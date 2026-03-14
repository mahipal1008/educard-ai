// FILE: lib/services/ai-generation.ts

import { nimChat } from "@/lib/nvidia-nim";
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

export class AIGenerationService {
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

    const response = await nimChat(
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

    const response = await nimChat(
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

    const response = await nimChat(
      getSummarySystemPrompt(),
      getSummaryPrompt(text, mode, summaryPrefs)
    );

    if (!response || response.trim().length === 0) {
      throw new Error("Empty summary response from AI.");
    }

    return response;
  }

  /**
   * Parses JSON from AI response, handling markdown code blocks.
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
