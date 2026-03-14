// FILE: app/api/process/pdf/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validatePDFFile } from "@/lib/validations/upload";
import { SupabaseStorageService } from "@/lib/services/storage";
import { PDFExtractService } from "@/lib/services/pdf-extract";
import { RateLimitService, RateLimitError } from "@/lib/services/rate-limit";
import { countWords } from "@/lib/utils";

export const runtime = "edge";

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

    // Process in background (non-blocking)
    processPDF(doc.id, arrayBuffer, file.name, user.id, aiPrefs).catch((err) => {
      console.error("PDF processing error:", err);
    });

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

    // Update document with extracted text
    await admin
      .from("documents")
      .update({
        title: pdfResult.title || filename.replace(/\.pdf$/i, ""),
        transcript_text: pdfResult.text,
        word_count: countWords(pdfResult.text),
      })
      .eq("id", documentId);

    // Step 3: Trigger all three generation calls in parallel
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const generatePromises = [
      fetch(`${appUrl}/api/generate/summary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, userId, summaryMode: aiPrefs?.summaryMode, aiPrefs }),
      }),
      fetch(`${appUrl}/api/generate/flashcards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, userId, aiPrefs }),
      }),
      fetch(`${appUrl}/api/generate/quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, userId, aiPrefs }),
      }),
    ];

    const results = await Promise.allSettled(generatePromises);
    const failures = results.filter((r) => r.status === "rejected");
    if (failures.length > 0) {
      console.error("Some generation tasks failed:", failures);
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
