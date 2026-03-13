// FILE: components/create/ProcessingStatus.tsx
"use client";

import { CheckCircle2, Circle, Loader2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type StepStatus = "pending" | "active" | "completed" | "failed";

interface ProcessingStep {
  label: string;
  status: StepStatus;
}

interface ProcessingStatusProps {
  steps: ProcessingStep[];
}

export function ProcessingStatus({ steps }: ProcessingStatusProps) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center gap-4">
          <div className="relative flex items-center justify-center">
            {step.status === "completed" && (
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            )}
            {step.status === "active" && (
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            )}
            {step.status === "pending" && (
              <Circle className="h-6 w-6 text-muted-foreground/40" />
            )}
            {step.status === "failed" && (
              <XCircle className="h-6 w-6 text-destructive" />
            )}
          </div>
          <span
            className={cn(
              "text-sm font-medium transition-colors",
              step.status === "completed" && "text-green-500",
              step.status === "active" && "text-foreground",
              step.status === "pending" && "text-muted-foreground",
              step.status === "failed" && "text-destructive"
            )}
          >
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
}
