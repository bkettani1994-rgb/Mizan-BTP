"use client";

import { Building2 } from "lucide-react";

import { ChantierCard } from "@/components/dashboard/chantier-card";
import { AddChantierDialog } from "@/components/chantiers/add-chantier-dialog";
import { EmptyState } from "@/components/empty-state";
import { useAppData } from "@/lib/store";
import { useLocale } from "@/lib/i18n/context";

export default function ChantiersPage() {
  const { chantiers, depenses } = useAppData();
  const { t } = useLocale();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
            {t("projectsPage.title")}
          </h1>
          <p className="mt-1 text-[15px] text-anthracite">
            {t(chantiers.length > 1 ? "projectsPage.subtitlePlural" : "projectsPage.subtitle", {
              count: chantiers.length,
            })}
          </p>
        </div>
        <AddChantierDialog />
      </header>

      {chantiers.length === 0 ? (
        <EmptyState
          icon={Building2}
          titre={t("dashboard.noProjectsTitle")}
          description={t("dashboard.noProjectsDesc")}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {chantiers.map((chantier) => (
            <ChantierCard key={chantier.id} chantier={chantier} depenses={depenses} />
          ))}
        </div>
      )}
    </div>
  );
}
