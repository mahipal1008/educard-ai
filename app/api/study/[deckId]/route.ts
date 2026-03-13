// FILE: app/api/study/[deckId]/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_CARDS_PER_SESSION = 20;

export const runtime = "edge";

export async function GET(
  _request: Request,
  { params }: { params: { deckId: string } }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = createAdminClient();

    // Verify deck ownership
    const { data: deckRaw } = await admin
      .from("decks")
      .select("id, user_id")
      .eq("id", params.deckId)
      .single();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const deck = deckRaw as any;

    if (!deck || deck.user_id !== user.id) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    // Fetch all flashcards for this deck
    const { data: flashcardsRaw } = await admin
      .from("flashcards")
      .select("*")
      .eq("deck_id", params.deckId)
      .order("order_index", { ascending: true });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const flashcards = (flashcardsRaw ?? []) as any[];

    if (flashcards.length === 0) {
      return NextResponse.json({ data: { cards: [], totalDue: 0 } });
    }

    // Fetch study progress for all cards
    const cardIds = flashcards.map((c: any) => c.id);
    const { data: progressRecordsRaw } = await admin
      .from("study_progress")
      .select("*")
      .eq("user_id", user.id)
      .in("flashcard_id", cardIds);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const progressRecords = (progressRecordsRaw ?? []) as any[];

    const progressMap = new Map(
      progressRecords.map((p: any) => [p.flashcard_id, p])
    );

    const now = new Date();

    // Separate due cards and new cards
    const dueCards = flashcards.filter((card: any) => {
      const progress = progressMap.get(card.id);
      if (!progress) return false;
      return new Date(progress.next_review_at) <= now;
    });

    const newCards = flashcards.filter(
      (card: any) => !progressMap.has(card.id)
    );

    // Combine: due cards first, then new cards
    const studyQueue = [...dueCards, ...newCards].slice(
      0,
      MAX_CARDS_PER_SESSION
    );

    // Attach progress data to each card
    const cardsWithProgress = studyQueue.map((card: any) => ({
      ...card,
      study_progress: progressMap.get(card.id) ?? null,
    }));

    return NextResponse.json({
      data: {
        cards: cardsWithProgress,
        totalDue: dueCards.length,
        totalNew: newCards.length,
        totalCards: flashcards.length,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
