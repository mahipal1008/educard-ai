// FILE: lib/nvidia-nim.ts
// Reusable NVIDIA NIM API client using fetch() (edge-compatible)

const MAX_RETRIES = 3;
const RETRY_BASE_DELAY = 1000;

interface NIMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface NIMChoice {
  message: {
    content: string;
  };
}

interface NIMResponse {
  choices: NIMChoice[];
}

/**
 * Call NVIDIA NIM API (OpenAI-compatible chat completions).
 * Works in edge runtime — uses fetch(), no Node SDKs.
 */
export async function nimChat(
  systemPrompt: string,
  userPrompt: string,
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
): Promise<string> {
  const baseUrl =
    process.env.NVIDIA_NIM_BASE_URL || "https://integrate.api.nvidia.com/v1";
  const apiKey = process.env.NVIDIA_API_KEY;
  const model = options?.model || process.env.NVIDIA_NIM_MODEL || "meta/llama-3.1-70b-instruct";

  if (!apiKey) {
    throw new Error("NVIDIA_API_KEY is not set in environment variables.");
  }

  const messages: NIMMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: options?.temperature ?? 0.7,
          max_tokens: options?.maxTokens ?? 4096,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        const isRateLimit = res.status === 429;
        const isLastAttempt = attempt === MAX_RETRIES - 1;

        if (isRateLimit && !isLastAttempt) {
          const delay = RETRY_BASE_DELAY * Math.pow(2, attempt);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        throw new Error(
          `NVIDIA NIM API error (${res.status}): ${errorText}`
        );
      }

      const data: NIMResponse = await res.json();
      const text = data.choices?.[0]?.message?.content;

      if (!text) {
        throw new Error("No text content in NVIDIA NIM response.");
      }

      return text;
    } catch (error) {
      const isRateLimit =
        error instanceof Error &&
        (error.message.includes("429") || error.message.includes("rate"));
      const isLastAttempt = attempt === MAX_RETRIES - 1;

      if (isRateLimit && !isLastAttempt) {
        const delay = RETRY_BASE_DELAY * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      if (isLastAttempt) {
        throw new Error(
          `NVIDIA NIM failed after ${MAX_RETRIES} attempts: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }

      throw error;
    }
  }

  throw new Error("NVIDIA NIM failed: exhausted all retries.");
}

/**
 * Call NVIDIA NIM Vision API for image analysis.
 * Sends base64 image as a data URL in the user message.
 */
export async function nimVision(
  systemPrompt: string,
  userPrompt: string,
  base64Image: string,
  mimeType: string,
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
): Promise<string> {
  const baseUrl =
    process.env.NVIDIA_NIM_BASE_URL || "https://integrate.api.nvidia.com/v1";
  const apiKey = process.env.NVIDIA_API_KEY;
  const model =
    options?.model ||
    process.env.NVIDIA_NIM_VISION_MODEL ||
    "meta/llama-3.2-90b-vision-instruct";

  if (!apiKey) {
    throw new Error("NVIDIA_API_KEY is not set in environment variables.");
  }

  const messages = [
    { role: "system" as const, content: systemPrompt },
    {
      role: "user" as const,
      content: [
        {
          type: "image_url" as const,
          image_url: {
            url: `data:${mimeType};base64,${base64Image}`,
          },
        },
        {
          type: "text" as const,
          text: userPrompt,
        },
      ],
    },
  ];

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: options?.temperature ?? 0.7,
          max_tokens: options?.maxTokens ?? 4096,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        const isRateLimit = res.status === 429;
        const isLastAttempt = attempt === MAX_RETRIES - 1;

        if (isRateLimit && !isLastAttempt) {
          const delay = RETRY_BASE_DELAY * Math.pow(2, attempt);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        throw new Error(
          `NVIDIA NIM Vision API error (${res.status}): ${errorText}`
        );
      }

      const data: NIMResponse = await res.json();
      const text = data.choices?.[0]?.message?.content;

      if (!text) {
        throw new Error("No text content in NVIDIA NIM Vision response.");
      }

      return text;
    } catch (error) {
      const isRateLimit =
        error instanceof Error &&
        (error.message.includes("429") || error.message.includes("rate"));
      const isLastAttempt = attempt === MAX_RETRIES - 1;

      if (isRateLimit && !isLastAttempt) {
        const delay = RETRY_BASE_DELAY * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      if (isLastAttempt) {
        throw new Error(
          `NVIDIA NIM Vision failed after ${MAX_RETRIES} attempts: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }

      throw error;
    }
  }

  throw new Error("NVIDIA NIM Vision failed: exhausted all retries.");
}
