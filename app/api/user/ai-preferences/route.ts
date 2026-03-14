// FILE: app/api/user/ai-preferences/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const preferencesSchema = z.object({
  difficulty: z.enum(["easy", "medium", "hard", "adaptive"]),
  cardDensity: z.enum(["fewer", "standard", "more"]),
  summaryMode: z.enum(["default", "bullet", "cornell", "outline", "mindmap"]),
  focusAreas: z.string().max(500).optional(),
  quizStyle: z.enum(["conceptual", "factual", "application", "mixed"]),
});

export type AIPreferences = z.infer<typeof preferencesSchema>;

const DEFAULT_PREFS: AIPreferences = {
  difficulty: "medium",
  cardDensity: "standard",
  summaryMode: "default",
  focusAreas: "",
  quizStyle: "mixed",
};

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Preferences are stored client-side in localStorage
    // API returns defaults; client merges with local storage
    return NextResponse.json({ data: DEFAULT_PREFS });
  } catch {
    return NextResponse.json({ data: DEFAULT_PREFS });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const validation = preferencesSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    // Validated successfully — preferences are persisted in localStorage on client
    return NextResponse.json({ data: validation.data });
  } catch (error) {
    console.error("AI preferences PUT error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save preferences" },
      { status: 500 }
    );
  }
}
