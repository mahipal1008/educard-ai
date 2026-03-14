// FILE: app/(dashboard)/create/page.tsx
"use client";

export const runtime = "edge";

import { useSearchParams } from "next/navigation";
import { InputTabs } from "@/components/create/InputTabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Suspense } from "react";

function CreateContent() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") === "pdf" ? "pdf" : "youtube";

  return (
    <div className="max-w-2xl mx-auto animate-in-up">
      <div className="mb-8">
        <h1 className="text-2xl font-bold md:text-3xl">Create New Study Material</h1>
        <p className="text-muted-foreground mt-1">
          Paste a YouTube URL or upload a PDF to generate flashcards, quizzes, and summaries.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Choose your source</CardTitle>
          <CardDescription>
            Our AI will extract the content and generate study material automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InputTabs defaultTab={defaultTab} />
        </CardContent>
      </Card>
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense>
      <CreateContent />
    </Suspense>
  );
}
