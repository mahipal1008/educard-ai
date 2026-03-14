// FILE: app/api/decks/[id]/translate/route.ts

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { nimChat } from "@/lib/nvidia-nim";
import { z } from "zod";

const inputSchema = z.object({
  languageCode: z.string().min(2).max(5),
  languageName: z.string().min(1),
});

interface TranslatedCard {
  cardId: string;
  translatedFront: string;
  translatedBack: string;
}

export const runtime = "edge";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: deckId } = await params;
    const body = await request.json();
    const validation = inputSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { languageCode, languageName } = validation.data;
    const admin = createAdminClient();

    // Fetch all cards for this deck
    const { data: cards, error: cardsError } = await admin
      .from("flashcards")
      .select("id, front, back")
      .eq("deck_id", deckId)
      .order("order_index", { ascending: true });

    if (cardsError || !cards || cards.length === 0) {
      return NextResponse.json(
        { error: "No flashcards found for this deck" },
        { status: 404 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cardRows = cards as any[];

    const cardsForTranslation = cardRows.map((c) => ({
      id: c.id,
      front: c.front,
      back: c.back,
    }));

    // Call NVIDIA NIM to translate all cards at once
    const responseText = await nimChat(
      "You are a professional translator. Return ONLY valid JSON, no explanation, no markdown.",
      `Translate ALL of these flashcards to ${languageName} (${languageCode}).
Keep technical/scientific terms in English where appropriate.
Return ONLY valid JSON, no explanation, no markdown.

Cards to translate:
${JSON.stringify(cardsForTranslation)}

Return format:
[{"cardId": "...", "translatedFront": "...", "translatedBack": "..."}]`
    );

    if (!responseText) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      );
    }

    // Parse the JSON response
    let translations: TranslatedCard[];
    try {
      const codeBlockMatch = responseText.match(
        /```(?:json)?\s*([\s\S]*?)```/
      );
      const jsonText = codeBlockMatch
        ? codeBlockMatch[1].trim()
        : responseText.trim();
      translations = JSON.parse(jsonText);
    } catch {
      // Try extracting array
      try {
        const arrayMatch = responseText.match(/\[[\s\S]*\]/);
        if (arrayMatch) {
          translations = JSON.parse(arrayMatch[0]);
        } else {
          return NextResponse.json(
            { error: "Failed to parse translation response" },
            { status: 500 }
          );
        }
      } catch {
        return NextResponse.json(
          { error: "Failed to parse translation response" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      data: {
        languageCode,
        languageName,
        translations,
      },
    });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to translate flashcards",
      },
      { status: 500 }
    );
  }
}
