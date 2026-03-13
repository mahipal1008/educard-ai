// FILE: app/(dashboard)/diagram-generator/page.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Network,
  Loader2,
  Sparkles,
  Download,
  Copy,
  GitBranch,
  BrainCircuit,
  ArrowLeftRight,
  Boxes,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

type DiagramType = "flowchart" | "mindmap" | "sequence" | "classDiagram" | "timeline";

const diagramTypes: { id: DiagramType; label: string; icon: React.ElementType; description: string }[] = [
  { id: "flowchart", label: "Flowchart", icon: GitBranch, description: "Process flow with decisions" },
  { id: "mindmap", label: "Mind Map", icon: BrainCircuit, description: "Central concept with branches" },
  { id: "sequence", label: "Sequence Diagram", icon: ArrowLeftRight, description: "Step-by-step interaction" },
  { id: "classDiagram", label: "Class Diagram", icon: Boxes, description: "Structure & relationships" },
  { id: "timeline", label: "Timeline", icon: Clock, description: "Chronological events" },
];

function MermaidRenderer({ code, id }: { code: string; id: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const renderDiagram = useCallback(async () => {
    try {
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: "default",
        securityLevel: "loose",
        flowchart: { useMaxWidth: true, htmlLabels: true },
      });
      const { svg: renderedSvg } = await mermaid.render(`mermaid-${id}`, code);
      setSvg(renderedSvg);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to render diagram");
      setSvg("");
    }
  }, [code, id]);

  useEffect(() => {
    renderDiagram();
  }, [renderDiagram]);

  if (error) {
    return (
      <div className="space-y-3">
        <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-3 text-sm text-amber-600">
          Diagram rendering preview unavailable. You can copy the Mermaid code below and paste it into{" "}
          <a href="https://mermaid.live" target="_blank" rel="noopener noreferrer" className="underline font-medium">
            mermaid.live
          </a>{" "}
          to view it.
        </div>
        <pre className="rounded-lg bg-muted p-4 text-xs overflow-x-auto whitespace-pre-wrap font-mono">
          {code}
        </pre>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex justify-center overflow-x-auto rounded-lg bg-white p-4 border"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export default function DiagramGeneratorPage() {
  const [topic, setTopic] = useState("");
  const [diagramType, setDiagramType] = useState<DiagramType>("flowchart");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{
    mermaidCode: string;
    summary: string;
    diagramType: string;
    topic: string;
  } | null>(null);
  const [history, setHistory] = useState<typeof result[]>([]);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Enter a topic to generate a diagram");
      return;
    }

    setGenerating(true);
    try {
      const res = await fetch("/api/generate/diagram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim(), diagramType }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      setResult(json.data);
      setHistory((prev) => [json.data, ...prev.slice(0, 4)]);
      toast.success("Diagram generated!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyCode = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.mermaidCode);
    toast.success("Mermaid code copied to clipboard");
  };

  const handleDownloadSVG = () => {
    const svgEl = document.querySelector(".diagram-output svg");
    if (!svgEl) {
      toast.error("No diagram to download");
      return;
    }
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${topic.replace(/[^a-zA-Z0-9]/g, "_")}_diagram.svg`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("SVG downloaded");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in-up">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl flex items-center gap-3">
          <Network className="h-7 w-7 text-primary" />
          AI Diagram Generator
        </h1>
        <p className="text-muted-foreground mt-1">
          Enter any topic and the AI generates visual diagrams — flowcharts, mind maps, timelines, and more.
        </p>
      </div>

      {/* Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Generate a Diagram</CardTitle>
          <CardDescription>Describe the concept or topic you want to visualize</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              placeholder="e.g. Photosynthesis process, Water cycle, OSI model layers..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !generating && handleGenerate()}
            />
          </div>

          <div className="space-y-2">
            <Label>Diagram Type</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {diagramTypes.map((dt) => {
                const Icon = dt.icon;
                const isActive = diagramType === dt.id;
                return (
                  <button
                    key={dt.id}
                    onClick={() => setDiagramType(dt.id)}
                    className={`rounded-lg border-2 p-3 text-left transition-all ${
                      isActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/20"
                    }`}
                  >
                    <Icon className={`h-4 w-4 mb-1 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                    <p className="text-xs font-medium">{dt.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!topic.trim() || generating}
            className="gap-2 w-full sm:w-auto"
          >
            {generating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {generating ? "Generating..." : "Generate Diagram"}
          </Button>
        </CardContent>
      </Card>

      {/* Result */}
      {result && (
        <Card className="border-2 border-primary/10">
          <CardHeader>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  {result.topic}
                </CardTitle>
                <CardDescription>{result.summary}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="capitalize">{result.diagramType}</Badge>
                <Button variant="outline" size="sm" className="gap-1.5" onClick={handleCopyCode}>
                  <Copy className="h-3.5 w-3.5" /> Code
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5" onClick={handleDownloadSVG}>
                  <Download className="h-3.5 w-3.5" /> SVG
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="diagram-output">
            <MermaidRenderer code={result.mermaidCode} id="main" />
          </CardContent>
        </Card>
      )}

      {/* History */}
      {history.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Diagrams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {history.slice(1).map((item, i) => (
                <button
                  key={i}
                  onClick={() => item && setResult(item)}
                  className="w-full flex items-center gap-3 rounded-lg border p-3 text-left hover:bg-muted/50 transition-colors"
                >
                  <Network className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item?.topic}</p>
                    <p className="text-xs text-muted-foreground capitalize">{item?.diagramType}</p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
