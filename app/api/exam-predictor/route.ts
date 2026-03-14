// FILE: app/api/exam-predictor/route.ts

import { NextResponse } from "next/server";
import { nimChat } from "@/lib/nvidia-nim";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const inputSchema = z.object({
  pdfTexts: z.array(z.string().min(1)).min(1, "At least one paper is required"),
  subject: z.string().min(1, "Subject is required"),
  examName: z.string().min(1, "Exam name is required"),
});

interface TopicFrequency {
  name: string;
  frequency: number;
  percentage: number;
}

interface PredictedQuestion {
  q: string;
  a: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
}

interface PracticeQuestion {
  q: string;
  a: string;
  options: string[];
  topic: string;
}

interface ExamPredictorResult {
  topics: TopicFrequency[];
  predictions: PredictedQuestion[];
  practiceSet: PracticeQuestion[];
}

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const validation = inputSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { pdfTexts, subject, examName } = validation.data;

    const prompt = `You are an expert exam analyst. I am giving you ${pdfTexts.length} past year question papers for ${examName} (${subject}).

Analyze ALL papers carefully and:
1. Identify the TOP 10 most repeated topics with frequency count
2. Predict 10 questions most likely to appear in the next exam
3. Generate 15 practice MCQs covering the most important topics

IMPORTANT for practiceSet: The "a" field must be the INDEX (0-based) of the correct option in the "options" array, as a string. For example if the correct answer is the first option, set "a": "0".

Return ONLY valid JSON in this exact format, no markdown, no explanation:
{
  "topics": [{"name": "...", "frequency": 5, "percentage": 25}],
  "predictions": [{"q": "...", "a": "...", "difficulty": "easy|medium|hard", "topic": "..."}],
  "practiceSet": [{"q": "...", "a": "0", "options": ["optA","optB","optC","optD"], "topic": "..."}]
}

Papers content:
${pdfTexts.map((t, i) => `--- Paper ${i + 1} ---\n${t.slice(0, 5000)}`).join("\n\n")}`;

    const responseText = await nimChat(
      "You are an expert exam analyst. Always return valid JSON.",
      prompt
    );

    if (!responseText) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      );
    }

    let result: ExamPredictorResult;
    try {
      const codeBlockMatch = responseText.match(
        /```(?:json)?\s*([\s\S]*?)```/
      );
      const jsonText = codeBlockMatch
        ? codeBlockMatch[1].trim()
        : responseText.trim();
      result = JSON.parse(jsonText);
    } catch {
      try {
        const objectMatch = responseText.match(/\{[\s\S]*\}/);
        if (objectMatch) {
          result = JSON.parse(objectMatch[0]);
        } else {
          return NextResponse.json(
            { error: "Failed to parse exam analysis" },
            { status: 500 }
          );
        }
      } catch {
        return NextResponse.json(
          { error: "Failed to parse exam analysis" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("Exam predictor error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to analyze exam papers",
      },
      { status: 500 }
    );
  }
}
