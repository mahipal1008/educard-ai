// FILE: components/create/PDFUpload.tsx
"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { useUpload } from "@/hooks/useUpload";
import { Button } from "@/components/ui/button";
import { FileUp, X, FileText, Loader2, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function PDFUpload() {
  const router = useRouter();
  const { file, setFile, clearFile, uploadProgress, isUploading, error, uploadFile } = useUpload();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
      }
    },
    [setFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 1,
    disabled: isUploading,
  });

  const handleUpload = async () => {
    const documentId = await uploadFile();
    if (documentId) {
      router.push(`/create/processing/${documentId}`);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
          }`}
        >
          <input {...getInputProps()} />
          <FileUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">
            {isDragActive ? "Drop your PDF here" : "Drag & drop your PDF here"}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            or click to browse files
          </p>
          <p className="text-xs text-muted-foreground">
            PDF only, max 10 MB
          </p>
        </div>
      ) : (
        <div className="border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 shrink-0">
              <FileText className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{file.name}</p>
              <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
            </div>
            {!isUploading && (
              <Button variant="ghost" size="icon" onClick={clearFile}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {isUploading && (
            <div className="mt-4 space-y-2">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-muted-foreground text-right">
                {uploadProgress}%
              </p>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button
        onClick={handleUpload}
        disabled={!file || isUploading}
        className="w-full h-12 text-base gap-2"
      >
        {isUploading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Uploading & Processing...
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            Generate Study Material
          </>
        )}
      </Button>
    </div>
  );
}
