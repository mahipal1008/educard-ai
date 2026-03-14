// FILE: lib/services/ai-generation.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { FlashcardGeneration, QuizQuestionGeneration } from "@/types";
import {
  getFlashcardPrompt,
  getFlashcardSystemPrompt,
  type FlashcardPreferences,
} from "@/lib/prompts/flashcard-prompt";
import {
  getQuizPrompt,
  getQuizSystemPrompt,
  type QuizPreferences,
} from "@/lib/prompts/quiz-prompt";
import {
  getSummaryPrompt,
  getSummarySystemPrompt,
  type SummaryMode,
  type SummaryPreferences,
} from "@/lib/prompts/summary-prompt";

export interface AIPreferences {
  difficulty?: "easy" | "medium" | "hard" | "adaptive";
  cardDensity?: "fewer" | "standard" | "more";
  summaryMode?: SummaryMode;
  quizStyle?: "conceptual" | "factual" | "application" | "mixed";
  focusAreas?: string;
}

const MAX_RETRIES = 3;
const RETRY_BASE_DELAY = 1000;

export class AIGenerationService {
  private static genAI: GoogleGenerativeAI | null = null;

  private static getGenAI(): GoogleGenerativeAI {
    if (!this.genAI) {
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    }
    return this.genAI;
  }

  /**
   * Generate flashcards from text content.
   * Returns an array of { front, back } objects.
   */
  static async generateFlashcards(
    text: string,
    prefs?: AIPreferences
  ): Promise<FlashcardGeneration[]> {
    const flashcardPrefs: FlashcardPreferences = {
      difficulty: prefs?.difficulty,
      cardDensity: prefs?.cardDensity,
      focusAreas: prefs?.focusAreas,
    };

    const response = await this.callGemini(
      getFlashcardSystemPrompt(),
      getFlashcardPrompt(text, flashcardPrefs)
    );

    const parsed = this.parseJSON<FlashcardGeneration[]>(response);

    if (!Array.isArray(parsed)) {
      throw new Error("Invalid flashcard response format from AI.");
    }

    return parsed.filter(
      (card) =>
        card &&
        typeof card.front === "string" &&
        typeof card.back === "string" &&
        card.front.trim().length > 0 &&
        card.back.trim().length > 0
    );
  }

  /**
   * Generate quiz questions from text content.
   * Returns an array of quiz question objects.
   */
  static async generateQuiz(
    text: string,
    prefs?: AIPreferences
  ): Promise<QuizQuestionGeneration[]> {
    const quizPrefs: QuizPreferences = {
      difficulty: prefs?.difficulty,
      quizStyle: prefs?.quizStyle,
      focusAreas: prefs?.focusAreas,
    };

    const response = await this.callGemini(
      getQuizSystemPrompt(),
      getQuizPrompt(text, quizPrefs)
    );

    const parsed = this.parseJSON<QuizQuestionGeneration[]>(response);

    if (!Array.isArray(parsed)) {
      throw new Error("Invalid quiz response format from AI.");
    }

    return parsed.filter(
      (q) =>
        q &&
        typeof q.question_text === "string" &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        typeof q.correct_answer_index === "number" &&
        q.correct_answer_index >= 0 &&
        q.correct_answer_index <= 3 &&
        typeof q.explanation === "string"
    );
  }

  /**
   * Generate a markdown summary from text content.
   */
  static async generateSummary(
    text: string,
    mode: SummaryMode = "default",
    prefs?: AIPreferences
  ): Promise<string> {
    const summaryPrefs: SummaryPreferences = {
      difficulty: prefs?.difficulty,
      focusAreas: prefs?.focusAreas,
    };

    const response = await this.callGemini(
      getSummarySystemPrompt(),
      getSummaryPrompt(text, mode, summaryPrefs)
    );

    if (!response || response.trim().length === 0) {
      throw new Error("Empty summary response from AI.");
    }

    return response;
  }

  /**
   * Core method to call Gemini with retry logic.
   */
  private static async callGemini(
    systemPrompt: string,
    userPrompt: string,
    retries = MAX_RETRIES
  ): Promise<string> {
    const genAI = this.getGenAI();
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: systemPrompt,
    });

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const result = await model.generateContent(userPrompt);
        const response = result.response;
        const text = response.text();

        if (!text) {
          throw new Error("No text content in AI response.");
        }

        return text;
      } catch (error) {
        const isRateLimit =
          error instanceof Error &&
          (error.message.includes("429") ||
            error.message.includes("RATE_LIMIT") ||
            error.message.includes("quota"));
        const isLastAttempt = attempt === retries - 1;

        if (isRateLimit && !isLastAttempt) {
          const delay = RETRY_BASE_DELAY * Math.pow(2, attempt);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        if (isLastAttempt) {
          throw new Error(
            `AI generation failed after ${retries} attempts: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        }

        throw error;
      }
    }

    throw new Error("AI generation failed: exhausted all retries.");
  }

  /**
   * Parses JSON from Gemini response, handling markdown code blocks.
   */
  private static parseJSON<T>(text: string): T {
    // Try to extract JSON from markdown code blocks
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonText = codeBlockMatch ? codeBlockMatch[1].trim() : text.trim();

    try {
      return JSON.parse(jsonText) as T;
    } catch {
      // Try to find JSON array or object in the response
      const arrayMatch = jsonText.match(/\[[\s\S]*\]/);
      const objectMatch = jsonText.match(/\{[\s\S]*\}/);
      const match = arrayMatch || objectMatch;

      if (match) {
        try {
          return JSON.parse(match[0]) as T;
        } catch {
          throw new Error("Failed to parse AI response as JSON.");
        }
      }

      throw new Error("No valid JSON found in AI response.");
    }
  }
}
