// FILE: app/(dashboard)/create/processing/[documentId]/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { ProcessingStatus } from "@/components/create/ProcessingStatus";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import type { DocumentStatus } from "@/types";

type StepStatus = "pending" | "active" | "completed" | "failed";

interface Step {
  label: string;
  status: StepStatus;
}

function getSteps(docStatus: DocumentStatus, hasSummary: boolean): Step[] {
  if (docStatus === "failed") {
    return [
      { label: "Extracting text...", status: "failed" },
      { label: "Generating summary", status: "pending" },
      { label: "Creating flashcards", status: "pending" },
      { label: "Building quiz", status: "pending" },
    ];
  }

  if (docStatus === "completed") {
    return [
      { label: "Text extracted", status: "completed" },
      { label: "Summary generated", status: "completed" },
      { label: "Flashcards created", status: "completed" },
      { label: "Quiz built", status: "completed" },
    ];
  }

  // Processing state
  if (!hasSummary) {
    return [
      { label: "Extracting text...", status: "completed" },
      { label: "Generating summary...", status: "active" },
      { label: "Creating flashcards...", status: "active" },
      { label: "Building quiz...", status: "active" },
    ];
  }

  return [
    { label: "Extracting text...", status: "active" },
    { label: "Generating summary", status: "pending" },
    { label: "Creating flashcards", status: "pending" },
    { label: "Building quiz", status: "pending" },
  ];
}

export default function ProcessingPage() {
  const router = useRouter();
  const params = useParams();
  const documentId = params.documentId as string;

  const [status, setStatus] = useState<DocumentStatus>("processing");
  const [hasSummary, setHasSummary] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const pollDocument = useCallback(async () => {
    try {
      const res = await fetch(`/api/documents/${documentId}`);
      if (!res.ok) return;

      const json = await res.json();
      const doc = json.data;

      setStatus(doc.status);
      setHasSummary(!!doc.summary);

      if (doc.status === "completed") {
        setTimeout(() => {
          router.push(`/document/${documentId}`);
        }, 1500);
      } else if (doc.status === "failed") {
        setErrorMessage(doc.error_message || "Processing failed");
      }
    } catch {
      // Silently retry on network error
    }
  }, [documentId, router]);

  useEffect(() => {
    pollDocument();
    const interval = setInterval(pollDocument, 2000);

    return () => clearInterval(interval);
  }, [pollDocument]);

  const steps = getSteps(status, hasSummary);

  return (
    <div className="max-w-lg mx-auto mt-12 animate-in-up">
      <Card>
        <CardContent className="p-8 text-center">
          {status !== "failed" ? (
            <>
              <div className="mb-6 flex justify-center">
                {status === "completed" ? (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                    <Sparkles className="h-8 w-8 text-green-500" />
                  </div>
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  </div>
                )}
              </div>

              <h2 className="text-xl font-bold mb-2">
                {status === "completed"
                  ? "Study material ready!"
                  : "Generating your study material..."}
              </h2>
              <p className="text-sm text-muted-foreground mb-8">
                {status === "completed"
                  ? "Redirecting you to your document..."
                  : "This usually takes 30-60 seconds. Please don't close this page."}
              </p>
            </>
          ) : (
            <>
              <div className="mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
              </div>

              <h2 className="text-xl font-bold mb-2">Processing failed</h2>
              <p className="text-sm text-destructive mb-4">{errorMessage}</p>
            </>
          )}

          <div className="text-left mb-8">
            <ProcessingStatus steps={steps} />
          </div>

          {status === "failed" && (
            <Button onClick={() => router.push("/create")} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
