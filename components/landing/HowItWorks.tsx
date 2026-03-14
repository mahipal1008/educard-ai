// FILE: components/landing/HowItWorks.tsx
import { Upload, Cpu, BookOpen, ArrowRight } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Upload,
    title: "Paste or Upload",
    description:
      "Drop a YouTube link or upload a PDF document. We support lectures, tutorials, textbooks, and research papers.",
    accent: "from-blue-500 to-cyan-500",
    bg: "bg-blue-500/10",
    color: "text-blue-500",
  },
  {
    step: "02",
    icon: Cpu,
    title: "AI Generates Material",
    description:
      "Our AI reads the full content and creates a summary, 20-30 flashcards, and a 10-15 question quiz — all in under a minute.",
    accent: "from-purple-500 to-pink-500",
    bg: "bg-purple-500/10",
    color: "text-purple-500",
  },
  {
    step: "03",
    icon: BookOpen,
    title: "Study & Retain",
    description:
      "Review flashcards with spaced repetition, take quizzes to test yourself, and track your progress on the dashboard.",
    accent: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-500/10",
    color: "text-emerald-500",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 md:py-32 lg:py-40 bg-muted/30 relative overflow-hidden" id="how-it-works">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="mx-auto max-w-[1400px] px-4 md:px-8 relative">
        <div className="text-center mb-16 md:mb-20 lg:mb-24">
          <div className="inline-flex items-center gap-2 rounded-full border bg-primary/5 px-4 py-1.5 text-sm lg:text-base font-medium text-primary mb-6">
            <Cpu className="h-4 w-4" />
            How It Works
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            Three steps to{" "}
            <span className="gradient-text">smarter studying</span>
          </h2>
          <p className="mt-5 text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
            From content to study session in under 60 seconds.
          </p>
        </div>

        <div className="grid gap-8 lg:gap-10 md:grid-cols-3 relative">
          {/* Connector lines (desktop) */}
          <div className="absolute top-20 lg:top-24 left-[calc(33.33%)] right-[calc(33.33%)] h-0.5 hidden md:flex items-center justify-center">
            <div className="w-full border-t-2 border-dashed border-primary/20" />
          </div>

          {steps.map((step, index) => (
            <div key={step.step} className="relative group">
              <div className="flex flex-col items-center text-center">
                {/* Step number & icon */}
                <div className="relative mb-8">
                  {/* Glow effect on hover */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${step.accent} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />

                  <div className={`relative flex h-20 w-20 sm:h-28 sm:w-28 lg:h-32 lg:w-32 items-center justify-center rounded-3xl ${step.bg} border-2 border-border group-hover:border-primary/30 transition-all duration-300`}>
                    <step.icon className={`h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 ${step.color}`} />
                  </div>

                  {/* Step badge */}
                  <div className={`absolute -top-3 -right-3 flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-xl bg-gradient-to-br ${step.accent} text-white text-sm lg:text-base font-bold shadow-lg`}>
                    {step.step}
                  </div>
                </div>

                <h3 className="text-xl lg:text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground lg:text-lg max-w-xs leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Arrow between steps (mobile) */}
              {index < steps.length - 1 && (
                <div className="flex justify-center my-4 md:hidden">
                  <ArrowRight className="h-5 w-5 text-primary/40 rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
