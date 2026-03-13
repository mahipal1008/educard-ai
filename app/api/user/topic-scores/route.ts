// FILE: app/api/user/topic-scores/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Topic scores are tracked client-side in localStorage since we cannot
    // run SQL migrations in this environment. The WeakTopicDashboard component
    // handles all the scoring logic locally.

    return NextResponse.json({
      data: {
        userId: user.id,
        scores: [], // Client manages this via localStorage
      },
    });
  } catch (error) {
    console.error("Topic scores error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to get topic scores",
      },
      { status: 500 }
    );
  }
}
