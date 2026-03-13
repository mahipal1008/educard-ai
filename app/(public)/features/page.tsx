// FILE: app/(public)/features/page.tsx
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Image,
  Video,
  BrainCircuit,
  SlidersHorizontal,
  Rocket,
  Sparkles,
  Bell,
  ArrowRight,
  Clock,
  Wand2,
  Layers,
  Target,
} from "lucide-react";
import Link from "next/link";

const comingSoonFeatures = [
  {
    icon: Image,
    title: "AI Image Generation",
    description:
      "Automatically generate visual flashcards and diagrams from your PDFs and video content. Turn complex concepts into memorable visual aids powered by AI image generation.",
    status: "In Development",
    quarter: "Q2 2026",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    borderColor: "border-pink-500/20",
    gradient: "from-pink-500/10 to-transparent",
  },
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
  },
  {
    icon: BrainCircuit,
    title: "Custom Model Training",
    description:
      "Train a personalized AI model on your specific subject area. Upload your study materials and the AI adapts to your curriculum, terminology, and learning style for hyper-relevant content generation.",
    status: "Research Phase",
    quarter: "Q3 2026",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    gradient: "from-purple-500/10 to-transparent",
  },
  {
    icon: SlidersHorizontal,
    title: "AI Model Adjustment",
    description:
      "Fine-tune how the AI generates your study materials. Adjust difficulty level, focus areas, question types, card density, and more. Recommended presets for different subjects and exam types.",
    status: "Research Phase",
    quarter: "Q3 2026",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    gradient: "from-amber-500/10 to-transparent",
  },
  {
    icon: Wand2,
    title: "Smart Summarization Modes",
    description:
      "Choose from multiple summary styles — bullet points, mind maps, Cornell notes, or outline format. Perfect for different study methods and learning preferences.",
    status: "Planned",
    quarter: "Q3 2026",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    gradient: "from-emerald-500/10 to-transparent",
  },
  {
    icon: Layers,
    title: "Multi-Source Deck Merging",
    description:
      "Combine flashcards from multiple PDFs and videos into a single unified study deck. Perfect for exam preparation that spans multiple lectures and reading materials.",
    status: "Planned",
    quarter: "Q4 2026",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
    gradient: "from-cyan-500/10 to-transparent",
  },
];

const statusColors: Record<string, string> = {
  "In Development": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "Research Phase": "bg-purple-500/10 text-purple-500 border-purple-500/20",
  "Planned": "bg-amber-500/10 text-amber-500 border-amber-500/20",
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
                <Rocket className="h-4 w-4" />
                Roadmap
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                The Future of{" "}
                <span className="gradient-text-animated">EduCard AI</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto leading-relaxed">
                We&apos;re building the most powerful AI study platform in the world.
                Here&apos;s what&apos;s coming next.
              </p>
            </div>
          </div>
        </section>

        {/* Status Legend */}
        <section className="py-8 border-b">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="flex flex-wrap justify-center gap-4">
              {Object.entries(statusColors).map(([status, classes]) => (
                <div key={status} className="flex items-center gap-2">
                  <Badge variant="outline" className={classes}>
                    {status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-2">
              {comingSoonFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className={`group relative overflow-hidden rounded-2xl border-2 ${feature.borderColor} bg-card p-8 transition-all duration-300 hover-lift`}
                >
                  {/* Gradient hover bg */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                  <div className="relative">
                    {/* Header row */}
                    <div className="flex items-start justify-between mb-6">
                      <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${feature.bg}`}>
                        <feature.icon className={`h-7 w-7 ${feature.color}`} />
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={statusColors[feature.status]}>
                          {feature.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {feature.description}
                    </p>

                    {/* Timeline */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Expected: {feature.quarter}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Notify CTA */}
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
              <Link href="/">
                <Button size="lg" variant="outline" className="gap-2 text-base px-8 h-12 border-2">
                  <ArrowRight className="h-5 w-5" />
                  Back to Home
                </Button>
              </Link>
            </div>

            {/* Feature request note */}
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
