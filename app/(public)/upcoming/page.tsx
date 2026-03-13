// FILE: app/(public)/upcoming/page.tsx
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Video,
  BrainCircuit,
  Rocket,
  Sparkles,
  Bell,
  ArrowRight,
  Clock,
  Target,
  Users,
  CalendarDays,
  Wifi,
  PenTool,
} from "lucide-react";
import Link from "next/link";

const upcomingFeatures = [
  {
    icon: Video,
    title: "Video Upload & Processing",
    description:
      "Upload your own video files directly — lecture recordings, screen captures, or any educational content. Our AI will transcribe, analyze, and generate study materials automatically.",
    status: "In Development",
    quarter: "Q2 2026",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    gradient: "from-blue-500/10 to-transparent",
    highlights: [
      "Support for MP4, MOV, WebM formats",
      "AI transcription with speaker detection",
      "Timestamp-linked flashcards and notes",
    ],
  },
  {
    icon: Users,
    title: "Collaborative Study Rooms",
    description:
      "Study together in real-time with classmates. Create shared rooms, compete on quizzes, share flashcard decks, and track group progress. Built for study groups and classroom use.",
    status: "In Development",
    quarter: "Q2 2026",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20",
    gradient: "from-indigo-500/10 to-transparent",
    highlights: [
      "Real-time multiplayer quiz battles",
      "Shared deck creation and editing",
      "Group leaderboards and progress tracking",
    ],
  },
  {
    icon: CalendarDays,
    title: "AI Study Planner",
    description:
      "Let AI create a personalized study schedule based on your exam dates, weak topics, and available time. Automatic reminders and adaptive rescheduling when you fall behind.",
    status: "In Development",
    quarter: "Q3 2026",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    gradient: "from-emerald-500/10 to-transparent",
    highlights: [
      "Set exam dates and study goals",
      "AI allocates daily study sessions automatically",
      "Adapts schedule based on your quiz performance",
    ],
  },
  {
    icon: PenTool,
    title: "AI Essay Grader & Writing Coach",
    description:
      "Submit essays and written answers for AI-powered grading and feedback. Get detailed rubric scores, improvement suggestions, grammar corrections, and structure analysis.",
    status: "Research Phase",
    quarter: "Q3 2026",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    borderColor: "border-rose-500/20",
    gradient: "from-rose-500/10 to-transparent",
    highlights: [
      "Rubric-based grading with detailed feedback",
      "Grammar, structure, and argument analysis",
      "Improvement suggestions with examples",
    ],
  },
  {
    icon: BrainCircuit,
    title: "Custom Model Training",
    description:
      "Train a personalized AI model on your specific subject area. Upload your study materials and the AI adapts to your curriculum, terminology, and learning style for hyper-relevant content generation.",
    status: "Research Phase",
    quarter: "Q4 2026",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    gradient: "from-purple-500/10 to-transparent",
    highlights: [
      "Upload course-specific training data",
      "AI learns your subject terminology",
      "Personalized content quality improves over time",
    ],
  },
  {
    icon: Wifi,
    title: "Offline Mode with Sync",
    description:
      "Study anywhere without internet. Download your decks, quizzes, and summaries for offline use. Changes sync automatically when you reconnect — perfect for commutes and travel.",
    status: "Research Phase",
    quarter: "Q4 2026",
    color: "text-slate-500",
    bg: "bg-slate-500/10",
    borderColor: "border-slate-500/20",
    gradient: "from-slate-500/10 to-transparent",
    highlights: [
      "Download decks and quizzes for offline use",
      "Continue studying with no internet",
      "Auto-sync progress when back online",
    ],
  },
];

const statusColors: Record<string, string> = {
  "In Development": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "Research Phase": "bg-purple-500/10 text-purple-500 border-purple-500/20",
};

export default function UpcomingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden hero-gradient py-24 md:py-32">
          <div className="absolute inset-0 grid-pattern" />
          <div className="mx-auto max-w-7xl px-4 md:px-6 relative">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full border bg-primary/5 px-5 py-2 text-sm font-medium text-primary mb-8">
                <Rocket className="h-4 w-4" />
                Roadmap
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Coming Soon to{" "}
                <span className="gradient-text-animated">EduCard AI</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto leading-relaxed">
                We&apos;re building the most powerful AI study platform. Here&apos;s what&apos;s launching next.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {Object.entries(statusColors).map(([status, classes]) => (
                  <Badge key={status} variant="outline" className={classes}>
                    {status}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <div className="space-y-8">
              {upcomingFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className={`group relative overflow-hidden rounded-2xl border-2 ${feature.borderColor} bg-card p-8 transition-all duration-300 hover-lift`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                  <div className="relative">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${feature.bg}`}>
                          <feature.icon className={`h-7 w-7 ${feature.color}`} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{feature.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className={statusColors[feature.status]}>
                              {feature.status}
                            </Badge>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              Expected: {feature.quarter}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {feature.description}
                    </p>

                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">What to expect</p>
                      <ul className="space-y-1.5">
                        {feature.highlights.map((h, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Sparkles className={`h-3.5 w-3.5 ${feature.color} shrink-0`} />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 bg-muted/30 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="mx-auto max-w-3xl px-4 md:px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Bell className="h-4 w-4" />
              Stay Updated
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-6">
              Don&apos;t miss out on new features
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              Sign up now and be the first to try new features as they launch. Early adopters get exclusive access.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="gap-2 text-base px-8 h-12 glow-primary shadow-lg shadow-primary/20">
                  <Sparkles className="h-5 w-5" />
                  Sign Up for Free
                </Button>
              </Link>
              <Link href="/features">
                <Button size="lg" variant="outline" className="gap-2 text-base px-8 h-12 border-2">
                  <ArrowRight className="h-5 w-5" />
                  See Current Features
                </Button>
              </Link>
            </div>
            <p className="mt-8 text-sm text-muted-foreground">
              <Target className="h-4 w-4 inline mr-1.5 -mt-0.5" />
              Have a feature request? We&apos;d love to hear from you.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
