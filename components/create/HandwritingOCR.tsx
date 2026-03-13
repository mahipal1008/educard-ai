// FILE: components/create/HandwritingOCR.tsx
"use client";

/* eslint-disable @next/next/no-img-element */

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PenTool,
  Camera,
  Upload,
  X,
  Sparkles,
  Loader2,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";

interface OCRResult {
  extractedText: string;
  topics: string[];
}

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE_MB = 10;

export function HandwritingOCR() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<OCRResult | null>(null);
  const [editedText, setEditedText] = useState("");
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((selectedFile: File) => {
    setError(null);
    setResult(null);

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

  const handleExtract = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const dataUrl = reader.result as string;
          resolve(dataUrl.split(",")[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch("/api/ocr-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64, mimeType: file.type }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to extract notes");
      setResult(json.data);
      setEditedText(json.data.extractedText);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(editedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearImage = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setEditedText("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      {!preview ? (
        <div className="space-y-4">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer hover:border-primary/50 hover:bg-accent/30 transition-all"
          >
            <PenTool className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-base font-medium mb-1">
              Upload a photo of your handwritten notes
            </p>
            <p className="text-sm text-muted-foreground">
              PNG, JPG, WEBP — up to {MAX_SIZE_MB}MB
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

          {/* Camera button for mobile */}
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => cameraInputRef.current?.click()}
          >
            <Camera className="h-4 w-4" />
            Take Photo with Camera
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileSelect(f);
              }}
            />
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Preview */}
          <div className="relative rounded-xl border overflow-hidden bg-muted/30">
            <img
              src={preview}
              alt="Handwritten notes"
              className="max-h-64 w-full object-contain"
            />
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center border hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Extract button */}
          {!result && !loading && (
            <Button onClick={handleExtract} className="w-full h-11 gap-2" size="lg">
              <Sparkles className="h-4 w-4" />
              Extract Text with AI
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
            Extracting handwritten text...
          </div>
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-in-up">
          {/* Topics */}
          {result.topics.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {result.topics.map((topic) => (
                <Badge key={topic} variant="secondary" className="text-xs">
                  {topic}
                </Badge>
              ))}
            </div>
          )}

          {/* Editable text area */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Extracted Notes
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-xs"
                  onClick={handleCopy}
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="w-full min-h-[200px] bg-muted/30 border rounded-lg p-3 text-sm leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </CardContent>
          </Card>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={clearImage} className="flex-1 gap-2">
              <Upload className="h-4 w-4" />
              Upload Another
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
