// FILE: components/quiz/QuizQuestion.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
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

  // Keyboard shortcuts: 1-4 or A-D to select answer
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (disabled || selected !== null) return;
      const keyMap: Record<string, number> = { "1": 0, "2": 1, "3": 2, "4": 3, a: 0, b: 1, c: 2, d: 3 };
      const index = keyMap[e.key.toLowerCase()];
      if (index !== undefined && index < options.length) {
        e.preventDefault();
        handleSelect(index);
      }
    },
    [disabled, selected, options.length] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

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
              <span className="text-sm font-medium flex-1">{option}</span>
              {selected === null && !disabled && (
                <kbd className="hidden sm:inline-flex text-[10px] text-muted-foreground/50 bg-muted px-1.5 py-0.5 rounded border font-mono">
                  {index + 1}
                </kbd>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
