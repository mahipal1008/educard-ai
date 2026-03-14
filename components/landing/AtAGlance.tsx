// FILE: components/landing/AtAGlance.tsx
"use client";

import {
  Calendar,
  MapPin,
  Mail,
  Cpu,
  Layers,
  Rocket,
} from "lucide-react";

const items = [
  { icon: Calendar, label: "Founded", value: "2025" },
  { icon: MapPin, label: "Location", value: "Delhi, India (Global)" },
  {
    icon: Mail,
    label: "Email",
    value: "raviray@educard-ai.indevs.in",
    href: "mailto:raviray@educard-ai.indevs.in",
  },
  { icon: Cpu, label: "Use", value: "NVIDIA CPU" },
  { icon: Layers, label: "Stack", value: "Next.js, NVIDIA NIM, PostgreSQL, Cloudflare" },
  { icon: Rocket, label: "Mission", value: "GPU-accelerated personalized learning" },
];

export function AtAGlance() {
  return (
    <section className="py-20 lg:py-28 bg-muted/30">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            At a Glance
          </h2>
          <p className="mt-3 text-muted-foreground text-lg">
            Built for students, powered by cutting-edge AI infrastructure
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-4 rounded-xl border bg-card p-5 hover:shadow-md transition-shadow"
            >
              <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {item.label}
                </p>
                {item.href ? (
                  <a
                    href={item.href}
                    className="text-sm font-semibold text-primary hover:underline break-all"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-sm font-semibold">{item.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
