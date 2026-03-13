// FILE: app/api/documents/[id]/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { SupabaseStorageService } from "@/lib/services/storage";

export const runtime = "edge";

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

    const { data: document, error } = await admin
      .from("documents")
      .select(
        `
        *,
        decks (id, title, card_count, is_public, public_slug, description),
        quizzes (id, title, question_count)
      `
      )
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    if (error || !document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    const transformed = {
      ...document,
      deck: Array.isArray(document.decks)
        ? document.decks[0] || null
        : document.decks,
      quiz: Array.isArray(document.quizzes)
        ? document.quizzes[0] || null
        : document.quizzes,
      decks: undefined,
      quizzes: undefined,
    };

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

export async function DELETE(
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

    // Verify ownership and get document
    const { data: document, error: fetchError } = await admin
      .from("documents")
      .select("id, type, storage_path, user_id")
      .eq("id", params.id)
      .single();

    if (fetchError || !document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    if (document.user_id !== user.id) {
      return NextResponse.json(
        { error: "Not authorized to delete this document" },
        { status: 403 }
      );
    }

    // Delete PDF from storage if it's a PDF document
    if (document.type === "pdf" && document.storage_path) {
      try {
        await SupabaseStorageService.deletePDF(document.storage_path);
      } catch (storageError) {
        console.error("Failed to delete PDF from storage:", storageError);
      }
    }

    // Delete document (cascades to decks, flashcards, quizzes, quiz_questions)
    const { error: deleteError } = await admin
      .from("documents")
      .delete()
      .eq("id", params.id);

    if (deleteError) {
      return NextResponse.json(
        { error: "Failed to delete document" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: { success: true } });
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
