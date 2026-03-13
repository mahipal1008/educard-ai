// FILE: components/quiz/QuizTimer.tsx
"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { formatTime } from "@/lib/utils";

interface QuizTimerProps {
  isRunning: boolean;
}

export function QuizTimer({ isRunning }: QuizTimerProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Clock className="h-4 w-4" />
      <span className="font-mono">{formatTime(seconds)}</span>
    </div>
  );
}
