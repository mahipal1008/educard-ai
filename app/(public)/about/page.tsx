// FILE: app/(public)/about/page.tsx
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Heart,
  Cpu,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Calendar,
  Layers,
  Target,
  Copy,
  Check,
  Users,
  Building2,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const values = [
  {
    icon: Heart,
    label: "Student-first design",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    icon: Cpu,
    label: "GPU-powered accuracy",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Globe,
    label: "Built for global learners",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
];

const team = [
  {
    name: "Ravi Roy",
    initials: "RR",
    role: "Founder, CEO & Full-Stack Developer",
    bio: "Full-stack engineer and AI builder. Building EduCard AI to make exam prep smarter for every student in India and beyond.",
    gradient: "from-violet-500 to-fuchsia-500",
    linkedin: "https://www.linkedin.com/in/ravi-roy-ai/",
  },
];

const companyInfo = [
  {
    icon: Calendar,
    label: "Founded",
    value: "2025",
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Delhi, India (Global)",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Mail,
    label: "Email",
    value: "raviray@educard-ai.indevs.in",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Building2,
    label: "Status",
    value: "NVIDIA Inception Partner",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    icon: Layers,
    label: "Stack",
    value: "Next.js, NVIDIA NIM, PostgreSQL, Cloudflare",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    icon: Target,
    label: "Mission",
    value: "GPU-accelerated personalized learning",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AboutPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText("raviray@educard-ai.indevs.in");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* ── Section 1: Page Header ── */}
        <section className="relative overflow-hidden hero-gradient py-24 md:py-32">
          <div className="absolute inset-0 grid-pattern" />
          <div className="mx-auto max-w-7xl px-4 md:px-6 relative">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full border bg-primary/5 px-5 py-2 text-sm font-medium text-primary mb-8">
                <Users className="h-4 w-4" />
                About Us
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                We&apos;re building the future of{" "}
                <span className="gradient-text-animated">
                  personalized learning
                </span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto leading-relaxed">
                EduCard AI was founded in 2025 with a single mission: make
                world-class exam preparation accessible to every student,
                everywhere&nbsp;&mdash; powered by cutting-edge AI and
                GPU-accelerated infrastructure.
              </p>
            </div>
          </div>
        </section>

        {/* ── Section 2: Mission & Values ── */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              {/* Left — mission statement */}
              <div>
                <Badge variant="outline" className="mb-6 gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  Our Mission
                </Badge>
                <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl leading-tight">
                  Every student deserves an AI tutor that adapts to how{" "}
                  <span className="text-primary">THEY</span> learn.
                </h2>
                <p className="mt-6 text-muted-foreground text-lg leading-relaxed max-w-lg">
                  We combine large language models, spaced repetition science,
                  and GPU-accelerated inference so that every flashcard, quiz,
                  and summary is personalised to the way you study best.
                </p>
              </div>

              {/* Right — value bullets */}
              <div className="space-y-5">
                {values.map((v) => (
                  <div
                    key={v.label}
                    className="group flex items-center gap-5 rounded-2xl border bg-card p-5 transition-all duration-300 hover-lift"
                  >
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${v.bg}`}
                    >
                      <v.icon className={`h-7 w-7 ${v.color}`} />
                    </div>
                    <span className="text-lg font-semibold">{v.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 3: Team ── */}
        <section className="py-20 md:py-28 bg-muted/30 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-6 gap-1.5">
                <Users className="h-3.5 w-3.5" />
                Meet the Team
              </Badge>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                The people behind{" "}
                <span className="gradient-text-animated">EduCard AI</span>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
                A small, passionate crew on a mission to reinvent how students
                study.
              </p>
            </div>

            <div className="flex justify-center">
              {team.map((member) => (
                <Card
                  key={member.name}
                  className="relative overflow-hidden border-2 transition-all duration-300 hover-lift bg-card w-full max-w-sm"
                >
                  <CardContent className="flex flex-col items-center text-center pt-8 pb-6">
                    {/* Avatar with gradient ring */}
                    <div
                      className={`mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br ${member.gradient} p-[3px]`}
                    >
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-card text-2xl font-bold tracking-wide">
                        {member.initials}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold">{member.name}</h3>
                    <p className="mt-1 text-sm font-medium text-primary">
                      {member.role}
                    </p>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed px-2">
                      {member.bio}
                    </p>

                    {/* Social icons */}
                    <div className="mt-5 flex items-center gap-3">
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-colors"
                        aria-label={`${member.name} LinkedIn`}
                      >
                        <Linkedin className="h-4 w-4 text-muted-foreground" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 4: Company Info Grid ── */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-6 gap-1.5">
                <Building2 className="h-3.5 w-3.5" />
                Company
              </Badge>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                At a glance
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {companyInfo.map((item) => (
                <div
                  key={item.label}
                  className="group relative overflow-hidden rounded-2xl border-2 bg-card p-6 transition-all duration-300 hover-lift"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.bg}`}
                    >
                      <item.icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {item.label}
                      </p>
                      <p className="mt-1 text-base font-semibold leading-snug">
                        {item.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 5: Contact / Email CTA ── */}
        <section className="py-20 md:py-28 bg-muted/30 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="mx-auto max-w-3xl px-4 md:px-6 text-center">
            <Badge variant="outline" className="mb-6 gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              Get in Touch
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              We&apos;d love to hear from you
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              Whether you have feedback, partnership ideas, or just want to say
              hello&nbsp;&mdash; drop us a line.
            </p>

            {/* Large styled email */}
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 rounded-2xl border-2 bg-card px-8 py-6">
              <a
                href="mailto:raviray@educard-ai.indevs.in"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-primary hover:underline underline-offset-4 transition-colors"
              >
                raviray@educard-ai.indevs.in              </a>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 shrink-0"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
