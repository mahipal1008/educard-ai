// FILE: app/(public)/privacy/page.tsx
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how EduCard AI collects, uses, and protects your personal data. Read our full privacy policy.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="relative overflow-hidden hero-gradient py-20 md:py-28">
          <div className="absolute inset-0 grid-pattern" />
          <div className="mx-auto max-w-4xl px-4 md:px-6 relative text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Privacy Policy
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Effective date: January 1, 2025
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-4 md:px-6">
            <div className="prose-container space-y-12">
              {/* Introduction */}
              <div>
                <p className="text-muted-foreground leading-relaxed">
                  At EduCard AI, your privacy matters to us. This Privacy Policy
                  explains what information we collect, how we use it, who we
                  share it with, and the choices you have. By using our platform
                  you agree to the practices described below.
                </p>
              </div>

              {/* Data We Collect */}
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-4">
                  1. Data We Collect
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We collect the minimum amount of data necessary to provide and
                  improve our service. This includes:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
                  <li>
                    <span className="font-medium text-foreground">
                      Account information
                    </span>{" "}
                    &mdash; your name, email address, and profile details
                    provided during sign-up.
                  </li>
                  <li>
                    <span className="font-medium text-foreground">
                      Uploaded content
                    </span>{" "}
                    &mdash; PDFs, documents, and YouTube URLs you submit for
                    flashcard and summary generation.
                  </li>
                  <li>
                    <span className="font-medium text-foreground">
                      Generated content
                    </span>{" "}
                    &mdash; flashcard decks, summaries, and audio files created
                    by our AI on your behalf.
                  </li>
                  <li>
                    <span className="font-medium text-foreground">
                      Usage data
                    </span>{" "}
                    &mdash; pages visited, features used, timestamps, and
                    general interaction patterns that help us improve the
                    product.
                  </li>
                  <li>
                    <span className="font-medium text-foreground">
                      Device &amp; browser data
                    </span>{" "}
                    &mdash; IP address, browser type, operating system, and
                    screen resolution collected automatically through standard
                    web technologies.
                  </li>
                </ul>
              </div>

              {/* How We Use It */}
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-4">
                  2. How We Use Your Data
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use the data we collect to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
                  <li>
                    Provide, operate, and maintain the EduCard AI platform.
                  </li>
                  <li>
                    Process your uploaded content through our AI pipeline to
                    generate flashcards, summaries, and audio.
                  </li>
                  <li>
                    Personalize your experience and remember your preferences.
                  </li>
                  <li>
                    Analyze usage trends to improve features, performance, and
                    reliability.
                  </li>
                  <li>
                    Communicate important updates, security alerts, and support
                    responses.
                  </li>
                  <li>
                    Enforce our Terms of Service and protect against misuse.
                  </li>
                </ul>
              </div>

              {/* Third-Party Services */}
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-4">
                  3. Third-Party Services
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  To deliver our core functionality, EduCard AI integrates with
                  the following third-party services. Data shared with these
                  providers is limited to what is strictly necessary for the
                  feature to work.
                </p>
                <div className="space-y-4">
                  <div className="rounded-xl border bg-card p-5">
                    <h3 className="font-semibold mb-1">Google Gemini AI</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      We send your uploaded content (text extracted from PDFs
                      and video transcripts) to Google&apos;s Gemini AI models
                      to generate flashcards and summaries. Google&apos;s use
                      of this data is governed by their own privacy policy and
                      data processing terms.
                    </p>
                  </div>
                  <div className="rounded-xl border bg-card p-5">
                    <h3 className="font-semibold mb-1">ElevenLabs TTS</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      When you use the text-to-speech feature, summary text is
                      sent to ElevenLabs to generate audio. ElevenLabs
                      processes this data according to their own privacy policy.
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  We may also use analytics, payment processing, and
                  infrastructure providers in the normal course of operating
                  the service. We do not sell your personal data to any third
                  party.
                </p>
              </div>

              {/* Data Storage */}
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-4">
                  4. Data Storage
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  All user data &mdash; including account information, uploaded
                  content, and generated materials &mdash; is stored securely
                  in{" "}
                  <span className="font-medium text-foreground">Supabase</span>,
                  our hosted PostgreSQL database and storage provider. Supabase
                  enforces encryption at rest and in transit, and its
                  infrastructure runs on trusted cloud platforms with
                  industry-standard security certifications.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We retain your data for as long as your account is active or
                  as needed to provide you with our services. If you delete your
                  account, we will remove your personal data within 30 days,
                  except where retention is required by law.
                </p>
              </div>

              {/* Your Rights */}
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-4">
                  5. Your Rights
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Depending on your jurisdiction, you may have the following
                  rights regarding your personal data:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground leading-relaxed">
                  <li>
                    <span className="font-medium text-foreground">Access</span>{" "}
                    &mdash; request a copy of the personal data we hold about
                    you.
                  </li>
                  <li>
                    <span className="font-medium text-foreground">
                      Correction
                    </span>{" "}
                    &mdash; ask us to correct inaccurate or incomplete data.
                  </li>
                  <li>
                    <span className="font-medium text-foreground">
                      Deletion
                    </span>{" "}
                    &mdash; request that we delete your personal data and
                    account.
                  </li>
                  <li>
                    <span className="font-medium text-foreground">
                      Portability
                    </span>{" "}
                    &mdash; receive your data in a structured, machine-readable
                    format.
                  </li>
                  <li>
                    <span className="font-medium text-foreground">
                      Objection
                    </span>{" "}
                    &mdash; object to certain types of processing, such as
                    direct marketing.
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  To exercise any of these rights, please contact us using the
                  details below. We will respond to your request within 30 days.
                </p>
              </div>

              {/* Contact Us */}
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-4">
                  6. Contact Us
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions or concerns about this Privacy
                  Policy or our data practices, please reach out to us at{" "}
                  <a
                    href="mailto:hello@educardai.com"
                    className="font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
                  >
                    hello@educardai.com
                  </a>
                  . We take every inquiry seriously and will do our best to
                  address your concerns promptly.
                </p>
              </div>

              {/* Closing note */}
              <div className="rounded-xl border bg-muted/30 p-6">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time. When we
                  make changes, we will revise the effective date at the top of
                  this page. We encourage you to review this policy periodically
                  to stay informed about how we protect your information.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
