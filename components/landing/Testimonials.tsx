// FILE: components/landing/Testimonials.tsx
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Medical Student",
    avatar: "SC",
    avatarColor: "bg-blue-500",
    rating: 5,
    text: "EduCard AI turned a 3-hour lecture into 30 flashcards in seconds. I used to spend hours manually creating cards — now I focus that time on actually studying. My exam scores jumped 15%.",
  },
  {
    name: "Marcus Johnson",
    role: "CS Undergraduate",
    avatar: "MJ",
    avatarColor: "bg-emerald-500",
    rating: 5,
    text: "The spaced repetition algorithm is a game-changer. I uploaded my entire Data Structures textbook chapter by chapter, and the AI-generated quizzes helped me ace my midterm.",
  },
  {
    name: "Emily Rodriguez",
    role: "High School Teacher",
    avatar: "ER",
    avatarColor: "bg-purple-500",
    rating: 5,
    text: "I create study decks from YouTube tutorials for my students and share them with a single link. It has completely transformed how I prepare supplementary material for my classes.",
  },
  {
    name: "David Kim",
    role: "Law Student",
    avatar: "DK",
    avatarColor: "bg-orange-500",
    rating: 5,
    text: "Reading case law PDFs used to be overwhelming. Now I upload them to EduCard AI and get perfectly structured flashcards that highlight the key legal principles. Absolute lifesaver.",
  },
  {
    name: "Priya Patel",
    role: "MBA Candidate",
    avatar: "PP",
    avatarColor: "bg-pink-500",
    rating: 5,
    text: "The quiz generation feature is brilliant. I upload my business case study PDFs and get multiple-choice questions that actually test deeper understanding, not just surface-level recall.",
  },
  {
    name: "Alex Thompson",
    role: "PhD Researcher",
    avatar: "AT",
    avatarColor: "bg-cyan-500",
    rating: 5,
    text: "As a researcher, I consume dozens of papers weekly. EduCard AI helps me summarize and create retention cards for each one. My literature review process is 10x faster now.",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden" id="testimonials">
      {/* Background */}
      <div className="absolute inset-0 dot-pattern opacity-30" />

      <div className="mx-auto max-w-7xl px-4 md:px-6 relative">
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Star className="h-4 w-4" />
            Testimonials
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Loved by <span className="gradient-text">students worldwide</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            See why thousands of students trust EduCard AI for their studies.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="group rounded-2xl border bg-card p-6 hover-lift hover:border-primary/20 transition-all duration-300 relative"
            >
              {/* Quote icon */}
              <Quote className="h-8 w-8 text-primary/10 mb-4" />

              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Review text */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t">
                <div className={`h-10 w-10 rounded-full ${t.avatarColor} flex items-center justify-center text-white text-sm font-bold`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
