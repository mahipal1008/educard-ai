// FILE: components/quiz/QuizQuestion.tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface QuizQuestionProps {
  questionText: string;
  options: string[];
  questionNumber: number;
  onAnswer: (selectedIndex: number) => void;
  disabled: boolean;
}

const optionLetters = ["A", "B", "C", "D"];

export function QuizQuestion({
  questionText,
  options,
  questionNumber,
  onAnswer,
  disabled,
}: QuizQuestionProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    if (disabled || selected !== null) return;
    setSelected(index);
    onAnswer(index);
  };

  return (
    <div className="animate-in-up">
      <div className="mb-6">
        <span className="text-xs font-medium text-primary uppercase tracking-wider">
          Question {questionNumber}
        </span>
        <h2 className="text-xl font-semibold mt-2">{questionText}</h2>
      </div>

      <div className="grid gap-3">
        {options.map((option, index) => (
          <Card
            key={index}
            className={cn(
              "cursor-pointer transition-all",
              selected === null && !disabled && "hover:border-primary/50 hover:shadow-sm",
              selected === index && "border-primary bg-primary/5 ring-2 ring-primary/20",
              (disabled || selected !== null) && selected !== index && "opacity-60 cursor-default"
            )}
            onClick={() => handleSelect(index)}
          >
            <CardContent className="flex items-center gap-4 p-4">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg border-2 font-semibold text-sm shrink-0 transition-colors",
                  selected === index
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/20 text-muted-foreground"
                )}
              >
                {optionLetters[index]}
              </div>
              <span className="text-sm font-medium">{option}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
