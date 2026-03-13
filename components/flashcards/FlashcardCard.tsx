// FILE: components/flashcards/FlashcardCard.tsx
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface FlashcardCardProps {
  front: string;
  back: string;
  isFlipped?: boolean;
  onFlip?: () => void;
  onClick?: () => void;
  className?: string;
}

export function FlashcardCard({
  front,
  back,
  isFlipped = false,
  onFlip,
  onClick,
  className,
}: FlashcardCardProps) {
  const [localFlipped, setLocalFlipped] = useState(false);
  const flipped = onFlip ? isFlipped : localFlipped;

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }
    if (onFlip) {
      onFlip();
    } else {
      setLocalFlipped((prev) => !prev);
    }
  };

  return (
    <div
      className={cn("perspective-1000 cursor-pointer", className)}
      onClick={handleClick}
    >
      <div
        className={cn(
          "relative w-full min-h-[200px] transition-transform duration-300 preserve-3d",
          flipped && "rotate-y-180"
        )}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden rounded-xl border-2 bg-card p-6 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
          <div className="text-center">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Question</p>
            <p className="text-lg font-medium">{front}</p>
            <p className="text-xs text-muted-foreground mt-4">Click to reveal answer</p>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-xl border-2 border-primary/20 bg-primary/5 p-6 flex items-center justify-center shadow-sm">
          <div className="text-center">
            <p className="text-xs uppercase tracking-wider text-primary mb-3">Answer</p>
            <p className="text-lg">{back}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
