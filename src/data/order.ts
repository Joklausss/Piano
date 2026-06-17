import type { SonMeta, Period } from "./types";

/**
 * PROGRESSION OFFICIELLE — couverture intégrale des graphèmes du CP,
 * du simple au complexe, répartie sur 5 périodes.
 * L'ordre de ce tableau = l'ordre de déverrouillage (déchiffrabilité).
 */
export const ORDER: SonMeta[] = [
  // ───────── PÉRIODE 1 — voyelles puis consonnes continues ─────────
  { id: "a", grapheme: "a", graphemes: ["a"], phoneme: "[a]", label: "le son [a]", period: 1, type: "voyelle", keyword: "ananas", emoji: "🍍" },
  { id: "i", grapheme: "i", graphemes: ["i"], phoneme: "[i]", label: "le son [i]", period: 1, type: "voyelle", keyword: "île", emoji: "🏝️" },
  { id: "o", grapheme: "o", graphemes: ["o"], phoneme: "[o]", label: "le son [o]", period: 1, type: "voyelle", keyword: "olive", emoji: "🫒" },
  { id: "u", grapheme: "u", graphemes: ["u"], phoneme: "[u]", label: "le son [u]", period: 1, type: "voyelle", keyword: "lune", emoji: "🌙" },
  { id: "e-acc", grapheme: "é", graphemes: ["é"], phoneme: "[é]", label: "le son [é]", period: 1, type: "voyelle", keyword: "éléphant", emoji: "🐘" },
  { id: "e-grave", grapheme: "è", graphemes: ["è"], phoneme: "[è]", label: "le son [è]", period: 1, type: "voyelle", keyword: "zèbre", emoji: "🦓" },
  { id: "e", grapheme: "e", graphemes: ["e"], phoneme: "[e]", label: "le son [e]", period: 1, type: "voyelle", keyword: "renard", emoji: "🦊" },
  { id: "y", grapheme: "y", graphemes: ["y"], phoneme: "[i] (y)", label: "la lettre y", period: 1, type: "voyelle", keyword: "stylo", emoji: "✏️" },
  { id: "l", grapheme: "l", graphemes: ["l"], phoneme: "[l]", label: "le son [l]", period: 1, type: "consonne-continue", keyword: "lion", emoji: "🦁" },
  { id: "f", grapheme: "f", graphemes: ["f"], phoneme: "[f]", label: "le son [f]", period: 1, type: "consonne-continue", keyword: "fusée", emoji: "🚀" },
  { id: "ch", grapheme: "ch", graphemes: ["ch"], phoneme: "[ch]", label: "le son [ch]", period: 1, type: "consonne-continue", keyword: "chat", emoji: "🐱" },
  { id: "s", grapheme: "s", graphemes: ["s"], phoneme: "[s]", label: "le son [s]", period: 1, type: "consonne-continue", keyword: "serpent", emoji: "🐍" },
  { id: "m", grapheme: "m", graphemes: ["m"], phoneme: "[m]", label: "le son [m]", period: 1, type: "consonne-continue", keyword: "moto", emoji: "🛵" },
  { id: "r", grapheme: "r", graphemes: ["r"], phoneme: "[r]", label: "le son [r]", period: 1, type: "consonne-continue", keyword: "robot", emoji: "🤖" },
  { id: "n", grapheme: "n", graphemes: ["n"], phoneme: "[n]", label: "le son [n]", period: 1, type: "consonne-continue", keyword: "nid", emoji: "🪺" },
  { id: "v", grapheme: "v", graphemes: ["v"], phoneme: "[v]", label: "le son [v]", period: 1, type: "consonne-continue", keyword: "vélo", emoji: "🚲" },
  { id: "j", grapheme: "j", graphemes: ["j"], phoneme: "[j]", label: "le son [j]", period: 1, type: "consonne-continue", keyword: "jupe", emoji: "👗" },
  { id: "z", grapheme: "z", graphemes: ["z"], phoneme: "[z]", label: "le son [z]", period: 1, type: "consonne-continue", keyword: "zéro", emoji: "0️⃣" },

  // ───────── PÉRIODE 2 — consonnes occlusives + premiers complexes ─────────
  { id: "p", grapheme: "p", graphemes: ["p"], phoneme: "[p]", label: "le son [p]", period: 2, type: "consonne-occlusive", keyword: "pomme", emoji: "🍎" },
  { id: "t", grapheme: "t", graphemes: ["t"], phoneme: "[t]", label: "le son [t]", period: 2, type: "consonne-occlusive", keyword: "tomate", emoji: "🍅" },
  { id: "c", grapheme: "c", graphemes: ["c"], phoneme: "[k] (c)", label: "le son [k] avec c", period: 2, type: "consonne-occlusive", keyword: "carotte", emoji: "🥕" },
  { id: "b", grapheme: "b", graphemes: ["b"], phoneme: "[b]", label: "le son [b]", period: 2, type: "consonne-occlusive", keyword: "ballon", emoji: "🎈" },
  { id: "d", grapheme: "d", graphemes: ["d"], phoneme: "[d]", label: "le son [d]", period: 2, type: "consonne-occlusive", keyword: "dé", emoji: "🎲" },
  { id: "g", grapheme: "g", graphemes: ["g"], phoneme: "[g]", label: "le son [g]", period: 2, type: "consonne-occlusive", keyword: "gâteau", emoji: "🎂" },
  { id: "k", grapheme: "k", graphemes: ["k"], phoneme: "[k] (k)", label: "le son [k] avec k", period: 2, type: "consonne-occlusive", keyword: "koala", emoji: "🐨" },
  { id: "qu", grapheme: "qu", graphemes: ["qu"], phoneme: "[k] (qu)", label: "le son [k] avec qu", period: 2, type: "complexe", keyword: "quatre", emoji: "4️⃣" },
  { id: "ou", grapheme: "ou", graphemes: ["ou"], phoneme: "[ou]", label: "le son [ou]", period: 2, type: "complexe", keyword: "loup", emoji: "🐺" },
  { id: "on", grapheme: "on", graphemes: ["on", "om"], phoneme: "[on]", label: "le son [on]", period: 2, type: "complexe", keyword: "pont", emoji: "🌉" },
  { id: "an", grapheme: "an", graphemes: ["an", "am"], phoneme: "[an]", label: "le son [an]", period: 2, type: "complexe", keyword: "gant", emoji: "🧤" },
  { id: "oi", grapheme: "oi", graphemes: ["oi"], phoneme: "[oi]", label: "le son [oi]", period: 2, type: "complexe", keyword: "roi", emoji: "👑" },
  { id: "in", grapheme: "in", graphemes: ["in", "im"], phoneme: "[in]", label: "le son [in]", period: 2, type: "complexe", keyword: "lapin", emoji: "🐰" },

  // ───────── PÉRIODE 3 — voyelles complexes & nasales ─────────
  { id: "au", grapheme: "au", graphemes: ["au", "eau"], phoneme: "[o] (au/eau)", label: "le son [o] : au, eau", period: 3, type: "complexe", keyword: "bateau", emoji: "🚤" },
  { id: "ai", grapheme: "ai", graphemes: ["ai", "ei", "ê"], phoneme: "[è] (ai/ei/ê)", label: "le son [è] : ai, ei, ê", period: 3, type: "complexe", keyword: "lait", emoji: "🥛" },
  { id: "eu", grapheme: "eu", graphemes: ["eu", "œu"], phoneme: "[eu]", label: "le son [eu]", period: 3, type: "complexe", keyword: "feu", emoji: "🔥" },
  { id: "en", grapheme: "en", graphemes: ["en", "em"], phoneme: "[an] : en, em", label: "le son [an] : en, em", period: 3, type: "complexe", keyword: "dent", emoji: "🦷" },
  { id: "ain", grapheme: "ain", graphemes: ["ain", "ein"], phoneme: "[in] : ain, ein", label: "le son [in] : ain, ein", period: 3, type: "complexe", keyword: "main", emoji: "✋" },
  { id: "oin", grapheme: "oin", graphemes: ["oin"], phoneme: "[oin]", label: "le son [oin]", period: 3, type: "complexe", keyword: "point", emoji: "📍" },
  { id: "gn", grapheme: "gn", graphemes: ["gn"], phoneme: "[gn]", label: "le son [gn]", period: 3, type: "complexe", keyword: "montagne", emoji: "⛰️" },

  // ───────── PÉRIODE 4 — graphèmes complexes (suite) & valeurs des lettres ─────────
  { id: "ill", grapheme: "ill", graphemes: ["ill"], phoneme: "[ill]", label: "le son [ill] : papillon", period: 4, type: "complexe", keyword: "papillon", emoji: "🦋" },
  { id: "ph", grapheme: "ph", graphemes: ["ph"], phoneme: "[f] (ph)", label: "le son [f] avec ph", period: 4, type: "complexe", keyword: "photo", emoji: "📷" },
  { id: "eil", grapheme: "eil", graphemes: [], phoneme: "-eil/-ail/-euil", label: "les familles -eil, -ail, -euil, -ouil", period: 4, type: "complexe", keyword: "soleil", emoji: "☀️" },
  { id: "y-iyi", grapheme: "y", graphemes: [], phoneme: "y = i + i", label: "la lettre y = i + i", period: 4, type: "valeur", keyword: "crayon", emoji: "✏️" },
  { id: "c-val", grapheme: "c / ç", graphemes: ["ç"], phoneme: "[s] : ce, ci, ç", label: "les valeurs de c", period: 4, type: "valeur", keyword: "citron", emoji: "🍋" },
  { id: "g-val", grapheme: "g", graphemes: [], phoneme: "[j] : ge, gi", label: "les valeurs de g", period: 4, type: "valeur", keyword: "girafe", emoji: "🦒" },
  { id: "er", grapheme: "er", graphemes: [], phoneme: "[é] : -er, -ez, -es", label: "le son [é] : -er, -ez, -es", period: 4, type: "valeur", keyword: "nez", emoji: "👃" },
  { id: "elle", grapheme: "elle", graphemes: [], phoneme: "[è] + consonne double", label: "elle, ette, esse", period: 4, type: "valeur", keyword: "fourchette", emoji: "🍴" },

  // ───────── PÉRIODE 5 — graphèmes rares + automatisation & fluence ─────────
  { id: "tion", grapheme: "ti", graphemes: [], phoneme: "[si] : -tion", label: "le son [si] : -tion", period: 5, type: "valeur", keyword: "potion", emoji: "🧪" },
  { id: "s-z", grapheme: "s", graphemes: [], phoneme: "[z] : s entre 2 voyelles", label: "le son [z] avec s", period: 5, type: "valeur", keyword: "rose", emoji: "🌹" },
  { id: "w", grapheme: "w", graphemes: ["w"], phoneme: "[w]/[v]", label: "la lettre w", period: 5, type: "complexe", keyword: "kiwi", emoji: "🥝" },
  { id: "x", grapheme: "x", graphemes: ["x"], phoneme: "[ks]/[gz]", label: "la lettre x", period: 5, type: "complexe", keyword: "taxi", emoji: "🚕" },
  { id: "un", grapheme: "un", graphemes: ["un", "um"], phoneme: "[un]", label: "le son [un]", period: 5, type: "complexe", keyword: "brun", emoji: "🟤" },
  { id: "ym", grapheme: "ym", graphemes: ["yn", "ym"], phoneme: "[in] : yn, ym", label: "le son [in] : yn, ym", period: 5, type: "complexe", keyword: "lynx", emoji: "🐆" },
  { id: "trema", grapheme: "ï", graphemes: ["ï", "ë"], phoneme: "le tréma", label: "le tréma : ï, ë", period: 5, type: "complexe", keyword: "maïs", emoji: "🌽" },
];

