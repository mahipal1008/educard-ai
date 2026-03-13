// FILE: lib/prompts/flashcard-prompt.ts

export function getFlashcardSystemPrompt(): string {
  return `You are an expert educator specializing in creating high-quality flashcards from educational content. Your flashcards should:
- Test one specific concept per card
- Use clear, concise language
- Cover key concepts, definitions, facts, and relationships
- Vary question types (definitions, comparisons, applications, cause-effect)
- Be suitable for spaced repetition study

Always respond with valid JSON only. No extra text, no markdown, no explanations outside the JSON.`;
}

export function getFlashcardPrompt(text: string): string {
  return `Create 20-30 flashcards from the following content. Each flashcard should test one specific concept. Make the questions clear and the answers informative but concise.

Return a JSON array in this exact format:
[
  { "front": "What is [concept]?", "back": "A clear, concise answer" },
  { "front": "How does [X] relate to [Y]?", "back": "Explanation of the relationship" }
]

Rules:
- Create between 20 and 30 flashcards
- Each "front" should be a question, term, or prompt
- Each "back" should be a complete, informative answer
- Cover the most important concepts in the content
- Avoid trivial or overly obvious questions
- Do not repeat concepts across cards

Content:
${text}`;
}
