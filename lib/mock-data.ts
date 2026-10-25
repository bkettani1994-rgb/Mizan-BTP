import type { ChantierDetails, Depense, Fournisseur } from "@/lib/types";

function isoDaysAgo(daysAgo: number): string {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

/**
 * Données de démonstration insérées automatiquement lors de la toute
 * première connexion d'un nouvel utilisateur, pour qu'il découvre
 * l'application avec un chantier déjà renseigné plutôt qu'une page vide.
 */
export const chantierDemo: {
  nom: string;
  ville: string;
  budgetTotal: number;
  depensesAnterieures: number;
  revenuPrevisionnel: number;
  avancementTravaux: number;
  dateDebut: string;
  details: ChantierDetails;
} = {
  nom: "Résidence Al Andalous",
  ville: "Casablanca",
  budgetTotal: 18_500_000,
  // 10 175 000 MAD dépensés au total, dont une partie suivie en détail ci-dessous
  depensesAnterieures: 9_079_500,
  revenuPrevisionnel: 24_000_000,
  avancementTravaux: 55,
  dateDebut: isoDaysAgo(260),
  details: {
    surfaceTerrain: 4_200,
    prixTerrain: 6_300_000,
    referenceFonciere: "TF 45872/C",
    numeroPermis: "PC-2025-0318",
    datePermis: isoDaysAgo(280),
    surfaceConstruite: 9_500,
    nombreLots: 64,
    nombreEtages: 7,
    architecte: "Cabinet Architecture Atlas",
    entrepriseConstruction: "SARL Bâtiss Pro",
    responsableChantier: "Hamid Belmekki",
    telephoneResponsable: "06 61 23 45 67",
  },
};

export const depensesDemo: Omit<Depense, "id" | "chantierId">[] = [
  {
    date: isoDaysAgo(3),
    description: "Main d'œuvre — gros œuvre",
    fournisseur: "SARL Bâtiss Pro",
    categorie: "Main d'œuvre",
    montant: 268_000,
  },
  {
    date: isoDaysAgo(12),
    description: "Béton prêt à l'emploi — étage 6",
    fournisseur: "Ciments de l'Atlas",
    categorie: "Matériaux",
    montant: 176_500,
  },
  {
    date: isoDaysAgo(24),
    description: "Étanchéité toiture-terrasse",
    fournisseur: "ÉtancheMaroc",
    categorie: "Finitions",
    montant: 63_000,
  },
  {
    date: isoDaysAgo(52),
    description: "Main d'œuvre — second œuvre",
    fournisseur: "SARL Bâtiss Pro",
    categorie: "Main d'œuvre",
    montant: 221_000,
  },
  {
    date: isoDaysAgo(80),
    description: "Location grue à tour — mensuel",
    fournisseur: "LocaGrue Maroc",
    categorie: "Location matériel",
    montant: 92_000,
  },
  {
    date: isoDaysAgo(130),
    description: "Terrassement",
    fournisseur: "Travaux Publics Rabat",
    categorie: "Gros œuvre",
    montant: 275_000,
  },
];

export const fournisseursDemo: Omit<Fournisseur, "id">[] = [
  {
    nom: "SARL Bâtiss Pro",
    telephone: "05 22 45 67 89",
    email: "contact@battisspro.ma",
    specialite: "Main d'œuvre",
    adresse: "Zone industrielle Ain Sebaâ, Casablanca",
  },
  {
    nom: "Ciments de l'Atlas",
    telephone: "05 24 30 12 34",
    email: "commercial@ciments-atlas.ma",
    specialite: "Matériaux",
    adresse: "Route de Safi, Marrakech",
  },
  {
    nom: "LocaGrue Maroc",
    telephone: "06 61 11 22 33",
    specialite: "Location matériel",
  },
  {
    nom: "Travaux Publics Rabat",
    telephone: "05 37 70 80 90",
    email: "devis@tprabat.ma",
    specialite: "Gros œuvre",
    adresse: "Avenue Hassan II, Rabat",
  },
  {
    nom: "Menuiserie du Nord",
    telephone: "06 70 45 12 36",
    specialite: "Finitions",
    adresse: "Tanger",
    notes: "Recommandé pour les portes et fenêtres aluminium. Devis demandé, pas encore de chantier en cours.",
  },
];
