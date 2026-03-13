// FILE: components/create/ImageQA.tsx
"use client";

/* eslint-disable @next/next/no-img-element */

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ImageIcon,
  Upload,
  X,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface ImageQAQuestion {
  q: string;
  a: string;
  options: string[];
}

interface ImageQAResult {
  explanation: string;
  questions: ImageQAQuestion[];
}

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE_MB = 10;

export function ImageQA() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImageQAResult | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showAnswers, setShowAnswers] = useState<Record<number, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((selectedFile: File) => {
    setError(null);
    setResult(null);
    setSelectedAnswers({});
    setShowAnswers({});

    if (!ACCEPTED_TYPES.includes(selectedFile.type)) {
      setError("Please upload a PNG, JPG, or WEBP image.");
      return;
    }
    if (selectedFile.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Image must be under ${MAX_SIZE_MB}MB.`);
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(selectedFile);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) handleFileSelect(droppedFile);
    },
    [handleFileSelect]
  );

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          // Strip data:image/...;base64, prefix
          const base64Data = result.split(",")[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch("/api/image-qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, mimeType: file.type }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to analyze image");
      setResult(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (questionIdx: number, optionIdx: number) => {
    if (showAnswers[questionIdx]) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionIdx]: optionIdx }));
    setShowAnswers((prev) => ({ ...prev, [questionIdx]: true }));
  };

  const clearImage = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setSelectedAnswers({});
    setShowAnswers({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      {!preview ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer hover:border-primary/50 hover:bg-accent/30 transition-all"
        >
          <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-base font-medium mb-1">
            Drop an image here or click to upload
          </p>
          <p className="text-sm text-muted-foreground">
            PNG, JPG, WEBP — up to {MAX_SIZE_MB}MB
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Chemistry diagrams, math equations, textbook pages, and more
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFileSelect(f);
            }}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Preview */}
          <div className="relative rounded-xl border overflow-hidden bg-muted/30">
            <img
              src={preview}
              alt="Uploaded"
              className="max-h-64 w-full object-contain"
            />
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center border hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Analyze button */}
          {!result && !loading && (
            <Button
              onClick={handleAnalyze}
              className="w-full h-11 gap-2"
              size="lg"
            >
              <Sparkles className="h-4 w-4" />
              Analyze Image with AI
            </Button>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Analyzing image with AI...
          </div>
          <Skeleton className="h-24 w-full rounded-xl" />
          <div className="grid gap-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-in-up">
          {/* Explanation */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">AI Explanation</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {result.explanation}
              </p>
            </CardContent>
          </Card>

          {/* Quiz Questions */}
          <div>
            <h3 className="text-base font-semibold mb-4">
              Quiz Questions ({result.questions.length})
            </h3>
            <div className="space-y-4">
              {result.questions.map((question, qIdx) => (
                <Card key={qIdx} className="overflow-hidden">
                  <CardContent className="p-5">
                    <p className="text-sm font-medium mb-3">
                      {qIdx + 1}. {question.q}
                    </p>
                    <div className="grid gap-2">
                      {question.options.map((option, oIdx) => {
                        const isSelected = selectedAnswers[qIdx] === oIdx;
                        const isCorrect = option === question.a;
                        const revealed = showAnswers[qIdx];

                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleSelectAnswer(qIdx, oIdx)}
                            disabled={revealed}
                            className={`w-full text-left text-sm p-3 rounded-lg border transition-all ${
                              revealed && isCorrect
                                ? "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400"
                                : revealed && isSelected && !isCorrect
                                ? "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400"
                                : isSelected
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50 hover:bg-accent/30"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span className="font-medium">
                                {String.fromCharCode(65 + oIdx)}.
                              </span>
                              {option}
                              {revealed && isCorrect && (
                                <CheckCircle2 className="h-4 w-4 ml-auto text-green-500" />
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {showAnswers[qIdx] && (
                      <div className="mt-3 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          Correct: {question.a}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Try another */}
          <Button variant="outline" onClick={clearImage} className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            Analyze Another Image
          </Button>
        </div>
      )}
    </div>
  );
}
