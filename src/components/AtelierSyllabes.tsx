"use client";

import { useState } from "react";
import { DecodableWord } from "@/components/reading/DecodableText";
import { speak } from "@/lib/audio";
import { vowelColor } from "@/lib/colors";

const VOYELLES = ["a", "e", "i", "o", "u", "y", "é", "è"];
const CONSONNES = ["l", "f", "ch", "s", "m", "r", "n", "v", "j", "z", "p", "t", "c", "b", "d", "g"];
const COMPLEXES = ["ou", "on", "an", "in", "oi", "au", "eau", "eu", "ai"];

function Pal({
  items,
  onTap,
  vowel,
}: {
  items: string[];
  onTap: (g: string) => void;
  vowel?: boolean;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-1.5">
      {items.map((g) => (
        <button
          key={g}
          onClick={() => onTap(g)}
          className="min-h-tap min-w-tap rounded-xl2 border-2 border-[#EBD9BE] bg-white px-3 py-2 font-reading text-xl font-bold shadow-softs active:scale-90"
          style={{ color: vowel ? vowelColor(g) : "#5E9650" }}
        >
          {g}
        </button>
      ))}
    </div>
  );
}

export default function AtelierSyllabes() {
  const [parts, setParts] = useState<string[]>([]);
  const word = parts.join("");

  return (
    <div>
      {/* Zone de construction */}
      <div className="mb-3 flex min-h-[80px] items-center justify-center rounded-xl3 border-2 border-dashed border-[#E0CBA8] bg-cream-soft p-4">
        {word ? (
          <DecodableWord word={word} aide="colore" big />
        ) : (
          <span className="font-bold text-ink-soft">Touche des lettres pour fabriquer une syllabe ou un mot…</span>
        )}
      </div>

      <div className="mb-3 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => speak(word, { rate: 0.7 })}
          disabled={!word}
          className="min-h-tap rounded-full bg-grass px-5 py-2 font-display font-semibold text-white shadow-softs disabled:opacity-40"
        >
          🔊 Lire
        </button>
        <button
          onClick={() => setParts((p) => p.slice(0, -1))}
          disabled={!word}
          className="min-h-tap rounded-full border-2 border-[#F1E2CB] bg-white px-4 py-2 font-bold text-ink-soft shadow-softs disabled:opacity-40"
        >
          ⌫ Effacer
        </button>
        <button
          onClick={() => setParts([])}
          disabled={!word}
          className="min-h-tap rounded-full border-2 border-[#F1E2CB] bg-white px-4 py-2 font-bold text-ink-soft shadow-softs disabled:opacity-40"
        >
          🧹 Tout enlever
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <div className="mb-1 text-center text-xs font-extrabold uppercase tracking-wide text-ink-soft">Voyelles</div>
          <Pal items={VOYELLES} onTap={(g) => setParts((p) => [...p, g])} vowel />
        </div>
        <div>
          <div className="mb-1 text-center text-xs font-extrabold uppercase tracking-wide text-ink-soft">Consonnes</div>
          <Pal items={CONSONNES} onTap={(g) => setParts((p) => [...p, g])} />
        </div>
        <div>
          <div className="mb-1 text-center text-xs font-extrabold uppercase tracking-wide text-ink-soft">Sons complexes</div>
          <Pal items={COMPLEXES} onTap={(g) => setParts((p) => [...p, g])} vowel />
        </div>
      </div>
    </div>
  );
}
