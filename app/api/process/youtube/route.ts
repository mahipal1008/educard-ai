// FILE: app/api/process/youtube/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { youtubeUrlSchema } from "@/lib/validations/youtube";
import { YouTubeTranscriptService } from "@/lib/services/youtube-transcript";
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

    let body: Record<string, unknown> = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const validation = youtubeUrlSchema.safeParse(body);
    const aiPrefs = body?.aiPrefs as Record<string, unknown> | undefined;

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message, receivedKeys: Object.keys(body || {}) },
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

    // Insert document with processing status
    const { data: document, error: insertError } = await admin
      .from("documents")
      .insert({
        user_id: user.id,
        type: "youtube" as const,
        title: "Processing...",
        source_url: validation.data.url,
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

    // Process in background (non-blocking)
    processYouTube(doc.id, validation.data.url, user.id, aiPrefs).catch((err) => {
      console.error("YouTube processing error:", err);
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

async function processYouTube(
  documentId: string,
  url: string,
  userId: string,
  aiPrefs?: Record<string, unknown>
) {
  const admin = createAdminClient();

  try {
    // Step 1: Fetch transcript
    const transcript = await YouTubeTranscriptService.getTranscript(url);

    // Update document with transcript data
    await admin
      .from("documents")
      .update({
        title: transcript.title,
        transcript_text: transcript.text,
        word_count: countWords(transcript.text),
      })
      .eq("id", documentId);

    // Step 2: Trigger all three generation calls in parallel
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

    // Check if any failed
    const failures = results.filter((r) => r.status === "rejected");
    if (failures.length > 0) {
      console.error("Some generation tasks failed:", failures);
    }

    // Mark document as completed
    await admin
      .from("documents")
      .update({ status: "completed" as const })
      .eq("id", documentId);
  } catch (error) {
    // Mark as failed
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
