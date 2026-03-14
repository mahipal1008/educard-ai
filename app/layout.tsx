// FILE: app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CookieConsent } from "@/components/CookieConsent";
import { ServiceWorkerRegistration } from "@/components/providers/sw-register";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "EduCard AI — Turn Any Content Into Flashcards & Quizzes Instantly",
    template: "%s | EduCard AI",
  },
  description:
    "GPU-accelerated AI study platform. Upload YouTube, PDF, or images and get instant flashcards, quizzes, voice tutor, and exam predictions.",
  keywords: [
    "AI flashcards",
    "study app",
    "exam predictor",
    "voice tutor",
    "GPU AI",
    "youtube flashcards",
    "pdf quiz",
    "spaced repetition",
    "education",
    "AI study tools",
  ],
  authors: [{ name: "EduCard AI" }],
  creator: "EduCard AI",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "EduCard AI",
    title: "EduCard AI — Turn Any Content Into Flashcards & Quizzes Instantly",
    description:
      "GPU-accelerated AI study platform. Upload YouTube, PDF, or images and get instant flashcards, quizzes, voice tutor, and exam predictions.",
    url: "https://educardai.com",
  },
  twitter: {
    card: "summary_large_image",
    site: "@educardai",
    title: "EduCard AI — Turn Any Content Into Flashcards & Quizzes Instantly",
    description:
      "GPU-accelerated AI study platform. Upload YouTube, PDF, or images and get instant flashcards, quizzes, voice tutor, and exam predictions.",
  },
  alternates: {
    canonical: "https://educardai.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#7c3aed" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            {children}
            <Toaster richColors position="bottom-right" />
            <CookieConsent />
            <ServiceWorkerRegistration />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
