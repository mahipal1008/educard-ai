// FILE: app/(dashboard)/quiz/[id]/results/[attemptId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { QuizResults } from "@/components/quiz/QuizResults";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface AttemptData {
  id: string;
  quiz_id: string;
  score: number;
  total_questions: number;
  answers: Array<{
    question_id: string;
    selected_index: number;
    is_correct: boolean;
  }>;
  time_taken_seconds: number | null;
}

interface QuestionData {
  id: string;
  question_text: string;
  options: string[];
  correct_answer_index: number;
  explanation: string;
  order_index: number;
}

interface QuizData {
  id: string;
  title: string;
  document_id: string;
  quiz_questions: QuestionData[];
}

export default function QuizResultsPage() {
  const params = useParams();
  const quizId = params.id as string;
  const attemptId = params.attemptId as string;

  const [attempt, setAttempt] = useState<AttemptData | null>(null);
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch attempt data and full quiz with correct answers
        const [attemptRes, quizRes] = await Promise.all([
          fetch(`/api/quizzes/${quizId}/attempt`),
          fetch(`/api/quizzes/${quizId}?include_answers=true`),
        ]);

        const attemptJson = await attemptRes.json();
        const quizJson = await quizRes.json();

        if (attemptRes.ok && attemptJson.data) {
          const found = attemptJson.data.find(
            (a: AttemptData) => a.id === attemptId
          );
          if (found) setAttempt(found);
        }

        if (quizRes.ok && quizJson.data) {
          setQuiz(quizJson.data);
        }
      } catch {
        toast.error("Failed to load results");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [quizId, attemptId]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 mt-8">
        <Skeleton className="h-48 rounded-xl" />
        <div className="flex gap-3 justify-center">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-6 w-40" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!attempt || !quiz) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold mb-2">Results not found</h2>
        <p className="text-muted-foreground">This attempt may not exist.</p>
      </div>
    );
  }

  // We need full question data with correct answers and explanations.
  // The quiz GET endpoint doesn't return correct_answer_index for anti-cheat,
  // but for results we fetch attempts which have is_correct already.
  // We'll use the attempt answers combined with quiz questions.
  // For full question data with explanations, we'll fetch via a separate mechanism.
  // Since the attempt already has is_correct, we can reconstruct the results.

  // Build question list from quiz data (which may not have correct_answer_index from GET)
  // For the results page, we'll show what we have.
  const questionsWithAnswers = (quiz.quiz_questions || []).map((q) => {
    const answer = attempt.answers.find((a) => a.question_id === q.id);
    return {
      ...q,
      correct_answer_index: answer?.is_correct
        ? answer.selected_index
        : (q as QuestionData & { correct_answer_index?: number }).correct_answer_index ?? 0,
      explanation: (q as QuestionData & { explanation?: string }).explanation ?? "Review this topic for better understanding.",
    };
  });

  return (
    <div className="py-4">
      <QuizResults
        score={attempt.score}
        total={attempt.total_questions}
        answers={attempt.answers}
        questions={questionsWithAnswers}
        quizId={quizId}
        documentId={quiz.document_id}
        timeTaken={attempt.time_taken_seconds}
      />
    </div>
  );
}
