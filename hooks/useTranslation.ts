// FILE: hooks/useTranslation.ts
"use client";

import { useState, useCallback } from "react";

interface TranslatedCard {
  cardId: string;
  translatedFront: string;
  translatedBack: string;
}

interface TranslationState {
  languageCode: string;
  languageName: string;
  translations: TranslatedCard[];
}

export function useTranslation(deckId: string) {
  const [translation, setTranslation] = useState<TranslationState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTranslated, setShowTranslated] = useState(false);

  const translate = useCallback(
    async (languageCode: string, languageName: string) => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/decks/${deckId}/translate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ languageCode, languageName }),
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Translation failed");

        setTranslation(json.data);
        setShowTranslated(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Translation failed");
      } finally {
        setLoading(false);
      }
    },
    [deckId]
  );

  const getTranslation = useCallback(
    (cardId: string) => {
      if (!translation || !showTranslated) return null;
      return translation.translations.find((t) => t.cardId === cardId) || null;
    },
    [translation, showTranslated]
  );

  const toggleTranslated = useCallback(() => {
    setShowTranslated((prev) => !prev);
  }, []);

  const clearTranslation = useCallback(() => {
    setTranslation(null);
    setShowTranslated(false);
    setError(null);
  }, []);

  return {
    translation,
    loading,
    error,
    showTranslated,
    translate,
    getTranslation,
    toggleTranslated,
    clearTranslation,
  };
}
