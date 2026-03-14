# NVIDIA_USAGE.md — How EduCard AI Uses NVIDIA Technology

## Overview

EduCard AI uses **NVIDIA NIM** (NVIDIA Inference Microservices) as its core AI inference engine. All AI features — from flashcard generation to image analysis — are powered by NVIDIA NIM API endpoints.

## NVIDIA NIM Models Used

### Text Generation — `meta/llama-3.1-70b-instruct`

Used for all text-based AI features:

| Feature | How NIM is Used |
|---------|----------------|
| **Flashcard Generation** | Extracts key concepts from YouTube transcripts and PDFs, generates question-answer pairs |
| **Quiz Generation** | Creates multiple-choice questions with explanations from source material |
| **Summary Generation** | Produces structured markdown summaries (default, bullet, detailed, cornell modes) |
| **Diagram Generation** | Generates valid Mermaid.js code for flowcharts, mindmaps, sequence diagrams, class diagrams, and timelines |
| **Voice Doubt Solver** | Answers student questions concisely with examples and explanations |
| **Exam Predictor** | Analyzes past exam papers to predict likely questions and generate practice sets |
| **Flashcard Translation** | Translates flashcard decks into 20+ languages while preserving technical terms |

### Vision — `meta/llama-3.2-90b-vision-instruct`

Used for image understanding features:

| Feature | How NIM is Used |
|---------|----------------|
| **Image Q&A** | Analyzes uploaded images and generates quiz questions based on visual content |
| **Handwriting OCR** | Extracts text from handwritten notes, fixes spelling, organizes into topics |
| **Concept Diagrams** | Generates ASCII diagrams and structured visual breakdowns for concepts |

## API Integration Architecture

```
Client Request
    ↓
Next.js API Route (Edge Runtime)
    ↓
lib/nvidia-nim.ts → nimChat() or nimVision()
    ↓
NVIDIA NIM API (https://integrate.api.nvidia.com/v1/chat/completions)
    ↓
OpenAI-compatible chat completions response
    ↓
JSON parsing + validation
    ↓
Response to client
```

### Key Implementation Details

- **Edge Runtime Compatible**: All API routes use `fetch()` — no Node.js SDKs, fully compatible with Cloudflare Workers and Vercel Edge Functions
- **Retry Logic**: Exponential backoff with 3 retries for rate-limited requests (429 status)
- **JSON Extraction**: Robust response parsing that handles markdown code blocks and extracts JSON arrays/objects
- **Vision API**: Images sent as base64 data URLs in the OpenAI-compatible multipart message format

## File Mapping

| File | NIM Usage |
|------|-----------|
| `lib/nvidia-nim.ts` | Core NIM client — `nimChat()` for text, `nimVision()` for images |
| `lib/services/ai-generation.ts` | Flashcard, quiz, and summary generation via `nimChat()` |
| `lib/claude-vision.ts` | Image Q&A, OCR, and diagram generation via `nimVision()` |
| `app/api/generate/diagram/route.ts` | Mermaid.js diagram generation via `nimChat()` |
| `app/api/voice-doubt/route.ts` | Student Q&A via `nimChat()` |
| `app/api/exam-predictor/route.ts` | Exam analysis via `nimChat()` |
| `app/api/decks/[id]/translate/route.ts` | Flashcard translation via `nimChat()` |

## Environment Variables

```env
NVIDIA_API_KEY=nvapi-...           # Your NVIDIA NIM API key
NVIDIA_NIM_BASE_URL=https://integrate.api.nvidia.com/v1
NVIDIA_NIM_MODEL=meta/llama-3.1-70b-instruct
NVIDIA_NIM_VISION_MODEL=meta/llama-3.2-90b-vision-instruct
```

## Future NVIDIA Plans

- Upgrade to larger models (Llama 3.1 405B) for complex reasoning tasks
- Implement streaming responses for real-time generation feedback
- Explore NVIDIA NeMo for custom fine-tuned education models
- Investigate NVIDIA Riva for on-device speech recognition
- Edge deployment with NVIDIA Jetson for offline school environments
- RAG pipeline with NVIDIA NIM Retrieval for document Q&A
