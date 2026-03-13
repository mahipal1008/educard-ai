// FILE: app/(public)/demo/page.tsx
"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  Youtube,
  FileText,
  Image as ImageIcon,
  PenLine,
  Mic,
  Globe,
  Brain,
  Target,
  Loader2,
  BookOpen,
  CheckCircle2,
  XCircle,
  ChevronRight,
  MessageSquare,
  Volume2,
  RotateCcw,
  Zap,
  Wand2,
  Layers,
  SlidersHorizontal,
  Network,
  GitBranch,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface FlashcardDemo {
  front: string;
  back: string;
}

interface QuizDemo {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

/* ------------------------------------------------------------------ */
/*  Sample data for instant demo (no API needed)                       */
/* ------------------------------------------------------------------ */

const sampleFlashcards: FlashcardDemo[] = [
  { front: "What is photosynthesis?", back: "The process by which green plants convert sunlight, water, and CO2 into glucose and oxygen using chlorophyll." },
  { front: "What is the powerhouse of the cell?", back: "Mitochondria — they produce ATP through cellular respiration, providing energy for cell functions." },
  { front: "Define Newton's Second Law", back: "Force equals mass times acceleration (F = ma). The acceleration of an object is directly proportional to the net force and inversely proportional to its mass." },
  { front: "What is the Pythagorean Theorem?", back: "In a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides: a² + b² = c²" },
  { front: "What is DNA?", back: "Deoxyribonucleic acid — a double helix molecule that carries genetic instructions for the development and functioning of living organisms." },
  { front: "Explain osmosis", back: "The movement of water molecules from a region of lower solute concentration to higher solute concentration through a semi-permeable membrane." },
];

const sampleQuiz: QuizDemo[] = [
  {
    question: "Which organelle is responsible for photosynthesis?",
    options: ["Mitochondria", "Chloroplast", "Ribosome", "Golgi apparatus"],
    correct: 1,
    explanation: "Chloroplasts contain chlorophyll, the green pigment that captures light energy for photosynthesis.",
  },
  {
    question: "What does F = ma represent?",
    options: ["Newton's First Law", "Newton's Second Law", "Newton's Third Law", "Law of Gravity"],
    correct: 1,
    explanation: "Newton's Second Law states that force equals mass times acceleration, describing how force affects motion.",
  },
  {
    question: "What is the primary function of DNA?",
    options: ["Energy production", "Protein synthesis", "Storing genetic information", "Cell division"],
    correct: 2,
    explanation: "DNA stores and transmits genetic information that directs protein synthesis and determines inherited characteristics.",
  },
  {
    question: "In which direction does osmosis occur?",
    options: ["High to low solute", "Low to high solute", "Random direction", "Only in plant cells"],
    correct: 1,
    explanation: "Osmosis moves water from low solute concentration (dilute) to high solute concentration (concentrated) through a semi-permeable membrane.",
  },
];

const sampleSummary = `## Key Concepts in Biology & Physics

### Photosynthesis
Plants convert **sunlight, water, and CO₂** into glucose and oxygen. This occurs in the **chloroplasts** using chlorophyll.

### Cell Biology
- **Mitochondria** produce ATP (energy currency of cells)
- **DNA** stores genetic information as a double helix
- **Osmosis** moves water across semi-permeable membranes

### Newton's Laws of Motion
1. **First Law**: Objects at rest stay at rest unless acted upon by a force
2. **Second Law**: F = ma (Force = mass × acceleration)
3. **Third Law**: Every action has an equal and opposite reaction

### Mathematics
- **Pythagorean Theorem**: a² + b² = c² (right triangles)
`;

const sampleTranslations: Record<string, { front: string; back: string }[]> = {
  Hindi: [
    { front: "प्रकाश संश्लेषण क्या है?", back: "वह प्रक्रिया जिसमें हरे पौधे सूर्य के प्रकाश, पानी और CO₂ को ग्लूकोज और ऑक्सीजन में बदलते हैं।" },
    { front: "कोशिका का पावरहाउस क्या है?", back: "माइटोकॉन्ड्रिया — ये कोशिकीय श्वसन द्वारा ATP का उत्पादन करते हैं।" },
  ],
  Spanish: [
    { front: "¿Qué es la fotosíntesis?", back: "El proceso por el cual las plantas verdes convierten la luz solar, el agua y el CO₂ en glucosa y oxígeno." },
    { front: "¿Cuál es la central eléctrica de la célula?", back: "Mitocondrias — producen ATP a través de la respiración celular." },
  ],
  French: [
    { front: "Qu'est-ce que la photosynthèse?", back: "Le processus par lequel les plantes vertes convertissent la lumière, l'eau et le CO₂ en glucose et oxygène." },
    { front: "Quelle est la centrale de la cellule?", back: "Les mitochondries — elles produisent l'ATP par la respiration cellulaire." },
  ],
};

const doubtAnswers: Record<string, string> = {
  default: "Photosynthesis is the process where plants use sunlight, water, and carbon dioxide to produce glucose and oxygen. The light reactions occur in the thylakoids (capturing solar energy), while the Calvin cycle happens in the stroma (fixing CO₂ into glucose). The overall equation is: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂.",
  newton: "Newton's Second Law (F = ma) means that a force applied to an object produces acceleration proportional to the force and inversely proportional to its mass. For example, pushing a shopping cart (small mass) with the same force as pushing a car (large mass) — the cart accelerates much more. This is why rockets need massive thrust to accelerate their heavy mass.",
  dna: "DNA replication is a semi-conservative process. The enzyme helicase unwinds the double helix, creating a replication fork. DNA polymerase then reads each template strand (3' to 5') and synthesizes a new complementary strand (5' to 3'). The result is two identical DNA molecules, each with one old and one new strand.",
};

/* ------------------------------------------------------------------ */
/*  Demo components                                                    */
/* ------------------------------------------------------------------ */

function FlashcardDemo() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = sampleFlashcards[currentIdx];

