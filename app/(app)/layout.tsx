import type { ReactNode } from "react";

import { AppShell } from "@/components/navigation/app-shell";
import { AppProvider } from "@/lib/store";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <AppShell>{children}</AppShell>
    </AppProvider>
  );
}
