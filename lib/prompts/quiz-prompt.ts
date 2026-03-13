// FILE: lib/prompts/quiz-prompt.ts

export function getQuizSystemPrompt(): string {
  return `You are an expert quiz creator who designs challenging but fair multiple-choice assessments. Your questions should:
- Test understanding, not just memorization
- Have exactly 4 plausible options
- Include clear, educational explanations
- Cover key concepts from the content

Always respond with valid JSON only. No extra text, no markdown, no explanations outside the JSON.`;
}

export function getQuizPrompt(text: string): string {
  return `Create 10-15 multiple choice questions from the following educational content. Each question should test a specific concept or understanding.

Return a JSON array in this exact format:
[
  {
    "question_text": "What is the main purpose of [concept]?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer_index": 0,
    "explanation": "Brief explanation of why the correct answer is right and why others are wrong."
  }
]

Rules:
- Create between 10 and 15 questions
- Each question must have exactly 4 options
- correct_answer_index must be 0, 1, 2, or 3
- Make all wrong answers plausible (no obviously silly options)
- Explanations should be 1-2 sentences
- Cover the most important topics in the content
- Mix difficulty levels: some easy, some medium, some hard
- Avoid "all of the above" or "none of the above" options

Content:
${text}`;
}
