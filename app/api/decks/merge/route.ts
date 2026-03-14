// FILE: app/api/decks/merge/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

export const runtime = "edge";

const mergeSchema = z.object({
  deckIds: z.array(z.string().uuid()).min(2, "Select at least 2 decks to merge"),
  title: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
});

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = mergeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { deckIds, title, description } = validation.data;
    const admin = createAdminClient();

    // Verify all decks belong to this user
    const { data: decks, error: deckError } = await admin
      .from("decks")
      .select("id, user_id, document_id")
      .in("id", deckIds);

    if (deckError || !decks) {
      return NextResponse.json({ error: "Failed to fetch decks" }, { status: 500 });
    }

    const unauthorized = decks.some((d) => d.user_id !== user.id);
    if (unauthorized) {
      return NextResponse.json({ error: "You can only merge your own decks" }, { status: 403 });
    }

    if (decks.length !== deckIds.length) {
      return NextResponse.json({ error: "Some decks were not found" }, { status: 400 });
    }

    if (decks.length < 2) {
      return NextResponse.json({ error: "At least 2 valid decks required" }, { status: 400 });
    }

    // Fetch all flashcards from selected decks
    const { data: allCards, error: cardsError } = await admin
      .from("flashcards")
      .select("front, back")
      .in("deck_id", deckIds);

    if (cardsError || !allCards) {
      return NextResponse.json({ error: "Failed to fetch flashcards" }, { status: 500 });
    }

    // Deduplicate cards by front text (case-insensitive), skip cards with missing front/back
    const seen = new Set<string>();
    const uniqueCards = allCards.filter((card) => {
      if (!card.front || !card.back) return false;
      const key = card.front.trim().toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Create new merged deck (use first source deck's document_id)
    const { data: newDeck, error: createError } = await admin
      .from("decks")
      .insert({
        user_id: user.id,
        document_id: decks[0].document_id,
        title,
        description: description || `Merged from ${deckIds.length} decks`,
        card_count: uniqueCards.length,
        is_public: false,
      })
      .select("id, title")
      .single();

    if (createError || !newDeck) {
      return NextResponse.json({ error: "Failed to create merged deck" }, { status: 500 });
    }

    const newDeckId = newDeck.id as string;

    // Insert all unique cards into the new deck
    if (uniqueCards.length > 0) {
      const cardsToInsert = uniqueCards.map((card) => ({
        deck_id: newDeckId,
        front: card.front,
        back: card.back,
      }));

      const { error: insertError } = await admin
        .from("flashcards")
        .insert(cardsToInsert);

      if (insertError) {
        // Clean up the deck if card insertion fails
        await admin.from("decks").delete().eq("id", newDeckId);
        return NextResponse.json({ error: "Failed to copy flashcards" }, { status: 500 });
      }
    }

    return NextResponse.json({
      data: {
        deckId: newDeckId,
        title: newDeck.title as string,
        totalCards: uniqueCards.length,
        duplicatesRemoved: allCards.length - uniqueCards.length,
        sourceDeckCount: deckIds.length,
      },
    });
  } catch (error) {
    console.error("Deck merge error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to merge decks" },
      { status: 500 }
    );
  }
}
