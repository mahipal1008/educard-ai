// FILE: app/api/quiz/attempt/route.ts

import { NextResponse } from "next/server";
import { z } from "zod";

const inputSchema = z.object({
  userId: z.string().uuid(),
  cardId: z.string().uuid().optional(),
  deckId: z.string().uuid().optional(),
  topic: z.string().min(1),
  correct: z.boolean(),
  timeTakenMs: z.number().int().min(0).optional(),
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

    // Topic tracking is primarily handled client-side via localStorage
    // in the WeakTopicDashboard component. This endpoint validates the
    // attempt data and returns success. When a quiz_topic_attempts table
    // is added to the database, server-side persistence can be enabled here.

    return NextResponse.json({
      data: {
        tracked: true,
        topic: validation.data.topic,
        correct: validation.data.correct,
      },
    });
  } catch (error) {
    console.error("Quiz attempt tracking error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to track attempt",
      },
      { status: 500 }
    );
  }
}
