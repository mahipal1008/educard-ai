// FILE: components/layout/Footer.tsx
import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background relative">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8 lg:py-20">
        <div className="grid gap-10 lg:gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 lg:h-10 lg:w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-xl lg:text-2xl font-bold">
                EduCard <span className="text-primary">AI</span>
              </span>
            </div>
            <p className="text-sm lg:text-base text-muted-foreground max-w-xs leading-relaxed">
              Transform any YouTube video or PDF into smart flashcards, quizzes, and summaries — powered by advanced AI.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="text-sm lg:text-base font-semibold uppercase tracking-wider text-foreground">Product</h4>
            <ul className="space-y-3 text-sm lg:text-base text-muted-foreground">
              <li><Link href="/features" className="hover:text-primary transition-colors">All Features</Link></li>
              <li><Link href="/#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/upcoming" className="hover:text-primary transition-colors">Coming Soon</Link></li>
              <li><Link href="/demo" className="hover:text-primary transition-colors">Interactive Demo</Link></li>
              <li><Link href="/login" className="hover:text-primary transition-colors">Sign In</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-sm lg:text-base font-semibold uppercase tracking-wider text-foreground">Resources</h4>
            <ul className="space-y-3 text-sm lg:text-base text-muted-foreground">
              <li><Link href="/youtube-to-flashcards" className="hover:text-primary transition-colors">YouTube to Flashcards</Link></li>
              <li><Link href="/pdf-to-quizzes" className="hover:text-primary transition-colors">PDF to Quizzes</Link></li>
              <li><Link href="/how-it-works" className="hover:text-primary transition-colors">How It Works</Link></li>
              <li><Link href="/spaced-repetition" className="hover:text-primary transition-colors">Spaced Repetition</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-sm lg:text-base font-semibold uppercase tracking-wider text-foreground">Company</h4>
            <ul className="space-y-3 text-sm lg:text-base text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* NVIDIA NIM Badge */}
        <div className="mt-12 lg:mt-16 pt-8 border-t flex flex-col items-center gap-6">
          <a
            href="https://build.nvidia.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg border border-[#76B900]/30 bg-[#76B900]/5 px-5 py-3 transition-colors hover:border-[#76B900]/60 hover:bg-[#76B900]/10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#76B900" className="h-6 w-6">
              <path d="M8.948 8.798V6.852c.072-.005.144-.009.218-.009 2.805-.084 4.953 2.395 4.953 2.395s-2.29 2.72-4.726 2.72c-.16 0-.312-.013-.445-.038V9.463c1.528.18 2.468-.859 3.157-1.625L8.948 8.798zM8.948 4.417v1.964l.218-.012c3.68-.109 6.468 3.122 6.468 3.122s-3.193 3.502-6.249 3.502c-.16 0-.308-.007-.437-.018v1.16c.12.007.244.014.38.014 2.932 0 5.056-1.493 7.096-3.268.339.278 1.73 1.312 2.016 1.535-1.988 1.6-6.612 3.085-9.056 3.085-.152 0-.296-.005-.436-.016v1.404H20.5V4.417H8.948zM8.948 12.971v-1.179a3.897 3.897 0 0 1-.445.032c-2.08 0-3.555-1.804-3.555-1.804s1.714-1.956 3.782-2.147V6.852C5.844 7.104 3.5 9.586 3.5 9.586s1.452 3.706 5.003 3.706c.16 0 .308-.012.445-.032v-.289z"/>
            </svg>
            <span className="text-sm font-medium text-[#76B900]">
              Powered by NVIDIA NIM
            </span>
          </a>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
            <p className="text-sm lg:text-base text-muted-foreground">
              &copy; {new Date().getFullYear()} EduCard AI. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground/60">
              Made with AI — Built for students, by students.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
