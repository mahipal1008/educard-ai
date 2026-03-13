// FILE: hooks/useQuiz.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import type { QuizQuestion, QuizAnswerSubmission } from "@/types";
import { toast } from "sonner";

type QuizState = "idle" | "loading" | "in_progress" | "submitting" | "completed";

interface QuizData {
  id: string;
  title: string;
  question_count: number;
  quiz_questions: Pick<QuizQuestion, "id" | "question_text" | "options" | "order_index">[];
}

export function useQuiz(quizId: string) {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [state, setState] = useState<QuizState>("idle");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswerSubmission[]>([]);
  const [startTime] = useState<number>(Date.now());
  const [error, setError] = useState<string | null>(null);

  // Fetch quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      setState("loading");
      try {
        const res = await fetch(`/api/quizzes/${quizId}`);
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Failed to fetch quiz");
        }

        setQuiz(json.data);
        setState("in_progress");
        setError(null);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load quiz";
        setError(message);
        setState("idle");
        toast.error(message);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const questions = quiz?.quiz_questions ?? [];
  const currentQuestion = questions[currentQuestionIndex] ?? null;
  const totalQuestions = questions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const submitAnswer = useCallback(
    (selectedIndex: number) => {
      if (!currentQuestion || state !== "in_progress") return;

      const newAnswer: QuizAnswerSubmission = {
        question_id: currentQuestion.id,
        selected_index: selectedIndex,
      };

      setAnswers((prev) => [...prev, newAnswer]);

      if (!isLastQuestion) {
        // Move to next question after a brief delay
        setTimeout(() => {
          setCurrentQuestionIndex((prev) => prev + 1);
        }, 800);
      }
    },
    [currentQuestion, state, isLastQuestion]
  );

  const submitAttempt = useCallback(async () => {
    if (state === "submitting") return null;
    setState("submitting");

    const timeTaken = Math.round((Date.now() - startTime) / 1000);

    try {
      const res = await fetch(`/api/quizzes/${quizId}/attempt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          time_taken_seconds: timeTaken,
        }),
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to submit quiz");
      }

      setState("completed");
      return json.data as { attemptId: string; score: number; total: number };
    } catch (err) {
      setState("in_progress");
      const message =
        err instanceof Error ? err.message : "Failed to submit quiz";
      toast.error(message);
      return null;
    }
  }, [quizId, answers, startTime, state]);

  return {
    quiz,
    state,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    answers,
    isLastQuestion,
    error,
    submitAnswer,
    submitAttempt,
  };
}
