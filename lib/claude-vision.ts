// FILE: lib/claude-vision.ts
// NOTE: Now uses Google Gemini instead of Claude for vision tasks

import { GoogleGenerativeAI } from "@google/generative-ai";

type MediaType = "image/jpeg" | "image/png" | "image/webp" | "image/gif";

interface ImageQAResult {
  explanation: string;
  questions: Array<{
    q: string;
    a: string;
    options: string[];
  }>;
}

interface OCRResult {
  extractedText: string;
  topics: string[];
}

const MAX_RETRIES = 3;
const RETRY_BASE_DELAY = 1000;

let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  }
  return genAI;
}

function parseJSON<T>(text: string): T {
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonText = codeBlockMatch ? codeBlockMatch[1].trim() : text.trim();

  try {
    return JSON.parse(jsonText) as T;
  } catch {
    const arrayMatch = jsonText.match(/\[[\s\S]*\]/);
    const objectMatch = jsonText.match(/\{[\s\S]*\}/);
    const match = arrayMatch || objectMatch;
    if (match) {
      try {
        return JSON.parse(match[0]) as T;
      } catch {
        throw new Error("Failed to parse AI vision response as JSON.");
      }
    }
    throw new Error("No valid JSON found in AI vision response.");
  }
}

async function callGeminiVision(
  base64Image: string,
  mimeType: MediaType,
  textPrompt: string,
): Promise<string> {
  const ai = getGenAI();
  const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent([
        textPrompt,
        {
          inlineData: {
            data: base64Image,
            mimeType,
          },
        },
      ]);

      const text = result.response.text();
      if (!text) {
        throw new Error("No text content in AI vision response.");
      }
      return text;
    } catch (error) {
      const isRateLimit =
        error instanceof Error &&
        (error.message.includes("429") ||
          error.message.includes("RATE_LIMIT") ||
          error.message.includes("quota"));
      const isLastAttempt = attempt === MAX_RETRIES - 1;

      if (isRateLimit && !isLastAttempt) {
        const delay = RETRY_BASE_DELAY * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      if (isLastAttempt) {
        throw new Error(
          `AI vision failed after ${MAX_RETRIES} attempts: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
      throw error;
    }
  }
  throw new Error("AI vision failed: exhausted all retries.");
}

export async function analyzeImageForQA(
  base64Image: string,
  mimeType: MediaType
): Promise<ImageQAResult> {
  const prompt = `Analyze this image carefully.
1. Write a clear, simple explanation of what this image shows (3-4 sentences).
2. Generate 5 multiple choice quiz questions based on this image. Each question must have 4 options with one correct answer.

Respond ONLY in this JSON format, no markdown, no explanation:
{
  "explanation": "...",
  "questions": [
    { "q": "...", "a": "correct answer", "options": ["A", "B", "C", "D"] }
  ]
}`;

  const response = await callGeminiVision(base64Image, mimeType, prompt);
  return parseJSON<ImageQAResult>(response);
}

export async function extractHandwrittenNotes(
  base64Image: string,
  mimeType: MediaType
): Promise<OCRResult> {
  const prompt = `This is a photo of handwritten notes. Please:
1. Extract ALL the text you can see, even if partially unclear
2. Fix obvious spelling mistakes
3. Organize the content into clear topics with headings
4. Format as clean, readable markdown

Return ONLY valid JSON in this format, no markdown, no explanation:
{
  "extractedText": "the organized markdown text here",
  "topics": ["Topic 1", "Topic 2"]
}`;

  const response = await callGeminiVision(base64Image, mimeType, prompt);
  return parseJSON<OCRResult>(response);
}

export async function generateDiagramForConcept(
  question: string
): Promise<string | null> {
  const ai = getGenAI();
  const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent(
    `For this concept: "${question}"
If a simple visual breakdown would help, generate it as an ASCII diagram or structured list.
If not applicable (e.g. factual question), return null.
Return ONLY JSON: {"diagram": "..." | null}`
  );

  const text = result.response.text();
  if (!text) return null;

  try {
    const parsed = parseJSON<{ diagram: string | null }>(text);
    return parsed.diagram;
  } catch {
    return null;
  }
}
