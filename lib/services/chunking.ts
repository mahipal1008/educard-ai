// FILE: lib/services/chunking.ts

const TARGET_CHUNK_SIZE = 12000; // ~3000 tokens
const OVERLAP_SIZE = 200;

export class ChunkingService {
  /**
   * Splits long text into chunks by paragraph boundaries.
   * Target chunk size: ~3000 tokens (~12,000 characters).
   * Maintains 200-character overlap between chunks for context continuity.
   */
  static splitText(text: string): string[] {
    if (!text || text.trim().length === 0) {
      return [];
    }

    // If text is small enough, return as single chunk
    if (text.length <= TARGET_CHUNK_SIZE) {
      return [text.trim()];
    }

    const paragraphs = text.split(/\n\s*\n/);
    const chunks: string[] = [];
    let currentChunk = "";

    for (const paragraph of paragraphs) {
      const trimmedParagraph = paragraph.trim();
      if (!trimmedParagraph) continue;

      // If adding this paragraph exceeds target, save current and start new
      if (
        currentChunk.length + trimmedParagraph.length > TARGET_CHUNK_SIZE &&
        currentChunk.length > 0
      ) {
        chunks.push(currentChunk.trim());

        // Start new chunk with overlap from end of previous chunk
        const overlapText = currentChunk.slice(-OVERLAP_SIZE);
        currentChunk = overlapText + "\n\n" + trimmedParagraph;
      } else {
        currentChunk +=
          (currentChunk.length > 0 ? "\n\n" : "") + trimmedParagraph;
      }
    }

    // Don't forget the last chunk
    if (currentChunk.trim().length > 0) {
      chunks.push(currentChunk.trim());
    }

    // Handle case where a single paragraph is very long - split by sentences
    return chunks.flatMap((chunk) => {
      if (chunk.length <= TARGET_CHUNK_SIZE * 1.5) return [chunk];
      return ChunkingService.splitBySentences(chunk);
    });
  }

  private static splitBySentences(text: string): string[] {
    const sentences = text.match(/[^.!?]+[.!?]+\s*/g) || [text];
    const chunks: string[] = [];
    let currentChunk = "";

    for (const sentence of sentences) {
      if (
        currentChunk.length + sentence.length > TARGET_CHUNK_SIZE &&
        currentChunk.length > 0
      ) {
        chunks.push(currentChunk.trim());
        const overlap = currentChunk.slice(-OVERLAP_SIZE);
        currentChunk = overlap + sentence;
      } else {
        currentChunk += sentence;
      }
    }

    if (currentChunk.trim().length > 0) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }

  /**
   * Estimates token count from character count (~4 chars per token)
   */
  static estimateTokenCount(text: string): number {
    return Math.ceil(text.length / 4);
  }
}
