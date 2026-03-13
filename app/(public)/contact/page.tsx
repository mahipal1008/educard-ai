"use client";

import { useState, type FormEvent } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Mail,
  Twitter,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General",
    message: "",
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden hero-gradient py-24 md:py-32">
          <div className="absolute inset-0 grid-pattern" />
          <div className="mx-auto max-w-7xl px-4 md:px-6 relative">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full border bg-primary/5 px-5 py-2 text-sm font-medium text-primary mb-8">
                <MessageSquare className="h-4 w-4" />
                Contact
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Get in touch
              </h1>
              <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto leading-relaxed">
                Have a question, partnership idea, or just want to say hi?
              </p>
            </div>
          </div>
        </section>

        {/* Form + Info */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-5">
              {/* Form Column */}
              <div className="lg:col-span-3">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center rounded-2xl border bg-card p-12 text-center">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 mb-6">
                      <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">
                      Message sent!
                    </h2>
                    <p className="text-muted-foreground max-w-sm mb-8">
                      Thanks for reaching out. We&apos;ll get back to you
                      within 24 hours.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: "",
                          email: "",
                          subject: "General",
                          message: "",
                        });
                      }}
                    >
                      Send another message
                    </Button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-2xl border bg-card p-8"
                  >
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30"
                      >
                        <option value="General">General</option>
                        <option value="Partnership">Partnership</option>
                        <option value="Press">Press</option>
                        <option value="Bug Report">Bug Report</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="How can we help you?"
                        rows={5}
                        required
                        value={formData.message}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Submit */}
                    <Button type="submit" size="lg" className="gap-2 w-full">
                      <Send className="h-4 w-4" />
                      Send Message
                    </Button>
                  </form>
                )}
              </div>

              {/* Info Column */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">
                      Company Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Email */}
                    <div className="flex items-start gap-4">
                      <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <a
                          href="mailto:hello@educardai.com"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          hello@educardai.com
                        </a>
                      </div>
                    </div>

                    {/* Twitter */}
                    <div className="flex items-start gap-4">
                      <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-500/10">
                        <Twitter className="h-5 w-5 text-sky-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Twitter</p>
                        <a
                          href="https://twitter.com/educardai"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-muted-foreground hover:text-sky-500 transition-colors"
                        >
                          @educardai
                        </a>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-4">
                      <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                        <MapPin className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">
                          Bhagalpur, India
                        </p>
                      </div>
                    </div>

                    {/* Response Time */}
                    <div className="flex items-start gap-4">
                      <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
                        <Clock className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Response time</p>
                        <p className="text-sm text-muted-foreground">
                          We reply within 24 hours
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
