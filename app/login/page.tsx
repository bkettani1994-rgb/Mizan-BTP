"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LanguageToggle } from "@/components/navigation/language-toggle";
import { createClient } from "@/lib/supabase/client";
import { useLocale } from "@/lib/i18n/context";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErreur(null);
    setLoading(true);

    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErreur(t("loginPage.error"));
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="bg-hero-navy relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <LanguageToggle variant="dark" className="fixed top-4 end-4 z-10" />
      <div className="relative z-10 w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Image
            src="/mizan-logo-white.png"
            alt="Mizan BTP"
            width={180}
            height={60}
            priority
            className="h-10 w-auto"
          />
          <p className="text-sm text-white/60">{t("brand.tagline")}</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-[var(--shadow-card-hover)] sm:p-8">
          <h1 className="text-xl font-extrabold tracking-tight text-navy sm:text-2xl">
            {t("loginPage.title")}
          </h1>
          <p className="mt-1 text-[15px] text-anthracite">{t("loginPage.subtitle")}</p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">{t("loginPage.email")}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                placeholder={t("loginPage.emailPlaceholder")}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">{t("loginPage.password")}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
              />
            </div>

            {erreur ? (
              <p className="rounded-xl bg-danger-bg px-3 py-2.5 text-sm text-danger">{erreur}</p>
            ) : null}

            <Button type="submit" size="lg" disabled={loading} className="mt-2 w-full">
              <LogIn className="size-5" />
              {loading ? t("loginPage.loading") : t("loginPage.submit")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
