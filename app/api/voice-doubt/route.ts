// FILE: app/api/voice-doubt/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateDiagramForConcept } from "@/lib/claude-vision";
import { textToSpeech } from "@/lib/elevenlabs";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

const inputSchema = z.object({
  question: z.string().min(1).max(2000),
});

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    // Auth check
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = inputSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Please provide a valid question" },
        { status: 400 }
      );
    }

    const { question } = validation.data;

    // Step 1: Answer with Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction:
        "You are a helpful tutor. Answer student questions concisely in 3-5 sentences. If the question involves math or science, give a clear explanation with an example.",
    });

    const result = await model.generateContent(question);
    const answerText = result.response.text() || "";

    // Step 2: Generate diagram if applicable (best-effort)
    let diagram: string | null = null;
    try {
      diagram = await generateDiagramForConcept(question);
    } catch {
      // Diagram generation is optional
    }

    // Step 3: Generate audio via ElevenLabs (best-effort, client falls back to browser TTS)
    let audioBase64: string | null = null;
    if (answerText.trim().length > 0) {
      try {
        const audioB64 = await textToSpeech(answerText);
        audioBase64 = audioB64;
      } catch {
        // Audio generation is optional - client will use browser TTS
      }
    }

    return NextResponse.json({
      data: {
        answer: answerText,
        diagram,
        audio: audioBase64,
      },
    });
  } catch (error) {
    console.error("Voice doubt error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to process voice doubt",
      },
      { status: 500 }
    );
  }
}
