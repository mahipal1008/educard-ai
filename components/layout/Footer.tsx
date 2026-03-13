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
              <a href="https://twitter.com/educardai" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-colors">
                <Twitter className="h-4 w-4 text-muted-foreground" />
              </a>
              <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-colors">
                <Github className="h-4 w-4 text-muted-foreground" />
              </a>
              <a href="https://linkedin.com/company/educardai" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-colors">
                <Linkedin className="h-4 w-4 text-muted-foreground" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Product</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/features" className="hover:text-primary transition-colors">All Features</Link></li>
              <li><Link href="/#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/upcoming" className="hover:text-primary transition-colors">Coming Soon</Link></li>
              <li><Link href="/demo" className="hover:text-primary transition-colors">Interactive Demo</Link></li>
              <li><Link href="/login" className="hover:text-primary transition-colors">Sign In</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Resources</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/youtube-to-flashcards" className="hover:text-primary transition-colors">YouTube to Flashcards</Link></li>
              <li><Link href="/pdf-to-quizzes" className="hover:text-primary transition-colors">PDF to Quizzes</Link></li>
              <li><Link href="/how-it-works" className="hover:text-primary transition-colors">How It Works</Link></li>
              <li><Link href="/spaced-repetition" className="hover:text-primary transition-colors">Spaced Repetition</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
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
