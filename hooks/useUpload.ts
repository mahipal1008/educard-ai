// FILE: hooks/useUpload.ts
"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { ACCEPTED_PDF_TYPE, MAX_FILE_SIZE } from "@/lib/validations/upload";

export function useUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback((selectedFile: File): boolean => {
    setError(null);

    if (selectedFile.type !== ACCEPTED_PDF_TYPE) {
      const msg = "Only PDF files are accepted.";
      setError(msg);
      toast.error(msg);
      return false;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      const msg = "File size must be less than 10MB.";
      setError(msg);
      toast.error(msg);
      return false;
    }

    return true;
  }, []);

  const handleFileSelect = useCallback(
    (selectedFile: File) => {
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        setError(null);
      }
    },
    [validateFile]
  );

  const uploadFile = useCallback(async (): Promise<string | null> => {
    if (!file) {
      toast.error("No file selected");
      return null;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Attach AI preferences from localStorage
      try {
        const savedPrefs = localStorage.getItem("educard-ai-prefs");
        if (savedPrefs) {
          formData.append("aiPrefs", savedPrefs);
        }
      } catch {
        // Ignore localStorage errors
      }

      // Simulate progress since fetch doesn't support progress natively
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const res = await fetch("/api/process/pdf", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Upload failed");
      }

      toast.success("PDF uploaded successfully!");
      return json.data.documentId;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Upload failed";
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [file]);

  const clearFile = useCallback(() => {
    setFile(null);
    setError(null);
    setUploadProgress(0);
  }, []);

  return {
    file,
    setFile: handleFileSelect,
    clearFile,
    uploadProgress,
    isUploading,
    error,
    uploadFile,
  };
}
