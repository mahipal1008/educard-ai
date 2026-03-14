// FILE: components/landing/Features.tsx
import {
  Youtube,
  FileText,
  Mic,
  Camera,
  Brain,
  Globe,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Youtube,
    title: "YouTube → Flashcards",
    description:
      "Paste any YouTube link and get a full study deck in 30 seconds.",
    color: "text-red-500",
    bg: "bg-red-500/10",
    borderHover: "hover:border-red-500/30",
    gradient: "from-red-500/10 to-transparent",
  },
  {
    icon: FileText,
    title: "PDF → Quiz",
    description:
      "Upload lecture notes and get MCQs, summaries, and key terms.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    borderHover: "hover:border-blue-500/30",
    gradient: "from-blue-500/10 to-transparent",
  },
  {
    icon: Mic,
    title: "Voice Doubt Solver",
    description:
      "Ask doubts by voice. Get instant spoken answers from your AI tutor.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    borderHover: "hover:border-purple-500/30",
    gradient: "from-purple-500/10 to-transparent",
  },
  {
    icon: Camera,
    title: "Image Q&A",
    description:
      "Photo a diagram or equation — AI explains and quizzes you on it.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    borderHover: "hover:border-amber-500/30",
    gradient: "from-amber-500/10 to-transparent",
  },
  {
    icon: Brain,
    title: "Exam Predictor",
    description:
      "Upload past papers. AI predicts your most likely exam questions.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    borderHover: "hover:border-emerald-500/30",
    gradient: "from-emerald-500/10 to-transparent",
  },
  {
    icon: Globe,
    title: "Multilingual",
    description:
      "Study in Hindi, Tamil, Bengali, or 20+ languages with one click.",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    borderHover: "hover:border-pink-500/30",
    gradient: "from-pink-500/10 to-transparent",
  },
];

export function Features() {
  return (
    <section className="py-24 md:py-32 lg:py-40 relative" id="features">
      {/* Background accent */}
      <div className="absolute inset-0 dot-pattern opacity-50" />

      <div className="mx-auto max-w-[1400px] px-4 md:px-8 relative">
        <div className="text-center mb-16 md:mb-20 lg:mb-24">
          <div className="inline-flex items-center gap-2 rounded-full border bg-primary/5 px-4 py-1.5 text-sm lg:text-base font-medium text-primary mb-6">
            <Sparkles className="h-4 w-4" />
            Features
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            Everything you need to study{" "}
            <span className="gradient-text">effectively</span>
          </h2>
          <p className="mt-5 text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
            EduCard AI handles the tedious work of creating study material so you
            can focus on what matters — actually learning.
          </p>
        </div>

        <div className="grid gap-6 lg:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`group relative overflow-hidden rounded-2xl border-2 bg-card p-8 lg:p-10 transition-all duration-300 hover-lift ${feature.borderHover}`}
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              <div className="relative">
                <div
                  className={`inline-flex h-14 w-14 lg:h-16 lg:w-16 items-center justify-center rounded-2xl ${feature.bg} mb-6`}
                >
                  <feature.icon className={`h-7 w-7 lg:h-8 lg:w-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl lg:text-2xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground lg:text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
