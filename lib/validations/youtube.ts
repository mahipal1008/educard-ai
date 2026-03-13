// FILE: lib/validations/youtube.ts

import { z } from "zod";

const youtubeUrlRegex =
  /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[?&].*)?$/;

export const youtubeUrlSchema = z.object({
  url: z
    .string()
    .min(1, "YouTube URL is required")
    .refine((url) => youtubeUrlRegex.test(url), {
      message:
        "Please enter a valid YouTube URL (e.g., https://youtube.com/watch?v=...)",
    }),
});

export type YouTubeUrlInput = z.infer<typeof youtubeUrlSchema>;

/**
 * Validates a YouTube URL and returns the video ID
 */
export function isValidYouTubeUrl(url: string): boolean {
  return youtubeUrlRegex.test(url);
}
