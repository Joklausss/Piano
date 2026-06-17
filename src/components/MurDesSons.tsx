"use client";

import { useState } from "react";
import { useProgress } from "@/lib/store";
import { SONS } from "@/lib/progression";
import { soundText, speak } from "@/lib/audio";
import { vowelColor } from "@/lib/colors";
import type { Period } from "@/data/types";

const FILTERS: { value: "all" | Period; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: 1, label: "P1" },
  { value: 2, label: "P2" },
  { value: 3, label: "P3" },
  { value: 4, label: "P4" },
  { value: 5, label: "P5" },
];

export default function MurDesSons() {
  const { isSonUnlocked, isMastered } = useProgress();
  const [filter, setFilter] = useState<"all" | Period>("all");

  const sons = SONS.filter((s) => filter === "all" || s.period === filter);

  return (
    <div>
      <div className="mb-4 flex flex-wrap justify-center gap-1">
        {FILTERS.map((f) => (
          <button
            key={String(f.value)}
            onClick={() => setFilter(f.value)}
            aria-pressed={filter === f.value}
            className={`min-h-tap rounded-full px-3 py-1.5 text-sm font-extrabold ${
              filter === f.value ? "bg-ink text-white" : "border-2 border-[#F1E2CB] bg-white text-ink-soft"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {sons.map((s) => {
          const unlocked = isSonUnlocked(s.index);
          const color = s.type === "voyelle" ? vowelColor(s.grapheme) : "#6E5D86";
          return (
            <button
              key={s.id}
              onClick={() => unlocked && speak(soundText(s.grapheme), { rate: 0.6 })}
              className={`flex flex-col items-center gap-1 rounded-xl2 border-2 border-[#F1E2CB] bg-white p-3 text-center shadow-softs ${
                unlocked ? "" : "opacity-50 grayscale"
              }`}
              aria-label={`${s.label}${unlocked ? "" : " (à découvrir)"}`}
            >
              <span className="text-3xl" aria-hidden>{unlocked ? s.emoji : "🔒"}</span>
              <span
                className="font-reading text-3xl font-bold leading-none"
                style={{ color }}
              >
                {s.grapheme}
              </span>
              {unlocked && (
                <>
                  <span className="text-xs font-bold text-ink-soft">{s.keyword}</span>
                  <span className="mt-1 flex items-end gap-2 text-ink-soft">
                    <span className="font-reading text-lg font-bold">{s.grapheme.toUpperCase()}</span>
                    <span className="font-reading text-lg">{s.grapheme}</span>
                    <span className="text-lg italic [font-family:'Segoe_Script','Comic_Sans_MS',cursive]">
                      {s.grapheme}
                    </span>
                  </span>
                  {isMastered(s.id) && <span className="text-xs text-grass-dark">✅ appris</span>}
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
