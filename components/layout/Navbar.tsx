// FILE: components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { GraduationCap, Moon, Sun, LogOut, Settings, Zap, CreditCard, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { Profile } from "@/types";

interface NavbarProps {
  showAuth?: boolean;
}

export function Navbar({ showAuth = false }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!showAuth) return;
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const res = await fetch("/api/user/profile");
        const json = await res.json();
        if (json.data) setProfile(json.data);
      }
    };
    fetchProfile();
  }, [showAuth, supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const creditsUsed = profile?.daily_credits_used ?? 0;
  const maxCredits = profile?.plan === "pro" ? Infinity : 5;
  const creditsRemaining = maxCredits === Infinity ? null : maxCredits - creditsUsed;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-[1400px] flex h-14 lg:h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-2">
          <Link href={showAuth ? "/dashboard" : "/"} className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 lg:h-9 lg:w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-lg lg:text-xl font-bold hidden sm:inline">
              EduCard <span className="text-primary">AI</span>
            </span>
          </Link>
        </div>

        {/* Center nav links (public/landing only) */}
        {!showAuth && (
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link href="/#features">
              <Button variant="ghost" size="sm" className="h-8 text-sm lg:text-base text-muted-foreground hover:text-foreground">Features</Button>
            </Link>
            <Link href="/#how-it-works">
              <Button variant="ghost" size="sm" className="h-8 text-sm lg:text-base text-muted-foreground hover:text-foreground">How It Works</Button>
            </Link>
            <Link href="/#pricing">
              <Button variant="ghost" size="sm" className="h-8 text-sm lg:text-base text-muted-foreground hover:text-foreground">Pricing</Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost" size="sm" className="h-8 text-sm lg:text-base text-muted-foreground hover:text-foreground">About</Button>
            </Link>
            <Link href="/blog">
              <Button variant="ghost" size="sm" className="h-8 text-sm lg:text-base text-muted-foreground hover:text-foreground">Blog</Button>
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-1.5">
          {/* Mobile menu (public/landing only) */}
          {!showAuth && (
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger
                render={<Button variant="ghost" size="icon" className="h-8 w-8 md:hidden" />}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 pt-10">
                <nav className="flex flex-col gap-1">
                  {[
                    { href: "/#features", label: "Features" },
                    { href: "/#how-it-works", label: "How It Works" },
                    { href: "/#pricing", label: "Pricing" },
                    { href: "/about", label: "About" },
                    { href: "/blog", label: "Blog" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="border-t my-3" />
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Sign in</Button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          )}

          {/* Credits indicator for free plan */}
          {showAuth && profile && creditsRemaining !== null && (
            <Tooltip>
              <TooltipTrigger
                render={<Link href="/pricing"><Button variant="ghost" size="sm" className="gap-1.5 text-xs h-8" /></Link>}
              >
                <Zap className={`h-3.5 w-3.5 ${creditsRemaining <= 1 ? "text-destructive" : "text-amber-500"}`} />
                <span className="hidden sm:inline">{creditsRemaining}/{maxCredits}</span>
                <span className="sm:hidden">{creditsRemaining}</span>
              </TooltipTrigger>
              <TooltipContent>
                {creditsRemaining} of {maxCredits} daily credits remaining
              </TooltipContent>
            </Tooltip>
          )}

          {/* Pro badge */}
          {showAuth && profile?.plan === "pro" && (
            <Badge variant="outline" className="gap-1 text-xs border-amber-500/30 text-amber-500 hidden sm:flex">
              <Zap className="h-3 w-3" /> Pro
            </Badge>
          )}

          {/* Theme toggle */}
          {mounted && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    aria-label="Toggle theme"
                  />
                }
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </TooltipTrigger>
              <TooltipContent>
                Switch to {theme === "dark" ? "light" : "dark"} mode
              </TooltipContent>
            </Tooltip>
          )}

          {showAuth && profile ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="ghost" className="relative h-8 w-8 rounded-full" />}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile.avatar_url ?? undefined} alt={profile.full_name ?? ""} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <div className="flex items-center gap-3 p-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile.avatar_url ?? undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{profile.full_name || "User"}</p>
                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline" className="text-[10px] capitalize h-4 px-1.5">
                        {profile.plan}
                      </Badge>
                      {creditsRemaining !== null && (
                        <span className="text-[10px] text-muted-foreground">
                          {creditsRemaining} credits left
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/settings")} className="gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/pricing")} className="gap-2">
                  <CreditCard className="h-4 w-4" />
                  Pricing & Plans
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="gap-2 text-destructive">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : !showAuth ? (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="h-8">Sign in</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="h-8">Get Started</Button>
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
