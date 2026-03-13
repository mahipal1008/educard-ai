// FILE: components/document/ActionCards.tsx
import Link from "next/link";
import { BrainCircuit, HelpCircle, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ActionCardsProps {
  deckId: string | null;
  quizId: string | null;
  cardCount: number;
  questionCount: number;
}

export function ActionCards({ deckId, quizId, cardCount, questionCount }: ActionCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {deckId && (
        <Card className="group hover:border-purple-500/30 hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 mb-4">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Study Flashcards</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {cardCount} cards ready for review
            </p>
            <div className="flex gap-2">
              <Link href={`/deck/${deckId}`}>
                <Button variant="outline" size="sm" className="gap-1">
                  Browse Cards
                </Button>
              </Link>
              <Link href={`/deck/${deckId}/study`}>
                <Button size="sm" className="gap-1">
                  Start Study <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {quizId && (
        <Card className="group hover:border-green-500/30 hover:shadow-lg transition-all">
          <CardContent className="p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-500 mb-4">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Take Quiz</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {questionCount} questions to test your knowledge
            </p>
            <Link href={`/quiz/${quizId}`}>
              <Button size="sm" className="gap-1">
                Start Quiz <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
