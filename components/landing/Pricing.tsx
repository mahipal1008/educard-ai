// FILE: components/landing/Pricing.tsx
"use client";

import { Check, Sparkles, Zap, HelpCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with AI-powered flashcards at no cost",
    features: [
      "10 flashcard decks per month",
      "YouTube + PDF upload",
      "Basic quiz mode",
    ],
    cta: "Get Started Free",
    popular: false,
    icon: Sparkles,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "Unlock the full power of AI-driven studying",
    features: [
      "Unlimited decks",
      "Voice Doubt Solver",
      "Image Q&A",
      "Multilingual (20+ languages)",
      "Exam Predictor",
      "Priority AI processing",
    ],
    cta: "Start Pro Trial",
    popular: true,
    icon: Zap,
  },
  {
    name: "Enterprise",
    price: "$12",
    period: "/month",
    description: "Collaborate and study together with your group",
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "Shared deck library",
      "Analytics dashboard",
    ],
    cta: "Contact Us",
    popular: false,
    icon: Users,
  },
];

const faqs = [
  {
    question: "Can I cancel anytime?",
    answer:
      "Absolutely. There are no long-term contracts or cancellation fees. You can cancel your Pro or Teams subscription at any time from your account settings, and you will continue to have access until the end of your current billing period.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes! The Pro plan comes with a 7-day free trial so you can explore every feature — Voice Doubt Solver, Image Q&A, Exam Predictor, and more — before committing. No credit card is required to start the trial.",
  },
  {
    question: "What AI models power EduCard AI?",
    answer:
      "EduCard AI is powered by Google Gemini AI and other state-of-the-art language and vision models, along with ElevenLabs for voice synthesis. This allows us to deliver highly accurate flashcard generation, intelligent quiz creation, voice-based doubt solving, and image-based Q&A across 20+ languages.",
  },
];

export function Pricing() {
  return (
    <section className="py-24 md:py-32 relative" id="pricing">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Section header */}
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

        {/* Pricing cards */}
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto items-start">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl overflow-hidden transition-all duration-300 hover-lift ${
                  plan.popular ? "gradient-border md:-mt-4 md:mb-[-1rem]" : ""
                }`}
              >
                {/* Popular shimmer effect */}
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 h-1 shimmer-border" />
                )}

                <div
                  className={`h-full bg-card rounded-2xl border-2 p-8 flex flex-col ${
                    plan.popular
                      ? "border-primary/30 shadow-xl shadow-primary/10"
                      : "border-border"
                  }`}
                >
                  {/* Header */}
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          plan.popular
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-2xl font-bold">{plan.name}</h3>
                      {plan.popular && (
                        <Badge className="bg-primary text-primary-foreground gap-1">
                          <Zap className="h-3 w-3" /> Most Popular
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {plan.description}
                    </p>
                    <div className="mt-6 flex items-baseline gap-1">
                      <span className="text-5xl font-extrabold">
                        {plan.price}
                      </span>
                      <span className="text-lg text-muted-foreground">
                        {plan.period}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-10 flex-1">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-3 text-sm"
                      >
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                        </div>
                        <span className="font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link href={plan.name === "Enterprise" ? "/contact" : "/signup"}>
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
            );
          })}
        </div>

        {/* Money back guarantee */}
        <p className="text-center mt-8 text-sm text-muted-foreground">
          7-day free trial on Pro. Cancel anytime. No questions asked.
        </p>

        {/* FAQ Section */}
        <div className="mt-24 md:mt-32 max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <HelpCircle className="h-4 w-4" />
              FAQ
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Have <span className="gradient-text">questions?</span>
            </h2>
            <p className="mt-5 text-lg text-muted-foreground">
              We have got answers.
            </p>
          </div>

          <div className="rounded-2xl border bg-card p-2 shadow-sm">
            <Accordion className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-b last:border-b-0 px-4"
                >
                  <AccordionTrigger className="text-left text-base font-semibold py-5 hover:text-primary transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
