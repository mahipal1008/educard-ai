// FILE: app/api/user/stats/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { UserStats } from "@/types";

export const runtime = "edge";

export async function GET() {
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

    // Fetch all stats in parallel
    const [documentsResult, attemptsResult, studyResult] = await Promise.all([
      admin
        .from("documents")
        .select("id", { count: "exact" })
        .eq("user_id", user.id),
      admin
        .from("quiz_attempts")
        .select("score, total_questions, completed_at")
        .eq("user_id", user.id),
      admin
        .from("study_progress")
        .select("last_reviewed_at")
        .eq("user_id", user.id)
        .not("last_reviewed_at", "is", null),
    ]);

    const totalDocuments = documentsResult.count ?? 0;
    const attempts = attemptsResult.data ?? [];
    const studyRecords = studyResult.data ?? [];

    // Calculate total cards studied today
    const today = new Date().toDateString();
    const totalCardsStudied = studyRecords.filter(
      (r) => r.last_reviewed_at && new Date(r.last_reviewed_at).toDateString() === today
    ).length;

    // Calculate quiz stats
    const totalQuizzesTaken = attempts.length;
    const averageQuizScore =
      attempts.length > 0
        ? Math.round(
            (attempts.reduce((sum, a) => {
              const pct = a.total_questions > 0 ? (a.score / a.total_questions) * 100 : 0;
              return sum + pct;
            }, 0) /
              attempts.length)
          )
        : 0;

    // Calculate study streak
    const studyStreak = calculateStudyStreak(studyRecords);

    const stats: UserStats = {
      totalDocuments,
      totalCardsStudied,
      totalQuizzesTaken,
      averageQuizScore,
      studyStreak,
    };

    return NextResponse.json({ data: stats });
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

function calculateStudyStreak(
  records: Array<{ last_reviewed_at: string | null }>
): number {
  if (records.length === 0) return 0;

  // Get unique days studied
  const daysStudied = new Set(
    records
      .filter((r) => r.last_reviewed_at)
      .map((r) => new Date(r.last_reviewed_at!).toDateString())
  );

  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const dateStr = checkDate.toDateString();

    if (daysStudied.has(dateStr)) {
      streak++;
    } else if (i === 0) {
      // Today hasn't been studied yet, but yesterday might have
      continue;
    } else {
      break;
    }
  }

  return streak;
}
