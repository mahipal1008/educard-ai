// FILE: lib/claude-vision.ts
// NOTE: Now uses NVIDIA NIM API instead of Google Gemini for vision tasks

import { nimChat, nimVision } from "@/lib/nvidia-nim";

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

  const response = await nimVision(
    "You are an expert image analyst. Always return valid JSON.",
    prompt,
    base64Image,
    mimeType
  );
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

  const response = await nimVision(
    "You are an expert OCR and handwriting analyst. Always return valid JSON.",
    prompt,
    base64Image,
    mimeType
  );
  return parseJSON<OCRResult>(response);
}

export async function generateDiagramForConcept(
  question: string
): Promise<string | null> {
  const response = await nimChat(
    "You are a helpful educational assistant. Return ONLY valid JSON.",
    `For this concept: "${question}"
If a simple visual breakdown would help, generate it as an ASCII diagram or structured list.
If not applicable (e.g. factual question), return null.
Return ONLY JSON: {"diagram": "..." | null}`
  );

  if (!response) return null;

  try {
    const parsed = parseJSON<{ diagram: string | null }>(response);
    return parsed.diagram;
  } catch {
    return null;
  }
}
