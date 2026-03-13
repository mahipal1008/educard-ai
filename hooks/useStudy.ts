// FILE: hooks/useStudy.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import type { StudyCard, StudyRating } from "@/types";
import { toast } from "sonner";

interface SessionStats {
  totalReviewed: number;
  ratings: Record<StudyRating, number>;
}

export function useStudy(deckId: string) {
  const [cards, setCards] = useState<StudyCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [stats, setStats] = useState<SessionStats>({
    totalReviewed: 0,
    ratings: { 0: 0, 1: 0, 2: 0, 3: 0 },
  });
  const [totalDue, setTotalDue] = useState(0);
  const [totalNew, setTotalNew] = useState(0);

  useEffect(() => {
    const fetchStudyCards = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/study/${deckId}`);
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Failed to fetch study cards");
        }

        setCards(json.data.cards);
        setTotalDue(json.data.totalDue);
        setTotalNew(json.data.totalNew);

        if (json.data.cards.length === 0) {
          setSessionComplete(true);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load study session";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudyCards();
  }, [deckId]);

  const currentCard = cards[currentIndex] ?? null;

  const flipCard = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const submitRating = useCallback(
    async (rating: StudyRating) => {
      if (!currentCard || isSubmitting) return;
      setIsSubmitting(true);

      try {
        const res = await fetch(`/api/study/${deckId}/review`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            flashcard_id: currentCard.id,
            rating,
          }),
        });

        if (!res.ok) {
          const json = await res.json();
          throw new Error(json.error || "Failed to submit review");
        }

        // Update stats
        setStats((prev) => ({
          totalReviewed: prev.totalReviewed + 1,
          ratings: {
            ...prev.ratings,
            [rating]: prev.ratings[rating] + 1,
          },
        }));

        // Move to next card
        setIsFlipped(false);
        if (currentIndex < cards.length - 1) {
          setTimeout(() => {
            setCurrentIndex((prev) => prev + 1);
          }, 200);
        } else {
          setSessionComplete(true);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to submit rating";
        toast.error(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [currentCard, currentIndex, cards.length, deckId, isSubmitting]
  );

  return {
    currentCard,
    currentIndex,
    totalCards: cards.length,
    loading,
    isFlipped,
    isSubmitting,
    sessionComplete,
    stats,
    totalDue,
    totalNew,
    flipCard,
    submitRating,
  };
}
