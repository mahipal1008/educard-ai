import { describe, it, expect } from "vitest";
import {
  slugify,
  generateUniqueSlug,
  formatDate,
  truncateText,
  countWords,
  calculatePercentage,
  getScoreColor,
  getScoreBgColor,
  formatTime,
} from "@/lib/utils";

describe("slugify", () => {
  it("converts text to lowercase kebab-case", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("removes special characters", () => {
    expect(slugify("Hello World! Test")).toBe("hello-world-test");
  });

  it("collapses multiple spaces/hyphens", () => {
    expect(slugify("hello   world---test")).toBe("hello-world-test");
  });

  it("trims whitespace", () => {
    expect(slugify("  hello  ")).toBe("hello");
  });

  it("truncates to 60 characters", () => {
    const long = "a".repeat(100);
    expect(slugify(long).length).toBe(60);
  });

  it("handles empty string", () => {
    expect(slugify("")).toBe("");
  });
});

describe("generateUniqueSlug", () => {
  it("generates slug with random suffix", () => {
    const slug = generateUniqueSlug("Test Title");
    expect(slug).toMatch(/^test-title-[a-z0-9]{6}$/);
  });

  it("generates unique slugs each time", () => {
    const slug1 = generateUniqueSlug("Same Title");
    const slug2 = generateUniqueSlug("Same Title");
    expect(slug1).not.toBe(slug2);
  });
});

describe("formatDate", () => {
  it("formats date correctly", () => {
    const result = formatDate("2024-01-15T10:00:00Z");
    expect(result).toContain("Jan");
    expect(result).toContain("15");
    expect(result).toContain("2024");
  });
});

describe("truncateText", () => {
  it("returns text unchanged if under max length", () => {
    expect(truncateText("short", 10)).toBe("short");
  });

  it("truncates and adds ellipsis when over max length", () => {
    expect(truncateText("hello world foo", 10)).toBe("hello worl...");
  });

  it("handles exact length", () => {
    expect(truncateText("exact", 5)).toBe("exact");
  });
});

describe("countWords", () => {
  it("counts words correctly", () => {
    expect(countWords("hello world")).toBe(2);
  });

  it("handles multiple spaces", () => {
    expect(countWords("hello   world   test")).toBe(3);
  });

  it("returns 0 for empty/whitespace string", () => {
    expect(countWords("")).toBe(0);
    expect(countWords("   ")).toBe(0);
  });
});

describe("calculatePercentage", () => {
  it("calculates correctly", () => {
    expect(calculatePercentage(50, 100)).toBe(50);
    expect(calculatePercentage(1, 3)).toBe(33);
  });

  it("returns 0 when total is 0", () => {
    expect(calculatePercentage(5, 0)).toBe(0);
  });

  it("returns 100 for full value", () => {
    expect(calculatePercentage(10, 10)).toBe(100);
  });
});

describe("getScoreColor", () => {
  it("returns green for >= 80", () => {
    expect(getScoreColor(80)).toBe("text-green-500");
    expect(getScoreColor(100)).toBe("text-green-500");
  });

  it("returns yellow for >= 60", () => {
    expect(getScoreColor(60)).toBe("text-yellow-500");
    expect(getScoreColor(79)).toBe("text-yellow-500");
  });

  it("returns red for < 60", () => {
    expect(getScoreColor(59)).toBe("text-red-500");
    expect(getScoreColor(0)).toBe("text-red-500");
  });
});

describe("getScoreBgColor", () => {
  it("returns green bg for >= 80", () => {
    expect(getScoreBgColor(90)).toContain("green");
  });

  it("returns yellow bg for >= 60", () => {
    expect(getScoreBgColor(65)).toContain("yellow");
  });

  it("returns red bg for < 60", () => {
    expect(getScoreBgColor(30)).toContain("red");
  });
});

describe("formatTime", () => {
  it("formats seconds to mm:ss", () => {
    expect(formatTime(0)).toBe("0:00");
    expect(formatTime(65)).toBe("1:05");
    expect(formatTime(600)).toBe("10:00");
    expect(formatTime(3599)).toBe("59:59");
  });

  it("pads seconds with zero", () => {
    expect(formatTime(5)).toBe("0:05");
  });
});
