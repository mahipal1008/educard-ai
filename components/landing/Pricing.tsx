// FILE: components/landing/Pricing.tsx
import { Check, X, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with AI-powered studying",
    features: [
      { text: "5 documents per day", included: true },
      { text: "Up to 30 flashcards per deck", included: true },
      { text: "Up to 15 quiz questions", included: true },
      { text: "10 MB max PDF size", included: true },
      { text: "Public deck sharing", included: true },
      { text: "Export to Anki/CSV", included: false },
      { text: "Priority AI processing", included: false },
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "For serious students who want unlimited power",
    features: [
      { text: "Unlimited documents", included: true },
      { text: "Up to 100 flashcards per deck", included: true },
      { text: "Up to 40 quiz questions", included: true },
      { text: "25 MB max PDF size", included: true },
      { text: "Public deck sharing", included: true },
      { text: "Export to Anki/CSV", included: true },
      { text: "Priority AI processing", included: true },
    ],
    cta: "Upgrade to Pro",
    popular: true,
  },
];

export function Pricing() {
  return (
    <section className="py-24 md:py-32 relative" id="pricing">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Sparkles className="h-4 w-4" />
            Pricing
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Simple, transparent{" "}
            <span className="gradient-text">pricing</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free. Upgrade when you need more power. No hidden fees.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl overflow-hidden transition-all duration-300 hover-lift ${
                plan.popular ? "gradient-border" : ""
              }`}
            >
              {/* Popular shimmer effect */}
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 h-1 shimmer-border" />
              )}

              <div className={`h-full bg-card rounded-2xl border-2 p-8 flex flex-col ${
                plan.popular
                  ? "border-primary/30 shadow-xl shadow-primary/10"
                  : "border-border"
              }`}>
                {/* Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    {plan.popular && (
                      <Badge className="bg-primary text-primary-foreground gap-1">
                        <Zap className="h-3 w-3" /> Most Popular
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-5xl font-extrabold">{plan.price}</span>
                    <span className="text-lg text-muted-foreground">{plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-center gap-3 text-sm">
                      {feature.included ? (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10">
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                        </div>
                      ) : (
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted">
                          <X className="h-3.5 w-3.5 text-muted-foreground/50" />
                        </div>
                      )}
                      <span className={feature.included ? "font-medium" : "text-muted-foreground/60"}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link href="/signup">
                  <Button
                    className={`w-full h-12 text-base font-semibold ${
                      plan.popular
                        ? "glow-primary shadow-lg shadow-primary/20"
                        : ""
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Money back guarantee */}
        <p className="text-center mt-8 text-sm text-muted-foreground">
          14-day money-back guarantee. Cancel anytime.
        </p>
      </div>
    </section>
  );
}
