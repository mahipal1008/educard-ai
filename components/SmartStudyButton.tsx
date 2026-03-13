// FILE: components/SmartStudyButton.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Loader2, Sparkles, X, RotateCcw, CheckCircle2 } from "lucide-react";
import { getWeakTopics } from "@/components/WeakTopicDashboard";

interface SmartCard {
  id: string;
  front: string;
  back: string;
}

export function SmartStudyButton() {
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState<SmartCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    setLoading(true);
    setError(null);

    try {
      const weakTopics = getWeakTopics();

      const res = await fetch("/api/decks/smart-study", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weakTopics }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to generate smart deck");

      setCards(json.data.cards);
      setCurrentIndex(0);
      setFlipped(false);
      setActive(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setFlipped(false);
    } else {
      setActive(false);
    }
  };

  if (!active) {
    return (
      <div className="space-y-3">
        <Button
          onClick={handleStart}
          disabled={loading}
          className="w-full gap-2"
          variant="outline"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Brain className="h-4 w-4" />
          )}
          {loading ? "Generating..." : "Smart Study (AI-Powered)"}
        </Button>
        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
        {cards.length > 0 && !active && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
            Session complete! {cards.length} cards reviewed.
          </div>
        )}
      </div>
    );
  }

  const card = cards[currentIndex];

  if (!card) {
    setActive(false);
    return null;
  }

  return (
    <Card className="border-primary/20">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Smart Study</span>
            <Badge variant="secondary" className="text-xs">
              {currentIndex + 1}/{cards.length}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setActive(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Flashcard */}
        <div
          onClick={() => setFlipped(!flipped)}
          className="min-h-[120px] rounded-xl border-2 p-6 cursor-pointer hover:border-primary/30 transition-colors flex items-center justify-center text-center"
        >
          <p className="text-sm leading-relaxed">
            {flipped ? card.back : card.front}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{flipped ? "Answer" : "Question"} — tap to flip</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => { setFlipped(false); }}
            >
              <RotateCcw className="h-3 w-3 mr-1" /> Flip
            </Button>
            <Button
              size="sm"
              className="h-7 text-xs"
              onClick={handleNext}
            >
              {currentIndex < cards.length - 1 ? "Next" : "Finish"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
