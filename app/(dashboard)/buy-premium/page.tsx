// FILE: app/(dashboard)/buy-premium/page.tsx
"use client";

export const runtime = "edge";

import { useState } from "react";
import { Check, Zap, Crown, Shield, ArrowLeft, Sparkles, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";

const plans = [
  {
    id: "pro-monthly",
    name: "Pro Monthly",
    price: 9,
    period: "month",
    features: [
      "Unlimited flashcard decks",
      "Voice Doubt Solver",
      "Image Q&A with AI Vision",
      "Multilingual translation (20+ languages)",
      "Exam Predictor",
      "Priority AI processing",
      "Unlimited quizzes & summaries",
    ],
  },
  {
    id: "pro-yearly",
    name: "Pro Yearly",
    price: 79,
    period: "year",
    savings: "Save $29/year",
    features: [
      "Everything in Pro Monthly",
      "2 months free",
      "Early access to new features",
      "Priority support",
    ],
  },
];

export default function BuyPremiumPage() {
  const [selectedPlan, setSelectedPlan] = useState("pro-monthly");
  const [isProcessing, setIsProcessing] = useState(false);

  const activePlan = plans.find((p) => p.id === selectedPlan);

  const handleCheckout = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast.success("Payment integration coming soon! You'll be notified when Pro is available.", {
      description: "For now, enjoy all features free during our launch period.",
      duration: 5000,
    });

    setIsProcessing(false);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
      {/* Back button */}
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-4">
          <Crown className="h-4 w-4" />
          Upgrade to Pro
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Unlock the full power of{" "}
          <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            EduCard AI
          </span>
        </h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-xl mx-auto">
          Get unlimited AI-powered studying with advanced features.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Plan selection */}
        <div className="lg:col-span-3 space-y-4">
          {/* Plan cards */}
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`w-full text-left rounded-xl border-2 p-5 transition-all ${
                selectedPlan === plan.id
                  ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                  : "border-border hover:border-muted-foreground/30"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                    selectedPlan === plan.id ? "border-primary" : "border-muted-foreground/40"
                  }`}>
                    {selectedPlan === plan.id && (
                      <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className="text-lg font-semibold">{plan.name}</span>
                  {plan.savings && (
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                      {plan.savings}
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
              </div>

              <ul className="grid gap-1.5 sm:grid-cols-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </button>
          ))}

          {/* Features comparison */}
          <Card className="mt-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                What you get with Pro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Flashcard Decks", free: "10/month", pro: "Unlimited" },
                  { label: "Quiz Generation", free: "Basic", pro: "Advanced + Explanations" },
                  { label: "Voice Doubt Solver", free: "No", pro: "Yes" },
                  { label: "Image Q&A", free: "No", pro: "Yes" },
                  { label: "Exam Predictor", free: "No", pro: "Yes" },
                  { label: "Languages", free: "English only", pro: "20+ languages" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm">
                    <span className="font-medium">{row.label}</span>
                    <span className="text-primary font-semibold">{row.pro}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Checkout summary */}
        <div className="lg:col-span-2">
          <Card className="sticky top-20 border-2 border-primary/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Plan details */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{activePlan?.name}</span>
                  <span className="font-semibold">${activePlan?.price}/{activePlan?.period}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">${activePlan?.price}/{activePlan?.period}</span>
                </div>
              </div>

              {/* Payment form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card">Card Number</Label>
                  <Input id="card" placeholder="4242 4242 4242 4242" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" />
                  </div>
                </div>
              </div>

              {/* Checkout button */}
              <Button
                className="w-full h-12 text-base font-semibold gap-2"
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Subscribe — ${activePlan?.price}/{activePlan?.period}
                  </>
                )}
              </Button>

              {/* Trust signals */}
              <div className="space-y-2 text-center">
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-3.5 w-3.5" />
                  Secure payment powered by Stripe
                </div>
                <p className="text-xs text-muted-foreground">
                  Cancel anytime. 7-day money-back guarantee.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
