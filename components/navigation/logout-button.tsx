"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { useLocale } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

export function LogoutButton({
  variant = "light",
  className,
}: {
  /** "dark" pour une utilisation sur fond sombre (sidebar), "light" sinon. */
  variant?: "light" | "dark";
  className?: string;
}) {
  const router = useRouter();
  const { t } = useLocale();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={cn(
        "inline-flex items-center gap-2 text-sm font-semibold transition-colors disabled:opacity-50",
        variant === "dark"
          ? "text-white/60 hover:text-white"
          : "rounded-xl border border-border bg-white px-4 py-2.5 text-danger hover:bg-danger-bg",
        className,
      )}
    >
      <LogOut className="size-4" />
      {t("nav.logout")}
    </button>
  );
}
