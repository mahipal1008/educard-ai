// FILE: lib/validations/upload.ts

import { z } from "zod";

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ACCEPTED_PDF_TYPE = "application/pdf";

export const uploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "File size must be less than 10MB",
    })
    .refine((file) => file.type === ACCEPTED_PDF_TYPE, {
      message: "Only PDF files are accepted",
    }),
});

export type UploadInput = z.infer<typeof uploadSchema>;

/**
 * Server-side validation for PDF upload
 */
export function validatePDFFile(file: {
  size: number;
  type: string;
}): { valid: boolean; error?: string } {
  if (file.type !== ACCEPTED_PDF_TYPE) {
    return { valid: false, error: "Only PDF files are accepted." };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "File size must be less than 10MB." };
  }
  return { valid: true };
}
