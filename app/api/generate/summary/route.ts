// FILE: app/api/generate/summary/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { AIGenerationService } from "@/lib/services/ai-generation";
import { z } from "zod";
import type { SummaryMode } from "@/lib/prompts/summary-prompt";

export const runtime = "edge";

const inputSchema = z.object({
  documentId: z.string().uuid(),
  summaryMode: z
    .enum(["default", "bullet", "cornell", "outline", "mindmap"])
    .optional()
    .default("default"),
  aiPrefs: z.object({
    difficulty: z.enum(["easy", "medium", "hard", "adaptive"]).optional(),
    focusAreas: z.string().optional(),
  }).optional(),
});

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const validation = inputSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { documentId, summaryMode, aiPrefs } = validation.data;
    const admin = createAdminClient();

    // Verify the document belongs to this user
    const { data: document, error: fetchError } = await admin
      .from("documents")
      .select("transcript_text, user_id")
      .eq("id", documentId)
      .single();

    if (fetchError || !document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    if (document.user_id !== user.id) {
      return NextResponse.json(
        { error: "You can only regenerate summaries for your own documents" },
        { status: 403 }
      );
    }

    if (!document.transcript_text) {
      return NextResponse.json(
        { error: "Document transcript not found" },
        { status: 404 }
      );
    }

    // Generate summary with the specified mode
    const summary = await AIGenerationService.generateSummary(
      document.transcript_text,
      summaryMode as SummaryMode,
      aiPrefs
    );

    // Update document with summary
    const { error: updateError } = await admin
      .from("documents")
      .update({ summary })
      .eq("id", documentId);

    if (updateError) {
      console.error("Failed to save summary:", updateError);
      return NextResponse.json(
        { error: "Summary generated but failed to save" },
        { status: 500 }
      );
    }

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
