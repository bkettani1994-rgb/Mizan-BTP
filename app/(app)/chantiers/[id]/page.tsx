"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Wallet, TrendingDown, PiggyBank, TrendingUp, Calendar, Receipt, Pencil } from "lucide-react";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { AddExpenseDialog } from "@/components/depenses/add-expense-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/empty-state";
import { ChantierDetailsCard } from "@/components/chantiers/chantier-details-card";
import { ChantierDetailsDialog } from "@/components/chantiers/chantier-details-dialog";
import { useAppData } from "@/lib/store";
import { useLocale } from "@/lib/i18n/context";
import { getArgentDepenseChantier, getDepensesDuChantier } from "@/lib/stats";
import { getStatutChantier, STATUT_STYLES } from "@/lib/status";
import { formatDate, formatMontant, formatPourcentage } from "@/lib/format";

export default function ChantierDetailPage() {
  const params = useParams<{ id: string }>();
  const { chantiers, depenses } = useAppData();
  const { locale, t } = useLocale();
  const chantier = chantiers.find((c) => c.id === params.id);

  if (!chantier) {
    return (
      <div className="flex flex-col gap-4">
        <Link
          href="/chantiers"
          className="flex w-fit items-center gap-1.5 text-sm font-semibold text-blue hover:underline"
        >
          <ArrowLeft className="size-4 rtl:rotate-180" />
          {t("common.backToProjects")}
        </Link>
        <EmptyState
          icon={MapPin}
          titre={t("projectDetail.notFoundTitle")}
          description={t("projectDetail.notFoundDesc")}
        />
      </div>
    );
  }

  const argentDepense = getArgentDepenseChantier(chantier, depenses);
  const resteDisponible = chantier.budgetTotal - argentDepense;
  const beneficePrevu = chantier.revenuPrevisionnel - chantier.budgetTotal;
  const pourcentageDepense =
    chantier.budgetTotal > 0 ? (argentDepense / chantier.budgetTotal) * 100 : 0;
  const pourcentageBudget = Math.min(100, Math.round(pourcentageDepense));
  const statut = getStatutChantier(
    chantier.budgetTotal,
    argentDepense,
    chantier.avancementTravaux,
  );
  const styles = STATUT_STYLES[statut];
  const StatutIcon = styles.icon;
  const depensesChantier = getDepensesDuChantier(chantier.id, depenses);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <Link
          href="/chantiers"
          className="flex w-fit items-center gap-1.5 text-sm font-semibold text-blue hover:underline"
        >
          <ArrowLeft className="size-4 rtl:rotate-180" />
          {t("common.backToProjects")}
        </Link>

        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
                {chantier.nom}
              </h1>
              <Badge variant={styles.badgeSolid}>
                <StatutIcon />
                {t(`status.${statut}`)}
              </Badge>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[15px] text-anthracite">
              <span className="flex items-center gap-1">
                <MapPin className="size-4" />
                {chantier.ville}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="size-4" />
                {t("projectDetail.startedOn", { date: formatDate(chantier.dateDebut, locale) })}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ChantierDetailsDialog
              chantier={chantier}
              trigger={
                <Button variant="outline">
                  <Pencil className="size-4" />
                  {t("projectDetailsForm.editProjectButton")}
                </Button>
              }
            />
            <AddExpenseDialog chantierIdParDefaut={chantier.id} />
          </div>
        </header>
      </div>

      <section
        aria-label={t("kpi.budgetTotal")}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <KpiCard
          icon={Wallet}
          label={t("kpi.budgetTotal")}
          value={formatMontant(chantier.budgetTotal, locale)}
          tone="navy"
        />
        <KpiCard
          icon={TrendingDown}
          label={t("kpi.spent")}
          value={formatMontant(argentDepense, locale)}
          sublabel={t("kpi.spentOfBudget", { percent: formatPourcentage(pourcentageDepense) })}
          tone="terracotta"
        />
        <KpiCard
          icon={PiggyBank}
          label={t("kpi.remaining")}
          value={formatMontant(resteDisponible, locale)}
          tone="blue"
          negatif={resteDisponible < 0}
        />
        <KpiCard
          icon={TrendingUp}
          label={t("kpi.profit")}
          value={formatMontant(beneficePrevu, locale)}
          sublabel={t("kpi.profitMarginOnProject")}
          tone="success"
          negatif={beneficePrevu < 0}
        />
      </section>

      <Card>
        <CardContent className="flex flex-col gap-5 pt-5 sm:pt-6">
          <div>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="text-anthracite">{t("projectCard.progress")}</span>
              <span className="font-semibold text-navy">
                {formatPourcentage(chantier.avancementTravaux)}
              </span>
            </div>
            <Progress value={chantier.avancementTravaux} indicatorClassName="bg-blue" />
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="text-anthracite">{t("projectCard.budgetConsumed")}</span>
              <span className="font-semibold text-navy">
                {formatPourcentage(pourcentageBudget)}
              </span>
            </div>
            <Progress
              value={pourcentageBudget}
              indicatorClassName={
                statut === "rouge" ? "bg-danger" : statut === "orange" ? "bg-warning" : "bg-success"
              }
            />
          </div>
        </CardContent>
      </Card>

      <ChantierDetailsCard chantier={chantier} />

      <Card>
        <CardHeader>
          <CardTitle>{t("projectDetail.expensesOfProject")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col divide-y divide-border">
          {depensesChantier.length === 0 ? (
            <EmptyState
              icon={Receipt}
              titre={t("projectDetail.noExpensesTitle")}
              description={t("projectDetail.noExpensesDesc")}
            />
          ) : (
            depensesChantier.map((depense) => (
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
                        {depense.categorie} · {formatDate(depense.date, locale)}
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
