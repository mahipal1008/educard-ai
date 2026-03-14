import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about EduCard AI, the AI-powered study platform that transforms YouTube videos and PDFs into flashcards, quizzes, and summaries.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
