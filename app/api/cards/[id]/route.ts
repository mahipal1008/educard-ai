// FILE: app/api/cards/[id]/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

const updateCardSchema = z.object({
  front: z.string().min(1).max(1000).optional(),
  back: z.string().min(1).max(2000).optional(),
});

async function verifyCardOwnership(
  admin: ReturnType<typeof createAdminClient>,
  cardId: string,
  userId: string
): Promise<{ authorized: boolean; deckId?: string }> {
  const { data: card } = await admin
    .from("flashcards")
    .select("id, deck_id")
    .eq("id", cardId)
    .single();

  if (!card) return { authorized: false };

  const deckId = (card as { id: string; deck_id: string }).deck_id;

  const { data: deck } = await admin
    .from("decks")
    .select("user_id")
    .eq("id", deckId)
    .single();

  if (!deck) return { authorized: false };

  const ownerId = (deck as { user_id: string }).user_id;
  return { authorized: ownerId === userId, deckId };
}

export const runtime = "edge";

export async function PUT(
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

    const body = await request.json();
    const validation = updateCardSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const admin = createAdminClient();
    const { authorized } = await verifyCardOwnership(admin, params.id, user.id);

    if (!authorized) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { data: updatedCard, error } = await admin
      .from("flashcards")
      .update(validation.data)
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to update card" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: updatedCard });
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
    const { authorized } = await verifyCardOwnership(admin, params.id, user.id);

    if (!authorized) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { error } = await admin
      .from("flashcards")
      .delete()
      .eq("id", params.id);

    if (error) {
      return NextResponse.json(
        { error: "Failed to delete card" },
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
