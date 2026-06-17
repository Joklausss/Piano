"use client";

import { useState } from "react";
import Piano from "@/components/Piano";
import { SONS } from "@/lib/progression";
import { COMPLEX_VOWELS } from "@/lib/colors";

const CONSONANTS = ["l","f","ch","s","m","r","n","v","j","z","p","t","c","b","d","g","k","qu","ph","gn"];

const CONSONANT_EMOJI: Record<string, string> = SONS.reduce((acc, s) => {
  if (CONSONANTS.includes(s.grapheme)) acc[s.grapheme] = s.emoji;
  return acc;
}, {} as Record<string, string>);

export default function FreePiano() {
  const [mode, setMode] = useState<"simple" | "complexe">("simple");
  const vowels = mode === "simple" ? ["a", "e", "i", "o", "u", "y"] : COMPLEX_VOWELS;

  return (
    <div>
      <div className="mb-3 flex justify-center">
        <div className="inline-flex gap-1 rounded-full border-2 border-[#F1E2CB] bg-white p-1 shadow-softs">
          {(["simple", "complexe"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={`min-h-tap rounded-full px-4 py-1.5 text-sm font-extrabold ${
                mode === m ? "bg-sun text-ink" : "text-ink-soft"
              }`}
            >
              {m === "simple" ? "Voyelles simples" : "Sons complexes"}
            </button>
          ))}
        </div>
      </div>
      <Piano consonants={CONSONANTS} vowels={vowels} consonantEmojis={CONSONANT_EMOJI} />
      <p className="mx-auto mt-4 max-w-[40ch] text-center text-sm font-bold text-ink-soft">
        Touche une <span className="text-grass-dark">consonne verte</span>, puis une{" "}
        <span className="text-ink">voyelle foncée</span>, et fais glisser pour chanter la syllabe 🎵
      </p>
    </div>
  );
}
