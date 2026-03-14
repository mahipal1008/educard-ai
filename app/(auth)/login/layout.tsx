import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In",
  description: "Sign in to your EduCard AI account to access your flashcards, quizzes, and study materials.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
