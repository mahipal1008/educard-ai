// FILE: components/landing/FAQ.tsx
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What types of YouTube videos work best?",
    answer:
      "EduCard AI works best with educational content like lectures, tutorials, explainers, and talks. The video must have either auto-generated or manually added subtitles/transcripts available. Music videos, live streams without captions, and very short clips may not produce useful results.",
  },
  {
    question: "What PDF formats are supported?",
    answer:
      "We support standard text-based PDFs up to 10 MB on the Free plan (25 MB on Pro). Scanned PDFs or image-only documents won't work as we need extractable text. Password-protected PDFs need to be unlocked before uploading.",
  },
  {
    question: "How accurate are the AI-generated flashcards and quizzes?",
    answer:
      "Our AI is powered by Claude, one of the most capable language models available. The generated content is typically very accurate, but we always recommend reviewing the flashcards and quiz questions. You can edit any card or question to make corrections.",
  },
  {
    question: "What is spaced repetition?",
    answer:
      "Spaced repetition is a scientifically proven study technique where you review material at increasing intervals. Cards you find difficult appear more often, while cards you know well appear less frequently. This optimizes your study time and improves long-term retention.",
  },
  {
    question: "Can I share my flashcard decks with others?",
    answer:
      "Yes! You can toggle any deck to public, which generates a unique shareable link. Anyone with the link can view and study the deck — no account required. This is great for study groups and classrooms.",
  },
  {
    question: "What are the limits on the Free plan?",
    answer:
      "The Free plan includes 5 document uploads per day, up to 30 flashcards per deck, and 15 quiz questions per document. The daily limit resets at midnight. You can upgrade to Pro for unlimited access.",
  },
];

export function FAQ() {
  return (
    <section className="py-24 md:py-32 bg-muted/30 relative" id="faq">
      {/* Top border gradient */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Frequently asked{" "}
            <span className="gradient-text">questions</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Everything you need to know about EduCard AI.
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-2 shadow-sm">
          <Accordion className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b last:border-b-0 px-4">
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
    </section>
  );
}
