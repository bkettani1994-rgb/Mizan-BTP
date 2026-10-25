-- Mizan BTP — schéma Supabase
-- À exécuter une seule fois dans votre projet Supabase :
-- Dashboard → SQL Editor → New query → coller ce fichier → Run.

create table if not exists public.chantiers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  nom text not null,
  ville text not null,
  budget_total numeric not null,
  depenses_anterieures numeric not null default 0,
  revenu_previsionnel numeric not null,
  avancement_travaux numeric not null default 0,
  date_debut timestamptz not null,
  details jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.depenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  chantier_id uuid not null references public.chantiers (id) on delete cascade,
  date timestamptz not null,
  description text not null,
  fournisseur text,
  categorie text not null,
  montant numeric not null,
  created_at timestamptz not null default now()
);

create table if not exists public.fournisseurs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  nom text not null,
  telephone text,
  email text,
  specialite text,
  adresse text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists depenses_chantier_id_idx on public.depenses (chantier_id);
create index if not exists depenses_user_id_idx on public.depenses (user_id);
create index if not exists chantiers_user_id_idx on public.chantiers (user_id);
create index if not exists fournisseurs_user_id_idx on public.fournisseurs (user_id);

-- Row Level Security : chaque utilisateur ne voit et ne modifie que ses propres données.
alter table public.chantiers enable row level security;
alter table public.depenses enable row level security;
alter table public.fournisseurs enable row level security;

drop policy if exists "chantiers_owner" on public.chantiers;
create policy "chantiers_owner" on public.chantiers
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "depenses_owner" on public.depenses;
create policy "depenses_owner" on public.depenses
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "fournisseurs_owner" on public.fournisseurs;
create policy "fournisseurs_owner" on public.fournisseurs
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
