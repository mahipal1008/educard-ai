// FILE: app/(dashboard)/deck/[id]/page.tsx
"use client";

export const runtime = "edge";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useFlashcards } from "@/hooks/useFlashcards";
import { FlashcardList } from "@/components/flashcards/FlashcardList";
import { EditCardModal } from "@/components/flashcards/EditCardModal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Plus, BookOpen, Share2, Globe, ArrowLeft, Download } from "lucide-react";
import { toast } from "sonner";
import { TranslationSelector } from "@/components/TranslationSelector";
import { useTranslation } from "@/hooks/useTranslation";
import type { Flashcard } from "@/types";

export default function DeckBrowsePage() {
  const params = useParams();
  const deckId = params.id as string;
  const { deck, cards, loading, addCard, updateCard, deleteCard } = useFlashcards(deckId);
  const {
    translation,
    loading: translationLoading,
    showTranslated,
    translate,
    getTranslation,
    toggleTranslated,
    clearTranslation,
  } = useTranslation(deckId);

  const [editCard, setEditCard] = useState<Flashcard | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [toggling, setToggling] = useState(false);

  const handleExportCSV = () => {
    if (!cards.length || !deck) return;
    const headers = "Front,Back\n";
    const rows = cards.map((c) => {
      const front = `"${c.front.replace(/"/g, '""')}"`;
      const back = `"${c.back.replace(/"/g, '""')}"`;
      return `${front},${back}`;
    }).join("\n");
    const csv = headers + rows;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${deck.title.replace(/[^a-zA-Z0-9]/g, "_")}_flashcards.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${cards.length} cards to CSV`);
  };

  const handleTogglePublic = async () => {
    if (!deck) return;
    setToggling(true);
    try {
      const res = await fetch(`/api/decks/${deckId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_public: !deck.is_public }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      if (!deck.is_public && json.data?.public_slug) {
        const shareUrl = `${window.location.origin}/share/deck/${json.data.public_slug}`;
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Deck is now public! Link copied.");
      } else {
        toast.success("Deck is now private.");
      }
      window.location.reload();
    } catch {
      toast.error("Failed to update sharing");
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-in-up">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-40" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold mb-2">Deck not found</h2>
        <Link href="/library"><Button variant="outline">Back to Library</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in-up">
      {/* Header */}
      <div>
        <Link href={`/document/${deck.document_id}`} className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-3">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to document
        </Link>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{deck.title}</h1>
              {deck.is_public && (
                <Badge variant="outline" className="gap-1">
                  <Globe className="h-3 w-3" /> Public
                </Badge>
              )}
            </div>
            {deck.description && (
              <p className="text-muted-foreground mt-1">{deck.description}</p>
            )}
            <p className="text-sm text-muted-foreground mt-1">
              {cards.length} {cards.length === 1 ? "card" : "cards"}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={cards.length === 0} className="gap-2">
              <Download className="h-4 w-4" /> Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handleTogglePublic} disabled={toggling} className="gap-2">
              <Share2 className="h-4 w-4" />
              {deck.is_public ? "Make Private" : "Share"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setAddOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" /> Add Card
            </Button>
            <Link href={`/deck/${deckId}/study`}>
              <Button size="sm" className="gap-2">
                <BookOpen className="h-4 w-4" /> Study
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Translation selector */}
      {cards.length > 0 && (
        <TranslationSelector
          loading={translationLoading}
          showTranslated={showTranslated}
          hasTranslation={!!translation}
          onTranslate={translate}
          onToggle={toggleTranslated}
          onClear={clearTranslation}
        />
      )}

      {/* Cards grid */}
      <FlashcardList
        cards={cards.map((card) => {
          const t = getTranslation(card.id);
          if (t) return { ...card, front: t.translatedFront, back: t.translatedBack };
          return card;
        })}
        onEdit={(card) => { setEditCard(card); setEditOpen(true); }}
        onDelete={deleteCard}
      />

      {/* Edit modal */}
      <EditCardModal
        card={editCard}
        open={editOpen}
        onClose={() => { setEditOpen(false); setEditCard(null); }}
        onSave={(cardId, data) => updateCard(cardId, data)}
      />

      {/* Add modal */}
      <EditCardModal
        card={null}
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={() => {}}
        mode="add"
        onAdd={addCard}
      />
    </div>
  );
}
