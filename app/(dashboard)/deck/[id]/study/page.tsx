// FILE: app/(dashboard)/deck/[id]/study/page.tsx
"use client";

export const runtime = "edge";

import { useParams } from "next/navigation";
import { useStudy } from "@/hooks/useStudy";
import { StudyMode } from "@/components/flashcards/StudyMode";
import { Skeleton } from "@/components/ui/skeleton";

export default function StudyPage() {
  const params = useParams();
  const deckId = params.id as string;

  const {
    currentCard,
    currentIndex,
    totalCards,
    loading,
    isFlipped,
    isSubmitting,
    sessionComplete,
    stats,
    flipCard,
    submitRating,
  } = useStudy(deckId);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto space-y-6 mt-8">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-[280px] w-full rounded-xl" />
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 animate-in-up">
      <StudyMode
        currentCard={currentCard}
        currentIndex={currentIndex}
        totalCards={totalCards}
        isFlipped={isFlipped}
        isSubmitting={isSubmitting}
        sessionComplete={sessionComplete}
        stats={stats}
        deckId={deckId}
        onFlip={flipCard}
        onRate={submitRating}
      />
    </div>
  );
}
