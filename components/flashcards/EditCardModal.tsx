// FILE: components/flashcards/EditCardModal.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Flashcard } from "@/types";

interface EditCardModalProps {
  card: Flashcard | null;
  open: boolean;
  onClose: () => void;
  onSave: (cardId: string, data: { front: string; back: string }) => void;
  mode?: "edit" | "add";
  onAdd?: (front: string, back: string) => void;
}

export function EditCardModal({
  card,
  open,
  onClose,
  onSave,
  mode = "edit",
  onAdd,
}: EditCardModalProps) {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  useEffect(() => {
    if (card) {
      setFront(card.front);
      setBack(card.back);
    } else {
      setFront("");
      setBack("");
    }
  }, [card, open]);

  const handleSave = () => {
    const trimmedFront = front.trim();
    const trimmedBack = back.trim();
    if (!trimmedFront || !trimmedBack) return;

    if (mode === "add" && onAdd) {
      onAdd(trimmedFront, trimmedBack);
    } else if (card) {
      onSave(card.id, { front: trimmedFront, back: trimmedBack });
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Card" : "Edit Card"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="card-front">Front (Question)</Label>
            <Textarea
              id="card-front"
              placeholder="Enter the question or term..."
              value={front}
              onChange={(e) => setFront(e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="card-back">Back (Answer)</Label>
            <Textarea
              id="card-back"
              placeholder="Enter the answer or definition..."
              value={back}
              onChange={(e) => setBack(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!front.trim() || !back.trim()}
          >
            {mode === "add" ? "Add Card" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
