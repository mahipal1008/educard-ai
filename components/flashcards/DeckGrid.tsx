// FILE: components/flashcards/DeckGrid.tsx
"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, Globe } from "lucide-react";
import type { Deck } from "@/types";

interface DeckGridProps {
  decks: Deck[];
}

export function DeckGrid({ decks }: DeckGridProps) {
  if (decks.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <BrainCircuit className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No decks found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {decks.map((deck) => (
        <Link key={deck.id} href={`/deck/${deck.id}`}>
          <Card className="hover:shadow-md hover:border-primary/20 transition-all cursor-pointer h-full">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
                  <BrainCircuit className="h-5 w-5" />
                </div>
                {deck.is_public && (
                  <Badge variant="outline" className="gap-1 text-xs">
                    <Globe className="h-3 w-3" />
                    Public
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold truncate mb-1">{deck.title}</h3>
              {deck.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {deck.description}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {deck.card_count} {deck.card_count === 1 ? "card" : "cards"}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
