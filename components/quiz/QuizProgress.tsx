// FILE: components/quiz/QuizProgress.tsx
"use client";

import { Progress } from "@/components/ui/progress";
import { calculatePercentage } from "@/lib/utils";

interface QuizProgressProps {
  current: number;
  total: number;
}

export function QuizProgress({ current, total }: QuizProgressProps) {
  const percentage = calculatePercentage(current, total);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
        <span>
          Question {current} of {total}
        </span>
        <span>{percentage}%</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}
