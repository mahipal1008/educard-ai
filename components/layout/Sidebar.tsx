// FILE: components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  Library,
  Settings,
  CreditCard,
  GraduationCap,
  Brain,
  Layers,
  Network,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/create", label: "Create New", icon: PlusCircle },
  { href: "/library", label: "Library", icon: Library },
  { href: "/merge-decks", label: "Merge Decks", icon: Layers },
  { href: "/diagram-generator", label: "Diagram AI", icon: Network },
  { href: "/exam-predictor", label: "Exam Predictor", icon: Brain },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/pricing", label: "Pricing", icon: CreditCard },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "hidden md:flex w-64 flex-col border-r bg-sidebar min-h-[calc(100vh-4rem)]",
        className
      )}
    >
      <div className="flex flex-col gap-1 p-4">
        <div className="flex items-center gap-2 px-3 py-2 mb-4">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">Study Hub</span>
        </div>

        <nav className="flex flex-col gap-1">
          {sidebarLinks.map((link) => {
            const isActive =
              pathname === link.href || pathname?.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-4">
        <div className="rounded-lg bg-primary/5 border border-primary/10 p-4">
          <h4 className="text-sm font-semibold mb-1">Upgrade to Pro</h4>
          <p className="text-xs text-muted-foreground mb-3">
            Get unlimited documents, more cards, and export options.
          </p>
          <Link href="/pricing">
            <span className="text-xs font-medium text-primary hover:underline cursor-pointer">
              View Plans →
            </span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
