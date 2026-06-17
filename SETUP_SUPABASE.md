# Activer les comptes (email) et la synchronisation — Supabase

La connexion par email est **optionnelle**. Sans configuration, l'app fonctionne en
local (la progression reste sur l'appareil). En branchant Supabase (gratuit), un
parent peut **créer un compte** et **retrouver la progression sur n'importe quel
appareil**.

Durée : ~5 minutes.

## 1) Créer le projet Supabase
1. Va sur **https://supabase.com** → crée un compte → **New project**.
2. Choisis un nom, un mot de passe de base de données, une région proche → **Create**.

## 2) Créer la table de synchronisation
Dans le projet : menu **SQL Editor** → **New query** → colle ce SQL → **Run** :

```sql
create table if not exists public.user_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_state enable row level security;

create policy "lire son propre etat"
  on public.user_state for select
  using (auth.uid() = user_id);

create policy "creer son propre etat"
  on public.user_state for insert
  with check (auth.uid() = user_id);

create policy "modifier son propre etat"
  on public.user_state for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

> Ces règles (RLS) garantissent que **chaque utilisateur ne voit et ne modifie que
> ses propres données**.

## 3) Régler l'authentification
Menu **Authentication → URL Configuration** :
- **Site URL** : `https://joklausss.github.io/Piano/`
- Ajoute la même URL dans **Redirect URLs**.

Menu **Authentication → Providers → Email** :
- Laisse **Email** activé.
- Astuce : pour une inscription **immédiate** (sans email de confirmation), désactive
  **« Confirm email »**. Sinon, l'utilisateur recevra un email à valider avant de
  pouvoir se connecter.

## 4) Récupérer les 2 clés
Menu **Project Settings → API** :
- **Project URL** (ex. `https://abcd1234.supabase.co`)
- **anon public** key (longue chaîne) — *cette clé est faite pour être publique,
  la sécurité vient des règles RLS ci-dessus.*

## 5) Donner les clés à l'app (GitHub)
Sur GitHub : repo **Joklausss/Piano** → **Settings → Secrets and variables → Actions
→ New repository secret**. Crée **deux** secrets :

| Nom du secret | Valeur |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | la *Project URL* |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | la clé *anon public* |

## 6) Redéployer
Onglet **Actions** → workflow **« Deploy to GitHub Pages »** → **Run workflow**
(ou fais un petit `git push`). Une fois le déploiement vert, ouvre le site : une
section **« ☁️ Compte & synchronisation »** apparaît sur l'accueil et dans l'espace
adulte.

## Comment ça marche
- Un **compte parent** (email + mot de passe) regroupe les **profils enfants**.
- Toute la progression (profils, sons maîtrisés, badges, fluence, réglages) est
  enregistrée dans la table `user_state` (un enregistrement JSON par compte).
- À la **connexion**, l'app récupère l'état du compte ; à chaque **changement**, elle
  le renvoie automatiquement (dernière écriture gagnante).
- Sans connexion, tout continue de fonctionner **en local**.
