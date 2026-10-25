"use client";

import { Wallet, TrendingDown, PiggyBank, TrendingUp, Building2, HardHat } from "lucide-react";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { ChantierCard } from "@/components/dashboard/chantier-card";
import { MonthlyExpensesChart } from "@/components/dashboard/monthly-expenses-chart";
import { RecentExpenses } from "@/components/dashboard/recent-expenses";
import { AddExpenseDialog } from "@/components/depenses/add-expense-dialog";
import { AddChantierDialog } from "@/components/chantiers/add-chantier-dialog";
import { EmptyState } from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAppData } from "@/lib/store";
import { useLocale } from "@/lib/i18n/context";
import { getDepensesMensuelles, getDernieresDepenses, getIndicateursGlobaux } from "@/lib/stats";
import { formatMontant, formatPourcentage } from "@/lib/format";

export default function DashboardPage() {
  const { chantiers, depenses } = useAppData();
  const { locale, t } = useLocale();
  const indicateurs = getIndicateursGlobaux(chantiers, depenses);
  const depensesMensuelles = getDepensesMensuelles(depenses, 6, locale);
  const dernieresDepenses = getDernieresDepenses(depenses, 5);

  return (
    <div className="flex flex-col gap-8">
      <header className="bg-hero-navy animate-float-in relative overflow-hidden rounded-3xl px-6 py-8 text-white shadow-[var(--shadow-card-hover)] sm:px-8 sm:py-10">
        <HardHat
          aria-hidden
          className="pointer-events-none absolute -end-8 -top-10 size-44 text-white/[0.06] sm:size-60"
        />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-terracotta-light">
              Mizan BTP
            </p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-[34px]">
              {t("dashboard.greeting")}
            </h1>
            <p className="mt-2 max-w-md text-[15px] text-white/70">
              {t("dashboard.subtitle")}
            </p>
          </div>
          <AddExpenseDialog />
        </div>
      </header>

      <section
        aria-label={t("kpi.budgetTotal")}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <KpiCard
          icon={Wallet}
          label={t("kpi.budgetTotal")}
          value={formatMontant(indicateurs.budgetTotal, locale)}
          tone="navy"
        />
        <KpiCard
          icon={TrendingDown}
          label={t("kpi.spent")}
          value={formatMontant(indicateurs.argentDepense, locale)}
          sublabel={t("kpi.spentOfBudget", { percent: formatPourcentage(indicateurs.pourcentageDepense) })}
          tone="terracotta"
        />
        <KpiCard
          icon={PiggyBank}
          label={t("kpi.remaining")}
          value={formatMontant(indicateurs.resteDisponible, locale)}
          tone="blue"
          negatif={indicateurs.resteDisponible < 0}
        />
        <KpiCard
          icon={TrendingUp}
          label={t("kpi.profit")}
          value={formatMontant(indicateurs.beneficePrevu, locale)}
          sublabel={t("kpi.profitMargin", { percent: formatPourcentage(indicateurs.margePourcentage) })}
          tone="success"
          negatif={indicateurs.beneficePrevu < 0}
        />
      </section>

      <section aria-label={t("dashboard.myProjects")} className="flex flex-col gap-4">
        <h2 className="text-xl font-bold tracking-tight text-navy">{t("dashboard.myProjects")}</h2>
        {chantiers.length === 0 ? (
          <EmptyState
            icon={Building2}
            titre={t("dashboard.noProjectsTitle")}
            description={t("dashboard.noProjectsDesc")}
            action={<AddChantierDialog />}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {chantiers.map((chantier) => (
              <ChantierCard key={chantier.id} chantier={chantier} depenses={depenses} />
            ))}
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>{t("dashboard.chartTitle")}</CardTitle>
            <CardDescription>{t("dashboard.chartSubtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <MonthlyExpensesChart data={depensesMensuelles} />
          </CardContent>
        </Card>

        <div className="xl:col-span-2">
          <RecentExpenses depenses={dernieresDepenses} chantiers={chantiers} />
        </div>
      </section>
    </div>
  );
}
