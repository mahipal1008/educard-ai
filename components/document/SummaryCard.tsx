// FILE: components/document/SummaryCard.tsx
"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Loader2, RefreshCw, List, BookOpenCheck, LayoutList, BrainCircuit } from "lucide-react";
import { toast } from "sonner";
import type { SummaryMode } from "@/lib/prompts/summary-prompt";

const summaryModes: { value: SummaryMode; label: string; icon: React.ElementType; description: string }[] = [
  { value: "default", label: "Default", icon: FileText, description: "TL;DR + Key Points + Key Terms" },
  { value: "bullet", label: "Bullet Points", icon: List, description: "Concise bullet-point format" },
  { value: "cornell", label: "Cornell Notes", icon: BookOpenCheck, description: "Questions + Notes + Summary" },
  { value: "outline", label: "Outline", icon: LayoutList, description: "Hierarchical outline structure" },
  { value: "mindmap", label: "Mind Map", icon: BrainCircuit, description: "Central topic with branches" },
];

interface SummaryCardProps {
  summary: string | null;
  documentId?: string;
}

export function SummaryCard({ summary, documentId }: SummaryCardProps) {
  const [currentSummary, setCurrentSummary] = useState(summary);
  const [mode, setMode] = useState<SummaryMode>("default");
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    setCurrentSummary(summary);
  }, [summary]);

  const handleRegenerate = async () => {
    if (!documentId) return;
    setRegenerating(true);
    try {
      // Read AI preferences from localStorage
      let aiPrefs;
      try {
        const savedPrefs = localStorage.getItem("educard-ai-prefs");
        if (savedPrefs) aiPrefs = JSON.parse(savedPrefs);
      } catch {
        // Ignore localStorage errors
      }

      const res = await fetch("/api/generate/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId, summaryMode: mode, aiPrefs }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      if (!json.data?.summary) throw new Error("Invalid response from server");
      setCurrentSummary(json.data.summary);
      toast.success(`Summary regenerated in ${summaryModes.find(m => m.value === mode)?.label} mode`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to regenerate summary");
    } finally {
      setRegenerating(false);
    }
  };

  if (!currentSummary) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No summary available yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-primary" />
            Summary
          </CardTitle>
          {documentId && (
            <div className="flex items-center gap-2">
              <Select value={mode} onValueChange={(v) => setMode(v as SummaryMode)}>
                <SelectTrigger className="w-[160px] h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {summaryModes.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      <div className="flex items-center gap-2">
                        <m.icon className="h-3.5 w-3.5" />
                        {m.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                variant="outline"
                onClick={handleRegenerate}
                disabled={regenerating}
                className="gap-1.5"
              >
                {regenerating ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
                {regenerating ? "Generating..." : "Regenerate"}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>{currentSummary}</ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
}
