// FILE: app/(public)/youtube-to-flashcards/page.tsx
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Youtube,
  Sparkles,
  FileText,
  Brain,
  Zap,
  ArrowRight,
  Check,
  Play,
  BookOpen,
  BarChart3,
} from "lucide-react";

const steps = [
  {
    step: "1",
    icon: Play,
    title: "Paste a YouTube URL",
    description:
      "Drop any educational YouTube video link — lectures, tutorials, or crash courses. We support videos up to 2 hours long.",
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    step: "2",
    icon: Brain,
    title: "AI extracts & analyzes",
    description:
      "Our AI transcribes the video, identifies key concepts, and structures the most important information for study.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    step: "3",
    icon: BookOpen,
    title: "Get flashcards instantly",
    description:
      "Receive a complete deck of flashcards, quiz questions, and a summary — ready to study in seconds.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
];

const benefits = [
  "Works with any educational YouTube video",
  "AI-generated front & back for every card",
  "Auto-generated quiz questions with explanations",
  "Markdown summary of key topics",
  "Spaced repetition scheduling built-in",
  "Export to CSV for Anki or other tools",
  "Supports 20+ languages via translation",
  "No manual note-taking needed",
];

export default function YouTubeToFlashcardsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden hero-gradient py-24 md:py-32">
          <div className="absolute inset-0 grid-pattern" />
          <div className="mx-auto max-w-7xl px-4 md:px-6 relative">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full border bg-red-500/5 px-5 py-2 text-sm font-medium text-red-500 mb-8">
                <Youtube className="h-4 w-4" />
                YouTube to Flashcards
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                Turn any YouTube video into{" "}
                <span className="gradient-text">study-ready flashcards</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground md:text-xl leading-relaxed">
                Paste a link. Get flashcards, quizzes, and summaries in seconds.
                Stop rewinding lectures — let AI do the note-taking.
              </p>
              <div className="mt-10 flex flex-wrap gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="h-12 px-8 text-base gap-2">
                    <Sparkles className="h-4 w-4" />
                    Try It Free
                  </Button>
                </Link>
                <Link href="/#how-it-works">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 px-8 text-base gap-2"
                  >
                    See How It Works
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-6 gap-1.5">
                <Zap className="h-3.5 w-3.5" />
                How It Works
              </Badge>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Three steps to smarter studying
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {steps.map((s) => (
                <div
                  key={s.step}
                  className="relative rounded-2xl border-2 bg-card p-8 transition-all duration-300 hover-lift"
                >
                  <div className="flex items-center gap-4 mb-5">
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${s.bg}`}
                    >
                      <s.icon className={`h-7 w-7 ${s.color}`} />
                    </div>
                    <span className="text-sm font-bold text-muted-foreground">
                      STEP {s.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {s.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 md:py-28 bg-muted/30 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <Badge variant="outline" className="mb-6 gap-1.5">
                  <FileText className="h-3.5 w-3.5" />
                  Why Students Love It
                </Badge>
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-4">
                  Everything you need from a single video
                </h2>
                <p className="text-muted-foreground text-lg">
                  Our AI watches the video so you can focus on learning. Every
                  key concept becomes a flashcard you can study anywhere.
                </p>
              </div>
              <div className="grid gap-3">
                {benefits.map((b) => (
                  <div
                    key={b}
                    className="flex items-center gap-3 rounded-xl border bg-card p-4"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                      <Check className="h-4 w-4 text-emerald-500" />
                    </div>
                    <span className="text-sm font-medium">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-3xl px-4 md:px-6 text-center">
            <div className="rounded-2xl border-2 bg-card p-10 md:p-14">
              <BarChart3 className="h-10 w-10 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Ready to study smarter?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
                Join thousands of students who save hours every week by turning
                YouTube lectures into flashcards.
              </p>
              <Link href="/signup">
                <Button size="lg" className="h-12 px-10 text-base gap-2">
                  <Sparkles className="h-4 w-4" />
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
