// FILE: components/flashcards/StudyMode.tsx
"use client";

import { useEffect, useCallback } from "react";
import { FlashcardCard } from "./FlashcardCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { calculatePercentage } from "@/lib/utils";
import { Trophy, RotateCcw, ArrowLeft, Keyboard } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import confetti from "canvas-confetti";
import type { StudyCard, StudyRating } from "@/types";

interface StudyModeProps {
  currentCard: StudyCard | null;
  currentIndex: number;
  totalCards: number;
  isFlipped: boolean;
  isSubmitting: boolean;
  sessionComplete: boolean;
  stats: {
    totalReviewed: number;
    ratings: Record<StudyRating, number>;
  };
  deckId: string;
  onFlip: () => void;
  onRate: (rating: StudyRating) => void;
}

const ratingButtons: { rating: StudyRating; label: string; color: string; hint: string; key: string }[] = [
  { rating: 0, label: "Again", color: "border-red-500 text-red-500 hover:bg-red-500/10", hint: "< 1 day", key: "1" },
  { rating: 1, label: "Hard", color: "border-orange-500 text-orange-500 hover:bg-orange-500/10", hint: "1 day", key: "2" },
  { rating: 2, label: "Good", color: "border-green-500 text-green-500 hover:bg-green-500/10", hint: "~6 days", key: "3" },
  { rating: 3, label: "Easy", color: "border-blue-500 text-blue-500 hover:bg-blue-500/10", hint: "~8 days", key: "4" },
];

export function StudyMode({
  currentCard,
  currentIndex,
  totalCards,
  isFlipped,
  isSubmitting,
  sessionComplete,
  stats,
  deckId,
  onFlip,
  onRate,
}: StudyModeProps) {
  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (sessionComplete || isSubmitting) return;

      // Space or Enter to flip
      if ((e.code === "Space" || e.code === "Enter") && !isFlipped && currentCard) {
        e.preventDefault();
        onFlip();
        return;
      }

      // 1-4 to rate after flip
      if (isFlipped && currentCard) {
        const keyToRating: Record<string, StudyRating> = {
          "1": 0,
          "2": 1,
          "3": 2,
          "4": 3,
        };
        if (e.key in keyToRating) {
          e.preventDefault();
          onRate(keyToRating[e.key]);
        }
      }
    },
    [isFlipped, currentCard, sessionComplete, isSubmitting, onFlip, onRate]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Confetti on session complete with good results
  useEffect(() => {
    if (sessionComplete) {
      const goodOrEasy = stats.ratings[2] + stats.ratings[3];
      const pct = stats.totalReviewed > 0 ? Math.round((goodOrEasy / stats.totalReviewed) * 100) : 0;
      if (pct >= 70) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
    }
  }, [sessionComplete, stats]);

  if (sessionComplete) {
    const goodOrEasy = stats.ratings[2] + stats.ratings[3];
    const percentage = calculatePercentage(goodOrEasy, stats.totalReviewed);

    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-scale-in">
        <Card className="w-full max-w-md border-2">
          <CardContent className="p-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 mx-auto mb-5 animate-float">
              <Trophy className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-1">Session Complete!</h2>
            <p className="text-muted-foreground mb-6">
              You reviewed <span className="font-semibold text-foreground">{stats.totalReviewed}</span> cards
            </p>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {ratingButtons.map((btn) => (
                <div key={btn.rating} className="p-3 rounded-xl bg-muted/50 border">
                  <div className={`text-2xl font-bold ${btn.color.split(" ")[1]}`}>
                    {stats.ratings[btn.rating]}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{btn.label}</div>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-1000"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {percentage}% cards rated Good or Easy
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              <Link href={`/deck/${deckId}`}>
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Deck
                </Button>
              </Link>
              <Button onClick={() => window.location.reload()} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Study Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
          <Trophy className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">All caught up!</h2>
        <p className="text-muted-foreground mb-4">No cards are due for review right now. Check back later!</p>
        <Link href={`/deck/${deckId}`}>
          <Button variant="outline">Back to Deck</Button>
        </Link>
      </div>
    );
  }

  const progressPercent = calculatePercentage(currentIndex + 1, totalCards);

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Card {currentIndex + 1} of {totalCards}</span>
          <Tooltip>
            <TooltipTrigger
              render={<button className="flex items-center gap-1 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors" />}
            >
              <Keyboard className="h-3.5 w-3.5" />
              Shortcuts
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs space-y-1">
              <p><kbd className="font-mono bg-muted px-1 rounded">Space</kbd> Flip card</p>
              <p><kbd className="font-mono bg-muted px-1 rounded">1-4</kbd> Rate card</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Card */}
      <div className="animate-scale-in" key={currentCard.id}>
        <FlashcardCard
          front={currentCard.front}
          back={currentCard.back}
          isFlipped={isFlipped}
          onFlip={onFlip}
          className="min-h-[280px] mb-4"
        />
      </div>

      {/* Hint text */}
      {!isFlipped && (
        <p className="text-center text-sm text-muted-foreground mb-4 animate-pulse-soft">
          Click card or press <kbd className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded border">Space</kbd> to flip
        </p>
      )}

      {/* Rating buttons - show after flip */}
      {isFlipped && (
        <div className="space-y-3 animate-in-up">
          <p className="text-sm text-center text-muted-foreground">
            How well did you know this?
          </p>
          <div className="grid grid-cols-4 gap-2">
            {ratingButtons.map((btn) => (
              <Tooltip key={btn.rating}>
                <TooltipTrigger
                  render={
                    <Button
                      variant="outline"
                      className={`flex flex-col h-auto py-3 ${btn.color} transition-all hover:scale-[1.02] active:scale-[0.98]`}
                      onClick={() => onRate(btn.rating)}
                      disabled={isSubmitting}
                    />
                  }
                >
                  <span className="font-semibold">{btn.label}</span>
                  <span className="text-[10px] opacity-70 mt-0.5">{btn.hint}</span>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  Press <kbd className="font-mono bg-muted px-1 rounded">{btn.key}</kbd>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
