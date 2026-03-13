// FILE: hooks/useFlashcards.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import type { Flashcard, DeckWithCards } from "@/types";
import { toast } from "sonner";

export function useFlashcards(deckId: string) {
  const [deck, setDeck] = useState<DeckWithCards | null>(null);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDeck = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/decks/${deckId}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to fetch deck");
      }

      setDeck(json.data);
      setCards(json.data.flashcards ?? []);
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load flashcards";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [deckId]);

  useEffect(() => {
    fetchDeck();
  }, [fetchDeck]);

  const addCard = useCallback(
    async (front: string, back: string) => {
      // Optimistic update
      const tempId = `temp-${Date.now()}`;
      const tempCard: Flashcard = {
        id: tempId,
        deck_id: deckId,
        front,
        back,
        order_index: cards.length,
        created_at: new Date().toISOString(),
      };
      setCards((prev) => [...prev, tempCard]);

      try {
        const res = await fetch(`/api/decks/${deckId}/cards`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ front, back }),
        });
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Failed to add card");
        }

        // Replace temp card with real card
        setCards((prev) =>
          prev.map((c) => (c.id === tempId ? json.data : c))
        );
        toast.success("Card added");
      } catch (err) {
        // Revert optimistic update
        setCards((prev) => prev.filter((c) => c.id !== tempId));
        const message =
          err instanceof Error ? err.message : "Failed to add card";
        toast.error(message);
      }
    },
    [deckId, cards.length]
  );

  const updateCard = useCallback(
    async (
      cardId: string,
      data: { front?: string; back?: string }
    ) => {
      // Optimistic update
      const previousCards = [...cards];
      setCards((prev) =>
        prev.map((c) => (c.id === cardId ? { ...c, ...data } : c))
      );

      try {
        const res = await fetch(`/api/cards/${cardId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Failed to update card");
        }

        setCards((prev) =>
          prev.map((c) => (c.id === cardId ? json.data : c))
        );
        toast.success("Card updated");
      } catch (err) {
        // Revert
        setCards(previousCards);
        const message =
          err instanceof Error ? err.message : "Failed to update card";
        toast.error(message);
      }
    },
    [cards]
  );

  const deleteCard = useCallback(
    async (cardId: string) => {
      // Optimistic update
      const previousCards = [...cards];
      setCards((prev) => prev.filter((c) => c.id !== cardId));

      try {
        const res = await fetch(`/api/cards/${cardId}`, {
          method: "DELETE",
        });
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Failed to delete card");
        }

        toast.success("Card deleted");
      } catch (err) {
        setCards(previousCards);
        const message =
          err instanceof Error ? err.message : "Failed to delete card";
        toast.error(message);
      }
    },
    [cards]
  );

  return {
    deck,
    cards,
    loading,
    error,
    addCard,
    updateCard,
    deleteCard,
    refetch: fetchDeck,
  };
}
