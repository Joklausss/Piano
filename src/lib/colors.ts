// Une couleur par voyelle — aide à la reconnaissance (cf. direction artistique).

export const VOWEL_COLORS: Record<string, string> = {
  a: "#F2785C",
  e: "#5FB6A8",
  i: "#F4C04E",
  o: "#6BA8E5",
  u: "#A98CD9",
  y: "#E58FB5",
  é: "#5FB6A8",
  è: "#4DA294",
  ê: "#4DA294",
};

const COMPLEX_VOWEL_COLOR = "#E08A4E"; // ou, on, an, oi… (voyelles complexes)
const CONSONANT_COLOR = "#5E9650"; // vert consonne

export function vowelColor(grapheme: string): string {
  return VOWEL_COLORS[grapheme] ?? COMPLEX_VOWEL_COLOR;
}

export function graphemeColor(grapheme: string, isVowel: boolean): string {
  if (isVowel) return vowelColor(grapheme);
  return CONSONANT_COLOR;
}

/** Sons complexes proposés sur le « 2e piano ». */
export const COMPLEX_VOWELS = ["ou", "on", "an", "in", "oi", "au", "eau", "eu", "ai", "ain"];
