// FILE: types/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          plan: string;
          daily_credits_used: number;
          last_credit_reset: string;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          plan?: string;
          daily_credits_used?: number;
          last_credit_reset?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          plan?: string;
          daily_credits_used?: number;
          last_credit_reset?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      documents: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          source_url: string | null;
          storage_path: string | null;
          transcript_text: string | null;
          summary: string | null;
          status: string;
          error_message: string | null;
          word_count: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          source_url?: string | null;
          storage_path?: string | null;
          transcript_text?: string | null;
          summary?: string | null;
          status?: string;
          error_message?: string | null;
          word_count?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          source_url?: string | null;
          storage_path?: string | null;
          transcript_text?: string | null;
          summary?: string | null;
          status?: string;
          error_message?: string | null;
          word_count?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "documents_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      decks: {
        Row: {
          id: string;
          user_id: string;
          document_id: string;
          title: string;
          description: string | null;
          card_count: number;
          is_public: boolean;
          public_slug: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          document_id: string;
          title: string;
          description?: string | null;
          card_count?: number;
          is_public?: boolean;
          public_slug?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          document_id?: string;
          title?: string;
          description?: string | null;
          card_count?: number;
          is_public?: boolean;
          public_slug?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "decks_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "decks_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "documents";
            referencedColumns: ["id"];
          }
        ];
      };
      flashcards: {
        Row: {
          id: string;
          deck_id: string;
          front: string;
          back: string;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          deck_id: string;
          front: string;
          back: string;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          deck_id?: string;
          front?: string;
          back?: string;
          order_index?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "flashcards_deck_id_fkey";
            columns: ["deck_id"];
            isOneToOne: false;
            referencedRelation: "decks";
            referencedColumns: ["id"];
          }
        ];
      };
      quizzes: {
        Row: {
          id: string;
          user_id: string;
          document_id: string;
          title: string;
          question_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          document_id: string;
          title: string;
          question_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          document_id?: string;
          title?: string;
          question_count?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "quizzes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "quizzes_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "documents";
            referencedColumns: ["id"];
          }
        ];
      };
      quiz_questions: {
        Row: {
          id: string;
          quiz_id: string;
          question_text: string;
          options: Json;
          correct_answer_index: number;
          explanation: string;
          order_index: number;
        };
        Insert: {
          id?: string;
          quiz_id: string;
          question_text: string;
          options: Json;
          correct_answer_index: number;
          explanation: string;
          order_index?: number;
        };
        Update: {
          id?: string;
          quiz_id?: string;
          question_text?: string;
          options?: Json;
          correct_answer_index?: number;
          explanation?: string;
          order_index?: number;
        };
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey";
            columns: ["quiz_id"];
            isOneToOne: false;
            referencedRelation: "quizzes";
            referencedColumns: ["id"];
          }
        ];
      };
      quiz_attempts: {
        Row: {
          id: string;
          user_id: string;
          quiz_id: string;
          score: number;
          total_questions: number;
          answers: Json;
          time_taken_seconds: number | null;
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          quiz_id: string;
          score: number;
          total_questions: number;
          answers: Json;
          time_taken_seconds?: number | null;
          completed_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          quiz_id?: string;
          score?: number;
          total_questions?: number;
          answers?: Json;
          time_taken_seconds?: number | null;
          completed_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey";
            columns: ["quiz_id"];
            isOneToOne: false;
            referencedRelation: "quizzes";
            referencedColumns: ["id"];
          }
        ];
      };
      study_progress: {
        Row: {
          id: string;
          user_id: string;
          flashcard_id: string;
          ease_factor: number;
          interval_days: number;
          repetitions: number;
          next_review_at: string;
          last_reviewed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          flashcard_id: string;
          ease_factor?: number;
          interval_days?: number;
          repetitions?: number;
          next_review_at?: string;
          last_reviewed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          flashcard_id?: string;
          ease_factor?: number;
          interval_days?: number;
          repetitions?: number;
          next_review_at?: string;
          last_reviewed_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "study_progress_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "study_progress_flashcard_id_fkey";
            columns: ["flashcard_id"];
            isOneToOne: false;
            referencedRelation: "flashcards";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export interface QuizAnswerRecord {
  question_id: string;
  selected_index: number;
  is_correct: boolean;
}
