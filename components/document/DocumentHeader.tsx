// FILE: components/document/DocumentHeader.tsx
import { Youtube, FileText, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { Document } from "@/types";

interface DocumentHeaderProps {
  document: Document;
}

export function DocumentHeader({ document }: DocumentHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl shrink-0 ${
            document.type === "youtube"
              ? "bg-red-500/10 text-red-500"
              : "bg-blue-500/10 text-blue-500"
          }`}
        >
          {document.type === "youtube" ? (
            <Youtube className="h-6 w-6" />
          ) : (
            <FileText className="h-6 w-6" />
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{document.title}</h1>
          <div className="flex items-center gap-3 mt-2">
            <Badge variant="outline" className="capitalize">
              {document.type}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(document.created_at)}
            </div>
            {document.word_count && (
              <span className="text-sm text-muted-foreground">
                {document.word_count.toLocaleString()} words
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
