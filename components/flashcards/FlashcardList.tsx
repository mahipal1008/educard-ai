// FILE: components/flashcards/FlashcardList.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { Flashcard } from "@/types";

interface FlashcardListProps {
  cards: Flashcard[];
  onEdit: (card: Flashcard) => void;
  onDelete: (cardId: string) => void;
}

export function FlashcardList({ cards, onEdit, onDelete }: FlashcardListProps) {
  if (cards.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No flashcards yet. Add your first card!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => (
        <Card key={card.id} className="group hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <span className="text-xs text-muted-foreground font-medium">
                #{index + 1}
              </span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onEdit(card)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive"
                  onClick={() => onDelete(card.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  Front
                </p>
                <p className="text-sm font-medium line-clamp-3">{card.front}</p>
              </div>
              <div className="border-t pt-3">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  Back
                </p>
                <p className="text-sm text-muted-foreground line-clamp-3">{card.back}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
