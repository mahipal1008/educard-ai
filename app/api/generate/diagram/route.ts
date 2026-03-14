// FILE: app/api/generate/diagram/route.ts

import { NextResponse } from "next/server";
import { nimChat } from "@/lib/nvidia-nim";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

const diagramSchema = z.object({
  topic: z.string().min(1).max(500),
  diagramType: z.enum(["flowchart", "mindmap", "sequence", "classDiagram", "timeline"]),
});

const diagramPrompts: Record<string, string> = {
  flowchart: `Generate a Mermaid.js FLOWCHART diagram for the topic.
Use "flowchart TD" (top-down) syntax. Include 6-12 nodes with meaningful labels.
Use different shapes: rectangles for processes, diamonds for decisions, rounded for start/end.
Example syntax:
flowchart TD
  A[Start] --> B{Decision}
  B -->|Yes| C[Process 1]
  B -->|No| D[Process 2]`,

  mindmap: `Generate a Mermaid.js MINDMAP diagram for the topic.
Use "mindmap" syntax. Include a central concept with 4-6 main branches and 2-3 sub-branches each.
Example syntax:
mindmap
  root((Central Topic))
    Branch 1
      Sub 1a
      Sub 1b
    Branch 2
      Sub 2a`,

  sequence: `Generate a Mermaid.js SEQUENCE diagram for the topic.
Use "sequenceDiagram" syntax. Include 3-5 participants with 6-10 message exchanges.
Example syntax:
sequenceDiagram
  participant A as Actor 1
  participant B as Actor 2
  A->>B: Message
  B-->>A: Response`,

  classDiagram: `Generate a Mermaid.js CLASS diagram for the topic.
Use "classDiagram" syntax. Include 4-6 classes with attributes, methods, and relationships.
Example syntax:
classDiagram
  class Animal {
    +String name
    +makeSound()
  }
  Animal <|-- Dog`,

  timeline: `Generate a Mermaid.js TIMELINE diagram for the topic.
Use "timeline" syntax. Include 5-8 events in chronological order.
Example syntax:
timeline
  title Timeline
  Section Phase 1
    Event 1 : Description
    Event 2 : Description`,
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = diagramSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { topic, diagramType } = validation.data;

    const prompt = `${diagramPrompts[diagramType]}

Topic: "${topic}"

IMPORTANT RULES:
- Return ONLY the raw Mermaid.js code, nothing else
- Do NOT wrap in markdown code blocks
- Do NOT add explanations before or after
- Make sure the syntax is valid Mermaid.js
- Use clear, educational labels
- Make the diagram comprehensive but readable`;

    let mermaidCode = await nimChat(
      "You are an expert at generating valid Mermaid.js diagram code. Return ONLY raw Mermaid code, no markdown.",
      prompt
    );

    // Strip markdown code blocks if present
    if (mermaidCode.startsWith("```")) {
      mermaidCode = mermaidCode.replace(/^```(?:mermaid)?\s*\n?/, "").replace(/\n?```$/, "").trim();
    }

    // Also ask NIM for a text summary of the diagram
    const summary = await nimChat(
      "You are a concise educational assistant.",
      `In 2-3 sentences, explain what this diagram shows about "${topic}". Be concise and educational.`
    );

    return NextResponse.json({
      data: {
        mermaidCode,
        summary,
        diagramType,
        topic,
      },
    });
  } catch (error) {
    console.error("Diagram generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate diagram" },
      { status: 500 }
    );
  }
}
