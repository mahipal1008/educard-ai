"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, Home, MessageCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-background">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="h-24 w-24 rounded-2xl bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-12 w-12 text-primary" />
            </div>
            <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center">
              <span className="text-destructive font-bold text-sm">?</span>
            </div>
          </div>
        </div>

        <h1 className="text-7xl font-bold text-primary mb-2">404</h1>
        <h2 className="text-2xl font-semibold mb-3">This page took the wrong exam...</h2>
        <p className="text-muted-foreground mb-8">
          Looks like this page didn&apos;t study hard enough and got lost.
          Let&apos;s get you back to learning.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/">
            <Button size="lg" className="gap-2 w-full sm:w-auto">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
              <MessageCircle className="h-4 w-4" />
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
