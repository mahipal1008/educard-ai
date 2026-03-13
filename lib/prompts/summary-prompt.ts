// FILE: lib/prompts/summary-prompt.ts

export type SummaryMode = "default" | "bullet" | "cornell" | "outline" | "mindmap";

export function getSummarySystemPrompt(): string {
  return `You are an expert at summarizing educational content clearly and concisely. You create well-structured summaries that help students quickly understand the key points and concepts. Respond in Markdown format.`;
}

export function getSummaryPrompt(text: string, mode: SummaryMode = "default"): string {
  const modeInstructions: Record<SummaryMode, string> = {
    default: `Include the following sections:

## TL;DR
A 2-3 sentence overview of the entire content.

## Key Points
5-8 bullet points covering the most important concepts and ideas.

## Key Terms
A list of important vocabulary terms and their definitions. Format as:
- **Term**: Definition

Keep the summary informative but concise.`,

    bullet: `Create a bullet-point summary:

## Overview
A 2-3 sentence overview.

## Main Points
- Use clear, concise bullet points
- Group related points under sub-headings
- Each bullet should be a complete standalone fact
- Use nested bullets for sub-points
- Aim for 15-20 bullets total

## Quick Review
3-5 one-liner takeaways for quick revision.`,

    cornell: `Create a summary in Cornell Notes format:

## Cue Column (Key Questions)
List 5-8 key questions that the content answers. Format as:
**Q: Question here?**

## Notes Column (Answers & Details)
For each question above, provide a detailed answer with supporting details.

## Summary Box
A 3-4 sentence comprehensive summary of the entire content.`,

    outline: `Create a hierarchical outline summary:

## I. First Major Section
### A. Sub-point
- 1. Detail
- 2. Detail
### B. Sub-point
## II. Second Major Section
### A. Sub-point

Make it at least 3 levels deep. Cover ALL major concepts.`,

    mindmap: `Create a text-based mind map summary:

## Central Topic
State the main subject in 1 line.

## Branches
For each major concept, create a branch:

### Branch 1: [Topic Name]
- Sub-idea 1.1
  - Detail
- Sub-idea 1.2

Create at least 4-5 branches with 2-3 sub-ideas each.

## Connections
List 3-5 connections between branches:
- [Branch X] connects to [Branch Y] because...`,
  };

  return `Summarize the following educational content using the specified format.

${modeInstructions[mode]}

Content:
${text}`;
}
