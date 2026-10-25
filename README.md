# Mizan BTP

**L'équilibre de vos chantiers** — application de gestion de chantier pour promoteurs immobiliers, bilingue français/arabe, en ligne et accessible depuis plusieurs appareils.

## Démarrer en local

```bash
npm install
cp .env.example .env.local   # renseignez vos identifiants Supabase (voir DEPLOIEMENT.md)
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000). Vous serez redirigé vers `/login` : connectez-vous avec un compte créé dans Supabase (voir [`DEPLOIEMENT.md`](./DEPLOIEMENT.md)).

Autres commandes utiles :

```bash
npm run build   # build de production
npm run start   # sert le build de production
npm run lint    # vérifie le code avec ESLint
```

## Stack technique

- **Next.js 16** (App Router) + TypeScript
- **Supabase** : base de données PostgreSQL + authentification par identifiant/mot de passe
- **Tailwind CSS v4** + composants shadcn/ui (créés manuellement dans `components/ui`)
- **lucide-react** pour les icônes, **Recharts** pour les graphiques
- Polices **Manrope** (latin) et **Cairo** (arabe), interface RTL complète

## Structure du projet

```
app/
  login/              Page de connexion (hors zone protégée)
  (app)/              Zone protégée par authentification (layout avec sidebar/nav)
    page.tsx          Tableau de bord
    chantiers/        Liste des chantiers + fiche détaillée par chantier
    depenses/         Liste des dépenses (filtrable, édition, suppression)
    fournisseurs/     Carnet de fournisseurs
    rapports/         Synthèse par chantier
    parametres/       Compte, langue, réinitialisation des données de démo
components/
  ui/                 Composants de base (Button, Card, Dialog, Progress, Select…)
  navigation/         Sidebar (desktop), barre de navigation (mobile), déconnexion
  dashboard/          Cartes KPI, carte chantier, graphique, dernières dépenses
  chantiers/, depenses/, fournisseurs/   Formulaires de création/édition
lib/
  store.tsx           Contexte React branché sur Supabase (CRUD chantiers/dépenses/fournisseurs)
  supabase/           Clients Supabase (navigateur, serveur, middleware) + mapping DB ↔ types
  mock-data.ts        Données du chantier de démonstration (semées à la première connexion)
  types.ts            Types TypeScript partagés
  stats.ts            Calculs d'indicateurs (totaux, graphique mensuel…)
  status.ts           Logique du code couleur vert / orange / rouge
  format.ts           Formatage des montants (MAD) et des dates
  i18n/                Dictionnaire FR/AR et contexte de langue
supabase/
  schema.sql          Schéma SQL à exécuter dans votre projet Supabase (tables + sécurité RLS)
proxy.ts              Protection des routes (redirige vers /login si non connecté)
```

## Déploiement en ligne

Voir [`DEPLOIEMENT.md`](./DEPLOIEMENT.md) pour le guide complet : création du
projet Supabase, création des comptes utilisateurs, déploiement sur Vercel.

## Prochaines étapes suggérées

1. Lier le champ "Fournisseur" des dépenses au carnet de fournisseurs (Select au lieu de texte libre).
2. Gestion multi-utilisateurs plus fine si plusieurs promoteurs rejoignent l'application.
3. Pièces jointes/factures sur les dépenses.
4. Prévoir la devise EUR (le formatage dans `lib/format.ts` est déjà prêt pour ça).
