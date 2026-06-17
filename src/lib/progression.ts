import { ORDER, MOTS_OUTILS_BY_PERIOD } from "@/data/order";
import { CONTENT } from "@/data/content";
import type { Son, Period } from "@/data/types";
import { isDecodable } from "@/lib/phonics";

/** Tous les sons, dans l'ordre, avec leur contenu. */
export const SONS: Son[] = ORDER.map((meta, index) => ({
  ...meta,
  index,
  content: CONTENT[meta.id] ?? {
    id: meta.id,
    mnemonic: "",
    ecoute: { motsAvec: [], motsSans: [] },
    syllabes: [],
    mots: [],
    phrases: [],
    motsOutils: [],
    dictee: [],
    histoire: { titre: "", lignes: [] },
  },
}));

const INDEX_BY_ID = new Map(SONS.map((s) => [s.id, s.index]));

export function getSon(id: string): Son | undefined {
  const i = INDEX_BY_ID.get(id);
  return i === undefined ? undefined : SONS[i];
}

export const PERIODS: Period[] = [1, 2, 3, 4, 5];

export function sonsOfPeriod(period: Period): Son[] {
  return SONS.filter((s) => s.period === period);
}

/** Graphèmes déverrouillés jusqu'au son d'index `index` (inclus). */
export function unlockedGraphemes(index: number): Set<string> {
  const set = new Set<string>();
  for (let i = 0; i <= index && i < ORDER.length; i++) {
    for (const g of ORDER[i].graphemes) set.add(g);
  }
  return set;
}

/** Mots outils admis jusqu'à la période du son d'index `index`. */
export function allowedMotsOutils(index: number): Set<string> {
  const period = ORDER[index]?.period ?? 5;
  const set = new Set<string>();
  for (let p = 1; p <= period; p++) {
    for (const m of MOTS_OUTILS_BY_PERIOD[p as Period]) set.add(m.toLowerCase());
  }
  return set;
}

const VOWEL_ORDER = ["a", "i", "o", "u", "e", "é", "è", "y"];

/** Voyelles déjà connues au son d'index `index` (pour le Piano / les syllabes). */
export function knownVowels(index: number): string[] {
  const unlocked = unlockedGraphemes(index);
  return VOWEL_ORDER.filter((v) => unlocked.has(v));
}

/** Voyelles simples (touches foncées du Piano) connues. */
export function pianoVowels(index: number): string[] {
  const unlocked = unlockedGraphemes(index);
  return ["a", "e", "i", "o", "u", "y"].filter((v) => unlocked.has(v));
}

/**
 * Filtre une liste de textes pour ne garder QUE ceux qui sont 100 %
 * déchiffrables au son d'index `index` (application de la « règle de fer »).
 */
export function keepDecodable(items: string[], index: number): string[] {
  const g = unlockedGraphemes(index);
  const m = allowedMotsOutils(index);
  return items.filter((t) => isDecodable(t, g, m));
}

const CONSONANT_GRAPHEMES = ["l","f","ch","s","m","r","n","v","j","z","p","t","c","b","d","g","k","qu","ph","gn","x","w"];

/** Consonnes déjà connues au son d'index `index` (pour le Piano des voyelles). */
export function knownConsonants(index: number): string[] {
  const unlocked = unlockedGraphemes(index);
  return CONSONANT_GRAPHEMES.filter((c) => unlocked.has(c));
}

/** Consonne « la plus récente » d'un son (pour alimenter le Piano de la leçon). */
export function lessonConsonant(son: Son): string | null {
  const g = son.graphemes[0];
  if (!g) return null;
  // Si le son introduit une consonne / digramme consonne, on la renvoie.
  const consonants = ["l","f","ch","s","m","r","n","v","j","z","p","t","c","b","d","g","k","qu","ph","gn","x","w"];
  return consonants.includes(g) ? g : null;
}
