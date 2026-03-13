// FILE: app/api/documents/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

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

    // Fetch documents with associated deck and quiz
    const { data: documents, error } = await admin
      .from("documents")
      .select(
        `
        *,
        decks (id, title, card_count, is_public, public_slug),
        quizzes (id, title, question_count)
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch documents" },
        { status: 500 }
      );
    }

    // Transform response - pick first deck and quiz from arrays
    const transformed = (documents ?? []).map((doc) => ({
      ...doc,
      deck: Array.isArray(doc.decks) ? doc.decks[0] || null : doc.decks,
      quiz: Array.isArray(doc.quizzes) ? doc.quizzes[0] || null : doc.quizzes,
      decks: undefined,
      quizzes: undefined,
    }));

    return NextResponse.json({ data: transformed });
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
