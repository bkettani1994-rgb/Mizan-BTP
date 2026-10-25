"use client";

import { Handshake, Phone, Mail, MapPin, Pencil } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { AddFournisseurDialog } from "@/components/fournisseurs/add-fournisseur-dialog";
import { useAppData } from "@/lib/store";
import { useLocale } from "@/lib/i18n/context";
import { getFournisseurs } from "@/lib/stats";
import { formatDate, formatMontant } from "@/lib/format";
import { CATEGORY_OPTIONS } from "@/lib/categories";

export default function FournisseursPage() {
  const { chantiers, depenses, fournisseurs: carnetFournisseurs } = useAppData();
  const { locale, t } = useLocale();
  const fournisseurs = getFournisseurs(
    depenses,
    chantiers,
    carnetFournisseurs,
    t("common.projectNotFoundShort"),
  );

  const specialiteLabel = (valeur?: string) =>
    valeur ? (t(CATEGORY_OPTIONS.find((c) => c.value === valeur)?.key ?? "") || valeur) : undefined;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
            {t("suppliersPage.title")}
          </h1>
          <p className="mt-1 text-[15px] text-anthracite">{t("suppliersPage.subtitle")}</p>
        </div>
        <AddFournisseurDialog />
      </header>

      {fournisseurs.length === 0 ? (
        <EmptyState
          icon={Handshake}
          titre={t("suppliersPage.noSuppliersTitle")}
          description={t("suppliersPage.noSuppliersDesc")}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {fournisseurs.map((fournisseur) => (
            <Card
              key={fournisseur.id ?? fournisseur.nom}
              className="hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
            >
              <CardContent className="flex flex-col gap-3 pt-5 sm:pt-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-navy sm:text-lg">
                      {fournisseur.nom}
                    </h3>
                    {fournisseur.specialite ? (
                      <p className="mt-0.5 text-sm text-blue">
                        {specialiteLabel(fournisseur.specialite)}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <p className="text-lg font-bold text-navy">
                      {formatMontant(fournisseur.montantTotal, locale)}
                    </p>
                    {fournisseur.id ? (
                      <AddFournisseurDialog
                        fournisseur={carnetFournisseurs.find((f) => f.id === fournisseur.id)}
                        trigger={
                          <Button variant="outline" size="sm">
                            <Pencil className="size-3.5" />
                            {t("projectDetailsForm.editButton")}
                          </Button>
                        }
                      />
                    ) : null}
                  </div>
                </div>

                <p className="text-sm text-anthracite">
                  {fournisseur.nombreDepenses === 0 || !fournisseur.derniereDepense
                    ? t("suppliersPage.noExpenseYet")
                    : t(
                        fournisseur.nombreDepenses > 1
                          ? "suppliersPage.expenseMany"
                          : "suppliersPage.expenseOne",
                        {
                          count: fournisseur.nombreDepenses,
                          date: formatDate(fournisseur.derniereDepense, locale),
                        },
                      )}
                </p>

                {fournisseur.chantiers.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {fournisseur.chantiers.map((nom) => (
                      <Badge key={nom} variant="neutral">
                        {nom}
                      </Badge>
                    ))}
                  </div>
                ) : null}

                {fournisseur.telephone || fournisseur.email || fournisseur.adresse ? (
                  <div className="flex flex-col gap-1 border-t border-border pt-3 text-sm text-anthracite">
                    {fournisseur.telephone ? (
                      <span className="flex items-center gap-1.5">
                        <Phone className="size-3.5 shrink-0" />
                        {fournisseur.telephone}
                      </span>
                    ) : null}
                    {fournisseur.email ? (
                      <span className="flex items-center gap-1.5">
                        <Mail className="size-3.5 shrink-0" />
                        {fournisseur.email}
                      </span>
                    ) : null}
                    {fournisseur.adresse ? (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="size-3.5 shrink-0" />
                        {fournisseur.adresse}
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
