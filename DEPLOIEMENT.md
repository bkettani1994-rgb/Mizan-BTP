# Déploiement de Mizan BTP en ligne

L'application fonctionne maintenant avec une vraie base de données en ligne
(Supabase) et une connexion par identifiant / mot de passe. Vous pouvez
l'ouvrir depuis n'importe quel appareil (téléphone, ordinateur) : les
données sont toujours les mêmes, partout.

Deux comptes gratuits à créer, puis 10-15 minutes de configuration.

## 1. Créer le projet Supabase (la base de données + la connexion)

1. Allez sur [supabase.com](https://supabase.com) et créez un compte gratuit.
2. Cliquez sur **New project**. Choisissez un nom (ex. `mizan-btp`), un mot
   de passe pour la base (gardez-le de côté) et une région proche du Maroc
   (ex. `eu-west` / Europe).
3. Une fois le projet créé (1-2 minutes), allez dans **SQL Editor** (menu de
   gauche) → **New query**.
4. Ouvrez le fichier [`supabase/schema.sql`](./supabase/schema.sql) de ce
   dépôt, copiez tout son contenu, collez-le dans l'éditeur SQL, puis
   cliquez sur **Run**. Cela crée les tables `chantiers`, `depenses`,
   `fournisseurs` et les règles de sécurité (chaque compte ne voit que ses
   propres données).
5. Allez dans **Project Settings** (icône engrenage) → **API**. Notez deux
   valeurs, vous en aurez besoin à l'étape 3 :
   - **Project URL** (ressemble à `https://xxxxxxxx.supabase.co`)
   - **anon public key** (une longue chaîne de caractères)

## 2. Créer le compte du promoteur

1. Toujours dans Supabase, allez dans **Authentication** → **Users**.
2. Cliquez sur **Add user** → **Create new user**.
3. Renseignez l'email et le mot de passe que le promoteur utilisera pour se
   connecter à l'application, puis cochez **Auto Confirm User** (pour éviter
   un email de confirmation). Cliquez sur **Create user**.
4. C'est tout : à sa première connexion, l'application créera
   automatiquement pour lui un chantier de démonstration déjà rempli, pour
   qu'il découvre l'outil sans partir d'une page vide.

Vous pourrez créer d'autres comptes de la même façon plus tard (un par
personne qui doit se connecter).

## 3. Déployer l'application sur Vercel

1. Allez sur [vercel.com](https://vercel.com) et créez un compte gratuit
   (vous pouvez vous connecter directement avec GitHub).
2. Cliquez sur **Add New** → **Project**, puis importez le dépôt GitHub
   `Mizan-BTP` (branche `claude/tender-shannon-jo4gq9`, ou votre branche
   principale si vous l'y avez fusionnée).
3. Avant de cliquer sur **Deploy**, ouvrez la section **Environment
   Variables** et ajoutez les deux valeurs notées à l'étape 1 :
   - `NEXT_PUBLIC_SUPABASE_URL` = votre Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = votre anon public key
4. Cliquez sur **Deploy**. Après 1-2 minutes, Vercel vous donne une adresse
   du type `https://mizan-btp.vercel.app` — c'est l'adresse à partager avec
   le promoteur. Elle fonctionne sur téléphone comme sur ordinateur.

## Et après ?

- Chaque mise à jour poussée sur la branche connectée à Vercel redéploie
  automatiquement l'application (aucune action supplémentaire nécessaire).
- Pour ajouter un deuxième utilisateur (un autre promoteur, un collaborateur),
  répétez simplement l'étape 2.
- Les données sont désormais stockées dans Supabase, pas dans le navigateur :
  elles survivent à un changement d'appareil, un vidage de cache, etc.
