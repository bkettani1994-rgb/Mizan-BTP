import type { Chantier, ChantierDetails, Depense, Fournisseur } from "@/lib/types";

/** Les colonnes numériques Postgres ("numeric") reviennent en chaîne via le client JS. */
function versNombre(valeur: unknown): number {
  return typeof valeur === "number" ? valeur : Number(valeur ?? 0);
}

export type ChantierRow = {
  id: string;
  user_id: string;
  nom: string;
  ville: string;
  budget_total: number | string;
  depenses_anterieures: number | string;
  revenu_previsionnel: number | string;
  avancement_travaux: number | string;
  date_debut: string;
  details: ChantierDetails | null;
};

export type DepenseRow = {
  id: string;
  user_id: string;
  chantier_id: string;
  date: string;
  description: string;
  fournisseur: string | null;
  categorie: string;
  montant: number | string;
};

export type FournisseurRow = {
  id: string;
  user_id: string;
  nom: string;
  telephone: string | null;
  email: string | null;
  specialite: string | null;
  adresse: string | null;
  notes: string | null;
};

export function chantierDepuisLigne(row: ChantierRow): Chantier {
  return {
    id: row.id,
    nom: row.nom,
    ville: row.ville,
    budgetTotal: versNombre(row.budget_total),
    depensesAnterieures: versNombre(row.depenses_anterieures),
    revenuPrevisionnel: versNombre(row.revenu_previsionnel),
    avancementTravaux: versNombre(row.avancement_travaux),
    dateDebut: row.date_debut,
    details: row.details ?? undefined,
  };
}

export function chantierVersLigne(chantier: Partial<Omit<Chantier, "id">>) {
  const ligne: Record<string, unknown> = {};
  if (chantier.nom !== undefined) ligne.nom = chantier.nom;
  if (chantier.ville !== undefined) ligne.ville = chantier.ville;
  if (chantier.budgetTotal !== undefined) ligne.budget_total = chantier.budgetTotal;
  if (chantier.depensesAnterieures !== undefined)
    ligne.depenses_anterieures = chantier.depensesAnterieures;
  if (chantier.revenuPrevisionnel !== undefined)
    ligne.revenu_previsionnel = chantier.revenuPrevisionnel;
  if (chantier.avancementTravaux !== undefined)
    ligne.avancement_travaux = chantier.avancementTravaux;
  if (chantier.dateDebut !== undefined) ligne.date_debut = chantier.dateDebut;
  if (chantier.details !== undefined) ligne.details = chantier.details;
  return ligne;
}

export function depenseDepuisLigne(row: DepenseRow): Depense {
  return {
    id: row.id,
    date: row.date,
    chantierId: row.chantier_id,
    description: row.description,
    fournisseur: row.fournisseur ?? undefined,
    categorie: row.categorie,
    montant: versNombre(row.montant),
  };
}

export function depenseVersLigne(depense: Partial<Omit<Depense, "id">>) {
  const ligne: Record<string, unknown> = {};
  if (depense.date !== undefined) ligne.date = depense.date;
  if (depense.chantierId !== undefined) ligne.chantier_id = depense.chantierId;
  if (depense.description !== undefined) ligne.description = depense.description;
  if (depense.fournisseur !== undefined) ligne.fournisseur = depense.fournisseur ?? null;
  if (depense.categorie !== undefined) ligne.categorie = depense.categorie;
  if (depense.montant !== undefined) ligne.montant = depense.montant;
  return ligne;
}

export function fournisseurDepuisLigne(row: FournisseurRow): Fournisseur {
  return {
    id: row.id,
    nom: row.nom,
    telephone: row.telephone ?? undefined,
    email: row.email ?? undefined,
    specialite: row.specialite ?? undefined,
    adresse: row.adresse ?? undefined,
    notes: row.notes ?? undefined,
  };
}

export function fournisseurVersLigne(fournisseur: Partial<Omit<Fournisseur, "id">>) {
  const ligne: Record<string, unknown> = {};
  if (fournisseur.nom !== undefined) ligne.nom = fournisseur.nom;
  if (fournisseur.telephone !== undefined) ligne.telephone = fournisseur.telephone ?? null;
  if (fournisseur.email !== undefined) ligne.email = fournisseur.email ?? null;
  if (fournisseur.specialite !== undefined) ligne.specialite = fournisseur.specialite ?? null;
  if (fournisseur.adresse !== undefined) ligne.adresse = fournisseur.adresse ?? null;
  if (fournisseur.notes !== undefined) ligne.notes = fournisseur.notes ?? null;
  return ligne;
}
