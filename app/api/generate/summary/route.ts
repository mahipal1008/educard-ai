// FILE: app/api/generate/summary/route.ts

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { AIGenerationService } from "@/lib/services/ai-generation";
import { z } from "zod";

const inputSchema = z.object({
  documentId: z.string().uuid(),
  userId: z.string().uuid(),
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

    const { documentId } = validation.data;
    const admin = createAdminClient();

    // Fetch transcript text
    const { data: document, error: fetchError } = await admin
      .from("documents")
      .select("transcript_text")
      .eq("id", documentId)
      .single();

    if (fetchError || !document?.transcript_text) {
      return NextResponse.json(
        { error: "Document transcript not found" },
        { status: 404 }
      );
    }

    // Generate summary
    const summary = await AIGenerationService.generateSummary(
      document.transcript_text
    );

    // Update document with summary
    await admin
      .from("documents")
      .update({ summary })
      .eq("id", documentId);

    return NextResponse.json({ data: { summary } });
  } catch (error) {
    console.error("Summary generation error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate summary",
      },
      { status: 500 }
    );
  }
}
