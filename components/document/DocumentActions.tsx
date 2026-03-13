// FILE: components/document/DocumentActions.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Share2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface DocumentActionsProps {
  documentId: string;
  deckId: string | null;
  isPublic: boolean;
  publicSlug: string | null;
}

export function DocumentActions({
  documentId,
  deckId,
  isPublic,
  publicSlug,
}: DocumentActionsProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/documents/${documentId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Document deleted");
      router.push("/library");
    } catch {
      toast.error("Failed to delete document");
    } finally {
      setDeleting(false);
    }
  };

  const handleTogglePublic = async () => {
    if (!deckId) return;
    setToggling(true);
    try {
      const res = await fetch(`/api/decks/${deckId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_public: !isPublic }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update");

      if (!isPublic && json.data?.public_slug) {
        const shareUrl = `${window.location.origin}/share/deck/${json.data.public_slug}`;
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Deck is now public! Link copied to clipboard.");
      } else {
        toast.success("Deck is now private.");
      }
      router.refresh();
    } catch {
      toast.error("Failed to update sharing settings");
    } finally {
      setToggling(false);
    }
  };

  const handleCopyLink = async () => {
    if (!publicSlug) return;
    const shareUrl = `${window.location.origin}/share/deck/${publicSlug}`;
    await navigator.clipboard.writeText(shareUrl);
    toast.success("Share link copied to clipboard!");
  };

  return (
    <div className="flex flex-wrap gap-2">
      {deckId && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleTogglePublic}
          disabled={toggling}
          className="gap-2"
        >
          <Share2 className="h-4 w-4" />
          {isPublic ? "Make Private" : "Share Deck"}
        </Button>
      )}

      {isPublic && publicSlug && (
        <Button variant="outline" size="sm" onClick={handleCopyLink} className="gap-2">
          Copy Link
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          toast.info("Regeneration started...");
          // Trigger regeneration by fetching the process endpoint again
          router.push(`/create/processing/${documentId}`);
        }}
        className="gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Regenerate
      </Button>

      <AlertDialog>
        <AlertDialogTrigger
          render={<Button variant="outline" size="sm" className="gap-2 text-destructive hover:bg-destructive/10" />}
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this document?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this document and all associated flashcards, quizzes, and study progress.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
