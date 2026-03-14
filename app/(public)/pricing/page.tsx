// FILE: app/(public)/pricing/page.tsx
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Pricing } from "@/components/landing/Pricing";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Choose the right EduCard AI plan. Free tier with 5 documents per day or Pro for unlimited AI-generated flashcards, quizzes, and summaries.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
