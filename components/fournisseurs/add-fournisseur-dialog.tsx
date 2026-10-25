"use client";

import { useState, cloneElement, isValidElement, type ReactElement } from "react";
import { Plus, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
import { CATEGORY_OPTIONS } from "@/lib/categories";
import type { Fournisseur } from "@/lib/types";

export function AddFournisseurDialog({
  fournisseur,
  trigger,
}: {
  /** Fournisseur existant à modifier ; omis pour créer un nouveau fournisseur. */
  fournisseur?: Fournisseur;
  trigger?: ReactElement<{ onClick?: () => void }>;
}) {
  const { ajouterFournisseur, modifierFournisseur, supprimerFournisseur } = useAppData();
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [plusDeDetails, setPlusDeDetails] = useState(Boolean(fournisseur?.notes));
  const [issue, setIssue] = useState<"saved" | "deleted" | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState(false);
  const modeEdition = Boolean(fournisseur);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const nom = String(data.get("nom") ?? "").trim();
    if (!nom) return;

    const champOuVide = (cle: string) => {
      const v = String(data.get(cle) ?? "").trim();
      return v ? v : undefined;
    };

    const valeurs = {
      nom,
      telephone: champOuVide("telephone"),
      email: champOuVide("email"),
      specialite: champOuVide("specialite"),
      adresse: champOuVide("adresse"),
      notes: champOuVide("notes"),
    };

    setErreur(false);
    setEnvoi(true);
    try {
      if (modeEdition && fournisseur) {
        await modifierFournisseur(fournisseur.id, valeurs);
      } else {
        await ajouterFournisseur(valeurs);
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
    if (!fournisseur) return;
    setErreur(false);
    try {
      await supprimerFournisseur(fournisseur.id);
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
      cloneElement(trigger, { onClick: () => setOpen(true) })
    ) : (
      <Button onClick={() => setOpen(true)} className="shadow-sm" size="lg">
        <Plus className="size-5" />
        {t("common.newSupplier")}
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
                  ? "supplierForm.deletedTitle"
                  : modeEdition
                    ? "supplierForm.updatedTitle"
                    : "supplierForm.savedTitle",
              )}
            </p>
            {issue === "saved" && (
              <p className="text-sm text-anthracite">
                {t(modeEdition ? "supplierForm.updatedDesc" : "supplierForm.savedDesc")}
              </p>
            )}
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>
                {t(modeEdition ? "supplierForm.editTitle" : "supplierForm.title")}
              </DialogTitle>
              <DialogDescription>{t("supplierForm.subtitle")}</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="nom">{t("supplierForm.name")}</Label>
                <Input
                  id="nom"
                  name="nom"
                  placeholder={t("supplierForm.namePlaceholder")}
                  defaultValue={fournisseur?.nom ?? ""}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="telephone">{t("supplierForm.phone")}</Label>
                  <Input
                    id="telephone"
                    name="telephone"
                    type="tel"
                    placeholder={t("supplierForm.phonePlaceholder")}
                    defaultValue={fournisseur?.telephone ?? ""}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">{t("supplierForm.email")}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t("supplierForm.emailPlaceholder")}
                    defaultValue={fournisseur?.email ?? ""}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="specialite">{t("supplierForm.specialty")}</Label>
                <Select
                  id="specialite"
                  name="specialite"
                  defaultValue={fournisseur?.specialite ?? ""}
                >
                  <option value="" disabled>
                    {t("supplierForm.specialtyPlaceholder")}
                  </option>
                  {CATEGORY_OPTIONS.map((categorie) => (
                    <option key={categorie.value} value={categorie.value}>
                      {t(categorie.key)}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="adresse">{t("supplierForm.address")}</Label>
                <Input
                  id="adresse"
                  name="adresse"
                  placeholder={t("supplierForm.addressPlaceholder")}
                  defaultValue={fournisseur?.adresse ?? ""}
                />
              </div>

              {plusDeDetails ? (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="notes">{t("supplierForm.notes")}</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder={t("supplierForm.notesPlaceholder")}
                    defaultValue={fournisseur?.notes ?? ""}
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setPlusDeDetails(true)}
                  className="self-start text-sm font-semibold text-blue hover:underline"
                >
                  {t("supplierForm.addNotes")}
                </button>
              )}

              {modeEdition && fournisseur && (
                <ConfirmDelete
                  triggerLabel={t("supplierForm.deleteSupplier")}
                  confirmMessage={t("supplierForm.deleteSupplierConfirm")}
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
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  {t("common.cancel")}
                </Button>
                <Button type="submit" disabled={envoi}>
                  {t(modeEdition ? "supplierForm.saveEdit" : "supplierForm.submit")}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
