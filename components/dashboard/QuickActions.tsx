// FILE: components/dashboard/QuickActions.tsx
import Link from "next/link";
import { Youtube, FileUp, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function QuickActions() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Link href="/create?tab=youtube">
        <Card className="group cursor-pointer hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/5 transition-all">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-500/10 text-red-500 shrink-0">
              <Youtube className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">New from YouTube</h3>
              <p className="text-sm text-muted-foreground">Paste a video URL to generate study material</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </CardContent>
        </Card>
      </Link>

      <Link href="/create?tab=pdf">
        <Card className="group cursor-pointer hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
              <FileUp className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Upload PDF</h3>
              <p className="text-sm text-muted-foreground">Upload a document to create flashcards & quizzes</p>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
