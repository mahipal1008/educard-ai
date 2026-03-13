// FILE: app/(public)/how-it-works/page.tsx
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Sparkles,
  Upload,
  Brain,
  BookOpen,
  BarChart3,
  ArrowRight,
  Zap,
  Youtube,
  FileText,
  Image as ImageIcon,
  PenLine,
  Mic,
  Globe,
  Target,
  TrendingUp,
} from "lucide-react";

const mainSteps = [
  {
    number: "01",
    title: "Upload your material",
    description:
      "Paste a YouTube URL, upload a PDF, snap a photo of handwritten notes, or upload an image. EduCard AI supports multiple input formats so you can study from any source.",
    icon: Upload,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    inputs: [
      { icon: Youtube, label: "YouTube Videos" },
      { icon: FileText, label: "PDF Documents" },
      { icon: ImageIcon, label: "Images & Diagrams" },
      { icon: PenLine, label: "Handwritten Notes" },
    ],
  },
  {
    number: "02",
    title: "AI processes & generates",
    description:
      "Our AI powered by Google Gemini analyzes your content — transcribing videos, extracting text from PDFs, recognizing handwriting — then generates flashcards, quizzes, and summaries tailored to the material.",
    icon: Brain,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    outputs: ["Flashcard Decks", "Quiz Questions", "Markdown Summaries", "Key Topics"],
  },
  {
    number: "03",
    title: "Study & review",
    description:
      "Study with interactive flashcards using spaced repetition. Take quizzes to test recall. Use the Voice Doubt Solver to ask questions by speaking. Translate cards into 20+ languages.",
    icon: BookOpen,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    tools: [
      { icon: Mic, label: "Voice Doubt Solver" },
      { icon: Globe, label: "20+ Languages" },
      { icon: Target, label: "Exam Predictor" },
      { icon: TrendingUp, label: "Weak Topic Tracker" },
    ],
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden hero-gradient py-24 md:py-32">
          <div className="absolute inset-0 grid-pattern" />
          <div className="mx-auto max-w-7xl px-4 md:px-6 relative">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full border bg-primary/5 px-5 py-2 text-sm font-medium text-primary mb-8">
                <Zap className="h-4 w-4" />
                How It Works
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                From content to{" "}
                <span className="gradient-text">study session</span> in 3 steps
              </h1>
              <p className="mt-6 text-lg text-muted-foreground md:text-xl leading-relaxed">
                EduCard AI transforms any learning material into personalized
                flashcards, quizzes, and summaries — powered by AI.
              </p>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-4 md:px-6 space-y-20">
            {mainSteps.map((step, idx) => (
              <div
                key={step.number}
                className={`grid gap-10 lg:grid-cols-2 items-center ${
                  idx % 2 === 1 ? "lg:direction-rtl" : ""
                }`}
              >
                {/* Text side */}
                <div className={idx % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="flex items-center gap-4 mb-5">
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${step.bg}`}
                    >
                      <step.icon className={`h-7 w-7 ${step.color}`} />
                    </div>
                    <span className="text-sm font-bold text-muted-foreground tracking-wider">
                      STEP {step.number}
                    </span>
                  </div>
                  <h2 className="text-3xl font-extrabold tracking-tight mb-4">
                    {step.title}
                  </h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Visual side */}
                <div className={idx % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="rounded-2xl border-2 bg-card p-6 space-y-3">
                    {step.inputs &&
                      step.inputs.map((input) => (
                        <div
                          key={input.label}
                          className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4"
                        >
                          <input.icon className="h-5 w-5 text-primary shrink-0" />
                          <span className="text-sm font-medium">
                            {input.label}
                          </span>
                        </div>
                      ))}
                    {step.outputs &&
                      step.outputs.map((output) => (
                        <div
                          key={output}
                          className="flex items-center gap-3 rounded-xl border bg-violet-500/5 p-4"
                        >
                          <Sparkles className="h-5 w-5 text-violet-500 shrink-0" />
                          <span className="text-sm font-medium">{output}</span>
                        </div>
                      ))}
                    {step.tools &&
                      step.tools.map((tool) => (
                        <div
                          key={tool.label}
                          className="flex items-center gap-3 rounded-xl border bg-emerald-500/5 p-4"
                        >
                          <tool.icon className="h-5 w-5 text-emerald-500 shrink-0" />
                          <span className="text-sm font-medium">
                            {tool.label}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 bg-muted/30 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="mx-auto max-w-3xl px-4 md:px-6 text-center">
            <div className="rounded-2xl border-2 bg-card p-10 md:p-14">
              <BarChart3 className="h-10 w-10 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Ready to transform how you study?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
                It takes 30 seconds to create your first AI-generated study
                deck. No credit card required.
              </p>
              <Link href="/signup">
                <Button size="lg" className="h-12 px-10 text-base gap-2">
                  <Sparkles className="h-4 w-4" />
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
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
