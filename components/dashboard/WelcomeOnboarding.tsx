// FILE: components/dashboard/WelcomeOnboarding.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Youtube, FileUp, ArrowRight, Sparkles, BookOpen, Brain } from "lucide-react";

interface WelcomeOnboardingProps {
  userName: string;
}

export function WelcomeOnboarding({ userName }: WelcomeOnboardingProps) {
  const firstName = userName ? userName.split(" ")[0] : "there";

  return (
    <div className="space-y-8 animate-in-up">
      {/* Welcome header */}
      <div className="text-center max-w-2xl mx-auto py-4">
        <div className="flex items-center justify-center mb-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-float">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold md:text-4xl mb-3">
          Welcome to EduCard AI, {firstName}!
        </h1>
        <p className="text-lg text-muted-foreground">
          Turn any learning material into interactive study tools. Here&apos;s how to get started:
        </p>
      </div>

      {/* Steps */}
      <div className="grid gap-4 md:grid-cols-3 max-w-4xl mx-auto">
        <Card className="relative overflow-hidden border-2 hover:border-primary/30 transition-all group animate-in-up stagger-1">
          <CardContent className="p-6">
            <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
              1
            </div>
            <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
              <Youtube className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="font-semibold mb-2">Add Content</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Paste a YouTube video URL or upload a PDF document
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-2 hover:border-primary/30 transition-all group animate-in-up stagger-2">
          <CardContent className="p-6">
            <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
              2
            </div>
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
              <Brain className="h-6 w-6 text-purple-500" />
            </div>
            <h3 className="font-semibold mb-2">AI Generates</h3>
            <p className="text-sm text-muted-foreground mb-4">
              AI creates flashcards, quizzes, and a summary in seconds
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-2 hover:border-primary/30 transition-all group animate-in-up stagger-3">
          <CardContent className="p-6">
            <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
              3
            </div>
            <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="font-semibold mb-2">Study & Master</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Use spaced repetition flashcards and quizzes to retain knowledge
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in-up stagger-4">
        <Link href="/create?tab=youtube">
          <Button size="lg" className="gap-2 glow-primary">
            <Youtube className="h-5 w-5" />
            Start with YouTube
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link href="/create?tab=pdf">
          <Button size="lg" variant="outline" className="gap-2">
            <FileUp className="h-5 w-5" />
            Upload a PDF
          </Button>
        </Link>
      </div>
    </div>
  );
}
