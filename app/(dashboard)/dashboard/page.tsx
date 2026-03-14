// FILE: app/(dashboard)/dashboard/page.tsx
"use client";

export const runtime = "edge";

import { useState, useEffect } from "react";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { RecentDocuments } from "@/components/dashboard/RecentDocuments";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { WelcomeOnboarding } from "@/components/dashboard/WelcomeOnboarding";
import { WeakTopicDashboard } from "@/components/WeakTopicDashboard";
import { SmartStudyButton } from "@/components/SmartStudyButton";
import { toast } from "sonner";
import type { UserStats, DocumentWithRelations } from "@/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [documents, setDocuments] = useState<DocumentWithRelations[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, docsRes, profileRes] = await Promise.all([
          fetch("/api/user/stats"),
          fetch("/api/documents"),
          fetch("/api/user/profile"),
        ]);

        const statsJson = await statsRes.json();
        const docsJson = await docsRes.json();
        const profileJson = await profileRes.json();

        if (statsJson.data) setStats(statsJson.data);
        if (docsJson.data) setDocuments(docsJson.data);
        if (profileJson.data?.full_name) setUserName(profileJson.data.full_name);
      } catch {
        toast.error("Failed to load dashboard data. Please refresh the page.");
      } finally {
        setLoadingStats(false);
        setLoadingDocs(false);
      }
    };

    fetchData();
  }, []);

  // Show onboarding for new users with no documents
  const isNewUser = !loadingDocs && documents.length === 0;

  if (isNewUser) {
    return <WelcomeOnboarding userName={userName} />;
  }

  return (
    <div className="space-y-8 animate-in-up">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">
          {userName ? `Welcome back, ${userName.split(" ")[0]}` : "Welcome back"}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s an overview of your study progress.
        </p>
      </div>

      {/* Stats */}
      <StatsRow stats={stats} loading={loadingStats} />

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <QuickActions />
      </div>

      {/* Recent documents */}
      <RecentDocuments documents={documents} loading={loadingDocs} />

      {/* Topic performance & Smart study */}
      <div className="grid gap-6 md:grid-cols-2">
        <WeakTopicDashboard />
        <SmartStudyButton />
      </div>
    </div>
  );
}
