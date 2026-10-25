"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAppData } from "@/lib/store";
import { useLocale } from "@/lib/i18n/context";

export function ResetDemoData() {
  const { reinitialiser } = useAppData();
  const { t } = useLocale();
  const [confirmation, setConfirmation] = useState(false);
  const [fait, setFait] = useState(false);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState(false);

  async function handleReset() {
    setErreur(false);
    setEnCours(true);
    try {
      await reinitialiser();
      setConfirmation(false);
      setFait(true);
      setTimeout(() => setFait(false), 2500);
    } catch {
      setErreur(true);
    } finally {
      setEnCours(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settingsPage.demoDataTitle")}</CardTitle>
        <CardDescription>{t("settingsPage.demoDataDesc")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {confirmation ? (
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm text-anthracite">{t("settingsPage.resetConfirm")}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setConfirmation(false)}>
                {t("common.cancel")}
              </Button>
              <Button size="sm" onClick={handleReset} disabled={enCours}>
                {t("common.confirm")}
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" onClick={() => setConfirmation(true)}>
            <RotateCcw className="size-4" />
            {t("settingsPage.resetButton")}
          </Button>
        )}
        {fait ? (
          <p className="text-sm font-medium text-success">{t("settingsPage.resetDone")}</p>
        ) : null}
        {erreur ? (
          <p className="text-sm font-medium text-danger">{t("common.networkError")}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
