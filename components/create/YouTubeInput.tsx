// FILE: components/create/YouTubeInput.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { youtubeUrlSchema, type YouTubeUrlInput } from "@/lib/validations/youtube";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Youtube, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export function YouTubeInput() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<YouTubeUrlInput>({
    resolver: zodResolver(youtubeUrlSchema),
    defaultValues: { url: "" },
  });

  const urlValue = watch("url");

  const onSubmit = async (data: YouTubeUrlInput) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/process/youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to process video");
      }

      toast.success("Processing started!");
      router.push(`/create/processing/${json.data.documentId}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="youtube-url" className="text-base font-medium">
          YouTube Video URL
        </Label>
        <div className="relative">
          <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            id="youtube-url"
            placeholder="https://www.youtube.com/watch?v=..."
            className="pl-10 h-12 text-base"
            {...register("url")}
            disabled={submitting}
          />
        </div>
        {errors.url && (
          <p className="text-sm text-destructive">{errors.url.message}</p>
        )}
        {urlValue && !errors.url && (
          <p className="text-sm text-green-500">Valid YouTube URL</p>
        )}
      </div>

      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="text-sm font-medium mb-2">Supported formats:</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• youtube.com/watch?v=...</li>
          <li>• youtu.be/...</li>
          <li>• youtube.com/shorts/...</li>
          <li>• youtube.com/embed/...</li>
        </ul>
      </div>

      <Button type="submit" disabled={submitting} className="w-full h-12 text-base gap-2">
        {submitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            Generate Study Material
          </>
        )}
      </Button>
    </form>
  );
}
