// FILE: lib/services/pdf-extract.ts

import { extractText } from "unpdf";

interface PDFExtractResult {
  text: string;
  pageCount: number;
  title: string | null;
}

export class PDFExtractService {
  /**
   * Extracts text from a PDF ArrayBuffer.
   * Edge-compatible — uses unpdf (works on Cloudflare Workers).
   */
  static async extractText(data: ArrayBuffer | Uint8Array): Promise<PDFExtractResult> {
    try {
      const buffer = data instanceof ArrayBuffer ? new Uint8Array(data) : data;
      const { text, totalPages } = await extractText(buffer, { mergePages: true });

      const combinedText = Array.isArray(text) ? text.join("\n") : (text as string);

      if (!combinedText || combinedText.trim().length < 50) {
        throw new Error(
          "Could not extract readable text from this PDF. The file may be scanned or image-based."
        );
      }

      // Clean up extracted text
      const cleanedText = combinedText
        .replace(/\r\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .replace(/\s{2,}/g, " ")
        .trim();

      return {
        text: cleanedText,
        pageCount: totalPages || 0,
        title: null,
      };
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message.includes("password") ||
          error.message.includes("encrypted")
        ) {
          throw new Error(
            "This PDF is password-protected. Please upload an unprotected PDF."
          );
        }
        throw error;
      }
      throw new Error("Failed to parse PDF. The file may be corrupted.");
    }
  }
}
