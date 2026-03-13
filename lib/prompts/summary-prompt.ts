// FILE: lib/prompts/summary-prompt.ts

export function getSummarySystemPrompt(): string {
  return `You are an expert at summarizing educational content clearly and concisely. You create well-structured summaries that help students quickly understand the key points and concepts. Respond in Markdown format.`;
}

export function getSummaryPrompt(text: string): string {
  return `Summarize the following educational content. Your summary should be well-organized and easy to study from.

Include the following sections:

## TL;DR
A 2-3 sentence overview of the entire content.

## Key Points
5-8 bullet points covering the most important concepts and ideas.

## Key Terms
A list of important vocabulary terms and their definitions from the content. Format as:
- **Term**: Definition

Keep the summary informative but concise. Focus on what a student would need to know for an exam.

Content:
${text}`;
}