  return (
    <div className="space-y-4">
      <div
        onClick={() => setFlipped(!flipped)}
        className="cursor-pointer min-h-[180px] rounded-xl border-2 bg-card p-6 flex items-center justify-center text-center transition-all hover:border-primary/30 hover:shadow-lg"
      >
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">
            {flipped ? "ANSWER" : "QUESTION"} — Click to flip
          </p>
          <p className={`text-lg font-semibold leading-relaxed ${flipped ? "text-primary" : ""}`}>
            {flipped ? card.back : card.front}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Card {currentIdx + 1} of {sampleFlashcards.length}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setCurrentIdx(Math.max(0, currentIdx - 1)); setFlipped(false); }}
            disabled={currentIdx === 0}
          >
            Previous
          </Button>
          <Button
            size="sm"
            onClick={() => { setCurrentIdx(Math.min(sampleFlashcards.length - 1, currentIdx + 1)); setFlipped(false); }}
            disabled={currentIdx === sampleFlashcards.length - 1}
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function QuizDemoSection() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = sampleQuiz[currentQ];

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === q.correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (currentQ < sampleQuiz.length - 1) {
      setCurrentQ((c) => c + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <div className="text-center py-6 space-y-4">
        <div className="text-4xl font-bold">
          {score}/{sampleQuiz.length}
        </div>
        <p className="text-muted-foreground">Questions correct</p>
        <div className="h-3 rounded-full bg-muted overflow-hidden max-w-xs mx-auto">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${(score / sampleQuiz.length) * 100}%` }}
          />
        </div>
        <Button onClick={handleReset} variant="outline" className="gap-2">
          <RotateCcw className="h-4 w-4" /> Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Question {currentQ + 1} of {sampleQuiz.length}
        </span>
        <Badge variant="outline">{score} correct</Badge>
      </div>
      <p className="text-base font-semibold">{q.question}</p>
      <div className="grid gap-2">
        {q.options.map((opt, idx) => {
          const isSelected = selected === idx;
          const isCorrect = idx === q.correct;
          const revealed = selected !== null;
          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={revealed}
              className={`w-full text-left text-sm p-3 rounded-lg border transition-all ${
                revealed && isCorrect ? "border-green-500 bg-green-500/10" :
                revealed && isSelected && !isCorrect ? "border-red-500 bg-red-500/10" :
                isSelected ? "border-primary bg-primary/5" :
                "border-border hover:border-primary/50"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="font-medium">{String.fromCharCode(65 + idx)}.</span>
                {opt}
                {revealed && isCorrect && <CheckCircle2 className="h-4 w-4 ml-auto text-green-500" />}
                {revealed && isSelected && !isCorrect && <XCircle className="h-4 w-4 ml-auto text-red-500" />}
              </span>
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
          <strong>Explanation:</strong> {q.explanation}
        </div>
      )}
      {selected !== null && (
        <Button onClick={handleNext} size="sm" className="gap-1">
          {currentQ < sampleQuiz.length - 1 ? "Next Question" : "See Results"}
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

function SummaryDemo() {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      {sampleSummary.split("\n").map((line, i) => {
        if (line.startsWith("## ")) return <h3 key={i} className="text-lg font-bold mt-4 mb-2">{line.replace("## ", "")}</h3>;
        if (line.startsWith("### ")) return <h4 key={i} className="text-base font-semibold mt-3 mb-1">{line.replace("### ", "")}</h4>;
        if (line.startsWith("- ")) return <p key={i} className="text-sm text-muted-foreground ml-4 my-0.5">{line}</p>;
        if (line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ")) return <p key={i} className="text-sm text-muted-foreground ml-4 my-0.5">{line}</p>;
        if (line.trim()) return <p key={i} className="text-sm text-muted-foreground my-1">{line}</p>;
        return null;
      })}
    </div>
  );
}

function TranslationDemo() {
  const [lang, setLang] = useState<string | null>(null);
  const languages = Object.keys(sampleTranslations);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Select a language to see flashcards translated:</p>
      <div className="flex flex-wrap gap-2">
        {languages.map((l) => (
          <Button
            key={l}
            variant={lang === l ? "default" : "outline"}
            size="sm"
            onClick={() => setLang(l)}
          >
            {l}
          </Button>
        ))}
      </div>
      {lang && (
        <div className="space-y-3 mt-4">
          {sampleTranslations[lang].map((card, i) => (
            <div key={i} className="rounded-xl border bg-card p-4 space-y-2">
              <p className="text-sm font-semibold">{card.front}</p>
              <p className="text-sm text-primary">{card.back}</p>
            </div>
          ))}
          <p className="text-xs text-muted-foreground">
            Showing 2 of {sampleFlashcards.length} cards in {lang}. Full translation available with all decks.
          </p>
        </div>
      )}
    </div>
  );
}

function VoiceDoubtDemo() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const getAnswer = () => {
    setLoading(true);
    setAnswer(null);
    setTimeout(() => {
      const q = question.toLowerCase();
      if (q.includes("newton") || q.includes("force") || q.includes("f=ma")) {
        setAnswer(doubtAnswers.newton);
      } else if (q.includes("dna") || q.includes("replication") || q.includes("genetic")) {
        setAnswer(doubtAnswers.dna);
      } else {
        setAnswer(doubtAnswers.default);
      }
      setLoading(false);
    }, 1500);
  };

  const speak = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.onstart = () => setSpeaking(true);
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utt);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Type a study question (or try: &quot;How does photosynthesis work?&quot;, &quot;Explain Newton&apos;s second law&quot;, &quot;How does DNA replicate?&quot;)
      </p>
      <div className="flex gap-2">
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask any study question..."
          onKeyDown={(e) => e.key === "Enter" && question.trim() && getAnswer()}
        />
        <Button onClick={getAnswer} disabled={!question.trim() || loading} className="gap-2 shrink-0">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="h-4 w-4" />}
          Ask
        </Button>
      </div>
      {answer && (
        <div className="space-y-3">
          <div className="rounded-xl bg-primary/5 border border-primary/10 p-4">
            <p className="text-sm leading-relaxed">{answer}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => {
              if (speaking) {
                if (typeof window !== "undefined") window.speechSynthesis?.cancel();
                setSpeaking(false);
              } else {
                speak(answer);
              }
            }}
          >
            <Volume2 className="h-4 w-4" />
            {speaking ? "Stop" : "Listen to Answer"}
          </Button>
        </div>
      )}
    </div>
  );
}

