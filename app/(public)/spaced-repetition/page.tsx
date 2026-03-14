// FILE: app/(public)/spaced-repetition/page.tsx
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Sparkles,
  Brain,
  Zap,
  ArrowRight,
  Check,
  Clock,
  TrendingUp,
  BarChart3,
  RefreshCw,
  Calendar,
  Target,
} from "lucide-react";

const intervals = [
  { day: "Day 1", label: "First review", desc: "Card shown right after creation", active: true },
  { day: "Day 3", label: "Short-term recall", desc: "AI checks if you still remember", active: true },
  { day: "Day 7", label: "One-week review", desc: "Strengthening memory pathways", active: true },
  { day: "Day 14", label: "Two-week review", desc: "Moving to long-term memory", active: false },
  { day: "Day 30", label: "Monthly review", desc: "Deep retention confirmed", active: false },
  { day: "Day 90", label: "Quarterly review", desc: "Permanent knowledge", active: false },
];

const benefits = [
  {
    icon: Clock,
    title: "Study less, remember more",
    description:
      "Spaced repetition is scientifically proven to reduce study time by up to 50% while doubling retention rates.",
  },
  {
    icon: Brain,
    title: "AI-optimized intervals",
    description:
      "Our SM-2 algorithm adapts review intervals based on your performance — cards you struggle with appear more often.",
  },
  {
    icon: Target,
    title: "Weak topic detection",
    description:
      "EduCard AI tracks which topics you get wrong and automatically generates focused study sessions to fill knowledge gaps.",
  },
  {
    icon: TrendingUp,
    title: "Progress tracking",
    description:
      "See your mastery level for every topic. Visual dashboards show what you know and what needs more work.",
  },
  {
    icon: RefreshCw,
    title: "Smart study sessions",
    description:
      "One-click smart study generates a session mixing 70% weak cards with 30% review cards for optimal learning.",
  },
  {
    icon: Calendar,
    title: "Daily review reminders",
    description:
      "Never miss a review. Your dashboard shows exactly how many cards are due today, keeping your streak alive.",
  },
];

export const metadata: Metadata = {
  title: "Spaced Repetition",
  description: "Master any subject with AI-powered spaced repetition. EduCard AI schedules reviews at optimal intervals for long-term retention.",
};

export default function SpacedRepetitionPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden hero-gradient py-24 md:py-32">
          <div className="absolute inset-0 grid-pattern" />
          <div className="mx-auto max-w-7xl px-4 md:px-6 relative">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full border bg-violet-500/5 px-5 py-2 text-sm font-medium text-violet-500 mb-8">
                <Brain className="h-4 w-4" />
                Spaced Repetition
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                The science of{" "}
                <span className="gradient-text">never forgetting</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground md:text-xl leading-relaxed">
                EduCard AI uses the proven SM-2 spaced repetition algorithm to
                show you the right card at the right time — maximizing retention
                with minimum effort.
              </p>
              <div className="mt-10 flex flex-wrap gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="h-12 px-8 text-base gap-2">
                    <Sparkles className="h-4 w-4" />
                    Start Learning
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 px-8 text-base gap-2"
                  >
                    How It Works
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Forgetting curve visualization */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-6 gap-1.5">
                <Zap className="h-3.5 w-3.5" />
                The Forgetting Curve
              </Badge>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Review at the perfect moment
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Without spaced repetition, you forget 80% within a week. With
                it, each review strengthens the memory and pushes the next
                review further out.
              </p>
            </div>

            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-border md:left-1/2" />
              <div className="space-y-8">
                {intervals.map((interval, i) => (
                  <div
                    key={interval.day}
                    className={`relative flex items-center gap-6 ${
                      i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Dot */}
                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10">
                      <div
                        className={`h-4 w-4 rounded-full border-2 ${
                          interval.active
                            ? "bg-primary border-primary shadow-lg shadow-primary/30"
                            : "bg-muted border-border"
                        }`}
                      />
                    </div>

                    {/* Card */}
                    <div
                      className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] rounded-xl border-2 bg-card p-5 transition-all hover-lift ${
                        interval.active ? "border-primary/20" : "border-border"
                      } ${i % 2 === 0 ? "md:mr-auto" : "md:ml-auto"}`}
                    >
                      <div className="flex items-center gap-3 mb-1">
                        <span
                          className={`text-sm font-bold ${
                            interval.active
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        >
                          {interval.day}
                        </span>
                        <span className="text-xs font-medium text-muted-foreground">
                          {interval.label}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {interval.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits grid */}
        <section className="py-20 md:py-28 bg-muted/30 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-6 gap-1.5">
                <Check className="h-3.5 w-3.5" />
                Why Spaced Repetition
              </Badge>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Built for long-term mastery
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="rounded-2xl border-2 bg-card p-7 transition-all duration-300 hover-lift"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-5">
                    <b.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {b.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-3xl px-4 md:px-6 text-center">
            <div className="rounded-2xl border-2 bg-card p-10 md:p-14">
              <BarChart3 className="h-10 w-10 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Start retaining what you study
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
                Join students who remember 90%+ of what they learn using AI-powered
                spaced repetition.
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
