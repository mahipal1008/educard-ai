// FILE: app/(dashboard)/document/[id]/page.tsx
"use client";

export const runtime = "edge";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { DocumentHeader } from "@/components/document/DocumentHeader";
import { SummaryCard } from "@/components/document/SummaryCard";
import { ActionCards } from "@/components/document/ActionCards";
import { DocumentActions } from "@/components/document/DocumentActions";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import type { DocumentWithRelations } from "@/types";

export default function DocumentPage() {
  const params = useParams();
  const documentId = params.id as string;
  const [document, setDocument] = useState<DocumentWithRelations | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res = await fetch(`/api/documents/${documentId}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load document");
        setDocument(json.data);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load document";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    fetchDocument();
  }, [documentId]);

  if (loading) {
    return (
      <div className="space-y-6 animate-in-up">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div>
            <Skeleton className="h-7 w-64 mb-2" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold mb-2">Document not found</h2>
        <p className="text-muted-foreground">This document may have been deleted.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in-up">
      <DocumentHeader document={document} />

      <DocumentActions
        documentId={document.id}
        deckId={document.deck?.id ?? null}
        isPublic={document.deck?.is_public ?? false}
        publicSlug={document.deck?.public_slug ?? null}
      />

      <SummaryCard
        summary={document.summary}
        documentId={document.id}
      />

      <ActionCards
        deckId={document.deck?.id ?? null}
        quizId={document.quiz?.id ?? null}
        cardCount={document.deck?.card_count ?? 0}
        questionCount={document.quiz?.question_count ?? 0}
      />
    </div>
  );
}