function ExamPredictorDemo() {
  const [active, setActive] = useState(false);

  const predictions = [
    { q: "Explain the process of photosynthesis with a diagram", difficulty: "medium", topic: "Biology" },
    { q: "Derive Newton's second law from first principles", difficulty: "hard", topic: "Physics" },
    { q: "What is the role of DNA polymerase in replication?", difficulty: "medium", topic: "Biology" },
    { q: "Solve: If F = 20N and m = 4kg, find acceleration", difficulty: "easy", topic: "Physics" },
    { q: "Compare mitosis and meiosis with examples", difficulty: "hard", topic: "Biology" },
  ];

  const topics = [
    { name: "Photosynthesis", pct: 85 },
    { name: "Newton's Laws", pct: 72 },
    { name: "Cell Division", pct: 65 },
    { name: "DNA & Genetics", pct: 58 },
    { name: "Thermodynamics", pct: 42 },
  ];

  const colors: Record<string, string> = {
    easy: "bg-green-500/10 text-green-600 border-green-500/20",
    medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    hard: "bg-red-500/10 text-red-600 border-red-500/20",
  };

  if (!active) {
    return (
      <div className="text-center py-6 space-y-4">
        <Target className="h-10 w-10 text-primary mx-auto" />
        <p className="text-sm text-muted-foreground">
          Upload past exam papers → AI predicts what&apos;s coming next
        </p>
        <Button onClick={() => setActive(true)} className="gap-2">
          <Sparkles className="h-4 w-4" />
          See Sample Predictions
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Topic Frequency</p>
        <div className="space-y-2">
          {topics.map((t) => (
            <div key={t.name} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium">{t.name}</span>
                <span className="text-muted-foreground">{t.pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: `${t.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Predicted Questions</p>
        <div className="space-y-2">
          {predictions.map((p, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border p-3 text-sm">
              <span className="text-muted-foreground font-medium shrink-0">{i + 1}.</span>
              <span className="flex-1">{p.q}</span>
              <Badge variant="outline" className={`text-xs shrink-0 ${colors[p.difficulty]}`}>
                {p.difficulty}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ImageQADemo() {
  const [active, setActive] = useState(false);

  if (!active) {
    return (
      <div className="text-center py-6 space-y-4">
        <ImageIcon className="h-10 w-10 text-primary mx-auto" />
        <p className="text-sm text-muted-foreground">
          Upload any image → AI explains it and generates quiz questions
        </p>
        <Button onClick={() => setActive(true)} className="gap-2">
          <Sparkles className="h-4 w-4" />
          See Sample Analysis
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-muted/50 border p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">AI Explanation</p>
        <p className="text-sm leading-relaxed">
          This image shows the <strong>structure of a plant cell</strong> with labeled organelles including
          the cell wall, cell membrane, chloroplasts, mitochondria, nucleus, and vacuole. The chloroplasts
          (shown in green) are responsible for photosynthesis, while the large central vacuole maintains
          turgor pressure.
        </p>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Generated Questions</p>
        {["Which organelle gives plant cells their green color?", "What is the function of the central vacuole?", "Which structure is found in plant cells but not animal cells?"].map((q, i) => (
          <div key={i} className="rounded-lg border p-3 text-sm flex items-center gap-2">
            <span className="text-muted-foreground font-medium">{i + 1}.</span>
            {q}
          </div>
        ))}
      </div>
    </div>
  );
}

function HandwritingDemo() {
  const [active, setActive] = useState(false);

  if (!active) {
    return (
      <div className="text-center py-6 space-y-4">
        <PenLine className="h-10 w-10 text-primary mx-auto" />
        <p className="text-sm text-muted-foreground">
          Snap a photo of handwritten notes → AI extracts and organizes the text
        </p>
        <Button onClick={() => setActive(true)} className="gap-2">
          <Sparkles className="h-4 w-4" />
          See Sample Extraction
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-3">
        <p className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">Original Notes (Handwritten)</p>
        <p className="text-sm text-muted-foreground italic">
          &quot;Photosynthsis — plants make food using sunlite... 6CO2 + 6H2O → C6H12O6 + 6O2...
          chloroplast is were it hapens... light dependent rxns in thylakoid...&quot;
        </p>
      </div>
      <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-3">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">AI-Cleaned Text</p>
        <div className="text-sm space-y-1">
          <p className="font-semibold">Photosynthesis</p>
          <p className="text-muted-foreground">Plants produce food using sunlight through photosynthesis.</p>
          <p className="text-muted-foreground font-mono text-xs mt-1">6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂</p>
          <p className="text-muted-foreground">The chloroplast is where photosynthesis occurs. Light-dependent reactions take place in the thylakoid membrane.</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Badge variant="secondary">Photosynthesis</Badge>
        <Badge variant="secondary">Chloroplast</Badge>
        <Badge variant="secondary">Light Reactions</Badge>
      </div>
    </div>
  );
}

function WeakTopicDemo() {
  const topics = [
    { name: "Photosynthesis", score: 92, color: "bg-emerald-500" },
    { name: "Newton's Laws", score: 78, color: "bg-emerald-500" },
    { name: "Cell Division", score: 65, color: "bg-amber-500" },
    { name: "Thermodynamics", score: 45, color: "bg-red-500" },
    { name: "Organic Chemistry", score: 32, color: "bg-red-500" },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        AI tracks your quiz performance and identifies weak areas for focused study.
      </p>
      <div className="space-y-3">
        {topics.map((t) => (
          <div key={t.name} className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{t.name}</span>
              <span className={`text-xs font-bold ${
                t.score >= 80 ? "text-emerald-500" : t.score >= 60 ? "text-amber-500" : "text-red-500"
              }`}>
                {t.score}%
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-700 ${t.color}`} style={{ width: `${t.score}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-lg bg-red-500/5 border border-red-500/10 p-3 text-sm">
        <strong className="text-red-500">Focus areas:</strong>{" "}
        <span className="text-muted-foreground">Thermodynamics, Organic Chemistry need more practice. Smart Study will prioritize these topics.</span>
      </div>
    </div>
  );
}

function SummaryModesDemo() {
  const [mode, setMode] = useState("default");
  const modes = [
    { id: "default", label: "Default", icon: "📝" },
    { id: "bullet", label: "Bullet Points", icon: "•" },
    { id: "cornell", label: "Cornell Notes", icon: "📋" },
    { id: "outline", label: "Outline", icon: "📑" },
    { id: "mindmap", label: "Mind Map", icon: "🧠" },
  ];

  const previews: Record<string, string[]> = {
    default: [
      "**TL;DR:** Photosynthesis converts light energy into chemical energy in plants.",
      "**Key Points:**",
      "- Occurs in chloroplasts using chlorophyll",
      "- Equation: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂",
      "- Two stages: Light reactions & Calvin cycle",
      "**Key Terms:** Chlorophyll, ATP, NADPH, Calvin cycle",
    ],
    bullet: [
      "**Overview:** Plants convert sunlight to glucose",
      "• Light reactions occur in thylakoid membranes",
      "• Calvin cycle occurs in the stroma",
      "• Produces glucose (C₆H₁₂O₆) and oxygen (O₂)",
      "• Requires: sunlight, water, carbon dioxide",
      "• Quick Review: Energy flow = Sun → ATP → Glucose",
    ],
    cornell: [
      "**Cue Questions:**",
      "Q: Where does photosynthesis occur?",
      "Q: What are the two main stages?",
      "**Notes:**",
      "- Chloroplasts contain thylakoids and stroma",
      "- Light reactions produce ATP + NADPH",
      "**Summary Box:** Photosynthesis is a two-stage process converting solar energy to chemical energy in chloroplasts.",
    ],
    outline: [
      "I. Photosynthesis Overview",
      "   A. Definition: Light energy → chemical energy",
      "   B. Location: Chloroplasts",
      "II. Light Reactions",
      "   A. Thylakoid membranes",
      "   B. Produces: ATP, NADPH, O₂",
      "III. Calvin Cycle",
      "   A. Stroma",
      "   B. Produces: G3P → Glucose",
    ],
    mindmap: [
      "**Central:** PHOTOSYNTHESIS",
      "├── Inputs: Sunlight, H₂O, CO₂",
      "├── Location: Chloroplasts",
      "│   ├── Thylakoids (Light Rxns)",
      "│   └── Stroma (Calvin Cycle)",
      "├── Outputs: Glucose, O₂",
      "└── Connection → Cellular Respiration (reverse)",
    ],
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Choose a summary style and see how the same content looks in different formats:
      </p>
      <div className="flex flex-wrap gap-2">
        {modes.map((m) => (
          <Button
            key={m.id}
            variant={mode === m.id ? "default" : "outline"}
            size="sm"
            onClick={() => setMode(m.id)}
            className="gap-1.5"
          >
            <span>{m.icon}</span> {m.label}
          </Button>
        ))}
      </div>
      <div className="rounded-xl border bg-muted/30 p-4 space-y-1">
        {previews[mode].map((line, i) => (
          <p key={i} className={`text-sm ${line.startsWith("**") ? "font-semibold mt-2" : "text-muted-foreground"}`}>
            {line.replace(/\*\*/g, "")}
          </p>
        ))}
      </div>
    </div>
  );
}

function DeckMergingDemo() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [merged, setMerged] = useState(false);

  const decks = [
    { id: "1", name: "Biology Ch.1 — Cell Structure", cards: 12 },
    { id: "2", name: "Biology Ch.2 — Photosynthesis", cards: 8 },
    { id: "3", name: "Biology Ch.3 — Cell Division", cards: 15 },
    { id: "4", name: "Physics — Newton's Laws", cards: 10 },
  ];

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setMerged(false);
  };

  const totalCards = decks.filter((d) => selected.has(d.id)).reduce((s, d) => s + d.cards, 0);

  if (merged) {
    return (
      <div className="text-center py-6 space-y-3">
        <div className="h-14 w-14 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-7 w-7 text-green-500" />
        </div>
        <p className="font-semibold">Merged Successfully!</p>
        <p className="text-sm text-muted-foreground">{totalCards} unique cards (3 duplicates removed)</p>
        <Button variant="outline" size="sm" onClick={() => { setMerged(false); setSelected(new Set()); }}>
          <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Select decks to combine into one unified study deck:
      </p>
      <div className="space-y-2">
        {decks.map((d) => (
          <button
            key={d.id}
            onClick={() => toggle(d.id)}
            className={`w-full flex items-center gap-3 rounded-lg border-2 p-3 text-left text-sm transition-all ${
              selected.has(d.id) ? "border-primary/30 bg-primary/5" : "border-border hover:border-primary/20"
            }`}
          >
            <div className={`h-4 w-4 rounded border-2 flex items-center justify-center ${
              selected.has(d.id) ? "border-primary bg-primary" : "border-muted-foreground"
            }`}>
              {selected.has(d.id) && <CheckCircle2 className="h-3 w-3 text-white" />}
            </div>
            <span className="flex-1 font-medium">{d.name}</span>
            <Badge variant="secondary" className="text-xs">{d.cards} cards</Badge>
          </button>
        ))}
      </div>
      {selected.size >= 2 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{totalCards} total cards selected</span>
          <Button size="sm" className="gap-1.5" onClick={() => setMerged(true)}>
            <Sparkles className="h-3.5 w-3.5" /> Merge {selected.size} Decks
          </Button>
        </div>
      )}
    </div>
  );
}

function AIModelDemo() {
  const [difficulty, setDifficulty] = useState("medium");
  const [style, setStyle] = useState("mixed");

  const difficultyOptions = [
    { id: "easy", label: "Easy", desc: "Simple language, basic concepts" },
    { id: "medium", label: "Medium", desc: "Standard academic level" },
    { id: "hard", label: "Hard", desc: "Advanced, exam-level depth" },
    { id: "adaptive", label: "Adaptive", desc: "AI adjusts to your level" },
  ];

  const styleOptions = [
    { id: "mixed", label: "Mixed" },
    { id: "conceptual", label: "Conceptual" },
    { id: "factual", label: "Factual" },
    { id: "application", label: "Application" },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Customize how AI generates your study materials:
      </p>
      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Difficulty Level</p>
        <div className="grid grid-cols-2 gap-2">
          {difficultyOptions.map((d) => (
            <button
              key={d.id}
              onClick={() => setDifficulty(d.id)}
              className={`rounded-lg border-2 p-3 text-left transition-all ${
                difficulty === d.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/20"
              }`}
            >
              <p className="text-sm font-medium">{d.label}</p>
              <p className="text-xs text-muted-foreground">{d.desc}</p>
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quiz Style</p>
        <div className="flex flex-wrap gap-2">
          {styleOptions.map((s) => (
            <Button
              key={s.id}
              variant={style === s.id ? "default" : "outline"}
              size="sm"
              onClick={() => setStyle(s.id)}
            >
              {s.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="rounded-lg bg-primary/5 border border-primary/10 p-3 text-sm">
        <strong>Current config:</strong> {difficultyOptions.find((d) => d.id === difficulty)?.label} difficulty, {style} quiz style.
        <span className="text-muted-foreground"> AI will generate content matching these preferences.</span>
      </div>
    </div>
  );
}

function DiagramDemo() {
  const [active, setActive] = useState(false);
  const [diagramType, setDiagramType] = useState("flowchart");

  const diagrams: Record<string, string[]> = {
    flowchart: [
      "flowchart TD",
      "  A[Sunlight] --> B[Chloroplast]",
      "  C[Water H₂O] --> B",
      "  D[CO₂] --> B",
      "  B --> E{Light Reactions}",
      "  E --> F[ATP + NADPH]",
      "  E --> G[O₂ Released]",
      "  F --> H{Calvin Cycle}",
      "  H --> I[Glucose C₆H₁₂O₆]",
    ],
    mindmap: [
      "mindmap",
      "  root((Photosynthesis))",
      "    Inputs",
      "      Sunlight",
      "      Water",
      "      Carbon Dioxide",
      "    Light Reactions",
      "      Thylakoid Membrane",
      "      ATP + NADPH",
      "    Calvin Cycle",
      "      Stroma",
      "      Glucose Production",
      "    Outputs",
      "      Oxygen",
      "      Glucose",
    ],
    sequence: [
      "sequenceDiagram",
      "  participant Sun as Sunlight",
      "  participant Chl as Chloroplast",
      "  participant Cal as Calvin Cycle",
      "  Sun->>Chl: Light energy",
      "  Note over Chl: Light Reactions",
      "  Chl->>Chl: Split H₂O → O₂",
      "  Chl->>Cal: ATP + NADPH",
      "  Note over Cal: Carbon Fixation",
      "  Cal->>Cal: CO₂ → G3P → Glucose",
    ],
  };

  const types = [
    { id: "flowchart", label: "Flowchart", icon: GitBranch },
    { id: "mindmap", label: "Mind Map", icon: Network },
    { id: "sequence", label: "Sequence", icon: Zap },
  ];

  if (!active) {
    return (
      <div className="text-center py-6 space-y-4">
        <Network className="h-10 w-10 text-primary mx-auto" />
        <p className="text-sm text-muted-foreground">
          Enter any topic → AI generates flowcharts, mind maps, sequence diagrams, and more
        </p>
        <Button onClick={() => setActive(true)} className="gap-2">
          <Sparkles className="h-4 w-4" />
          See Sample Diagrams
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Topic: <strong>Photosynthesis Process</strong></p>
      <div className="flex flex-wrap gap-2">
        {types.map((t) => {
          const Icon = t.icon;
          return (
            <Button
              key={t.id}
              variant={diagramType === t.id ? "default" : "outline"}
              size="sm"
              onClick={() => setDiagramType(t.id)}
              className="gap-1.5"
            >
              <Icon className="h-3.5 w-3.5" /> {t.label}
            </Button>
          );
        })}
      </div>
      <div className="rounded-xl bg-muted/30 border p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
          Generated Mermaid Code ({diagramType})
        </p>
        <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap leading-relaxed">
          {diagrams[diagramType].join("\n")}
        </pre>
      </div>
      <p className="text-xs text-muted-foreground">
        In the full app, this renders as an interactive SVG diagram. You can also export as SVG or copy the Mermaid code.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Feature cards config                                               */
/* ------------------------------------------------------------------ */

interface FeatureDemo {
  id: string;
  icon: typeof Youtube;
  title: string;
  badge: string;
  color: string;
  bg: string;
}

const features: FeatureDemo[] = [
  { id: "flashcards", icon: BookOpen, title: "AI Flashcards", badge: "Core", color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "quiz", icon: Brain, title: "AI Quiz Generator", badge: "Core", color: "text-violet-500", bg: "bg-violet-500/10" },
  { id: "summary", icon: FileText, title: "AI Summary", badge: "Core", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { id: "summarymodes", icon: Wand2, title: "Smart Summary Modes", badge: "New", color: "text-emerald-600", bg: "bg-emerald-600/10" },
  { id: "translation", icon: Globe, title: "Multilingual Translation", badge: "AI Feature", color: "text-cyan-500", bg: "bg-cyan-500/10" },
  { id: "voice", icon: Mic, title: "Voice Doubt Solver", badge: "AI Feature", color: "text-rose-500", bg: "bg-rose-500/10" },
  { id: "imageqa", icon: ImageIcon, title: "Image Q&A", badge: "AI Feature", color: "text-orange-500", bg: "bg-orange-500/10" },
  { id: "handwriting", icon: PenLine, title: "Handwriting OCR", badge: "AI Feature", color: "text-amber-500", bg: "bg-amber-500/10" },
  { id: "exam", icon: Target, title: "Exam Predictor", badge: "AI Feature", color: "text-pink-500", bg: "bg-pink-500/10" },
  { id: "weak", icon: Zap, title: "Weak Topic Tracker", badge: "AI Feature", color: "text-red-500", bg: "bg-red-500/10" },
  { id: "merge", icon: Layers, title: "Deck Merging", badge: "New", color: "text-cyan-600", bg: "bg-cyan-600/10" },
  { id: "diagram", icon: Network, title: "AI Diagram Generator", badge: "New", color: "text-teal-500", bg: "bg-teal-500/10" },
  { id: "aimodel", icon: SlidersHorizontal, title: "AI Model Adjustment", badge: "New", color: "text-amber-600", bg: "bg-amber-600/10" },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function DemoPage() {
  const [activeFeature, setActiveFeature] = useState("flashcards");

  const renderDemo = () => {
    switch (activeFeature) {
      case "flashcards": return <FlashcardDemo />;
      case "quiz": return <QuizDemoSection />;
      case "summary": return <SummaryDemo />;
      case "summarymodes": return <SummaryModesDemo />;
      case "translation": return <TranslationDemo />;
      case "voice": return <VoiceDoubtDemo />;
      case "imageqa": return <ImageQADemo />;
      case "handwriting": return <HandwritingDemo />;
      case "exam": return <ExamPredictorDemo />;
      case "weak": return <WeakTopicDemo />;
      case "merge": return <DeckMergingDemo />;
      case "diagram": return <DiagramDemo />;
      case "aimodel": return <AIModelDemo />;
      default: return null;
    }
  };

  const current = features.find((f) => f.id === activeFeature) ?? features[0];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden hero-gradient py-20 md:py-28">
          <div className="absolute inset-0 grid-pattern" />
          <div className="mx-auto max-w-7xl px-4 md:px-6 relative">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full border bg-primary/5 px-5 py-2 text-sm font-medium text-primary mb-8">
                <Sparkles className="h-4 w-4" />
                Interactive Demo
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                Try every feature{" "}
                <span className="gradient-text">right now</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground md:text-xl leading-relaxed">
                No sign-up needed. Explore all 13 AI features with live, interactive demos.
              </p>
            </div>
          </div>
        </section>

        {/* Demo area */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 md:px-6">
            <div className="grid gap-8 lg:grid-cols-[300px,1fr]">
              {/* Feature nav */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 px-3">
                  Select a feature
                </p>
                {features.map((feat) => {
                  const Icon = feat.icon;
                  const isActive = feat.id === activeFeature;
                  return (
                    <button
                      key={feat.id}
                      onClick={() => setActiveFeature(feat.id)}
                      className={`w-full flex items-center gap-3 rounded-xl p-3 text-left transition-all ${
                        isActive
                          ? "bg-primary/5 border-2 border-primary/20 shadow-sm"
                          : "border-2 border-transparent hover:bg-muted/50"
                      }`}
                    >
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${feat.bg}`}>
                        <Icon className={`h-4 w-4 ${feat.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${isActive ? "text-primary" : ""}`}>
                          {feat.title}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-[10px] shrink-0">
                        {feat.badge}
                      </Badge>
                    </button>
                  );
                })}
              </div>

              {/* Demo content */}
              <Card className="border-2">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${current.bg}`}>
                      <current.icon className={`h-5 w-5 ${current.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{current.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">Interactive demo</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {renderDemo()}
                </CardContent>
              </Card>
            </div>

            {/* CTA */}
            <div className="mt-16 text-center">
              <div className="rounded-2xl border-2 bg-card p-8 md:p-12 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-3">
                  Ready to use these features with your own content?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Sign up free and upload your YouTube lectures, PDFs, or handwritten notes.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <a href="/signup">
                    <Button size="lg" className="h-11 gap-2">
                      <Sparkles className="h-4 w-4" />
                      Get Started Free
                    </Button>
                  </a>
                  <a href="/#pricing">
                    <Button variant="outline" size="lg" className="h-11">
                      View Pricing
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
