// FILE: lib/services/spaced-repetition.ts

import type { SM2State, StudyRating } from "@/types";

/**
 * SM-2 Spaced Repetition Algorithm
 *
 * Rating scale:
 *   0 = Again (complete blackout, reset)
 *   1 = Hard  (significant difficulty, short interval)
 *   2 = Good  (correct with some effort)
 *   3 = Easy  (effortless recall, longer interval)
 */
export class SpacedRepetitionService {
  static readonly MIN_EASE_FACTOR = 1.3;
  static readonly DEFAULT_EASE_FACTOR = 2.5;

  /**
   * Calculates the next review state based on current state and rating.
   */
  static calculateNext(
    currentState: SM2State | null,
    rating: StudyRating
  ): SM2State {
    const state = currentState ?? {
      easeFactor: this.DEFAULT_EASE_FACTOR,
      intervalDays: 1,
      repetitions: 0,
      nextReviewAt: new Date(),
    };

    let { easeFactor, intervalDays, repetitions } = state;

    if (rating === 0) {
      // Again — reset repetitions, short interval
      repetitions = 0;
      intervalDays = 1;
      easeFactor = Math.max(this.MIN_EASE_FACTOR, easeFactor - 0.2);
    } else if (rating === 1) {
      // Hard — don't advance much
      repetitions = repetitions + 1;
      easeFactor = Math.max(this.MIN_EASE_FACTOR, easeFactor - 0.15);

      if (repetitions <= 1) {
        intervalDays = 1;
      } else if (repetitions === 2) {
        intervalDays = 3;
      } else {
        intervalDays = Math.round(intervalDays * easeFactor * 0.8);
      }
    } else if (rating === 2) {
      // Good — standard progression
      repetitions = repetitions + 1;
      easeFactor = Math.max(this.MIN_EASE_FACTOR, easeFactor - 0.05 + 0.08);

      if (repetitions <= 1) {
        intervalDays = 1;
      } else if (repetitions === 2) {
        intervalDays = 6;
      } else {
        intervalDays = Math.round(intervalDays * easeFactor);
      }
    } else {
      // Easy — accelerated progression
      repetitions = repetitions + 1;
      easeFactor = easeFactor + 0.15;

      if (repetitions <= 1) {
        intervalDays = 3;
      } else if (repetitions === 2) {
        intervalDays = 8;
      } else {
        intervalDays = Math.round(intervalDays * easeFactor * 1.3);
      }
    }

    // Cap interval at 365 days
    intervalDays = Math.min(intervalDays, 365);
    intervalDays = Math.max(intervalDays, 1);

    const nextReviewAt = new Date();
    nextReviewAt.setDate(nextReviewAt.getDate() + intervalDays);

    return {
      easeFactor,
      intervalDays,
      repetitions,
      nextReviewAt,
    };
  }

  /**
   * Returns a label for the rating
   */
  static getRatingLabel(rating: StudyRating): string {
    const labels: Record<StudyRating, string> = {
      0: "Again",
      1: "Hard",
      2: "Good",
      3: "Easy",
    };
    return labels[rating];
  }

  /**
   * Returns color for the rating button
   */
  static getRatingColor(rating: StudyRating): string {
    const colors: Record<StudyRating, string> = {
      0: "text-red-500 border-red-500 hover:bg-red-500/10",
      1: "text-orange-500 border-orange-500 hover:bg-orange-500/10",
      2: "text-green-500 border-green-500 hover:bg-green-500/10",
      3: "text-blue-500 border-blue-500 hover:bg-blue-500/10",
    };
    return colors[rating];
  }
}
