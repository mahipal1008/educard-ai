// FILE: lib/services/youtube-transcript.ts

import { YoutubeTranscript } from "youtube-transcript";

interface TranscriptResult {
  text: string;
  title: string;
  videoId: string;
}

export class YouTubeTranscriptService {
  /**
   * Extracts YouTube video ID from various URL formats
   */
  static extractVideoId(url: string): string | null {
    const patterns = [
      // Standard: youtube.com/watch?v=ID
      /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
      // Short: youtu.be/ID
      /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      // Embed: youtube.com/embed/ID
      /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      // Shorts: youtube.com/shorts/ID
      /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
      // Just the ID itself
      /^([a-zA-Z0-9_-]{11})$/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }

    return null;
  }

  /**
   * Fetches transcript from a YouTube video
   */
  static async getTranscript(url: string): Promise<TranscriptResult> {
    const videoId = this.extractVideoId(url);
    if (!videoId) {
      throw new Error("Invalid YouTube URL. Could not extract video ID.");
    }

    try {
      const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);

      if (!transcriptItems || transcriptItems.length === 0) {
        throw new Error(
          "No transcript available for this video. The video may have transcripts disabled, be private, or be region-blocked."
        );
      }

      // Join all transcript snippets, stripping timestamps
      const text = transcriptItems
        .map((item) => item.text)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

      if (!text || text.length < 50) {
        throw new Error(
          "Transcript is too short or empty. The video may not contain enough spoken content."
        );
      }

      // Try to extract title from the video (we'll use the URL for now)
      const title = `YouTube Video - ${videoId}`;

      return {
        text,
        title,
        videoId,
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("Transcript is disabled")) {
          throw new Error(
            "Transcripts are disabled for this video. Please try a different video."
          );
        }
        if (error.message.includes("Video unavailable")) {
          throw new Error(
            "This video is unavailable. It may be private, deleted, or region-blocked."
          );
        }
        throw error;
      }
      throw new Error("Failed to fetch transcript. Please try again.");
    }
  }
}
