// FILE: components/layout/Footer.tsx
import Link from "next/link";
import { GraduationCap, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background relative">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold">
                EduCard <span className="text-primary">AI</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Transform any YouTube video or PDF into smart flashcards, quizzes, and summaries — powered by advanced AI.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer">
                <Twitter className="h-4 w-4 text-muted-foreground" />
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer">
                <Github className="h-4 w-4 text-muted-foreground" />
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer">
                <Linkedin className="h-4 w-4 text-muted-foreground" />
              </span>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Product</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/#features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="/#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/features" className="hover:text-primary transition-colors">Coming Soon</Link></li>
              <li><Link href="/login" className="hover:text-primary transition-colors">Sign In</Link></li>
              <li><Link href="/signup" className="hover:text-primary transition-colors">Get Started</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Resources</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>YouTube to Flashcards</li>
              <li>PDF to Quizzes</li>
              <li>Spaced Repetition</li>
              <li>AI Summaries</li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Support</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><span className="hover:text-primary transition-colors cursor-pointer">Help Center</span></li>
              <li><span className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-primary transition-colors cursor-pointer">Terms of Service</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} EduCard AI. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/60">
            Made with AI — Built for students, by students.
          </p>
        </div>
      </div>
    </footer>
  );
}
