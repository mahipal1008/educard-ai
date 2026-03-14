// FILE: app/api/process/pdf/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validatePDFFile } from "@/lib/validations/upload";
import { SupabaseStorageService } from "@/lib/services/storage";
import { PDFExtractService } from "@/lib/services/pdf-extract";
import { RateLimitService, RateLimitError } from "@/lib/services/rate-limit";
import { AIGenerationService } from "@/lib/services/ai-generation";
import { ChunkingService } from "@/lib/services/chunking";
import { countWords } from "@/lib/utils";
import type { FlashcardGeneration, QuizQuestionGeneration } from "@/types";
import type { SummaryMode } from "@/lib/prompts/summary-prompt";

export const runtime = "edge";

// Helper to get Cloudflare's waitUntil for background processing
function getWaitUntil(): ((promise: Promise<unknown>) => void) | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getRequestContext } = require("@cloudflare/next-on-pages");
    const ctx = getRequestContext()?.ctx;
    if (ctx?.waitUntil) return ctx.waitUntil.bind(ctx);
  } catch {
    // Not on Cloudflare — fallback to fire-and-forget
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const aiPrefsRaw = formData.get("aiPrefs") as string | null;
    const aiPrefs = aiPrefsRaw ? JSON.parse(aiPrefsRaw) : undefined;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file
    const fileValidation = validatePDFFile({
      size: file.size,
      type: file.type,
    });
    if (!fileValidation.valid) {
      return NextResponse.json(
        { error: fileValidation.error },
        { status: 400 }
      );
    }

    // Check rate limit
    try {
      await RateLimitService.checkAndIncrement(user.id);
    } catch (error) {
      if (error instanceof RateLimitError) {
        return NextResponse.json(
          { error: error.message },
          { status: 429 }
        );
      }
      throw error;
    }

    const admin = createAdminClient();

    // Create document entry first
    const { data: document, error: insertError } = await admin
      .from("documents")
      .insert({
        user_id: user.id,
        type: "pdf" as const,
        title: file.name.replace(/\.pdf$/i, ""),
        status: "processing" as const,
      })
      .select()
      .single();

    if (insertError || !document) {
      return NextResponse.json(
        { error: "Failed to create document" },
        { status: 500 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc = document as any;

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Use waitUntil on Cloudflare to keep worker alive, otherwise fire-and-forget
    const backgroundTask = processPDF(doc.id, arrayBuffer, file.name, user.id, aiPrefs);
    const waitUntil = getWaitUntil();
    if (waitUntil) {
      waitUntil(backgroundTask);
    } else {
      backgroundTask.catch((err) => {
        console.error("PDF processing error:", err);
      });
    }

    return NextResponse.json(
      { data: { documentId: doc.id } },
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

async function processPDF(
  documentId: string,
  data: ArrayBuffer,
  filename: string,
  userId: string,
  aiPrefs?: Record<string, unknown>
) {
  const admin = createAdminClient();

  try {
    // Step 1: Upload to storage
    const storagePath = await SupabaseStorageService.uploadPDF(
      userId,
      documentId,
      data,
      filename
    );

    await admin
      .from("documents")
      .update({ storage_path: storagePath })
      .eq("id", documentId);

    // Step 2: Extract text
    const pdfResult = await PDFExtractService.extractText(data);
    const transcriptText = pdfResult.text;
    const title = pdfResult.title || filename.replace(/\.pdf$/i, "");

    // Update document with extracted text
    await admin
      .from("documents")
      .update({
        title,
        transcript_text: transcriptText,
        word_count: countWords(transcriptText),
      })
      .eq("id", documentId);

    // Step 3: Generate summary, flashcards, and quiz directly (no self-referencing fetch)
    const summaryMode = (aiPrefs?.summaryMode as SummaryMode) || "default";

    const [summaryResult, flashcardsResult, quizResult] = await Promise.allSettled([
      AIGenerationService.generateSummary(transcriptText, summaryMode, aiPrefs as Record<string, string> | undefined),
      generateFlashcardsInline(transcriptText, aiPrefs),
      generateQuizInline(transcriptText, aiPrefs),
    ]);

    // Save summary
    if (summaryResult.status === "fulfilled") {
      await admin.from("documents").update({ summary: summaryResult.value }).eq("id", documentId);
    } else {
      console.error("Summary generation failed:", summaryResult.reason);
    }

    // Save flashcards
    if (flashcardsResult.status === "fulfilled") {
      const finalCards = flashcardsResult.value;
      if (finalCards.length > 0) {
        const { data: deck } = await admin
          .from("decks")
          .insert({
            user_id: userId,
            document_id: documentId,
            title: `${title} - Flashcards`,
            description: `Auto-generated flashcards from ${title}`,
            card_count: 0,
          })
          .select()
          .single();

        if (deck) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const deckRow = deck as any;
          const flashcardRows = finalCards.map((card: FlashcardGeneration, index: number) => ({
            deck_id: deckRow.id as string,
            front: card.front,
            back: card.back,
            order_index: index,
          }));
          await admin.from("flashcards").insert(flashcardRows);
        }
      }
    } else {
      console.error("Flashcard generation failed:", flashcardsResult.reason);
    }

    // Save quiz
    if (quizResult.status === "fulfilled") {
      const finalQuestions = quizResult.value;
      if (finalQuestions.length > 0) {
        const { data: quiz } = await admin
          .from("quizzes")
          .insert({
            user_id: userId,
            document_id: documentId,
            title: `${title} - Quiz`,
            question_count: finalQuestions.length,
          })
          .select()
          .single();

        if (quiz) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const quizRow = quiz as any;
          const questionRows = finalQuestions.map((q: QuizQuestionGeneration, index: number) => ({
            quiz_id: quizRow.id as string,
            question_text: q.question_text,
            options: q.options,
            correct_answer_index: q.correct_answer_index,
            explanation: q.explanation,
            order_index: index,
          }));
          await admin.from("quiz_questions").insert(questionRows);
        }
      }
    } else {
      console.error("Quiz generation failed:", quizResult.reason);
    }

    // Mark as completed
    await admin
      .from("documents")
      .update({ status: "completed" as const })
      .eq("id", documentId);
  } catch (error) {
    await admin
      .from("documents")
      .update({
        status: "failed" as const,
        error_message:
          error instanceof Error ? error.message : "Processing failed",
      })
      .eq("id", documentId);
  }
}

async function generateFlashcardsInline(
  text: string,
  aiPrefs?: Record<string, unknown>
): Promise<FlashcardGeneration[]> {
  const chunks = ChunkingService.splitText(text);
  let allCards: FlashcardGeneration[] = [];

  for (const chunk of chunks) {
    const cards = await AIGenerationService.generateFlashcards(chunk, aiPrefs as Record<string, string> | undefined);
    allCards = [...allCards, ...cards];
  }

  const seen = new Set<string>();
  const uniqueCards = allCards.filter((card) => {
    const key = card.front.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return uniqueCards.slice(0, 30);
}

async function generateQuizInline(
  text: string,
  aiPrefs?: Record<string, unknown>
): Promise<QuizQuestionGeneration[]> {
  const chunks = ChunkingService.splitText(text);
  let allQuestions: QuizQuestionGeneration[] = [];

  for (const chunk of chunks) {
    const questions = await AIGenerationService.generateQuiz(chunk, aiPrefs as Record<string, string> | undefined);
    allQuestions = [...allQuestions, ...questions];
  }

  const seen = new Set<string>();
  const uniqueQuestions = allQuestions.filter((q) => {
    const key = q.question_text.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return uniqueQuestions.slice(0, 15);
}
