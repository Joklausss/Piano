// Extrait ORDER + MOTS_OUTILS_BY_PERIOD de order.ts et calcule, pour chaque son,
// les graphèmes et mots outils déjà déverrouillés. Écrit scripts/specs.json
// (consommé par le workflow de génération de contenu).
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const src = readFileSync(join(root, "src", "data", "order.ts"), "utf8");

// Découpe le littéral équilibré (en ignorant les crochets dans les chaînes).
function literal(marker, open, close) {
  const from = src.indexOf(marker);
  const eq = src.indexOf("=", from); // sauter l'annotation de type (SonMeta[])
  const s = src.indexOf(open, eq);
  let depth = 0;
  let inStr = false;
  let quote = "";
  let i = s;
  for (; i < src.length; i++) {
    const ch = src[i];
    if (inStr) {
      if (ch === quote && src[i - 1] !== "\\") inStr = false;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      inStr = true;
      quote = ch;
      continue;
    }
    if (ch === open) depth++;
    else if (ch === close) {
      depth--;
      if (depth === 0) {
        i++;
        break;
      }
    }
  }
  return src.slice(s, i);
}

const ORDER = (0, eval)("(" + literal("export const ORDER", "[", "]") + ")");
const MOTS = (0, eval)("(" + literal("MOTS_OUTILS_BY_PERIOD", "{", "}") + ")");

const cumG = new Set();
const specs = ORDER.map((m, index) => {
  for (const g of m.graphemes) cumG.add(g);
  const mo = new Set();
  for (let p = 1; p <= m.period; p++) for (const x of MOTS[p] || []) mo.add(x);
  return {
    ...m,
    index,
    allowedGraphemes: [...cumG],
    allowedMotsOutils: [...mo],
  };
});

writeFileSync(join(root, "scripts", "specs.json"), JSON.stringify(specs, null, 2));
console.log(`OK — ${specs.length} specs écrits. Dernier: ${specs.at(-1).id}`);
