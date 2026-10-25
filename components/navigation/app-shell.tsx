"use client";

import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";

import { Sidebar } from "@/components/navigation/sidebar";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { LanguageToggle } from "@/components/navigation/language-toggle";
import { useAppData } from "@/lib/store";

export function AppShell({ children }: { children: ReactNode }) {
  const { chargement } = useAppData();

  return (
    <div className="min-h-screen">
      <Sidebar />
      <BottomNav />
      <LanguageToggle className="fixed top-3 end-3 z-40 shadow-[var(--shadow-card-hover)] md:hidden" />
      <main className="bg-blueprint min-h-screen pb-28 md:ms-64 md:pb-0">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
          {chargement ? (
            <div className="flex min-h-[60vh] items-center justify-center">
              <Loader2 className="size-8 animate-spin text-navy/40" />
            </div>
          ) : (
            children
          )}
        </div>
      </main>
    </div>
  );
}
