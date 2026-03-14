// FILE: app/api/decks/[id]/cards/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

const addCardSchema = z.object({
  front: z.string().min(1, "Front text is required").max(1000),
  back: z.string().min(1, "Back text is required").max(2000),
});

export const runtime = "edge";

export async function POST(
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
    const validation = addCardSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    // Verify deck ownership
    const { data: deck } = await admin
      .from("decks")
      .select("user_id, card_count")
      .eq("id", params.id)
      .single();

    if (!deck || deck.user_id !== user.id) {
      return NextResponse.json(
        { error: "Not authorized" },
        { status: 403 }
      );
    }

    // Insert new card
    const { data: card, error } = await admin
      .from("flashcards")
      .insert({
        deck_id: params.id,
        front: validation.data.front,
        back: validation.data.back,
        order_index: deck.card_count, // Append to end
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Failed to add card" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: card }, { status: 201 });
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
