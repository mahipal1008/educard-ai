// FILE: app/(public)/features/page.tsx
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Youtube,
  FileText,
  Brain,
  Globe,
  Mic,
  PenLine,
  Target,
  Zap,
  Sparkles,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Wand2,
  Layers,
  SlidersHorizontal,
  Image as ImageIcon,
  Network,
} from "lucide-react";
import Link from "next/link";

const currentFeatures = [
  {
    icon: Youtube,
    title: "YouTube to Flashcards",
    description: "Paste any YouTube URL and get AI-generated flashcards, quizzes, and summaries in seconds. Perfect for lecture videos.",
    color: "text-red-500",
    bg: "bg-red-500/10",
    borderColor: "border-red-500/20",
    category: "Core",
  },
  {
    icon: FileText,
    title: "PDF to Study Materials",
    description: "Upload PDFs — textbooks, research papers, or notes — and transform them into interactive flashcards, quizzes, and structured summaries.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    category: "Core",
  },
  {
    icon: BookOpen,
    title: "AI Flashcard Generator",
    description: "Automatically create high-quality flashcards with questions on the front and detailed answers on the back. Supports spaced repetition study.",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    borderColor: "border-violet-500/20",
    category: "Core",
  },
  {
    icon: Brain,
    title: "AI Quiz Generator",
    description: "Generate multiple-choice quizzes with explanations. Track your score and identify weak areas with instant feedback.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    category: "Core",
  },
  {
    icon: Wand2,
    title: "Smart Summarization Modes",
    description: "Choose from 5 summary styles: Default, Bullet Points, Cornell Notes, Outline, or Mind Map. Regenerate summaries in any format anytime.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    category: "New",
  },
  {
    icon: Globe,
    title: "Multilingual Translation",
    description: "Translate your flashcard decks into Hindi, Spanish, French, and more. Study in any language with AI-powered translation.",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
    category: "AI Feature",
  },
  {
    icon: Mic,
    title: "Voice Doubt Solver",
    description: "Ask questions by voice or text and get instant AI explanations with text-to-speech. Like having a tutor available 24/7.",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    borderColor: "border-rose-500/20",
    category: "AI Feature",
  },
  {
    icon: ImageIcon,
    title: "Image Q&A",
    description: "Upload any image — diagrams, charts, equations — and the AI will analyze it, explain the concepts, and generate quiz questions.",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    category: "AI Feature",
  },
  {
    icon: PenLine,
    title: "Handwriting OCR",
    description: "Snap a photo of handwritten notes and the AI extracts, cleans, and organizes the text. Turn messy notes into study materials.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    category: "AI Feature",
  },
  {
    icon: Network,
    title: "AI Diagram Generator",
    description: "Generate flowcharts, mind maps, sequence diagrams, class diagrams, and timelines from any topic using AI. Export as SVG or copy Mermaid code.",
    color: "text-teal-500",
    bg: "bg-teal-500/10",
    borderColor: "border-teal-500/20",
    category: "New",
  },
  {
    icon: Target,
    title: "Exam Predictor",
    description: "Upload past exam papers and the AI predicts likely questions, topic frequency, and difficulty levels for upcoming exams.",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    borderColor: "border-pink-500/20",
    category: "AI Feature",
  },
  {
    icon: Zap,
    title: "Weak Topic Tracker",
    description: "AI analyzes your quiz performance to identify weak areas. Smart Study mode prioritizes topics where you need the most practice.",
    color: "text-red-500",
    bg: "bg-red-500/10",
    borderColor: "border-red-500/20",
    category: "AI Feature",
  },
  {
    icon: Layers,
    title: "Multi-Source Deck Merging",
    description: "Combine flashcards from multiple documents into a single unified deck. Duplicates are automatically detected and removed.",
    color: "text-cyan-600",
    bg: "bg-cyan-600/10",
    borderColor: "border-cyan-600/20",
    category: "New",
  },
  {
    icon: SlidersHorizontal,
    title: "AI Model Adjustment",
    description: "Fine-tune difficulty level, card density, summary style, quiz type, and focus areas. Personalize how AI generates your content.",
    color: "text-amber-600",
    bg: "bg-amber-600/10",
    borderColor: "border-amber-600/20",
    category: "New",
  },
];

const categoryColors: Record<string, string> = {
  Core: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  "AI Feature": "bg-purple-500/10 text-purple-600 border-purple-500/20",
  New: "bg-green-500/10 text-green-600 border-green-500/20",
};

export default function FeaturesPage() {
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
                <Sparkles className="h-4 w-4" />
                All Features
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Everything in{" "}
                <span className="gradient-text-animated">EduCard AI</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto leading-relaxed">
                14 powerful AI features to transform any learning material into interactive study content. All available now.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {Object.entries(categoryColors).map(([cat, classes]) => (
                  <Badge key={cat} variant="outline" className={classes}>
                    {cat === "New" && <Sparkles className="h-3 w-3 mr-1" />}
                    {cat === "Core" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {currentFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className={`group relative overflow-hidden rounded-2xl border-2 ${feature.borderColor} bg-card p-6 transition-all duration-300 hover-lift`}
                >
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg}`}>
                        <feature.icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <Badge variant="outline" className={categoryColors[feature.category]}>
                        {feature.category === "New" && <Sparkles className="h-3 w-3 mr-1" />}
                        {feature.category}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
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
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-6">
              Ready to transform how you study?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              All 14 features are available now. Start for free and experience the future of learning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="gap-2 text-base px-8 h-12 glow-primary shadow-lg shadow-primary/20">
                  <Sparkles className="h-5 w-5" />
                  Get Started Free
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="gap-2 text-base px-8 h-12 border-2">
                  Try Interactive Demo
                </Button>
              </Link>
              <Link href="/upcoming">
                <Button size="lg" variant="ghost" className="gap-2 text-base px-8 h-12">
                  Coming Soon <ArrowRight className="h-4 w-4" />
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
