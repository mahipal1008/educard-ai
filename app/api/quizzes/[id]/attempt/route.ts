// FILE: app/api/quizzes/[id]/attempt/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

const submitAttemptSchema = z.object({
  answers: z.array(
    z.object({
      question_id: z.string().uuid(),
      selected_index: z.number().int().min(0).max(3),
    })
  ),
  time_taken_seconds: z.number().int().positive().optional(),
});

export const runtime = "edge";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
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

    const body = await request.json();
    const validation = submitAttemptSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    // Verify quiz ownership
    const { data: quiz } = await admin
      .from("quizzes")
      .select("id, user_id, question_count")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Fetch all questions with correct answers
    const { data: questions } = await admin
      .from("quiz_questions")
      .select("id, correct_answer_index")
      .eq("quiz_id", params.id);

    if (!questions || questions.length === 0) {
      return NextResponse.json(
        { error: "No questions found for this quiz" },
        { status: 404 }
      );
    }

    // Build a map of question_id -> correct_answer_index
    const correctAnswerMap = new Map(
      questions.map((q) => [q.id, q.correct_answer_index])
    );

    // Grade the answers
    let score = 0;
    const gradedAnswers = validation.data.answers.map((answer) => {
      const correctIndex = correctAnswerMap.get(answer.question_id);
      const isCorrect = correctIndex === answer.selected_index;
      if (isCorrect) score++;
      return {
        question_id: answer.question_id,
        selected_index: answer.selected_index,
        is_correct: isCorrect,
      };
    });

    // Insert attempt
    const { data: attempt, error: insertError } = await admin
      .from("quiz_attempts")
      .insert({
        user_id: user.id,
        quiz_id: params.id,
        score,
        total_questions: questions.length,
        answers: gradedAnswers,
        time_taken_seconds: validation.data.time_taken_seconds ?? null,
      })
      .select()
      .single();

    if (insertError || !attempt) {
      return NextResponse.json(
        { error: "Failed to save quiz attempt" },
        { status: 500 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const attemptRow = attempt as any;

    return NextResponse.json(
      {
        data: {
          attemptId: attemptRow.id,
          score,
          total: questions.length,
        },
      },
      { status: 201 }
    );
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

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
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

    const { data: attempts, error } = await admin
      .from("quiz_attempts")
      .select("*")
      .eq("quiz_id", params.id)
      .eq("user_id", user.id)
      .order("completed_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch attempts" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: attempts ?? [] });
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
