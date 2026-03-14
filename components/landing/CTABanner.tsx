// FILE: components/landing/CTABanner.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTABanner() {
  return (
    <section className="py-24 md:py-32 lg:py-40 relative overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-purple-600" />
          <div className="absolute inset-0 grid-pattern opacity-10" />

          {/* Floating elements */}
          <div className="absolute top-10 left-10 h-32 w-32 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-10 right-10 h-40 w-40 bg-white/10 rounded-full blur-2xl" />

          <div className="relative px-4 py-12 sm:px-8 sm:py-16 md:px-16 md:py-20 lg:px-20 lg:py-24 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur px-4 py-1.5 text-sm lg:text-base font-medium text-white mb-8">
              <Sparkles className="h-4 w-4" />
              Start studying smarter today
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl max-w-3xl mx-auto">
              Ready to transform how you study?
            </h2>

            <p className="mt-6 text-lg lg:text-xl text-white/80 max-w-xl mx-auto">
              Join 500+ students who are already using AI to study smarter, not harder. Get started in under 30 seconds.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 gap-2 text-base lg:text-lg px-8 h-12 lg:h-14 lg:px-10 font-semibold shadow-lg">
                  Get Started Free <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/#pricing">
                <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 gap-2 text-base lg:text-lg px-8 h-12 lg:h-14 lg:px-10 bg-transparent">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
