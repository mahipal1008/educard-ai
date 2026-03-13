// FILE: types/index.ts

import type { Database } from "./database.types";

// Table row type aliases
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Document = Database["public"]["Tables"]["documents"]["Row"];
export type Deck = Database["public"]["Tables"]["decks"]["Row"];
export type Flashcard = Database["public"]["Tables"]["flashcards"]["Row"];
export type Quiz = Database["public"]["Tables"]["quizzes"]["Row"];
export type QuizQuestion = Database["public"]["Tables"]["quiz_questions"]["Row"];
export type QuizAttempt = Database["public"]["Tables"]["quiz_attempts"]["Row"];
export type StudyProgress = Database["public"]["Tables"]["study_progress"]["Row"];

// Insert type aliases
export type DocumentInsert = Database["public"]["Tables"]["documents"]["Insert"];
export type DeckInsert = Database["public"]["Tables"]["decks"]["Insert"];
export type FlashcardInsert = Database["public"]["Tables"]["flashcards"]["Insert"];
export type QuizInsert = Database["public"]["Tables"]["quizzes"]["Insert"];
export type QuizQuestionInsert = Database["public"]["Tables"]["quiz_questions"]["Insert"];
export type QuizAttemptInsert = Database["public"]["Tables"]["quiz_attempts"]["Insert"];
export type StudyProgressInsert = Database["public"]["Tables"]["study_progress"]["Insert"];

// Update type aliases
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
export type DocumentUpdate = Database["public"]["Tables"]["documents"]["Update"];
export type DeckUpdate = Database["public"]["Tables"]["decks"]["Update"];
export type FlashcardUpdate = Database["public"]["Tables"]["flashcards"]["Update"];
export type StudyProgressUpdate = Database["public"]["Tables"]["study_progress"]["Update"];

// Document status type
export type DocumentStatus = "pending" | "processing" | "completed" | "failed";
export type DocumentType = "youtube" | "pdf";
export type PlanType = "free" | "pro";

// Study rating (SM-2)
export type StudyRating = 0 | 1 | 2 | 3;

// API response types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
}

// Document with relations
export interface DocumentWithRelations extends Document {
  deck?: Deck | null;
  quiz?: Quiz | null;
}

// Deck with flashcards
export interface DeckWithCards extends Deck {
  flashcards: Flashcard[];
}

// Quiz with questions
export interface QuizWithQuestions extends Quiz {
  quiz_questions: QuizQuestion[];
}

// Study card (flashcard with progress)
export interface StudyCard extends Flashcard {
  study_progress?: StudyProgress | null;
}

// Quiz answer submission
export interface QuizAnswerSubmission {
  question_id: string;
  selected_index: number;
}

// User stats
export interface UserStats {
  totalDocuments: number;
  totalCardsStudied: number;
  totalQuizzesTaken: number;
  averageQuizScore: number;
  studyStreak: number;
}

// Generation result types
export interface FlashcardGeneration {
  front: string;
  back: string;
}

export interface QuizQuestionGeneration {
  question_text: string;
  options: [string, string, string, string];
  correct_answer_index: number;
  explanation: string;
}

// Processing steps for UI
export type ProcessingStep =
  | "extracting"
  | "summarizing"
  | "flashcards"
  | "quiz"
  | "completed"
  | "failed";

// SM-2 algorithm state
export interface SM2State {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  nextReviewAt: Date;
}
