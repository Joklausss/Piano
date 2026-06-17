# 🎹 Mon Piano des mots

**Apprendre à lire au CP avec la méthode syllabique.**
On apprend d'abord le **son** de chaque lettre, puis on **colle** une consonne et une
voyelle pour « chanter » une syllabe — comme on joue deux notes sur un piano.

Application web **responsive** et **installable (PWA)**, pensée pour des enfants de
5–7 ans qui ne savent pas encore lire les consignes : tout est utilisable à l'**audio**
et aux **pictogrammes**, avec une mascotte (Mélo le hibou) qui guide à voix haute.

> Outil **100 % original** et autonome, **non affilié** à un éditeur. Inspiré des
> principes pédagogiques publics de la méthode syllabique, sans reproduire aucun
> contenu protégé.

---

## ✨ Ce que contient l'application

- **Module 0 — « Avant de lire »** : révision maternelle / GS (conscience phonologique,
  syllabes, rimes, voyelles, 3 écritures, principe alphabétique, geste d'écriture).
- **Parcours CP intégral** : **53 leçons de sons** couvrant tous les graphèmes du CP,
  répartis sur **5 périodes**, du simple au complexe, avec déverrouillage progressif.
- **Chaque leçon = 10 étapes** : je découvre le son → j'écoute → je joue du piano →
  je lis des syllabes → des mots → des phrases → mots outils → j'encode (dictée) →
  j'écris la lettre → une histoire à lire + fluence.
- **Le Piano** (composant-signature) : touches **foncées = voyelles**, touches
  **vertes = consonnes** ; on touche une consonne puis une voyelle et la syllabe est
  « chantée » avec un doigt qui glisse. Mode libre + 2ᵉ piano pour les sons complexes,
  verso en cursive.
- **Outils** : mur des sons (cartes référentes), atelier de syllabes, dictée muette,
  lecteur d'histoires (surlignage mot par mot synchronisé à la voix + fluence), jeux
  (tri de sons, confusions b/d/p/q).
- **Différenciation à 3 niveaux** sur les syllabes, mots et textes (étayage réglable :
  coloré → segmenté → sans aide).
- **Espace adulte** (protégé par un mini-calcul) : suivi par enfant, réglages,
  fiches à imprimer (syllabaire, cartes des sons, modèles d'écriture), guide.
- **Multi-profils**, progression locale, badges, **PWA hors-ligne**.

## 🔒 La « règle de fer » : déchiffrabilité garantie

Un texte **n'utilise jamais un graphème non encore appris**. Le moteur phonétique
(`src/lib/phonics.ts`) segmente chaque mot graphème par graphème (recherche du plus
long d'abord, avec les **règles de position des voyelles nasales**), puis vérifie que
chaque graphème fait partie de ceux déjà déverrouillés.

Tout texte affiché à l'enfant est **filtré au runtime** par ce moteur : même si un
contenu généré contenait un mot non déchiffrable, il n'apparaît pas. Un test
automatique vérifie l'ensemble du corpus :

```bash
npm run check:decodability
```

## 🧱 Architecture du contenu

- La progression (l'ordre des sons + les mots outils par période) est définie dans
  [`src/data/order.ts`](src/data/order.ts) — **source de vérité unique**.
- Le contenu pédagogique de chaque son est dans `src/data/content/<id>.json`
  (mnémonique, écoute, syllabes, mots, phrases, mots outils, dictée, histoire).
- `scripts/build-specs.mjs` calcule, pour chaque son, les graphèmes et mots outils
  autorisés (déchiffrabilité) → `scripts/specs.json`.
- `scripts/gen-content-scaffold.mjs` (re)génère les fichiers de contenu et l'index typé.

## 🛠️ Stack technique

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** (jetons de design : une couleur par voyelle)
- **Framer Motion** (animations utiles : touche enfoncée, syllabe qui « pop », doigt)
- **Web Speech API** (`fr-FR`) pour la voix, avec repli visuel si l'audio est coupé
- **PWA** : `public/manifest.webmanifest` + `public/sw.js` (mode hors-ligne)
- Police de lecture **Andika** (lettres non ambiguës pour jeunes lecteurs)

## 🚀 Démarrer

```bash
npm install
npm run dev      # développement → http://localhost:3000
npm run build    # build de production
npm run start    # servir le build de production
npm run lint
npm run check:decodability
```

## ♿ Accessibilité & ergonomie enfant

- Cibles tactiles ≥ 44 px, gros boutons, peu d'éléments par écran.
- Audio partout + repli visuel ; bouton 🔊/🔇 global.
- Contrastes soignés, focus visible, navigation clavier, respect de
  `prefers-reduced-motion`.
- Choix de la police montrée (script / cursive).
- Aucune pub, aucun lien sortant, aucun contenu inattendu.

## 🔐 Données & RGPD

Collecte **minimale**, **aucun tracking publicitaire**. La progression et les profils
sont stockés **localement** dans le navigateur (localStorage) — rien n'est envoyé sur
un serveur.

**Comptes & synchronisation (optionnel).** Pour retrouver la progression d'un
appareil à l'autre, on peut activer une connexion par **email + mot de passe**
(Supabase). Désactivée par défaut ; voir **[`SETUP_SUPABASE.md`](SETUP_SUPABASE.md)**.
Quand elle est activée, un compte parent regroupe les profils enfants et la
progression est synchronisée (données protégées par RLS, la clé publique est sans
risque). Sans configuration, l'app reste 100 % locale.

## 📁 Structure

```
src/
├── app/                # routes (accueil, parcours, leçon, piano, outils, adulte…)
├── components/         # Piano, Mascotte, leçon (10 étapes), lecteurs, jeux…
├── data/               # types, order.ts (progression), content/*.json
└── lib/                # phonics (déchiffrabilité), audio, progression, store
scripts/                # build-specs, gen-content-scaffold, check-decodability
public/                 # manifest, service worker, icône
```

## ⚖️ Propriété intellectuelle

« Lecture Piano » / « Piano » est une méthode et une marque d'un éditeur (Retz). Ce
projet **ne reproduit aucun contenu protégé** (textes, illustrations, histoires,
phrases mnémoniques, visuel du matériel). Tous les contenus (textes, mnémoniques,
mascotte, nom du produit) sont **originaux** et s'inspirent uniquement des principes
pédagogiques publics de la méthode syllabique.

---

Fait avec 💛 pour donner le plaisir de lire.
