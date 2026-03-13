// FILE: components/dashboard/RecentDocuments.tsx
"use client";

import Link from "next/link";
import { FileText, Youtube, ArrowRight, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRelativeTime } from "@/lib/utils";
import type { DocumentWithRelations } from "@/types";

interface RecentDocumentsProps {
  documents: DocumentWithRelations[];
  loading: boolean;
}

export function RecentDocuments({ documents, loading }: RecentDocumentsProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="flex-1">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Recent Documents</CardTitle>
        <Link
          href="/library"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-8">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <FileText className="h-7 w-7 text-primary" />
            </div>
            <h4 className="font-medium mb-1">No documents yet</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first document from a YouTube video or PDF
            </p>
            <Link href="/create">
              <Button size="sm" className="gap-2">
                <ArrowRight className="h-3.5 w-3.5" /> Create First Document
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.slice(0, 5).map((doc) => (
              <Link
                key={doc.id}
                href={`/document/${doc.id}`}
                className="flex items-center gap-4 rounded-lg p-3 hover:bg-muted/50 transition-colors"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg shrink-0 ${
                    doc.type === "youtube"
                      ? "bg-red-500/10 text-red-500"
                      : "bg-blue-500/10 text-blue-500"
                  }`}
                >
                  {doc.type === "youtube" ? (
                    <Youtube className="h-5 w-5" />
                  ) : (
                    <FileText className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{doc.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(doc.created_at)}
                    </span>
                  </div>
                </div>
                <Badge
                  variant={
                    doc.status === "completed"
                      ? "default"
                      : doc.status === "processing"
                      ? "secondary"
                      : "destructive"
                  }
                  className="shrink-0 text-xs"
                >
                  {doc.status}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
