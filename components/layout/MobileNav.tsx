// FILE: components/layout/MobileNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  Library,
  Settings,
  Brain,
  Network,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mobileLinks = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/create", label: "Create", icon: PlusCircle },
  { href: "/library", label: "Library", icon: Library },
  { href: "/diagram-generator", label: "Diagram", icon: Network },
  { href: "/exam-predictor", label: "Predict", icon: Brain },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="flex items-center justify-around py-2">
        {mobileLinks.map((link) => {
          const isActive =
            pathname === link.href || pathname?.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 text-xs font-medium transition-colors rounded-lg",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <link.icon className={cn("h-5 w-5", isActive && "text-primary")} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
