// FILE: app/(dashboard)/library/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { FileText, Youtube, Trash2, ExternalLink, Search, SlidersHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import type { DocumentWithRelations, DocumentType } from "@/types";

type SortBy = "newest" | "oldest" | "title";
type FilterBy = "all" | DocumentType;

export default function LibraryPage() {
  const [documents, setDocuments] = useState<DocumentWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterBy>("all");
  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await fetch("/api/documents");
        const json = await res.json();
        if (json.data) setDocuments(json.data);
      } catch {
        setFetchError(true);
        toast.error("Failed to load documents");
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  const filteredDocuments = useMemo(() => {
    let result = documents;

    // Filter by type
    if (filter !== "all") {
      result = result.filter((doc) => doc.type === filter);
    }

    // Filter by search
    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter((doc) =>
        doc.title.toLowerCase().includes(lowerSearch)
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return a.title.localeCompare(b.title);
    });

    return result;
  }, [documents, filter, search, sortBy]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/documents/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setDocuments((prev) => prev.filter((d) => d.id !== deleteId));
      toast.success("Document deleted");
    } catch {
      toast.error("Failed to delete document");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in-up">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">Library</h1>
        <p className="text-muted-foreground mt-1">All your documents and study material.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={(v) => setFilter(v as FilterBy)}>
            <SelectTrigger className="w-[130px]">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortBy)}>
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Document grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <Skeleton className="h-10 w-10 rounded-lg mb-4" />
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="text-center py-20">
          <div className="relative mx-auto w-fit mb-6">
            <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <FileText className="h-10 w-10 text-primary" />
            </div>
            {(search || filter !== "all") && (
              <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                <Search className="h-3 w-3 text-muted-foreground" />
              </div>
            )}
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {search || filter !== "all" ? "No matching documents" : fetchError ? "Failed to load documents" : "Your library is empty"}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            {search || filter !== "all"
              ? "Try adjusting your search or filters to find what you're looking for."
              : fetchError
              ? "Something went wrong while loading your documents. Please try refreshing the page."
              : "Start by creating your first document from a YouTube video or PDF. Your study materials will appear here."}
          </p>
          {search || filter !== "all" ? (
            <Button variant="outline" onClick={() => { setSearch(""); setFilter("all"); }}>
              Clear Filters
            </Button>
          ) : (
            <Link href="/create">
              <Button className="gap-2">Create Your First Document</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="group hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
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
                  <Badge
                    variant={
                      doc.status === "completed"
                        ? "default"
                        : doc.status === "processing"
                        ? "secondary"
                        : doc.status === "failed"
                        ? "destructive"
                        : "outline"
                    }
                    className="text-xs"
                  >
                    {doc.status}
                  </Badge>
                </div>

                <h3 className="font-semibold truncate mb-1">{doc.title}</h3>
                <p className="text-xs text-muted-foreground mb-1">{formatDate(doc.created_at)}</p>
                {doc.deck && (
                  <p className="text-xs text-muted-foreground">{doc.deck.card_count} cards</p>
                )}

                <div className="flex gap-2 mt-4">
                  <Link href={`/document/${doc.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full gap-1">
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={(e) => {
                      e.preventDefault();
                      setDeleteId(doc.id);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete document?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this document and all its flashcards, quizzes, and study progress. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
