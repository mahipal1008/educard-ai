// FILE: app/api/study/[deckId]/review/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { SpacedRepetitionService } from "@/lib/services/spaced-repetition";
import { z } from "zod";
import type { StudyRating } from "@/types";

const reviewSchema = z.object({
  flashcard_id: z.string().uuid(),
  rating: z.number().int().min(0).max(3) as z.ZodType<StudyRating>,
});

export const runtime = "edge";

export async function POST(
  request: Request,
  { params }: { params: { deckId: string } }
) {
  try {
    const body = await request.json();

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const validation = reviewSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { flashcard_id, rating } = validation.data;
    const admin = createAdminClient();

    // Verify deck ownership
    const { data: deckRaw } = await admin
      .from("decks")
      .select("user_id")
      .eq("id", params.deckId)
      .single();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const deck = deckRaw as any;

    if (!deck || deck.user_id !== user.id) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    // Verify flashcard belongs to deck
    const { data: flashcard } = await admin
      .from("flashcards")
      .select("id")
      .eq("id", flashcard_id)
      .eq("deck_id", params.deckId)
      .single();

    if (!flashcard) {
      return NextResponse.json(
        { error: "Flashcard not found in this deck" },
        { status: 404 }
      );
    }

    // Fetch or create study progress
    const { data: existingProgressRaw } = await admin
      .from("study_progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("flashcard_id", flashcard_id)
      .single();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existingProgress = existingProgressRaw as any;

    // Calculate next review using SM-2
    const currentState = existingProgress
      ? {
          easeFactor: existingProgress.ease_factor,
          intervalDays: existingProgress.interval_days,
          repetitions: existingProgress.repetitions,
          nextReviewAt: new Date(existingProgress.next_review_at),
        }
      : null;

    const nextState = SpacedRepetitionService.calculateNext(
      currentState,
      rating
    );

    if (existingProgress) {
      // Update existing progress
      const { error: updateError } = await admin
        .from("study_progress")
        .update({
          ease_factor: nextState.easeFactor,
          interval_days: nextState.intervalDays,
          repetitions: nextState.repetitions,
          next_review_at: nextState.nextReviewAt.toISOString(),
          last_reviewed_at: new Date().toISOString(),
        })
        .eq("id", existingProgress.id);

      if (updateError) {
        return NextResponse.json(
          { error: "Failed to update study progress" },
          { status: 500 }
        );
      }
    } else {
      // Create new progress record
      const { error: insertError } = await admin
        .from("study_progress")
        .insert({
          user_id: user.id,
          flashcard_id,
          ease_factor: nextState.easeFactor,
          interval_days: nextState.intervalDays,
          repetitions: nextState.repetitions,
          next_review_at: nextState.nextReviewAt.toISOString(),
          last_reviewed_at: new Date().toISOString(),
        });

      if (insertError) {
        return NextResponse.json(
          { error: "Failed to create study progress" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      data: {
        nextReviewAt: nextState.nextReviewAt.toISOString(),
        intervalDays: nextState.intervalDays,
        easeFactor: nextState.easeFactor,
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
