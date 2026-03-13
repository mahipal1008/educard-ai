// FILE: app/(dashboard)/settings/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, CreditCard, Shield, Loader2, SlidersHorizontal, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Profile } from "@/types";
import Link from "next/link";

const profileSchema = z.object({
  full_name: z.string().min(1, "Name is required").max(100),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface AIPreferences {
  difficulty: "easy" | "medium" | "hard" | "adaptive";
  cardDensity: "fewer" | "standard" | "more";
  summaryMode: "default" | "bullet" | "cornell" | "outline" | "mindmap";
  focusAreas: string;
  quizStyle: "conceptual" | "factual" | "application" | "mixed";
}

const defaultPrefs: AIPreferences = {
  difficulty: "medium",
  cardDensity: "standard",
  summaryMode: "default",
  focusAreas: "",
  quizStyle: "mixed",
};

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aiPrefs, setAiPrefs] = useState<AIPreferences>(defaultPrefs);
  const [savingAI, setSavingAI] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/user/profile");
        const json = await res.json();
        if (json.data) {
          setProfile(json.data);
          reset({ full_name: json.data.full_name || "" });
        }
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();

    // Load AI preferences from localStorage
    try {
      const stored = localStorage.getItem("educard-ai-prefs");
      if (stored) setAiPrefs({ ...defaultPrefs, ...JSON.parse(stored) });
    } catch {
      // use defaults
    }
  }, [reset]);

  const onSubmit = async (data: ProfileFormData) => {
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setProfile(json.data);
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const saveAIPrefs = async () => {
    setSavingAI(true);
    try {
      const res = await fetch("/api/user/ai-preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aiPrefs),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to save AI preferences");
      }
      localStorage.setItem("educard-ai-prefs", JSON.stringify(aiPrefs));
      toast.success("AI preferences saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save AI preferences");
    } finally {
      setSavingAI(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in-up">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences.</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" /> Profile
          </CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile?.avatar_url ?? undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{profile?.full_name || "User"}</p>
              <p className="text-sm text-muted-foreground">
                Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                placeholder="Your name"
                {...register("full_name")}
              />
              {errors.full_name && (
                <p className="text-sm text-destructive">{errors.full_name.message}</p>
              )}
            </div>
            <Button type="submit" disabled={saving} className="gap-2">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* AI Model Adjustment */}
      <Card className="border-2 border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-primary" />
            AI Model Adjustment
            <Badge variant="secondary" className="ml-2 text-xs gap-1">
              <Sparkles className="h-3 w-3" /> New
            </Badge>
          </CardTitle>
          <CardDescription>
            Fine-tune how AI generates your study materials. These preferences apply to all new content.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Difficulty Level</Label>
            <Select
              value={aiPrefs.difficulty}
              onValueChange={(v) => setAiPrefs((p) => ({ ...p, difficulty: v as AIPreferences["difficulty"] }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy — Simple language, basic concepts</SelectItem>
                <SelectItem value="medium">Medium — Standard academic level</SelectItem>
                <SelectItem value="hard">Hard — Advanced, exam-level depth</SelectItem>
                <SelectItem value="adaptive">Adaptive — AI adjusts based on performance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Flashcard Density</Label>
            <Select
              value={aiPrefs.cardDensity}
              onValueChange={(v) => setAiPrefs((p) => ({ ...p, cardDensity: v as AIPreferences["cardDensity"] }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fewer">Fewer Cards — Key concepts only (~5-8)</SelectItem>
                <SelectItem value="standard">Standard — Balanced coverage (~10-15)</SelectItem>
                <SelectItem value="more">More Cards — Detailed coverage (~20-25)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Default Summary Style</Label>
            <Select
              value={aiPrefs.summaryMode}
              onValueChange={(v) => setAiPrefs((p) => ({ ...p, summaryMode: v as AIPreferences["summaryMode"] }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default — TL;DR + Key Points + Terms</SelectItem>
                <SelectItem value="bullet">Bullet Points — Concise bullet format</SelectItem>
                <SelectItem value="cornell">Cornell Notes — Questions + Notes + Summary</SelectItem>
                <SelectItem value="outline">Outline — Hierarchical structure</SelectItem>
                <SelectItem value="mindmap">Mind Map — Central topic with branches</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Quiz Question Style</Label>
            <Select
              value={aiPrefs.quizStyle}
              onValueChange={(v) => setAiPrefs((p) => ({ ...p, quizStyle: v as AIPreferences["quizStyle"] }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mixed">Mixed — All question types</SelectItem>
                <SelectItem value="conceptual">Conceptual — Understanding & reasoning</SelectItem>
                <SelectItem value="factual">Factual — Definitions & recall</SelectItem>
                <SelectItem value="application">Application — Problem solving & examples</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="focus-areas">Focus Areas (optional)</Label>
            <Input
              id="focus-areas"
              placeholder="e.g. cell biology, thermodynamics, organic chemistry"
              value={aiPrefs.focusAreas}
              maxLength={500}
              onChange={(e) => setAiPrefs((p) => ({ ...p, focusAreas: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground">
              Comma-separated topics the AI should emphasize when generating content.
            </p>
          </div>

          <Separator />

          <Button onClick={saveAIPrefs} disabled={savingAI} className="gap-2">
            {savingAI && <Loader2 className="h-4 w-4 animate-spin" />}
            Save AI Preferences
          </Button>
        </CardContent>
      </Card>

      {/* Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" /> Subscription
          </CardTitle>
          <CardDescription>Your current plan and usage.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold">Current Plan</p>
              <Badge className="mt-1 capitalize">{profile?.plan || "free"}</Badge>
            </div>
            {profile?.plan === "free" && (
              <Link href="/pricing">
                <Button size="sm">Upgrade to Pro</Button>
              </Link>
            )}
          </div>
          <Separator className="my-4" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Documents today</span>
              <span className="font-medium">{profile?.daily_credits_used ?? 0} / {profile?.plan === "pro" ? "∞" : "5"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Shield className="h-5 w-5" /> Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleSignOut} className="text-destructive hover:bg-destructive/10">
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
