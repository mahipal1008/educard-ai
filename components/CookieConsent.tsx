"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 p-4">
      <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground text-center sm:text-left">
          We use cookies to improve your experience. By using EduCard AI, you agree to our{" "}
          <Link href="/privacy" className="text-primary underline underline-offset-4 hover:text-primary/80">
            Privacy Policy
          </Link>.
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/privacy">
            <Button variant="outline" size="sm">Learn More</Button>
          </Link>
          <Button size="sm" onClick={accept}>Accept</Button>
        </div>
      </div>
    </div>
  );
}
