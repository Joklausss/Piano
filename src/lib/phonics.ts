// Moteur phonétique : segmentation graphème par graphème + vérification de
// déchiffrabilité (la « règle de fer » : un texte n'utilise que des graphèmes déjà vus).
//
// Principe : on segmente chaque mot avec l'INVENTAIRE COMPLET des graphèmes
// (recherche du plus long d'abord, avec les règles de position des voyelles
// nasales), puis on vérifie que chaque graphème obtenu fait partie des
// graphèmes déjà déverrouillés.

const VOWEL_LETTERS = "aeiouyàâäéèêëîïôöùûü";

/** Voyelles simples toujours admises (accents circonflexes = même famille de son). */
const BASE_ALLOWED = new Set<string>([
  "h", // h muet
  "â",
  "à",
  "î",
  "ô",
  "û",
  "ù",
]);

/** Petits mots/clitiques d'élision toujours admis (l', d', j', n', m', t', s', c', qu'). */
const CLITICS = new Set(["l", "d", "j", "n", "m", "t", "s", "c", "qu"]);

interface InvEntry {
  g: string;
  nasal?: boolean;
}

// Inventaire des graphèmes multi-lettres fiables (un seul phonème là où ils
// apparaissent). Les « valeurs » contextuelles (er=é, ce=s, ge=j…) ne sont PAS
// ici : leurs mots restent déchiffrables lettre à lettre.
const MULTI: InvEntry[] = [
  // 3 lettres
  { g: "eau" },
  { g: "ain", nasal: true },
  { g: "ein", nasal: true },
  { g: "oin", nasal: true },
  { g: "ill" },
  // 2 lettres — non nasales
  { g: "ch" },
  { g: "ph" },
  { g: "gn" },
  { g: "qu" },
  { g: "ou" },
  { g: "oi" },
  { g: "ai" },
  { g: "ei" },
  { g: "au" },
  { g: "eu" },
  { g: "œu" },
  // 2 lettres — nasales (règle de position appliquée)
  { g: "an", nasal: true },
  { g: "am", nasal: true },
  { g: "en", nasal: true },
  { g: "em", nasal: true },
  { g: "on", nasal: true },
  { g: "om", nasal: true },
  { g: "in", nasal: true },
  { g: "im", nasal: true },
  { g: "un", nasal: true },
  { g: "um", nasal: true },
  { g: "yn", nasal: true },
  { g: "ym", nasal: true },
];

// Trié du plus long au plus court pour la recherche gloutonne.
const MULTI_SORTED = [...MULTI].sort((a, b) => b.g.length - a.g.length);

function isVowelChar(ch: string | undefined): boolean {
  return !!ch && VOWEL_LETTERS.includes(ch);
}

/**
 * Une voyelle nasale (an, in, on…) ne « sonne » nasale que si elle n'est PAS
 * suivie d'une voyelle ni d'un n/m (sinon : ananas, année, pomme, immense…).
 */
function nasalOk(word: string, after: number): boolean {
  const next = word[after];
  if (next === undefined) return true; // fin de mot
  if (isVowelChar(next)) return false;
  if (next === "n" || next === "m") return false;
  return true;
}

export interface Segmentation {
  graphemes: string[];
  ok: boolean;
  unknown: string[];
}

/** Segmente un mot (déjà en minuscules) avec l'inventaire complet. */
export function segment(word: string): string[] {
  const out: string[] = [];
  let i = 0;
  while (i < word.length) {
    let matched: InvEntry | null = null;
    for (const e of MULTI_SORTED) {
      const len = e.g.length;
      if (word.startsWith(e.g, i)) {
        if (e.nasal && !nasalOk(word, i + len)) continue;
        matched = e;
        break;
      }
    }
    if (matched) {
      out.push(matched.g);
      i += matched.g.length;
    } else {
      out.push(word[i]);
      i += 1;
    }
  }
  return out;
}

/** Découpe un texte en mots (lettres + accents), apostrophes/traits = séparateurs. */
export function tokenize(text: string): string[] {
  const re = /[a-zàâäéèêëîïôöùûüçœæ]+/gi;
  return (text.match(re) || []).map((t) => t.toLowerCase());
}

