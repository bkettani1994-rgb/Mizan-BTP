"use client";

import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LogoutButton } from "@/components/navigation/logout-button";
import { createClient } from "@/lib/supabase/client";
import { useLocale } from "@/lib/i18n/context";

export function AccountCard() {
  const { t } = useLocale();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setEmail(user?.email ?? null);
    });
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserRound className="size-5 text-blue" />
          {t("settingsPage.accountTitle")}
        </CardTitle>
        <CardDescription>{t("settingsPage.accountDesc")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        {email ? <p className="text-[15px] font-semibold text-navy">{email}</p> : null}
        <LogoutButton />
      </CardContent>
    </Card>
  );
}
