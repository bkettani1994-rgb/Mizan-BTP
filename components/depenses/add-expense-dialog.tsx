"use client";

import { useState, cloneElement, isValidElement } from "react";
import { Plus, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmDelete } from "@/components/ui/confirm-delete";
import { useAppData } from "@/lib/store";
import { useLocale } from "@/lib/i18n/context";
import { CURRENCY_LABEL } from "@/lib/i18n/translations";
import { CATEGORY_OPTIONS } from "@/lib/categories";
import type { Depense } from "@/lib/types";

function dateInputVersISO(valeur: string) {
  // Les champs <input type="date"> renvoient "AAAA-MM-JJ" : on fixe midi
  // pour éviter tout décalage de fuseau horaire lors de l'affichage.
  return new Date(`${valeur}T12:00:00`).toISOString();
}

export function AddExpenseDialog({
  trigger,
  chantierIdParDefaut,
  depense,
}: {
  trigger?: React.ReactNode;
  /** Pré-remplit et verrouille le chantier, utile depuis une fiche chantier. */
  chantierIdParDefaut?: string;
  /** Dépense existante à modifier ; omis pour créer une nouvelle dépense. */
  depense?: Depense;
}) {
  const { chantiers, ajouterDepense, modifierDepense, supprimerDepense } = useAppData();
  const { locale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const [plusDeDetails, setPlusDeDetails] = useState(Boolean(depense?.fournisseur));
  const [issue, setIssue] = useState<"saved" | "deleted" | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState(false);
  const modeEdition = Boolean(depense);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const chantierId = String(data.get("chantier") ?? "");
    const description = String(data.get("description") ?? "").trim();
    const montant = Number(data.get("montant"));
    const date = String(data.get("date") ?? "");
    const categorie = String(data.get("categorie") ?? "Autre");
    const fournisseur = String(data.get("fournisseur") ?? "").trim();

    if (!chantierId || !description || !montant || !date) return;

    const valeurs = {
      chantierId,
      description,
      montant,
      date: dateInputVersISO(date),
      categorie: categorie || "Autre",
      fournisseur: fournisseur || undefined,
    };

    setErreur(false);
    setEnvoi(true);
    try {
      if (modeEdition && depense) {
        await modifierDepense(depense.id, valeurs);
      } else {
        await ajouterDepense(valeurs);
      }

      setIssue("saved");
      setTimeout(() => {
        setOpen(false);
        setIssue(null);
        if (!modeEdition) {
          setPlusDeDetails(false);
          form.reset();
        }
      }, 900);
    } catch {
      setErreur(true);
    } finally {
      setEnvoi(false);
    }
  }

  async function handleDelete() {
    if (!depense) return;
    setErreur(false);
    try {
      await supprimerDepense(depense.id);
      setIssue("deleted");
      setTimeout(() => {
        setOpen(false);
        setIssue(null);
      }, 900);
    } catch {
      setErreur(true);
    }
  }

  const triggerElement =
    trigger && isValidElement(trigger) ? (
      cloneElement(trigger as React.ReactElement<{ onClick?: () => void }>, {
        onClick: () => setOpen(true),
      })
    ) : (
      <Button onClick={() => setOpen(true)} className="shadow-sm" size="lg">
        <Plus className="size-5" />
        {t("common.addExpense")}
      </Button>
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {triggerElement}
      <DialogContent>
        {issue ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-success-bg">
              <Check className="size-7 text-success" />
            </div>
            <p className="text-lg font-semibold text-navy">
              {t(
                issue === "deleted"
                  ? "expenseForm.deletedTitle"
                  : modeEdition
                    ? "expenseForm.updatedTitle"
                    : "expenseForm.savedTitle",
              )}
            </p>
            {issue === "saved" && (
              <p className="text-sm text-anthracite">
                {t(modeEdition ? "expenseForm.updatedDesc" : "expenseForm.savedDesc")}
              </p>
            )}
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>
                {t(modeEdition ? "expenseForm.editTitle" : "expenseForm.title")}
              </DialogTitle>
              <DialogDescription>{t("expenseForm.subtitle")}</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="chantier">{t("expenseForm.project")}</Label>
                {chantierIdParDefaut && !modeEdition ? (
                  <>
                    <input type="hidden" name="chantier" value={chantierIdParDefaut} />
                    <Select id="chantier" value={chantierIdParDefaut} disabled>
                      {chantiers.map((chantier) => (
                        <option key={chantier.id} value={chantier.id}>
                          {chantier.nom} — {chantier.ville}
                        </option>
                      ))}
                    </Select>
                  </>
                ) : (
                  <Select
                    id="chantier"
                    name="chantier"
                    required
                    defaultValue={depense?.chantierId ?? ""}
                  >
                    <option value="" disabled>
                      {t("expenseForm.projectPlaceholder")}
                    </option>
                    {chantiers.map((chantier) => (
                      <option key={chantier.id} value={chantier.id}>
                        {chantier.nom} — {chantier.ville}
                      </option>
                    ))}
                  </Select>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="description">{t("expenseForm.description")}</Label>
                <Input
                  id="description"
                  name="description"
                  placeholder={t("expenseForm.descriptionPlaceholder")}
                  defaultValue={depense?.description ?? ""}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="montant">
                    {t("expenseForm.amount", { currency: CURRENCY_LABEL[locale] })}
                  </Label>
                  <Input
                    id="montant"
                    name="montant"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    placeholder="0"
                    defaultValue={depense?.montant ?? ""}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="date">{t("expenseForm.date")}</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    defaultValue={depense?.date.slice(0, 10) ?? new Date().toISOString().slice(0, 10)}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="categorie">{t("expenseForm.category")}</Label>
                <Select id="categorie" name="categorie" defaultValue={depense?.categorie ?? ""}>
                  <option value="" disabled>
                    {t("expenseForm.categoryPlaceholder")}
                  </option>
                  {CATEGORY_OPTIONS.map((categorie) => (
                    <option key={categorie.value} value={categorie.value}>
                      {t(categorie.key)}
                    </option>
                  ))}
                </Select>
              </div>

              {plusDeDetails ? (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="fournisseur">
                    {t("expenseForm.supplier")}{" "}
                    <span className="font-normal text-anthracite">
                      {t("expenseForm.supplierOptional")}
                    </span>
                  </Label>
                  <Input
                    id="fournisseur"
                    name="fournisseur"
                    placeholder={t("expenseForm.supplierPlaceholder")}
                    defaultValue={depense?.fournisseur ?? ""}
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setPlusDeDetails(true)}
                  className="self-start text-sm font-semibold text-blue hover:underline"
                >
                  {t("expenseForm.addSupplier")}
                </button>
              )}

              {modeEdition && (
                <ConfirmDelete
                  triggerLabel={t("expenseForm.deleteExpense")}
                  confirmMessage={t("expenseForm.deleteExpenseConfirm")}
                  confirmLabel={t("common.delete")}
                  cancelLabel={t("common.cancel")}
                  onConfirm={handleDelete}
                />
              )}

              {erreur ? (
                <p className="rounded-xl bg-danger-bg px-3 py-2.5 text-sm text-danger">
                  {t("common.networkError")}
                </p>
              ) : null}

              <DialogFooter className="mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  {t("common.cancel")}
                </Button>
                <Button type="submit" disabled={envoi}>
                  {t(modeEdition ? "expenseForm.saveEdit" : "expenseForm.submit")}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
