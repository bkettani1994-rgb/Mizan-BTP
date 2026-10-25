"use client";

import { Settings, Languages } from "lucide-react";

import { ComingSoon } from "@/components/coming-soon";
import { AccountCard } from "@/components/parametres/account-card";
import { ResetDemoData } from "@/components/parametres/reset-demo-data";
import { LanguageToggle } from "@/components/navigation/language-toggle";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLocale } from "@/lib/i18n/context";

export default function ParametresPage() {
  const { t } = useLocale();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
          {t("settingsPage.title")}
        </h1>
      </header>

      <AccountCard />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="size-5 text-blue" />
            {t("settingsPage.languageTitle")}
          </CardTitle>
          <CardDescription>{t("settingsPage.languageDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <LanguageToggle />
        </CardContent>
      </Card>

      <ResetDemoData />

      <ComingSoon
        icon={Settings}
        titre={t("settingsPage.otherSettingsTitle")}
        description={t("settingsPage.otherSettingsDesc")}
      />
    </div>
  );
}
