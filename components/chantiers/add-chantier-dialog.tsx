"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAppData } from "@/lib/store";
import { useLocale } from "@/lib/i18n/context";
import { CURRENCY_LABEL } from "@/lib/i18n/translations";

export function AddChantierDialog() {
  const { ajouterChantier } = useAppData();
  const { locale, t } = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [plusDeDetails, setPlusDeDetails] = useState(false);
  const [confirme, setConfirme] = useState(false);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const nom = String(data.get("nom") ?? "").trim();
    const ville = String(data.get("ville") ?? "").trim();
    const budgetTotal = Number(data.get("budgetTotal"));
    const revenuPrevisionnel = Number(data.get("revenuPrevisionnel"));
    const dateDebut = String(data.get("dateDebut") ?? "");
    const avancementTravaux = Number(data.get("avancementTravaux") || 0);

    if (!nom || !ville || !budgetTotal || !revenuPrevisionnel || !dateDebut) return;

    setErreur(false);
    setEnvoi(true);
    try {
      const id = await ajouterChantier({
        nom,
        ville,
        budgetTotal,
        revenuPrevisionnel,
        avancementTravaux: Math.min(100, Math.max(0, avancementTravaux)),
        depensesAnterieures: 0,
        dateDebut: new Date(`${dateDebut}T12:00:00`).toISOString(),
      });

      setConfirme(true);
      setTimeout(() => {
        setOpen(false);
        setConfirme(false);
        setPlusDeDetails(false);
        form.reset();
        router.push(`/chantiers/${id}`);
      }, 900);
    } catch {
      setErreur(true);
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)} className="shadow-sm" size="lg">
        <Plus className="size-5" />
        {t("common.addProject")}
      </Button>
      <DialogContent>
        {confirme ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-success-bg">
              <Check className="size-7 text-success" />
            </div>
            <p className="text-lg font-semibold text-navy">{t("projectForm.savedTitle")}</p>
            <p className="text-sm text-anthracite">{t("projectForm.savedDesc")}</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{t("projectForm.title")}</DialogTitle>
              <DialogDescription>{t("projectForm.subtitle")}</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="nom">{t("projectForm.name")}</Label>
                <Input
                  id="nom"
                  name="nom"
                  placeholder={t("projectForm.namePlaceholder")}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ville">{t("projectForm.city")}</Label>
                <Input
                  id="ville"
                  name="ville"
                  placeholder={t("projectForm.cityPlaceholder")}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="budgetTotal">
                    {t("projectForm.budget", { currency: CURRENCY_LABEL[locale] })}
                  </Label>
                  <Input
                    id="budgetTotal"
                    name="budgetTotal"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    placeholder="0"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="revenuPrevisionnel">
                    {t("projectForm.revenue", { currency: CURRENCY_LABEL[locale] })}
                  </Label>
                  <Input
                    id="revenuPrevisionnel"
                    name="revenuPrevisionnel"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="dateDebut">{t("projectForm.startDate")}</Label>
                <Input
                  id="dateDebut"
                  name="dateDebut"
                  type="date"
                  defaultValue={new Date().toISOString().slice(0, 10)}
                  required
                />
              </div>

              {plusDeDetails ? (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="avancementTravaux">
                    {t("projectForm.progress")}{" "}
                    <span className="font-normal text-anthracite">
                      {t("projectForm.progressOptional")}
                    </span>
                  </Label>
                  <Input
                    id="avancementTravaux"
                    name="avancementTravaux"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={100}
                    placeholder="0"
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setPlusDeDetails(true)}
                  className="self-start text-sm font-semibold text-blue hover:underline"
                >
                  {t("projectForm.addProgress")}
                </button>
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
                  {t("projectForm.submit")}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
