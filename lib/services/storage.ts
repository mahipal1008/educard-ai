// FILE: lib/services/storage.ts

import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET_NAME = "pdf-uploads";

export class SupabaseStorageService {
  /**
   * Uploads a PDF to Supabase Storage.
   * Path convention: {userId}/{documentId}/{filename}.pdf
   */
  static async uploadPDF(
    userId: string,
    documentId: string,
    data: ArrayBuffer,
    filename: string
  ): Promise<string> {
    const supabase = createAdminClient();
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = `${userId}/${documentId}/${safeName}`;

    const blob = new Blob([new Uint8Array(data)], { type: "application/pdf" });

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, blob, {
        contentType: "application/pdf",
        upsert: false,
      });

    if (error) {
      throw new Error(`Failed to upload PDF: ${error.message}`);
    }

    return storagePath;
  }

  /**
   * Downloads a PDF from Supabase Storage and returns ArrayBuffer.
   */
  static async downloadPDF(storagePath: string): Promise<ArrayBuffer> {
    const supabase = createAdminClient();

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .download(storagePath);

    if (error || !data) {
      throw new Error(`Failed to download PDF: ${error?.message || "No data"}`);
    }

    return await data.arrayBuffer();
  }

  /**
   * Deletes a PDF from Supabase Storage.
   */
  static async deletePDF(storagePath: string): Promise<void> {
    const supabase = createAdminClient();

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([storagePath]);

    if (error) {
      throw new Error(`Failed to delete PDF: ${error.message}`);
    }
  }
}
