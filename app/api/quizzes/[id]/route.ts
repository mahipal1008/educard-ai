// FILE: app/api/quizzes/[id]/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "edge";

export async function GET(
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

    const admin = createAdminClient();
    const url = new URL(request.url);
    const includeAnswers = url.searchParams.get("include_answers") === "true";

    // Choose which fields to select based on context
    const questionFields = includeAnswers
      ? "id, question_text, options, correct_answer_index, explanation, order_index"
      : "id, question_text, options, order_index";

    // Fetch quiz with questions
    const { data: quiz, error } = await admin
      .from("quizzes")
      .select(
        `
        *,
        quiz_questions (${questionFields})
      `
      )
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    if (error || !quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Sort questions by order_index
    if (Array.isArray(quiz.quiz_questions)) {
      quiz.quiz_questions.sort(
        (a: { order_index: number }, b: { order_index: number }) =>
          a.order_index - b.order_index
      );
    }

    return NextResponse.json({ data: quiz });
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
