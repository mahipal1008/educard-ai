// FILE: lib/prompts/flashcard-prompt.ts

export interface FlashcardPreferences {
  difficulty?: "easy" | "medium" | "hard" | "adaptive";
  cardDensity?: "fewer" | "standard" | "more";
  focusAreas?: string;
}

export function getFlashcardSystemPrompt(): string {
  return `You are an expert educator specializing in creating high-quality flashcards from educational content. Your flashcards should:
- Test one specific concept per card
- Use clear, concise language
- Cover key concepts, definitions, facts, and relationships
- Vary question types (definitions, comparisons, applications, cause-effect)
- Be suitable for spaced repetition study

Always respond with valid JSON only. No extra text, no markdown, no explanations outside the JSON.`;
}

export function getFlashcardPrompt(text: string, prefs?: FlashcardPreferences): string {
  const difficulty = prefs?.difficulty || "adaptive";
  const density = prefs?.cardDensity || "standard";

  const densityRange: Record<string, string> = {
    fewer: "10-15",
    standard: "20-30",
    more: "30-50",
  };
  const range = densityRange[density] || "20-30";

  const difficultyInstructions: Record<string, string> = {
    easy: "Focus on basic definitions, simple recall, and straightforward facts. Avoid complex analysis questions.",
    medium: "Mix basic recall with some conceptual understanding questions. Include both simple and moderately challenging cards.",
    hard: "Focus on deep understanding, application, analysis, and connections between concepts. Include challenging questions that require critical thinking.",
    adaptive: "Mix difficulty levels: some easy recall, some medium conceptual, and some hard application questions.",
  };

  let focusInstructions = "";
  if (prefs?.focusAreas && prefs.focusAreas.trim()) {
    focusInstructions = `\n- Pay special attention to these topics/areas: ${prefs.focusAreas}`;
  }

  return `Create ${range} flashcards from the following content. Each flashcard should test one specific concept. Make the questions clear and the answers informative but concise.

Return a JSON array in this exact format:
[
  { "front": "What is [concept]?", "back": "A clear, concise answer" },
  { "front": "How does [X] relate to [Y]?", "back": "Explanation of the relationship" }
]

Rules:
- Create between ${range} flashcards
- Difficulty: ${difficultyInstructions[difficulty]}
- Each "front" should be a question, term, or prompt
- Each "back" should be a complete, informative answer
- Cover the most important concepts in the content
- Avoid trivial or overly obvious questions
- Do not repeat concepts across cards${focusInstructions}

Content:
${text}`;
}
