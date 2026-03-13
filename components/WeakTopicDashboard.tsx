// FILE: components/WeakTopicDashboard.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

interface TopicScore {
  topic: string;
  total: number;
  correct: number;
  percentage: number;
}

const STORAGE_KEY = "educard_topic_scores";

export function getTopicScores(): TopicScore[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function recordTopicAttempt(topic: string, correct: boolean) {
  if (typeof window === "undefined") return;
  const scores = getTopicScores();
  const existing = scores.find(
    (s) => s.topic.toLowerCase() === topic.toLowerCase()
  );

  if (existing) {
    existing.total += 1;
    if (correct) existing.correct += 1;
    existing.percentage = Math.round((existing.correct / existing.total) * 100);
  } else {
    scores.push({
      topic,
      total: 1,
      correct: correct ? 1 : 0,
      percentage: correct ? 100 : 0,
    });
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
}

export function getWeakTopics(): string[] {
  return getTopicScores()
    .filter((s) => s.percentage < 60 && s.total >= 2)
    .map((s) => s.topic);
}

function getBarColor(pct: number): string {
  if (pct < 60) return "bg-red-500";
  if (pct < 80) return "bg-amber-500";
  return "bg-emerald-500";
}

function getStatusIcon(pct: number) {
  if (pct < 60) return <TrendingDown className="h-4 w-4 text-red-500" />;
  if (pct < 80) return <AlertTriangle className="h-4 w-4 text-amber-500" />;
  return <TrendingUp className="h-4 w-4 text-emerald-500" />;
}

export function WeakTopicDashboard() {
  const [scores, setScores] = useState<TopicScore[]>([]);

  useEffect(() => {
    setScores(getTopicScores());
  }, []);

  if (scores.length === 0) {
    return null;
  }

  const sorted = [...scores].sort((a, b) => a.percentage - b.percentage);
  const weakCount = sorted.filter((s) => s.percentage < 60).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            Topic Performance
          </CardTitle>
          {weakCount > 0 && (
            <Badge variant="outline" className="text-xs bg-red-500/10 text-red-500 border-red-500/20">
              {weakCount} weak {weakCount === 1 ? "topic" : "topics"}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {sorted.map((score) => (
          <div key={score.topic} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                {getStatusIcon(score.percentage)}
                <span className="font-medium">{score.topic}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {score.correct}/{score.total} ({score.percentage}%)
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${getBarColor(score.percentage)}`}
                style={{ width: `${score.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
