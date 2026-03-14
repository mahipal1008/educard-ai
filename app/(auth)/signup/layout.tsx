import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your free EduCard AI account. Start turning YouTube videos and PDFs into AI-generated flashcards and quizzes.",
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
