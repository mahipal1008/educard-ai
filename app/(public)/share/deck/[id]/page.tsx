// FILE: app/(public)/share/deck/[id]/page.tsx
"use client";

export const runtime = "edge";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FlashcardCard } from "@/components/flashcards/FlashcardCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GraduationCap, Globe, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Flashcard, Deck } from "@/types";

interface PublicDeckData extends Deck {
  flashcards: Flashcard[];
}

export default function PublicDeckPage() {
  const params = useParams();
  const slug = params.id as string;

  const [deck, setDeck] = useState<PublicDeckData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"browse" | "study">("browse");

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        // Try fetching by slug - we'll use the deck ID endpoint
        // The slug is actually the deck ID or public_slug
        const res = await fetch(`/api/decks/${slug}`);
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Deck not found");
        }

        if (!json.data.is_public) {
          throw new Error("This deck is not public");
        }

        setDeck(json.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load deck");
      } finally {
        setLoading(false);
      }
    };

    fetchDeck();
  }, [slug]);

  const cards = deck?.flashcards ?? [];
  const currentCard = cards[currentIndex];

  const goNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
          {loading ? (
            <div className="space-y-6">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-[300px] rounded-xl" />
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Deck not found</h2>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Link href="/">
                <Button variant="outline">Go Home</Button>
              </Link>
            </div>
          ) : deck ? (
            <div className="space-y-6 animate-in-up">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="gap-1">
                    <Globe className="h-3 w-3" /> Public Deck
                  </Badge>
                </div>
                <h1 className="text-3xl font-bold">{deck.title}</h1>
                {deck.description && (
                  <p className="text-muted-foreground mt-2">{deck.description}</p>
                )}
                <p className="text-sm text-muted-foreground mt-1">
                  {cards.length} cards
                </p>
              </div>

              {/* View toggle */}
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "browse" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("browse")}
                >
                  Browse All
                </Button>
                <Button
                  variant={viewMode === "study" ? "default" : "outline"}
                  size="sm"
                  onClick={() => { setViewMode("study"); setCurrentIndex(0); }}
                >
                  Flip Through
                </Button>
              </div>

              {viewMode === "study" && currentCard ? (
                <div className="max-w-lg mx-auto">
                  <FlashcardCard
                    front={currentCard.front}
                    back={currentCard.back}
                    className="min-h-[250px] mb-6"
                  />
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={goPrev}
                      disabled={currentIndex === 0}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {currentIndex + 1} / {cards.length}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={goNext}
                      disabled={currentIndex === cards.length - 1}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {cards.map((card, index) => (
                    <Card key={card.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <span className="text-xs text-muted-foreground">#{index + 1}</span>
                        <div className="mt-2 space-y-2">
                          <div>
                            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-0.5">Front</p>
                            <p className="text-sm font-medium">{card.front}</p>
                          </div>
                          <div className="border-t pt-2">
                            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-0.5">Back</p>
                            <p className="text-sm text-muted-foreground">{card.back}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* CTA */}
              <Card className="bg-primary/5 border-primary/10">
                <CardContent className="p-6 text-center">
                  <GraduationCap className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">
                    Want to create your own flashcards?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    EduCard AI turns any YouTube video or PDF into flashcards, quizzes, and summaries in seconds.
                  </p>
                  <Link href="/signup">
                    <Button>Sign Up Free</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
}
