// FILE: components/VoiceDoubtSolver.tsx
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Mic,
  MicOff,
  Loader2,
  X,
  MessageSquare,
  AlertCircle,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";

interface DoubtResult {
  transcript: string;
  answer: string;
  diagram: string | null;
  audio: string | null;
}

// Browser SpeechRecognition types
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
};

function getSpeechRecognition(): SpeechRecognitionInstance | null {
  const w = window as unknown as Record<string, unknown>;
  const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
  if (!SR) return null;
  return new (SR as new () => SpeechRecognitionInstance)();
}

export function VoiceDoubtSolver() {
  const [open, setOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DoubtResult | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const startRecording = useCallback(() => {
    setError(null);
    setTranscript("");

    const recognition = getSpeechRecognition();
    if (!recognition) {
      setError("Speech recognition is not supported in this browser. Try Chrome or Edge.");
      return;
    }

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript;
      }
      setTranscript(finalTranscript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "no-speech") {
        setError("No speech detected. Please try again.");
      } else if (event.error === "not-allowed") {
        setError("Microphone access denied. Please check browser permissions.");
      } else {
        setError("Something went wrong with speech recognition. Please try again.");
      }
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);

    // Auto-stop after 30 seconds
    setTimeout(() => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }, 30000);
  }, []);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
  }, []);

  const playAudio = useCallback((base64Audio: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(`data:audio/mpeg;base64,${base64Audio}`);
    audioRef.current = audio;
    audio.onplay = () => setIsSpeaking(true);
    audio.onended = () => setIsSpeaking(false);
    audio.onerror = () => setIsSpeaking(false);
    audio.play().catch(() => setIsSpeaking(false));
  }, []);

  const speakAnswer = useCallback((text: string, audioBase64?: string | null) => {
    // Try ElevenLabs audio first
    if (audioBase64) {
      playAudio(audioBase64);
      return;
    }
    // Fallback to browser TTS
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [playAudio]);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  const handleSubmit = async () => {
    if (!transcript.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/voice-doubt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: transcript.trim() }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to process doubt");

      const doubtResult: DoubtResult = {
        transcript: transcript.trim(),
        answer: json.data.answer,
        diagram: json.data.diagram,
        audio: json.data.audio || null,
      };
      setResult(doubtResult);
      setTranscript("");

      // Auto-speak the answer (ElevenLabs if available, else browser TTS)
      if (json.data.answer) {
        speakAnswer(json.data.answer, json.data.audio);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setTranscript("");
    stopSpeaking();
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 flex items-center justify-center hover:scale-105 transition-transform"
        title="Ask a doubt"
      >
        <Mic className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)]">
      <Card className="shadow-2xl border-2">
        <CardContent className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">AI Doubt Solver</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => { setOpen(false); handleReset(); }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-destructive/10 text-destructive text-xs">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {error}
            </div>
          )}

          {/* Recording state */}
          {!result && !loading && (
            <div className="text-center space-y-4">
              <p className="text-xs text-muted-foreground">
                {isRecording
                  ? "Listening... Speak your question clearly"
                  : transcript
                  ? "Recording ready. Tap Submit to send."
                  : "Tap the mic to ask a question"}
              </p>

              {/* Live transcript preview */}
              {transcript && (
                <div className="rounded-lg bg-muted/50 p-2.5 text-left">
                  <p className="text-xs text-muted-foreground">{transcript}</p>
                </div>
              )}

              {/* Mic button */}
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={loading}
                className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center transition-all ${
                  isRecording
                    ? "bg-destructive text-destructive-foreground animate-pulse shadow-lg shadow-destructive/25"
                    : "bg-primary text-primary-foreground hover:scale-105 shadow-lg shadow-primary/25"
                }`}
              >
                {isRecording ? (
                  <MicOff className="h-7 w-7" />
                ) : (
                  <Mic className="h-7 w-7" />
                )}
              </button>

              {/* Submit button */}
              {transcript && !isRecording && (
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    Clear
                  </Button>
                  <Button size="sm" onClick={handleSubmit} className="gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    Submit
                  </Button>
                </div>
              )}

              <p className="text-[10px] text-muted-foreground">
                Max 30 seconds
              </p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="text-center py-6 space-y-3">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="text-xs text-muted-foreground">
                AI is thinking about your question...
              </p>
              {transcript && (
                <div className="rounded-lg bg-muted/50 p-2.5 text-left">
                  <p className="text-xs text-muted-foreground">{transcript}</p>
                </div>
              )}
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {/* Transcript */}
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-[10px] font-medium text-muted-foreground mb-1 uppercase tracking-wider">
                  Your Question
                </p>
                <p className="text-sm">{result.transcript}</p>
              </div>

              {/* Answer */}
              <div className="rounded-lg bg-primary/5 border border-primary/10 p-3">
                <p className="text-[10px] font-medium text-primary mb-1 uppercase tracking-wider">
                  AI Answer
                </p>
                <p className="text-sm leading-relaxed">{result.answer}</p>
              </div>

              {/* Diagram if available */}
              {result.diagram && (
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-[10px] font-medium text-muted-foreground mb-1 uppercase tracking-wider">
                    Visual Breakdown
                  </p>
                  <pre className="text-xs whitespace-pre-wrap font-mono">
                    {result.diagram}
                  </pre>
                </div>
              )}

              {/* TTS controls */}
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2"
                onClick={() => isSpeaking ? stopSpeaking() : speakAnswer(result.answer, result.audio)}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="h-3.5 w-3.5" />
                    Stop Speaking
                  </>
                ) : (
                  <>
                    <Volume2 className="h-3.5 w-3.5" />
                    Listen to Answer
                  </>
                )}
              </Button>

              {/* Ask another */}
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleReset}
              >
                Ask Another Question
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
