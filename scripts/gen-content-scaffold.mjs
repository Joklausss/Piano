// Génère les fichiers de contenu placeholder + l'index typé à partir de la liste
// des ids de sons. Les agents du workflow réécriront ensuite chaque JSON.
import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dir = join(root, "src", "data", "content");
mkdirSync(dir, { recursive: true });

const IDS = [
  "a", "i", "o", "u", "e-acc", "e-grave", "e", "y",
  "l", "f", "ch", "s", "m", "r", "n", "v", "j", "z",
  "p", "t", "c", "b", "d", "g", "k", "qu", "ou", "on", "an", "oi", "in",
  "au", "ai", "eu", "en", "ain", "oin", "gn",
  "ill", "ph", "eil", "y-iyi", "c-val", "g-val", "er", "elle",
  "tion", "s-z", "w", "x", "un", "ym", "trema",
];

function placeholder(id) {
  return {
    id,
    mnemonic: "",
    ecoute: { motsAvec: [], motsSans: [] },
    syllabes: [],
    mots: [],
    phrases: [],
    motsOutils: [],
    dictee: [],
    histoire: { titre: "", lignes: [] },
  };
}

for (const id of IDS) {
  const file = join(dir, `${id}.json`);
  // Ne pas écraser un contenu déjà rempli par un agent.
  if (existsSync(file)) {
    try {
      const cur = JSON.parse(readFileSync(file, "utf8"));
      if (cur && cur.mnemonic) continue;
    } catch {}
  }
  writeFileSync(file, JSON.stringify(placeholder(id), null, 2) + "\n", "utf8");
}

const varName = (id) => "c_" + id.replace(/[^a-z0-9]/gi, "_");
const imports = IDS.map((id) => `import ${varName(id)} from "./${id}.json";`).join("\n");
const entries = IDS.map((id) => `  "${id}": ${varName(id)} as unknown as SonContent,`).join("\n");

const index = `// FICHIER GÉNÉRÉ par scripts/gen-content-scaffold.mjs — ne pas éditer à la main.
import type { SonContent } from "../types";
${imports}

export const CONTENT: Record<string, SonContent> = {
${entries}
};
`;
writeFileSync(join(dir, "index.ts"), index, "utf8");

console.log(`OK — ${IDS.length} fichiers de contenu + index.ts générés.`);
