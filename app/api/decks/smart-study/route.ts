// FILE: app/api/decks/smart-study/route.ts

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const rawTopics = body.weakTopics;
    const weakTopics: string[] = Array.isArray(rawTopics)
      ? rawTopics.filter((t: unknown) => typeof t === "string")
      : [];

    const admin = createAdminClient();

    // Get user's decks
    const { data: decks } = await admin
      .from("decks")
      .select("id")
      .eq("user_id", user.id);

    if (!decks || decks.length === 0) {
      return NextResponse.json(
        { error: "No decks found" },
        { status: 404 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const deckIds = (decks as any[]).map((d) => d.id as string);

    // Get all cards from user's decks
    const { data: allCards } = await admin
      .from("flashcards")
      .select("id, front, back, deck_id")
      .in("deck_id", deckIds);

    if (!allCards || allCards.length === 0) {
      return NextResponse.json(
        { error: "No flashcards found" },
        { status: 404 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cards = allCards as any[];

    // If weak topics provided, try to match cards by content
    let weakCards = cards;
    if (weakTopics.length > 0) {
      const topicLower = weakTopics.map((t) => t.toLowerCase());
      weakCards = cards.filter((c) => {
        const text = `${c.front} ${c.back}`.toLowerCase();
        return topicLower.some((topic) => text.includes(topic));
      });
    }

    // Build smart study deck: 70% weak + 30% random/new
    const shuffled = (arr: typeof cards) =>
      [...arr].sort(() => Math.random() - 0.5);

    const weakSelection = shuffled(weakCards).slice(0, 7);
    const remaining = cards.filter(
      (c) => !weakSelection.some((w) => w.id === c.id)
    );
    const randomSelection = shuffled(remaining).slice(0, 3);

    const smartDeck = [...weakSelection, ...randomSelection].map((c) => ({
      id: c.id,
      front: c.front,
      back: c.back,
      deck_id: c.deck_id,
    }));

    return NextResponse.json({
      data: {
        cards: smartDeck,
        weakCount: weakSelection.length,
        newCount: randomSelection.length,
      },
    });
  } catch (error) {
    console.error("Smart study error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate smart study deck",
      },
      { status: 500 }
    );
  }
}
