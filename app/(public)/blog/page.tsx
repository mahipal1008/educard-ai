// FILE: app/(public)/blog/page.tsx
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Blog | EduCard AI",
  description:
    "How We Used GPU-Accelerated AI to Build a Smarter Flashcard System",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero / Header */}
        <section className="border-b bg-muted/30">
          <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to home
            </Link>

            <div className="flex flex-wrap items-center gap-2 mb-6">
              <Badge variant="outline" className="text-xs">
                Engineering
              </Badge>
              <Badge variant="outline" className="text-xs">
                AI / ML
              </Badge>
              <Badge variant="outline" className="text-xs">
                Product
              </Badge>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl leading-[1.15]">
              How We Used GPU-Accelerated AI to Build a Smarter Flashcard System
            </h1>

            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl">
              A deep dive into the infrastructure and AI models powering
              EduCard AI &mdash; from video ingestion to voice-enabled
              flashcards.
            </p>

            {/* Author & meta */}
            <div className="mt-10 flex items-center gap-4">
              {/* Circular avatar with initials */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                RR
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">
                   Ravi Roy
                </span>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    March 2025
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    4 min read
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Article body */}
        <article className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
          <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:tracking-tight prose-headings:font-semibold prose-p:leading-relaxed prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
            <p className="text-lg leading-relaxed text-muted-foreground">
              At EduCard AI, our mission is straightforward: turn any learning
              resource into structured, retention-optimized study material in
              seconds. Behind that simplicity lies a sophisticated pipeline that
              combines large language models, GPU-accelerated inference, and
              multi-modal input processing. Here is how we built it.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-12 mb-4">
              The Problem: Unstructured Knowledge Everywhere
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Students consume hours of YouTube lectures, sift through dense
              PDFs, and attend live sessions &mdash; yet most of that
              information never makes it into a reviewable format. Manual
              flashcard creation is tedious and inconsistent. We wanted an
              engine that could accept a YouTube URL, a PDF upload, or even raw
              voice input and produce high-quality flashcards, quizzes, and
              summaries automatically.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-12 mb-4">
              The AI Engine: NVIDIA NIM at the Core
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We chose the <strong>NVIDIA NIM API</strong> as our primary
              inference platform. NIM&apos;s GPU-accelerated models allow us to
              process both text and visual content from PDFs in a single
              inference call, dramatically reducing latency. For YouTube
              content, we extract transcripts and feed them through Llama 3.1 70B with
              custom prompts engineered for educational content extraction. The
              model identifies key concepts, generates question-answer pairs,
              and produces concise summaries &mdash; all calibrated to the
              source material&apos;s difficulty level.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-12 mb-4">
              GPU Infrastructure: Speed That Students Expect
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Processing a 45-minute lecture transcript or a 100-page PDF needs
              to feel instant. Our backend leverages{" "}
              <strong>NVIDIA GPU infrastructure</strong> to accelerate the
              heaviest parts of the pipeline &mdash; embedding generation for
              semantic chunking, parallel prompt execution, and real-time
              document parsing. By batching inference requests and utilizing
              GPU memory efficiently, we keep median processing time under ten
              seconds for most documents, even during peak usage.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-12 mb-4">
              Voice-First Learning with ElevenLabs TTS
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Not every study session happens at a desk. We integrated{" "}
              <strong>ElevenLabs text-to-speech</strong> to let students listen
              to their flashcards and summaries while commuting, exercising, or
              doing chores. ElevenLabs&apos; neural voice models produce
              natural, clear narration that makes audio review genuinely
              effective rather than robotic. On the input side, students can
              also dictate notes via voice, which our pipeline transcribes and
              converts into structured study material through the same NIM
              processing layer.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-12 mb-4">
              Putting It All Together
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The result is a seamless loop: upload or link your content, let
              GPU-accelerated AI break it down, review flashcards with spaced
              repetition, quiz yourself, and listen on the go. Every layer of
              the stack &mdash; from NIM&apos;s language understanding to
              NVIDIA&apos;s compute power to ElevenLabs&apos; voice
              synthesis &mdash; is chosen to minimize friction between
              encountering information and actually retaining it. We believe
              the best study tool is the one you actually use, and speed,
              accuracy, and accessibility are what make that possible.
            </p>
          </div>

          <Separator className="my-12" />

          {/* Author card at bottom */}
          <div className="flex items-start gap-4 rounded-xl border bg-muted/40 p-6">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
              RR
            </div>
            <div>
              <p className="font-semibold text-foreground"> Ravi Roy</p>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                Builder of EduCard AI. Passionate about making education
                accessible through artificial intelligence and modern web
                technology.
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
