// FILE: components/create/InputTabs.tsx
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { YouTubeInput } from "./YouTubeInput";
import { PDFUpload } from "./PDFUpload";
import { ImageQA } from "./ImageQA";
import { HandwritingOCR } from "./HandwritingOCR";
import { Youtube, FileUp, ImageIcon, PenTool } from "lucide-react";

interface InputTabsProps {
  defaultTab?: string;
}

export function InputTabs({ defaultTab = "youtube" }: InputTabsProps) {
  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4 h-12">
        <TabsTrigger value="youtube" className="gap-2 text-sm">
          <Youtube className="h-4 w-4" />
          <span className="hidden sm:inline">YouTube</span>
        </TabsTrigger>
        <TabsTrigger value="pdf" className="gap-2 text-sm">
          <FileUp className="h-4 w-4" />
          <span className="hidden sm:inline">PDF</span>
        </TabsTrigger>
        <TabsTrigger value="image" className="gap-2 text-sm">
          <ImageIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Image Q&A</span>
        </TabsTrigger>
        <TabsTrigger value="handwriting" className="gap-2 text-sm">
          <PenTool className="h-4 w-4" />
          <span className="hidden sm:inline">Notes</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="youtube" className="mt-6">
        <YouTubeInput />
      </TabsContent>
      <TabsContent value="pdf" className="mt-6">
        <PDFUpload />
      </TabsContent>
      <TabsContent value="image" className="mt-6">
        <ImageQA />
      </TabsContent>
      <TabsContent value="handwriting" className="mt-6">
        <HandwritingOCR />
      </TabsContent>
    </Tabs>
  );
}