function wordIsDecodable(
  word: string,
  allowed: Set<string>,
  motsOutils: Set<string>,
): boolean {
  if (motsOutils.has(word)) return true;
  if (word.length === 1 && CLITICS.has(word)) return true;
  if (CLITICS.has(word) && word.length <= 2) return true; // qu'
  const parts = segment(word);
  for (const g of parts) {
    if (allowed.has(g)) continue;
    if (BASE_ALLOWED.has(g)) continue;
    return false;
  }
  return true;
}

/** Vérifie qu'un texte est 100 % déchiffrable avec les graphèmes/mots outils donnés. */
export function isDecodable(
  text: string,
  allowedGraphemes: Iterable<string>,
  motsOutils: Iterable<string> = [],
): boolean {
  const allowed = new Set(allowedGraphemes);
  const outils = new Set([...motsOutils].map((m) => m.toLowerCase()));
  for (const w of tokenize(text)) {
    if (!wordIsDecodable(w, allowed, outils)) return false;
  }
  return true;
}

/** Renvoie les mots non déchiffrables d'un texte (pour le diagnostic). */
export function offendingWords(
  text: string,
  allowedGraphemes: Iterable<string>,
  motsOutils: Iterable<string> = [],
): string[] {
  const allowed = new Set(allowedGraphemes);
  const outils = new Set([...motsOutils].map((m) => m.toLowerCase()));
  return tokenize(text).filter((w) => !wordIsDecodable(w, allowed, outils));
}

// ---------- Génération et coloration de syllabes ----------

const VOWEL_GRAPHEMES = new Set<string>([
  "a", "e", "i", "o", "u", "y", "é", "è", "ê", "ë", "ï", "â", "à", "î", "ô", "û",
  "ou", "oi", "au", "eau", "eu", "œu", "ai", "ei",
  "an", "am", "en", "em", "on", "om", "in", "im", "un", "um",
  "ain", "ein", "oin", "yn", "ym",
]);

export function isVowelGrapheme(g: string): boolean {
  return VOWEL_GRAPHEMES.has(g);
}

export interface SylPart {
  g: string;
  kind: "cons" | "voy";
}

/** Découpe une syllabe en parties colorables (consonne / voyelle). */
export function syllableParts(syllable: string): SylPart[] {
  return segment(syllable.toLowerCase()).map((g) => ({
    g,
    kind: isVowelGrapheme(g) ? "voy" : "cons",
  }));
}

/**
 * Découpe un mot en syllabes (suite de graphèmes). Heuristique simple et
 * rassurante pour l'enfant (V-CV, VC-CV), pas une perfection linguistique.
 */
export function syllabify(word: string): string[][] {
  const g = segment(word.toLowerCase());
  const isV = (x: string) => isVowelGrapheme(x);
  const syllables: string[][] = [];
  let cur: string[] = [];
  for (let i = 0; i < g.length; i++) {
    cur.push(g[i]);
    if (isV(g[i])) {
      let j = i + 1;
      let cons = 0;
      while (j < g.length && !isV(g[j])) {
        cons++;
        j++;
      }
      if (j >= g.length) {
        for (let k = i + 1; k < g.length; k++) cur.push(g[k]);
        syllables.push(cur);
        cur = [];
        break;
      } else if (cons <= 1) {
        syllables.push(cur);
        cur = [];
      } else {
        cur.push(g[i + 1]);
        i += 1;
        syllables.push(cur);
        cur = [];
      }
    }
  }
  if (cur.length) syllables.push(cur);
  return syllables.length ? syllables : [g];
}

const SIMPLE_VOWELS = ["a", "i", "o", "u", "e"];

/**
 * Génère des syllabes CV déchiffrables pour une consonne donnée, avec les
 * voyelles déjà connues. Toujours déchiffrable par construction.
 */
export function buildSyllables(
  consonant: string,
  knownVowels: string[],
  order: string[] = SIMPLE_VOWELS,
): string[] {
  const vowels = order.filter((v) => knownVowels.includes(v));
  return vowels.map((v) => consonant + v);
}
