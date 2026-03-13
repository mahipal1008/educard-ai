"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { VoiceDoubtSolver } from "@/components/VoiceDoubtSolver";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showAuth />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
          <div className="mx-auto max-w-6xl p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
      <MobileNav />
      <VoiceDoubtSolver />
    </div>
  );
}
