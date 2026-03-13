// FILE: app/(dashboard)/exam-predictor/page.tsx
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  FileUp,
  X,
  Sparkles,
  Loader2,
  AlertCircle,
  BarChart3,
  Target,
  BookOpen,
  TrendingUp,
  CheckCircle2,
  Brain,
} from "lucide-react";

interface TopicFrequency {
  name: string;
  frequency: number;
  percentage: number;
}

interface PredictedQuestion {
  q: string;
  a: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
}

interface PracticeQuestion {
  q: string;
  a: string;
  options: string[];
  topic: string;
}

interface ExamResult {
  topics: TopicFrequency[];
  predictions: PredictedQuestion[];
  practiceSet: PracticeQuestion[];
}

const MAX_PDF_SIZE_MB = 10;

const difficultyColors: Record<string, string> = {
  easy: "bg-green-500/10 text-green-600 border-green-500/20",
  medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  hard: "bg-red-500/10 text-red-600 border-red-500/20",
};

export default function ExamPredictorPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [subject, setSubject] = useState("");
  const [examName, setExamName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [practiceMode, setPracticeMode] = useState(false);
  const [practiceAnswers, setPracticeAnswers] = useState<Record<number, number>>({});
  const [practiceRevealed, setPracticeRevealed] = useState<Record<number, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileAdd = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const valid: File[] = [];
    Array.from(newFiles).forEach((f) => {
      if (f.type !== "application/pdf") {
        toast.error(`"${f.name}" is not a PDF file.`);
        return;
      }
      if (f.size > MAX_PDF_SIZE_MB * 1024 * 1024) {
        toast.error(`"${f.name}" exceeds ${MAX_PDF_SIZE_MB}MB limit.`);
        return;
      }
      valid.push(f);
    });
    setFiles((prev) => [...prev, ...valid].slice(0, 5));
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const extractPdfText = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    // Simple text extraction from PDF bytes - look for text between parentheses in PDF streams
    let text = "";
    const decoder = new TextDecoder("utf-8", { fatal: false });
    const raw = decoder.decode(uint8Array);
    // Extract readable text segments
    const textMatches = raw.match(/\(([^)]{2,})\)/g);
    if (textMatches) {
      text = textMatches
        .map((m) => m.slice(1, -1))
        .filter((t) => t.length > 2 && /[a-zA-Z]/.test(t))
        .join(" ");
    }
    // Fallback: extract between stream/endstream
    if (text.length < 100) {
      const streamMatches = raw.match(/stream\s*([\s\S]*?)endstream/g);
      if (streamMatches) {
        text = streamMatches
          .map((m) => m.replace(/stream|endstream/g, "").trim())
          .filter((t) => /[a-zA-Z]{3,}/.test(t))
          .join(" ")
          .replace(/[^\x20-\x7E\n]/g, " ")
          .replace(/\s+/g, " ")
          .trim();
      }
    }
    return text || `[Contents of ${file.name}]`;
  };

  const handleAnalyze = async () => {
    if (files.length === 0 || !subject.trim() || !examName.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const pdfTexts = await Promise.all(files.map(extractPdfText));

      const res = await fetch("/api/exam-predictor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfTexts, subject, examName }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Analysis failed");
      setResult(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handlePracticeAnswer = (qIdx: number, optIdx: number) => {
    if (practiceRevealed[qIdx]) return;
    setPracticeAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
    setPracticeRevealed((prev) => ({ ...prev, [qIdx]: true }));
  };

  return (
    <div className="space-y-6 animate-in-up">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl flex items-center gap-3">
          <Brain className="h-7 w-7 text-primary" />
          AI Exam Predictor
        </h1>
        <p className="text-muted-foreground mt-1">
          Upload past papers and let AI predict what&apos;s coming next.
        </p>
      </div>

      {!result ? (
        <Card>
          <CardHeader>
            <CardTitle>Upload Past Papers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Subject & Exam inputs */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="e.g., Physics, Biology, CS"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="examName">Exam Name</Label>
                <Input
                  id="examName"
                  placeholder="e.g., Final Exam 2025, JEE Mains"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                />
              </div>
            </div>

            {/* File upload */}
            <div>
              <Label>Past Papers (PDF, up to 5)</Label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-accent/30 transition-all"
              >
                <FileUp className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-sm font-medium">Drop PDFs here or click to upload</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Up to {MAX_PDF_SIZE_MB}MB per file
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileAdd(e.target.files)}
                />
              </div>
            </div>

            {/* File list */}
            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-lg border p-3 text-sm"
                  >
                    <FileUp className="h-4 w-4 text-blue-500 shrink-0" />
                    <span className="flex-1 truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(1)}MB
                    </span>
                    <button onClick={() => removeFile(i)}>
                      <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                ))}
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
                  Analyzing {files.length} paper{files.length > 1 ? "s" : ""}... This may take a minute.
                </div>
                <Skeleton className="h-32 rounded-xl" />
              </div>
            )}

            {/* Analyze button */}
            <Button
              onClick={handleAnalyze}
              disabled={files.length === 0 || !subject.trim() || !examName.trim() || loading}
              className="w-full h-11 gap-2"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Analyze Papers & Predict Questions
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Topic Frequency */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Topic Frequency Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.topics.map((topic, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{topic.name}</span>
                    <span className="text-muted-foreground text-xs">
                      {topic.frequency}x ({topic.percentage}%)
                    </span>
                  </div>
                  <Progress value={topic.percentage} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Predicted Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Predicted Questions ({result.predictions.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.predictions.map((pred, i) => (
                <div key={i} className="rounded-lg border p-4 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium">{i + 1}. {pred.q}</p>
                    <Badge variant="outline" className={`shrink-0 text-xs ${difficultyColors[pred.difficulty]}`}>
                      {pred.difficulty}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{pred.a}</p>
                  <Badge variant="secondary" className="text-xs">{pred.topic}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Practice Mode */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Practice Questions ({result.practiceSet.length})
                </CardTitle>
                {!practiceMode && (
                  <Button size="sm" onClick={() => setPracticeMode(true)} className="gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Start Practice
                  </Button>
                )}
              </div>
            </CardHeader>
            {practiceMode && (
              <CardContent className="space-y-4">
                {result.practiceSet.map((q, qIdx) => (
                  <div key={qIdx} className="rounded-lg border p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium">{qIdx + 1}. {q.q}</p>
                      <Badge variant="secondary" className="text-xs shrink-0">{q.topic}</Badge>
                    </div>
                    <div className="grid gap-2">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = practiceAnswers[qIdx] === oIdx;
                        const correctIdx = parseInt(q.a, 10);
                        const isCorrect = oIdx === correctIdx;
                        const revealed = practiceRevealed[qIdx];

                        return (
                          <button
                            key={oIdx}
                            onClick={() => handlePracticeAnswer(qIdx, oIdx)}
                            disabled={revealed}
                            className={`w-full text-left text-sm p-3 rounded-lg border transition-all ${
                              revealed && isCorrect
                                ? "border-green-500 bg-green-500/10"
                                : revealed && isSelected && !isCorrect
                                ? "border-red-500 bg-red-500/10"
                                : isSelected
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50 hover:bg-accent/30"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span className="font-medium">{String.fromCharCode(65 + oIdx)}.</span>
                              {opt}
                              {revealed && isCorrect && (
                                <CheckCircle2 className="h-4 w-4 ml-auto text-green-500" />
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Score summary */}
                {Object.keys(practiceRevealed).length === result.practiceSet.length && (
                  <div className="rounded-xl bg-primary/5 border border-primary/10 p-6 text-center">
                    <p className="text-2xl font-bold">
                      {Object.entries(practiceAnswers).filter(
                        ([qIdx, oIdx]) =>
                          oIdx === parseInt(result.practiceSet[parseInt(qIdx)].a, 10)
                      ).length}{" "}
                      / {result.practiceSet.length}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Questions Correct</p>
                  </div>
                )}
              </CardContent>
            )}
          </Card>

          {/* Start over */}
          <Button
            variant="outline"
            onClick={() => {
              setResult(null);
              setFiles([]);
              setPracticeMode(false);
              setPracticeAnswers({});
              setPracticeRevealed({});
            }}
            className="w-full"
          >
            Analyze New Papers
          </Button>
        </div>
      )}
    </div>
  );
}
