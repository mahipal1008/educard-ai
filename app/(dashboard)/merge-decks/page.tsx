// FILE: app/(dashboard)/merge-decks/page.tsx
"use client";

export const runtime = "edge";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Layers, Loader2, Sparkles, BookOpen, CheckCircle2, Check } from "lucide-react";
import { toast } from "sonner";

interface DeckItem {
  id: string;
  title: string;
  card_count: number;
  created_at: string;
  document_id: string | null;
}

export default function MergeDecksPage() {
  const router = useRouter();
  const [decks, setDecks] = useState<DeckItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [mergeTitle, setMergeTitle] = useState("");
  const [merging, setMerging] = useState(false);
  const [result, setResult] = useState<{
    deckId: string;
    totalCards: number;
    duplicatesRemoved: number;
  } | null>(null);

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const res = await fetch("/api/documents");
        if (!res.ok) throw new Error("Failed to load decks");
        const json = await res.json();
        if (json.data) {
          const deckList: DeckItem[] = json.data
            .filter((doc: { deck?: DeckItem | null }) => doc.deck?.id)
            .map((doc: { deck: DeckItem }) => doc.deck);
          setDecks(deckList);
        }
      } catch {
        toast.error("Failed to load decks");
      } finally {
        setLoading(false);
      }
    };
    fetchDecks();
  }, []);

  const toggleDeck = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalCards = decks
    .filter((d) => selectedIds.has(d.id))
    .reduce((sum, d) => sum + (d.card_count || 0), 0);

  const handleMerge = async () => {
    if (selectedIds.size < 2) {
      toast.error("Select at least 2 decks to merge");
      return;
    }
    if (!mergeTitle.trim()) {
      toast.error("Enter a title for the merged deck");
      return;
    }

    setMerging(true);
    try {
      const res = await fetch("/api/decks/merge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deckIds: Array.from(selectedIds),
          title: mergeTitle.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      setResult(json.data);
      toast.success(`Merged ${json.data.totalCards} cards into new deck!`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Merge failed");
    } finally {
      setMerging(false);
    }
  };

  if (result) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in-up">
        <Card className="border-2 border-primary/20">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <div className="h-16 w-16 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold">Decks Merged Successfully!</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong>{result.totalCards}</strong> unique cards in the merged deck</p>
              {result.duplicatesRemoved > 0 && (
                <p><strong>{result.duplicatesRemoved}</strong> duplicate cards removed</p>
              )}
            </div>
            <div className="flex gap-3 justify-center pt-2">
              <Button onClick={() => router.push(`/deck/${result.deckId}`)} className="gap-2">
                <BookOpen className="h-4 w-4" /> Open Merged Deck
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setResult(null);
                  setSelectedIds(new Set());
                  setMergeTitle("");
                }}
              >
                Merge More
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in-up">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl flex items-center gap-3">
          <Layers className="h-7 w-7 text-primary" />
          Merge Decks
        </h1>
        <p className="text-muted-foreground mt-1">
          Combine flashcards from multiple decks into one unified study deck. Duplicates are automatically removed.
        </p>
      </div>

      {/* Merged deck title */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">New Merged Deck</CardTitle>
          <CardDescription>Give a title for the combined deck</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="merge-title">Deck Title</Label>
            <Input
              id="merge-title"
              placeholder="e.g. Biology Final Exam Review"
              value={mergeTitle}
              onChange={(e) => setMergeTitle(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Select decks */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Select Decks to Merge</CardTitle>
              <CardDescription>Choose 2 or more decks</CardDescription>
            </div>
            {selectedIds.size > 0 && (
              <Badge variant="outline" className="text-sm">
                {selectedIds.size} selected &middot; {totalCards} cards
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-14 rounded-lg" />
              ))}
            </div>
          ) : decks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Layers className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>No decks found. Create some documents first to generate flashcard decks.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {decks.map((deck) => {
                const isSelected = selectedIds.has(deck.id);
                return (
                  <button
                    key={deck.id}
                    onClick={() => toggleDeck(deck.id)}
                    className={`w-full flex items-center gap-3 rounded-lg border-2 p-3 text-left transition-all ${
                      isSelected
                        ? "border-primary/30 bg-primary/5"
                        : "border-border hover:border-primary/20 hover:bg-muted/50"
                    }`}
                  >
                    <div className={`h-5 w-5 rounded border-2 flex items-center justify-center shrink-0 ${
                      isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"
                    }`}>
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{deck.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {deck.card_count || 0} cards
                      </p>
                    </div>
                    {isSelected && (
                      <Badge className="bg-primary/10 text-primary border-0 text-xs">Selected</Badge>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Merge button */}
      <div className="flex justify-end">
        <Button
          size="lg"
          onClick={handleMerge}
          disabled={selectedIds.size < 2 || !mergeTitle.trim() || merging}
          className="gap-2"
        >
          {merging ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {merging ? "Merging..." : selectedIds.size === 0 ? "Select Decks to Merge" : `Merge ${selectedIds.size} Deck${selectedIds.size === 1 ? "" : "s"}`}
        </Button>
      </div>
    </div>
  );
}
