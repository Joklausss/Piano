// Modèle de données pédagogique — tout le parcours est généré à partir de ces types.

export type Period = 0 | 1 | 2 | 3 | 4 | 5;

export type SonType =
  | "voyelle"
  | "consonne-continue"
  | "consonne-occlusive"
  | "complexe"
  | "valeur";

/** Métadonnées d'un son (l'ordre du tableau = la progression / le déverrouillage). */
export interface SonMeta {
  id: string;
  /** Graphie principale affichée, ex. "a", "ch", "ou", "an". */
  grapheme: string;
  /** Toutes les graphies introduites par cette leçon (servent au déverrouillage). */
  graphemes: string[];
  /** Étiquette lisible du son, ex. "[a]", "[an]". */
  phoneme: string;
  label: string;
  period: Period;
  type: SonType;
  /** Mot référent (image), ex. "ananas". */
  keyword: string;
  emoji: string;
}

/** Contenu pédagogique d'un son (généré, vérifié pour la déchiffrabilité). */
export interface SonContent {
  id: string;
  /** Phrase mnémonique 100 % originale. */
  mnemonic: string;
  /** Geste optionnel associé au son. */
  geste?: string;
  /** Étape 2 — discrimination auditive. */
  ecoute: {
    motsAvec: string[];
    motsSans: string[];
  };
  /** Syllabes-clés (sinon générées automatiquement). */
  syllabes: string[];
  /** Mots déchiffrables. */
  mots: string[];
  /** Phrases déchiffrables. */
  phrases: string[];
  /** Mots outils du jour. */
  motsOutils: string[];
  /** Items de dictée (image -> mot). */
  dictee: { mot: string; emoji?: string }[];
  /** Petite histoire de lecture plaisir. */
  histoire: { titre: string; lignes: string[] };
}

export interface Son extends SonMeta {
  content: SonContent;
  /** Index dans la progression (0 = premier). */
  index: number;
}

export interface Profile {
  id: string;
  name: string;
  avatar: string; // emoji
  createdAt: number;
}

export interface ProgressState {
  /** ids de sons maîtrisés. */
  masteredSons: string[];
  /** ids d'étapes complétées, ex. "a:3". */
  completedSteps: string[];
  /** Module 0 : ids d'activités terminées. */
  module0Done: string[];
  /** Meilleur score de fluence (mots/min) par histoire. */
  fluence: Record<string, number>;
  badges: string[];
}
