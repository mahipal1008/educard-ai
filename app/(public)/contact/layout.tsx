import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the EduCard AI team. We'd love to hear your feedback, questions, or partnership inquiries.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
