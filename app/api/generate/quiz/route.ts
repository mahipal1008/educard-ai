// FILE: app/api/generate/quiz/route.ts

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { AIGenerationService } from "@/lib/services/ai-generation";
import { ChunkingService } from "@/lib/services/chunking";
import { z } from "zod";
import type { QuizQuestionGeneration } from "@/types";

const prefsSchema = z.object({
  difficulty: z.enum(["easy", "medium", "hard", "adaptive"]).optional(),
  quizStyle: z.enum(["conceptual", "factual", "application", "mixed"]).optional(),
  focusAreas: z.string().optional(),
});

const inputSchema = z.object({
  documentId: z.string().uuid(),
  userId: z.string().uuid(),
  aiPrefs: prefsSchema.optional(),
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

    const { documentId, userId, aiPrefs } = validation.data;
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

    // Generate quiz questions for each chunk
    let allQuestions: QuizQuestionGeneration[] = [];

    for (const chunk of chunks) {
      const questions = await AIGenerationService.generateQuiz(chunk, aiPrefs);
      allQuestions = [...allQuestions, ...questions];
    }

    // Deduplicate by question text
    const seen = new Set<string>();
    const uniqueQuestions = allQuestions.filter((q) => {
      const key = q.question_text.toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Limit to 15 questions for free plan
    const finalQuestions = uniqueQuestions.slice(0, 15);

    // Create quiz
    const { data: quiz, error: quizError } = await admin
      .from("quizzes")
      .insert({
        user_id: userId,
        document_id: documentId,
        title: `${document.title} - Quiz`,
        question_count: finalQuestions.length,
      })
      .select()
      .single();

    if (quizError || !quiz) {
      return NextResponse.json(
        { error: "Failed to create quiz" },
        { status: 500 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const quizRow = quiz as any;

    // Bulk insert questions
    const questionRows = finalQuestions.map((q, index) => ({
      quiz_id: quizRow.id as string,
      question_text: q.question_text,
      options: q.options,
      correct_answer_index: q.correct_answer_index,
      explanation: q.explanation,
      order_index: index,
    }));

    const { error: questionsError } = await admin
      .from("quiz_questions")
      .insert(questionRows);

    if (questionsError) {
      console.error("Failed to insert quiz questions:", questionsError);
      return NextResponse.json(
        { error: "Failed to insert quiz questions" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: { quizId: quizRow.id, questionCount: finalQuestions.length },
    });
  } catch (error) {
    console.error("Quiz generation error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate quiz",
      },
      { status: 500 }
    );
  }
}
