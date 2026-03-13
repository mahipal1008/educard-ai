// FILE: app/api/generate/flashcards/route.ts

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { AIGenerationService } from "@/lib/services/ai-generation";
import { ChunkingService } from "@/lib/services/chunking";
import { z } from "zod";
import type { FlashcardGeneration } from "@/types";

const inputSchema = z.object({
  documentId: z.string().uuid(),
  userId: z.string().uuid(),
});

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = inputSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { documentId, userId } = validation.data;
    const admin = createAdminClient();

    // Fetch transcript text and document title
    const { data: document, error: fetchError } = await admin
      .from("documents")
      .select("transcript_text, title")
      .eq("id", documentId)
      .single();

    if (fetchError || !document?.transcript_text) {
      return NextResponse.json(
        { error: "Document transcript not found" },
        { status: 404 }
      );
    }

    // Split text into chunks
    const chunks = ChunkingService.splitText(document.transcript_text);

    // Generate flashcards for each chunk
    let allCards: FlashcardGeneration[] = [];

    for (const chunk of chunks) {
      const cards = await AIGenerationService.generateFlashcards(chunk);
      allCards = [...allCards, ...cards];
    }

    // Deduplicate by front text (case-insensitive)
    const seen = new Set<string>();
    const uniqueCards = allCards.filter((card) => {
      const key = card.front.toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Limit to 30 cards for free plan
    const finalCards = uniqueCards.slice(0, 30);

    // Create deck
    const { data: deck, error: deckError } = await admin
      .from("decks")
      .insert({
        user_id: userId,
        document_id: documentId,
        title: `${document.title} - Flashcards`,
        description: `Auto-generated flashcards from ${document.title}`,
        card_count: 0, // Will be updated by trigger
      })
      .select()
      .single();

    if (deckError || !deck) {
      return NextResponse.json(
        { error: "Failed to create deck" },
        { status: 500 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const deckRow = deck as any;

    // Bulk insert flashcards
    const flashcardRows = finalCards.map((card, index) => ({
      deck_id: deckRow.id as string,
      front: card.front,
      back: card.back,
      order_index: index,
    }));

    const { error: cardsError } = await admin
      .from("flashcards")
      .insert(flashcardRows);

    if (cardsError) {
      console.error("Failed to insert flashcards:", cardsError);
      return NextResponse.json(
        { error: "Failed to insert flashcards" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: { deckId: deckRow.id, cardCount: finalCards.length },
    });
  } catch (error) {
    console.error("Flashcard generation error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate flashcards",
      },
      { status: 500 }
    );
  }
}
