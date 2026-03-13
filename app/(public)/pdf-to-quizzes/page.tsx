// FILE: app/(public)/pdf-to-quizzes/page.tsx
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  FileText,
  Sparkles,
  Brain,
  Zap,
  ArrowRight,
  Check,
  Upload,
  ListChecks,
  Trophy,
  BarChart3,
} from "lucide-react";

const steps = [
  {
    step: "1",
    icon: Upload,
    title: "Upload your PDF",
    description:
      "Drag and drop any PDF — textbooks, lecture notes, research papers, or study guides. We handle files up to 10MB.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    step: "2",
    icon: Brain,
    title: "AI builds your quiz",
    description:
      "Our AI reads every page, extracts key concepts, and generates multiple-choice questions with detailed explanations.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    step: "3",
    icon: Trophy,
    title: "Test your knowledge",
    description:
      "Take the quiz, see instant feedback with explanations, and track your progress over time with weak topic detection.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
];

const features = [
  "AI reads full PDF content — even scanned docs",
  "Multiple-choice questions with 4 options each",
  "Detailed explanations for every answer",
  "Difficulty-based question categorization",
  "Instant scoring with performance breakdown",
  "Weak topic tracking across sessions",
  "Generates flashcards alongside quizzes",
  "Works with textbooks, notes, and papers",
];

export default function PdfToQuizzesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden hero-gradient py-24 md:py-32">
          <div className="absolute inset-0 grid-pattern" />
          <div className="mx-auto max-w-7xl px-4 md:px-6 relative">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full border bg-blue-500/5 px-5 py-2 text-sm font-medium text-blue-500 mb-8">
                <FileText className="h-4 w-4" />
                PDF to Quizzes
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                Transform any PDF into{" "}
                <span className="gradient-text">interactive quizzes</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground md:text-xl leading-relaxed">
                Upload your study material. Get AI-generated quizzes with
                explanations. Know exactly what you need to review.
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
                From document to quiz in seconds
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

        {/* Features */}
        <section className="py-20 md:py-28 bg-muted/30 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <Badge variant="outline" className="mb-6 gap-1.5">
                  <ListChecks className="h-3.5 w-3.5" />
                  Features
                </Badge>
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-4">
                  Smart quizzes that actually help you learn
                </h2>
                <p className="text-muted-foreground text-lg">
                  Every question is generated from YOUR material — not generic
                  question banks. AI identifies the most important concepts and
                  tests your understanding.
                </p>
              </div>
              <div className="grid gap-3">
                {features.map((f) => (
                  <div
                    key={f}
                    className="flex items-center gap-3 rounded-xl border bg-card p-4"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                      <Check className="h-4 w-4 text-emerald-500" />
                    </div>
                    <span className="text-sm font-medium">{f}</span>
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
                Stop rereading. Start quizzing.
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
                Active recall is proven to boost retention by 50%. Let AI create
                the perfect quiz from your study material.
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
