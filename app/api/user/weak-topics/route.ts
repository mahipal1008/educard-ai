// FILE: app/api/user/weak-topics/route.ts

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

    // Since we store topic scores client-side (no DB migration),
    // this endpoint returns a placeholder that the client can use
    // to force-generate a smart study deck from weak topics.
    // The actual topic scoring logic lives in the WeakTopicDashboard component
    // using localStorage.

    return NextResponse.json({
      data: {
        userId: user.id,
        message: "Use client-side topic tracking. See WeakTopicDashboard component.",
      },
    });
  } catch (error) {
    console.error("Weak topics error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to get weak topics",
      },
      { status: 500 }
    );
  }
}
