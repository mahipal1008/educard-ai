// FILE: app/(public)/page.tsx
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Demo } from "@/components/landing/Demo";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Team } from "@/components/landing/Team";
import { AtAGlance } from "@/components/landing/AtAGlance";
import { Testimonials } from "@/components/landing/Testimonials";
import { Pricing } from "@/components/landing/Pricing";
import { CTABanner } from "@/components/landing/CTABanner";

export const metadata: Metadata = {
  title: "Turn Any Content Into Flashcards & Quizzes Instantly",
  description: "EduCard AI transforms YouTube videos and PDFs into AI-generated flashcards, quizzes, and summaries. Study smarter with spaced repetition and exam predictions.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <Demo />
        <HowItWorks />
        <Team />
        <AtAGlance />
        <Testimonials />
        <Pricing />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
