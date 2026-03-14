// FILE: app/(dashboard)/quiz/[id]/page.tsx
"use client";

export const runtime = "edge";

import { useParams, useRouter } from "next/navigation";
import { useQuiz } from "@/hooks/useQuiz";
import { QuizProgress } from "@/components/quiz/QuizProgress";
import { QuizQuestion } from "@/components/quiz/QuizQuestion";
import { QuizTimer } from "@/components/quiz/QuizTimer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;

  const {
    quiz,
    state,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    isLastQuestion,
    submitAnswer,
    submitAttempt,
  } = useQuiz(quizId);

  const handleAnswer = (selectedIndex: number) => {
    submitAnswer(selectedIndex);

    if (isLastQuestion) {
      // Small delay then submit
      setTimeout(async () => {
        const result = await submitAttempt();
        if (result) {
          router.push(`/quiz/${quizId}/results/${result.attemptId}`);
        }
      }, 1000);
    }
  };

  if (state === "loading") {
    return (
      <div className="max-w-2xl mx-auto space-y-6 mt-8">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (state === "submitting") {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg font-medium">Grading your quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz || !currentQuestion) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold mb-2">Quiz not found</h2>
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold truncate">{quiz.title}</h1>
        <QuizTimer isRunning={state === "in_progress"} />
      </div>

      {/* Progress */}
      <QuizProgress current={currentQuestionIndex + 1} total={totalQuestions} />

      {/* Current question */}
      <QuizQuestion
        key={currentQuestion.id}
        questionText={currentQuestion.question_text}
        options={currentQuestion.options as string[]}
        questionNumber={currentQuestionIndex + 1}
        onAnswer={handleAnswer}
        disabled={state !== "in_progress"}
      />
    </div>
  );
}
