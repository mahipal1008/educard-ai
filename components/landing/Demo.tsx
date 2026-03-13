import Link from "next/link";
import { Play, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Demo() {
  return (
    <section className="py-24 md:py-32 relative" id="demo">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Sparkles className="h-4 w-4" />
            Demo
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            See EduCard AI in <span className="gradient-text">action</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            Try all 9 AI features with interactive demos — no sign-up needed
          </p>
        </div>

        {/* Interactive demo link */}
        <Link href="/demo">
          <div className="relative group cursor-pointer rounded-2xl border-2 border-border bg-card overflow-hidden shadow-2xl shadow-primary/5 hover-lift transition-all">
            <div className="aspect-video bg-gradient-to-br from-muted/80 via-muted/50 to-background p-8 flex flex-col items-center justify-center gap-6">
              {/* Play button */}
              <div className="h-20 w-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <Play className="h-8 w-8 text-primary ml-1" />
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold">Try EduCard AI — Interactive Demo</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Flashcards, Quizzes, Voice Doubt Solver, Image Q&A, and more
                </p>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="bg-muted/50 border-t px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>9 AI features to explore</span>
              </div>
              <Button variant="ghost" size="sm" className="gap-1 text-primary">
                Try Now <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
