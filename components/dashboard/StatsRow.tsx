// FILE: components/dashboard/StatsRow.tsx
"use client";

import { FileText, BrainCircuit, Trophy, Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { UserStats } from "@/types";

interface StatsRowProps {
  stats: UserStats | null;
  loading: boolean;
}

const statItems = [
  { key: "totalDocuments" as const, label: "Documents", icon: FileText, color: "text-blue-500 bg-blue-500/10" },
  { key: "totalCardsStudied" as const, label: "Cards Today", icon: BrainCircuit, color: "text-purple-500 bg-purple-500/10" },
  { key: "totalQuizzesTaken" as const, label: "Quizzes Taken", icon: Trophy, color: "text-green-500 bg-green-500/10" },
  { key: "studyStreak" as const, label: "Day Streak", icon: Flame, color: "text-orange-500 bg-orange-500/10" },
];

export function StatsRow({ stats, loading }: StatsRowProps) {
  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {statItems.map((item) => (
        <Card key={item.key}>
          <CardContent className="flex items-center gap-4 p-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg shrink-0 ${item.color}`}>
              <item.icon className="h-6 w-6" />
            </div>
            <div>
              {loading ? (
                <>
                  <Skeleton className="h-7 w-12 mb-1" />
                  <Skeleton className="h-4 w-20" />
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">{stats?.[item.key] ?? 0}</div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
