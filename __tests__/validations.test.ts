import { describe, it, expect } from "vitest";
import { isValidYouTubeUrl, youtubeUrlSchema } from "@/lib/validations/youtube";
import { validatePDFFile, MAX_FILE_SIZE } from "@/lib/validations/upload";

describe("isValidYouTubeUrl", () => {
  it("accepts standard watch URLs", () => {
    expect(isValidYouTubeUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(true);
    expect(isValidYouTubeUrl("https://youtube.com/watch?v=dQw4w9WgXcQ")).toBe(true);
    expect(isValidYouTubeUrl("http://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(true);
  });

  it("accepts short URLs", () => {
    expect(isValidYouTubeUrl("https://youtu.be/dQw4w9WgXcQ")).toBe(true);
  });

  it("accepts embed URLs", () => {
    expect(isValidYouTubeUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe(true);
  });

  it("accepts shorts URLs", () => {
    expect(isValidYouTubeUrl("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toBe(true);
  });

  it("accepts URLs with extra parameters", () => {
    expect(isValidYouTubeUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=120")).toBe(true);
  });

  it("rejects invalid URLs", () => {
    expect(isValidYouTubeUrl("https://google.com")).toBe(false);
    expect(isValidYouTubeUrl("not a url")).toBe(false);
    expect(isValidYouTubeUrl("")).toBe(false);
    expect(isValidYouTubeUrl("https://youtube.com/watch?v=short")).toBe(false); // ID too short
  });
});

describe("youtubeUrlSchema", () => {
  it("validates correct URLs", () => {
    const result = youtubeUrlSchema.safeParse({ url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" });
    expect(result.success).toBe(true);
  });

  it("rejects empty URL", () => {
    const result = youtubeUrlSchema.safeParse({ url: "" });
    expect(result.success).toBe(false);
  });

  it("rejects non-YouTube URLs", () => {
    const result = youtubeUrlSchema.safeParse({ url: "https://vimeo.com/12345" });
    expect(result.success).toBe(false);
  });
});

describe("validatePDFFile", () => {
  it("accepts valid PDF files", () => {
    const result = validatePDFFile({ size: 1024, type: "application/pdf" });
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("rejects non-PDF types", () => {
    const result = validatePDFFile({ size: 1024, type: "image/png" });
    expect(result.valid).toBe(false);
    expect(result.error).toContain("PDF");
  });

  it("rejects files over 10MB", () => {
    const result = validatePDFFile({ size: MAX_FILE_SIZE + 1, type: "application/pdf" });
    expect(result.valid).toBe(false);
    expect(result.error).toContain("10MB");
  });

  it("accepts files exactly at the limit", () => {
    const result = validatePDFFile({ size: MAX_FILE_SIZE, type: "application/pdf" });
    expect(result.valid).toBe(true);
  });
});
