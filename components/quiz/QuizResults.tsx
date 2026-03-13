// FILE: components/quiz/QuizResults.tsx
"use client";

import { useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Trophy, RotateCcw, ArrowLeft } from "lucide-react";
import { calculatePercentage, getScoreColor, getScoreBgColor } from "@/lib/utils";
import Link from "next/link";
import confetti from "canvas-confetti";

interface QuizResultsProps {
  score: number;
  total: number;
  answers: Array<{
    question_id: string;
    selected_index: number;
    is_correct: boolean;
  }>;
  questions: Array<{
    id: string;
    question_text: string;
    options: string[];
    correct_answer_index: number;
    explanation: string;
  }>;
  quizId: string;
  documentId: string;
  timeTaken: number | null;
}

export function QuizResults({
  score,
  total,
  answers,
  questions,
  quizId,
  documentId,
  timeTaken,
}: QuizResultsProps) {
  const percentage = calculatePercentage(score, total);
  const scoreColor = getScoreColor(percentage);
  const scoreBg = getScoreBgColor(percentage);

  useEffect(() => {
    if (percentage >= 80) {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [percentage]);

  const questionMap = new Map(questions.map((q) => [q.id, q]));

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in-up">
      {/* Score card */}
      <Card className={`border-2 ${scoreBg}`}>
        <CardContent className="p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background mx-auto mb-4">
            <Trophy className={`h-8 w-8 ${scoreColor}`} />
          </div>
          <div className={`text-5xl font-bold mb-2 ${scoreColor}`}>
            {score} / {total}
          </div>
          <div className={`text-2xl font-semibold mb-1 ${scoreColor}`}>
            {percentage}%
          </div>
          <p className="text-muted-foreground">
            {percentage >= 80
              ? "Excellent work! You really know this material!"
              : percentage >= 60
              ? "Good effort! Review the wrong answers to improve."
              : "Keep studying! Review the material and try again."}
          </p>
          {timeTaken && (
            <p className="text-sm text-muted-foreground mt-2">
              Completed in {Math.floor(timeTaken / 60)}m {timeTaken % 60}s
            </p>
          )}
        </CardContent>
      </Card>

      {/* Action buttons */}
      <div className="flex gap-3 justify-center">
        <Link href={`/quiz/${quizId}`}>
          <Button variant="outline" className="gap-2">
            <RotateCcw className="h-4 w-4" /> Retry Quiz
          </Button>
        </Link>
        <Link href={`/document/${documentId}`}>
          <Button className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Document
          </Button>
        </Link>
      </div>

      {/* Per-question review */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Question Review</h3>
        <Accordion className="space-y-2">
          {answers.map((answer, index) => {
            const question = questionMap.get(answer.question_id);
            if (!question) return null;

            return (
              <AccordionItem
                key={answer.question_id}
                value={`q-${index}`}
                className="border rounded-lg px-4"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 text-left">
                    {answer.is_correct ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                    )}
                    <span className="text-sm font-medium">
                      Q{index + 1}: {question.question_text}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-3 pl-8">
                    <div className="space-y-1.5">
                      {question.options.map((opt, optIndex) => (
                        <div
                          key={optIndex}
                          className={`flex items-center gap-2 text-sm p-2 rounded ${
                            optIndex === question.correct_answer_index
                              ? "bg-green-500/10 text-green-700 dark:text-green-400 font-medium"
                              : optIndex === answer.selected_index && !answer.is_correct
                              ? "bg-red-500/10 text-red-700 dark:text-red-400 line-through"
                              : "text-muted-foreground"
                          }`}
                        >
                          <span className="font-mono text-xs w-6">
                            {String.fromCharCode(65 + optIndex)}.
                          </span>
                          {opt}
                          {optIndex === question.correct_answer_index && (
                            <Badge variant="outline" className="ml-auto text-xs text-green-500 border-green-500/30">
                              Correct
                            </Badge>
                          )}
                          {optIndex === answer.selected_index && !answer.is_correct && (
                            <Badge variant="outline" className="ml-auto text-xs text-red-500 border-red-500/30">
                              Your answer
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Explanation
                      </p>
                      <p className="text-sm">{question.explanation}</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}
