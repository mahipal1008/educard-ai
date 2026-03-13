// FILE: components/TranslationSelector.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Languages, Loader2, ToggleLeft, ToggleRight, X } from "lucide-react";

const LANGUAGES = [
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", flag: "🇧🇩" },
  { code: "te", name: "Telugu", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", flag: "🇮🇳" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "zh", name: "Chinese (Simplified)", flag: "🇨🇳" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "sw", name: "Swahili", flag: "🇰🇪" },
  { code: "tr", name: "Turkish", flag: "🇹🇷" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "nl", name: "Dutch", flag: "🇳🇱" },
  { code: "pl", name: "Polish", flag: "🇵🇱" },
];

interface TranslationSelectorProps {
  loading: boolean;
  showTranslated: boolean;
  hasTranslation: boolean;
  onTranslate: (languageCode: string, languageName: string) => void;
  onToggle: () => void;
  onClear: () => void;
}

export function TranslationSelector({
  loading,
  showTranslated,
  hasTranslation,
  onTranslate,
  onToggle,
  onClear,
}: TranslationSelectorProps) {
  const [selectedLang, setSelectedLang] = useState("");

  const handleTranslate = () => {
    const lang = LANGUAGES.find((l) => l.code === selectedLang);
    if (lang) {
      onTranslate(lang.code, lang.name);
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Languages className="h-4 w-4 text-muted-foreground shrink-0" />

      {!hasTranslation ? (
        <>
          <Select value={selectedLang} onValueChange={(val) => setSelectedLang(val || "")}>
            <SelectTrigger className="w-[180px] h-8 text-xs">
              <SelectValue placeholder="Translate to..." />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.code} value={lang.code} className="text-xs">
                  {lang.flag} {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            size="sm"
            className="h-8 text-xs gap-1.5"
            onClick={handleTranslate}
            disabled={!selectedLang || loading}
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Languages className="h-3.5 w-3.5" />
            )}
            {loading ? "Translating..." : "Translate"}
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1.5"
            onClick={onToggle}
          >
            {showTranslated ? (
              <ToggleRight className="h-3.5 w-3.5" />
            ) : (
              <ToggleLeft className="h-3.5 w-3.5" />
            )}
            {showTranslated ? "Show Original" : "Show Translated"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs gap-1.5"
            onClick={onClear}
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </Button>
        </>
      )}
    </div>
  );
}
