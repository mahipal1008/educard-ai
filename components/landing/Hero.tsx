// FILE: components/landing/Hero.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Play,
  Sparkles,
  Youtube,
  FileText,
  Brain,
  Star,
  CheckCircle2,
  Zap,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden hero-gradient">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 grid-pattern" />

      {/* Floating decorative orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/4 h-[600px] w-[600px] bg-primary/8 rounded-full blur-[100px] animate-pulse-soft" />
        <div className="absolute -bottom-32 right-1/4 h-[500px] w-[500px] bg-purple-500/6 rounded-full blur-[100px] animate-pulse-soft" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/3 right-0 h-[300px] w-[300px] bg-blue-500/5 rounded-full blur-[80px] animate-float" />
      </div>

      <div className="mx-auto max-w-7xl px-4 md:px-6 py-24 md:py-36 lg:py-44 relative">
        <div className="flex flex-col items-center text-center">
          {/* Announcement badge */}
          <div className="mb-8 animate-in-down">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 backdrop-blur-md px-5 py-2 text-sm font-medium shadow-lg shadow-primary/5 hover-lift cursor-default">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-muted-foreground">New:</span>
              <span className="font-semibold">AI-Powered Study Revolution</span>
              <ArrowRight className="h-3.5 w-3.5 text-primary" />
            </div>
          </div>

          {/* Main headline */}
          <h1 className="max-w-5xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl animate-in-up leading-[1.1]">
            Transform Any{" "}
            <span className="gradient-text-animated">Content</span>
            <br className="hidden sm:block" />
            {" "}Into Smart{" "}
            <span className="gradient-text-animated">Study Cards</span>
          </h1>

          {/* Subheading */}
          <p className="mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl lg:text-2xl animate-in-up stagger-2 leading-relaxed">
            Paste a YouTube link or upload a PDF — get AI-generated flashcards,
            quizzes, and summaries in{" "}
            <span className="font-semibold text-foreground">seconds</span>.
          </p>

          {/* Inline features list */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 md:gap-6 animate-in-up stagger-3">
            {[
              { icon: Zap, text: "Instant Generation" },
              { icon: Brain, text: "Spaced Repetition" },
              { icon: Star, text: "AI-Powered" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-sm text-muted-foreground">
                <item.icon className="h-4 w-4 text-primary" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row animate-in-up stagger-4">
            <Link href="/signup">
              <Button size="lg" className="gap-2 text-base px-8 h-12 glow-primary text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
                Get Started Free <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline" className="gap-2 text-base px-8 h-12 text-lg border-2 hover:bg-accent/50 transition-all">
                <Play className="h-5 w-5" /> See How It Works
              </Button>
            </Link>
          </div>

          {/* No credit card required */}
          <p className="mt-4 text-xs text-muted-foreground animate-in-up stagger-5 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
            Free forever — No credit card required
          </p>

          {/* Social proof bar */}
          <div className="mt-14 flex flex-col sm:flex-row items-center gap-6 animate-in-up stagger-5">
            {/* Avatars */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {["bg-blue-500", "bg-emerald-500", "bg-purple-500", "bg-orange-500", "bg-pink-500"].map((color, i) => (
                  <div
                    key={i}
                    className={`h-9 w-9 rounded-full border-2 border-background ${color} flex items-center justify-center text-white text-xs font-bold ring-2 ring-background`}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold">2,000+ students</p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">4.9/5</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block h-10 w-px bg-border" />

            {/* Stats */}
            <div className="flex items-center gap-6 text-center">
              <div>
                <div className="text-lg font-bold">50K+</div>
                <div className="text-xs text-muted-foreground">Cards Created</div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <div className="text-lg font-bold">10K+</div>
                <div className="text-xs text-muted-foreground">Quizzes Taken</div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div>
                <div className="text-lg font-bold">98%</div>
                <div className="text-xs text-muted-foreground">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Hero preview card */}
          <div className="mt-20 w-full max-w-5xl animate-in-up stagger-6">
            <div className="rounded-2xl border bg-card shadow-2xl shadow-primary/8 overflow-hidden gradient-border hover-lift">
              {/* Window chrome */}
              <div className="bg-muted/50 px-4 py-3 border-b flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-background/80 rounded-md px-4 py-1 text-xs text-muted-foreground font-mono border">
                    educard.ai/dashboard
                  </div>
                </div>
              </div>

              {/* Dashboard preview content */}
              <div className="p-6 md:p-8">
                {/* Stats row */}
                <div className="grid gap-4 md:grid-cols-3 mb-6">
                  {[
                    { icon: FileText, value: "24", label: "Flashcards Created", color: "primary", bg: "bg-primary/5 border-primary/10" },
                    { icon: Brain, value: "85%", label: "Avg Quiz Score", color: "emerald-500", bg: "bg-emerald-500/5 border-emerald-500/10" },
                    { icon: Sparkles, value: "7", label: "Day Streak", color: "orange-500", bg: "bg-orange-500/5 border-orange-500/10" },
                  ].map((stat) => (
                    <div key={stat.label} className={`rounded-xl ${stat.bg} border p-4 flex items-center gap-3`}>
                      <div className={`h-10 w-10 rounded-lg bg-${stat.color}/10 flex items-center justify-center`}>
                        <stat.icon className={`h-5 w-5 text-${stat.color}`} />
                      </div>
                      <div>
                        <div className={`text-2xl font-bold text-${stat.color}`}>{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent items preview */}
                <div className="space-y-2">
                  {[
                    { title: "Machine Learning Fundamentals", type: "youtube" as const, cards: 32 },
                    { title: "Data Structures & Algorithms.pdf", type: "pdf" as const, cards: 28 },
                    { title: "Introduction to Psychology", type: "youtube" as const, cards: 24 },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg border p-3 bg-background/50 hover:bg-accent/30 transition-colors">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                        item.type === "youtube" ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"
                      }`}>
                        {item.type === "youtube" ? <Youtube className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.title}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs shrink-0">{item.cards} cards</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
