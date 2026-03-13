// FILE: app/api/image-qa/route.ts

import { NextResponse } from "next/server";
import { analyzeImageForQA } from "@/lib/claude-vision";
import { z } from "zod";

const inputSchema = z.object({
  image: z.string().min(1, "Image data is required"),
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]),
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

    const { image, mimeType } = validation.data;

    // Validate base64 size (approx 10MB = ~13.3M base64 chars)
    if (image.length > 14_000_000) {
      return NextResponse.json(
        { error: "Image exceeds 10MB limit" },
        { status: 400 }
      );
    }

    const result = await analyzeImageForQA(image, mimeType);

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("Image Q&A error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to analyze image",
      },
      { status: 500 }
    );
  }
}
