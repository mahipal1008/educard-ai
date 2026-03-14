// End-to-end test: YouTube URL → transcript → flashcards + quiz + summary
import "dotenv/config";

import { YouTubeTranscriptService } from "./lib/services/youtube-transcript";
import { AIGenerationService } from "./lib/services/ai-generation";
import { ChunkingService } from "./lib/services/chunking";

const testUrl = "https://youtu.be/Cb46_P12bMY?si=CpmfzjoxzVrJXqgM";

async function main() {
  console.log("=== YouTube → Study Material Test ===\n");
  console.log("URL:", testUrl);

  // Step 1: Fetch transcript
  console.log("\n--- Step 1: Fetching YouTube transcript ---");
  const transcript = await YouTubeTranscriptService.getTranscript(testUrl);
  console.log("Title:", transcript.title);
  console.log("Video ID:", transcript.videoId);
  console.log("Text length:", transcript.text.length, "chars");
  console.log("Preview:", transcript.text.substring(0, 200) + "...\n");

  // Step 2: Generate summary
  console.log("--- Step 2: Generating summary ---");
  const summary = await AIGenerationService.generateSummary(transcript.text, "default");
  console.log("Summary length:", summary.length, "chars");
  console.log("Summary preview:", summary.substring(0, 300) + "...\n");

  // Step 3: Generate flashcards
  console.log("--- Step 3: Generating flashcards ---");
  const chunks = ChunkingService.splitText(transcript.text);
  console.log("Text split into", chunks.length, "chunk(s)");

  let allCards: Array<{ front: string; back: string }> = [];
  for (const chunk of chunks) {
    const cards = await AIGenerationService.generateFlashcards(chunk);
    allCards = [...allCards, ...cards];
  }
  console.log("Generated", allCards.length, "flashcards");
  if (allCards.length > 0) {
    console.log("Sample flashcard:");
    console.log("  Front:", allCards[0].front);
    console.log("  Back:", allCards[0].back);
  }

  // Step 4: Generate quiz
  console.log("\n--- Step 4: Generating quiz questions ---");
  let allQuestions: Array<{
    question_text: string;
    options: string[];
    correct_answer_index: number;
    explanation: string;
  }> = [];
  for (const chunk of chunks) {
    const questions = await AIGenerationService.generateQuiz(chunk);
    allQuestions = [...allQuestions, ...questions];
  }
  console.log("Generated", allQuestions.length, "quiz questions");
  if (allQuestions.length > 0) {
    console.log("Sample question:");
    console.log("  Q:", allQuestions[0].question_text);
    console.log("  Options:", allQuestions[0].options.join(" | "));
    console.log("  Answer:", allQuestions[0].options[allQuestions[0].correct_answer_index]);
  }

  console.log("\n=== ALL TESTS PASSED ===");
  console.log("Transcript:", transcript.text.length, "chars");
  console.log("Summary:", summary.length, "chars");
  console.log("Flashcards:", allCards.length);
  console.log("Quiz questions:", allQuestions.length);
}

main().catch((err) => {
  console.error("\nTEST FAILED:", err.message);
  process.exit(1);
});
