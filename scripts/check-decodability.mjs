// Test automatique de déchiffrabilité : vérifie que chaque texte lu d'une leçon
// n'utilise que des graphèmes déjà déverrouillés (la « règle de fer »).
// Porte la même logique que src/lib/phonics.ts.
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const specs = JSON.parse(readFileSync(join(root, "scripts", "specs.json"), "utf8"));
const contentDir = join(root, "src", "data", "content");

const VOWEL_LETTERS = "aeiouyàâäéèêëîïôöùûü";
const BASE_ALLOWED = new Set(["h", "â", "à", "î", "ô", "û", "ù"]);
const CLITICS = new Set(["l", "d", "j", "n", "m", "t", "s", "c", "qu"]);

const MULTI = [
  { g: "eau" }, { g: "ain", nasal: true }, { g: "ein", nasal: true }, { g: "oin", nasal: true }, { g: "ill" },
  { g: "ch" }, { g: "ph" }, { g: "gn" }, { g: "qu" }, { g: "ou" }, { g: "oi" }, { g: "ai" }, { g: "ei" },
  { g: "au" }, { g: "eu" }, { g: "œu" },
  { g: "an", nasal: true }, { g: "am", nasal: true }, { g: "en", nasal: true }, { g: "em", nasal: true },
  { g: "on", nasal: true }, { g: "om", nasal: true }, { g: "in", nasal: true }, { g: "im", nasal: true },
  { g: "un", nasal: true }, { g: "um", nasal: true }, { g: "yn", nasal: true }, { g: "ym", nasal: true },
].sort((a, b) => b.g.length - a.g.length);

const isVowelChar = (ch) => !!ch && VOWEL_LETTERS.includes(ch);
function nasalOk(word, after) {
  const next = word[after];
  if (next === undefined) return true;
  if (isVowelChar(next)) return false;
  if (next === "n" || next === "m") return false;
  return true;
}
function segment(word) {
  const out = [];
  let i = 0;
  while (i < word.length) {
    let matched = null;
    for (const e of MULTI) {
      if (word.startsWith(e.g, i)) {
        if (e.nasal && !nasalOk(word, i + e.g.length)) continue;
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
function tokenize(text) {
  return (String(text).match(/[a-zàâäéèêëîïôöùûüçœæ]+/gi) || []).map((t) => t.toLowerCase());
}
function wordDecodable(word, allowed, outils) {
  if (outils.has(word)) return true;
  if (word.length <= 2 && CLITICS.has(word)) return true;
  for (const g of segment(word)) {
    if (allowed.has(g) || BASE_ALLOWED.has(g)) continue;
    return false;
  }
  return true;
}
function offending(text, allowed, outils) {
  return tokenize(text).filter((w) => !wordDecodable(w, allowed, outils));
}

function textsOf(c) {
  // On ne vérifie QUE les textes LUS par l'enfant.
  // ecoute.motsAvec / motsSans sont ENTENDUS (discrimination auditive) -> non concernés.
  const t = [];
  for (const s of c.syllabes || []) t.push(s);
  for (const m of c.mots || []) t.push(m);
  for (const p of c.phrases || []) t.push(p);
  for (const d of c.dictee || []) if (d && d.mot) t.push(d.mot);
  if (c.histoire) {
    if (c.histoire.titre) t.push(c.histoire.titre);
    for (const l of c.histoire.lignes || []) t.push(l);
  }
  return t;
}

let filled = 0;
let totalOffending = 0;
const problems = [];
const empty = [];
const broken = [];

for (const spec of specs) {
  const file = join(contentDir, `${spec.id}.json`);
  if (!existsSync(file)) {
    empty.push(spec.id);
    continue;
  }
  let c;
  try {
    c = JSON.parse(readFileSync(file, "utf8"));
  } catch {
    broken.push(spec.id);
    continue;
  }
  if (!c.mnemonic) {
    empty.push(spec.id);
    continue;
  }
  filled += 1;
  const allowed = new Set(spec.allowedGraphemes);
  const outils = new Set(spec.allowedMotsOutils.map((m) => m.toLowerCase()));
  const bad = new Set();
  for (const t of textsOf(c)) for (const w of offending(t, allowed, outils)) bad.add(w);
  if (bad.size) {
    totalOffending += bad.size;
    problems.push({ id: spec.id, words: [...bad] });
  }
}

console.log(`\n=== Déchiffrabilité ===`);
console.log(`Sons remplis     : ${filled}/${specs.length}`);
console.log(`Vides (placeholder): ${empty.length}${empty.length ? " -> " + empty.join(", ") : ""}`);
console.log(`JSON cassés      : ${broken.length}${broken.length ? " -> " + broken.join(", ") : ""}`);
console.log(`Mots non déchiffrables (uniques, tous sons): ${totalOffending}`);
if (problems.length) {
  console.log(`\nDétail (mots à filtrer au runtime) :`);
  for (const p of problems) console.log(`  ${p.id}: ${p.words.join(", ")}`);
}
const strict = process.argv.includes("--strict");
if (strict && (broken.length || empty.length)) process.exit(1);
