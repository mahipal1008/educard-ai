import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo",
  description: "Try EduCard AI live. See how AI instantly generates flashcards, quizzes, and summaries from any educational content.",
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
