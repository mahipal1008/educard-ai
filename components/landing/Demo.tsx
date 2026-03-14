import Link from "next/link";
import { Play, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Demo() {
  return (
    <section className="py-24 md:py-32 lg:py-40 relative" id="demo">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border bg-primary/5 px-4 py-1.5 text-sm lg:text-base font-medium text-primary mb-6">
            <Sparkles className="h-4 w-4" />
            Demo
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            See EduCard AI in <span className="gradient-text">action</span>
          </h2>
          <p className="mt-5 text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
            Try all 9 AI features with interactive demos — no sign-up needed
          </p>
        </div>

        {/* Interactive demo link */}
        <Link href="/demo">
          <div className="relative group cursor-pointer rounded-2xl border-2 border-border bg-card overflow-hidden shadow-2xl shadow-primary/5 hover-lift transition-all">
            <div className="aspect-video bg-gradient-to-br from-muted/80 via-muted/50 to-background p-8 lg:p-12 flex flex-col items-center justify-center gap-6 lg:gap-8">
              {/* Play button */}
              <div className="h-20 w-20 lg:h-24 lg:w-24 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <Play className="h-8 w-8 lg:h-10 lg:w-10 text-primary ml-1" />
              </div>
              <div className="text-center">
                <p className="text-lg lg:text-xl font-semibold">Try EduCard AI — Interactive Demo</p>
                <p className="text-sm lg:text-base text-muted-foreground mt-1">
                  Flashcards, Quizzes, Voice Doubt Solver, Image Q&A, and more
                </p>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="bg-muted/50 border-t px-4 lg:px-6 py-3 lg:py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm lg:text-base text-muted-foreground">
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
