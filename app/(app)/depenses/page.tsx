"use client";

import { useMemo, useState } from "react";
import { Receipt } from "lucide-react";

import { AddExpenseDialog } from "@/components/depenses/add-expense-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { EmptyState } from "@/components/empty-state";
import { useAppData } from "@/lib/store";
import { useLocale } from "@/lib/i18n/context";
import { formatDate, formatMontant } from "@/lib/format";

export default function DepensesPage() {
  const { chantiers, depenses } = useAppData();
  const { locale, t } = useLocale();
  const [chantierId, setChantierId] = useState("tous");

  const depensesTriees = useMemo(
    () =>
      [...depenses].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    [depenses],
  );

  const depensesFiltrees =
    chantierId === "tous"
      ? depensesTriees
      : depensesTriees.filter((d) => d.chantierId === chantierId);

  const total = depensesFiltrees.reduce((sum, d) => sum + d.montant, 0);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
            {t("expensesPage.title")}
          </h1>
          <p className="mt-1 text-[15px] text-anthracite">
            {t(depenses.length > 1 ? "expensesPage.countMany" : "expensesPage.countOne", {
              count: depenses.length,
            })}
          </p>
        </div>
        <AddExpenseDialog />
      </header>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:w-72">
          <Select
            aria-label={t("expensesPage.filterLabel")}
            value={chantierId}
            onChange={(event) => setChantierId(event.target.value)}
          >
            <option value="tous">{t("common.allProjects")}</option>
            {chantiers.map((chantier) => (
              <option key={chantier.id} value={chantier.id}>
                {chantier.nom}
              </option>
            ))}
          </Select>
        </div>
        <p className="text-[15px] font-semibold text-navy">
          {t("common.totalDisplayed")} : {formatMontant(total, locale)}
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col divide-y divide-border pt-5 sm:pt-6">
          {depensesFiltrees.length === 0 ? (
            <EmptyState
              icon={Receipt}
              titre={t("expensesPage.noExpensesTitle")}
              description={t("expensesPage.noExpensesDesc")}
            />
          ) : (
            depensesFiltrees.map((depense) => (
              <AddExpenseDialog
                key={depense.id}
                depense={depense}
                trigger={
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 rounded-lg py-3.5 text-start transition-colors first:pt-0 last:pb-0 hover:bg-surface"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-medium text-navy">
                        {depense.description}
                      </p>
                      <p className="mt-0.5 text-sm text-anthracite">
                        {chantiers.find((c) => c.id === depense.chantierId)?.nom ??
                          t("common.projectNotFoundShort")}{" "}
                        · {depense.categorie} · {formatDate(depense.date, locale)}
                        {depense.fournisseur ? ` · ${depense.fournisseur}` : ""}
                      </p>
                    </div>
                    <p className="shrink-0 text-[15px] font-semibold text-navy">
                      {formatMontant(depense.montant, locale)}
                    </p>
                  </button>
                }
              />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