/** Mots outils introduits par période (cumulatifs au fil de l'année). */
export const MOTS_OUTILS_BY_PERIOD: Record<Period, string[]> = {
  0: [],
  1: ["le", "la", "les", "un", "une", "il", "elle", "est", "et", "de", "sur", "au", "avec", "alors", "à", "y"],
  2: ["dans", "sous", "pour", "mais", "par", "mon", "ma", "mes", "son", "sa", "ses", "ton", "ta", "tes", "des", "oui", "non", "ici", "voilà", "qui", "que", "on"],
  3: ["ne", "pas", "puis", "très", "chez", "vers", "sans", "ou", "où", "dans", "plus"],
  4: ["cette", "comme", "avait", "était", "ils", "elles", "leur", "votre", "notre", "deux"],
  5: ["aussi", "toujours", "beaucoup", "pendant", "depuis", "déjà", "quand", "alors"],
};

export const PERIOD_TITLES: Record<Period, string> = {
  0: "Avant de lire",
  1: "Période 1 — Les voyelles et les consonnes longues",
  2: "Période 2 — Les consonnes courtes et les premiers sons",
  3: "Période 3 — Les sons des voyelles et les nasales",
  4: "Période 4 — Les graphèmes complexes et les valeurs des lettres",
  5: "Période 5 — Les sons rares et la fluence",
};
