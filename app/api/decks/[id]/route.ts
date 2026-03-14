// FILE: app/api/decks/[id]/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateUniqueSlug } from "@/lib/utils";
import { z } from "zod";

const updateDeckSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(500).optional(),
  is_public: z.boolean().optional(),
});

export const runtime = "edge";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const admin = createAdminClient();

    // Fetch deck with flashcards
    const { data, error } = await admin
      .from("decks")
      .select("*, flashcards(*)")
      .eq("id", params.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const deck = data as any;

    // Check access: either owner or public deck
    if (deck.user_id !== user?.id && !deck.is_public) {
      return NextResponse.json(
        { error: "Not authorized to view this deck" },
        { status: 403 }
      );
    }

    // Sort flashcards by order_index
    if (Array.isArray(deck.flashcards)) {
      deck.flashcards.sort(
        (a: { order_index: number }, b: { order_index: number }) =>
          a.order_index - b.order_index
      );
    }

    return NextResponse.json({ data: deck });
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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const validation = updateDeckSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    // Verify ownership
    const { data: existingDeck } = await admin
      .from("decks")
      .select("user_id, public_slug, title")
      .eq("id", params.id)
      .single();

    if (!existingDeck || existingDeck.user_id !== user.id) {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 403 }
      );
    }

    // If making public and no slug exists, generate one
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = { ...validation.data };
    if (
      validation.data.is_public === true &&
      !existingDeck.public_slug
    ) {
      updateData.public_slug = generateUniqueSlug(existingDeck.title);
    }

    const { data: deck, error } = await admin
      .from("decks")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to update deck" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: deck });
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
