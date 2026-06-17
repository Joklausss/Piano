"use client";

import type { AideLevel } from "@/lib/store";

const OPTIONS: { value: AideLevel; label: string; emoji: string }[] = [
  { value: "colore", label: "Couleurs", emoji: "🌈" },
  { value: "segmente", label: "Coupé", emoji: "✂️" },
  { value: "nu", label: "Tout seul", emoji: "👁️" },
];

/** Sélecteur d'étayage à 3 niveaux (différenciation). */
export default function AideToggle({
  value,
  onChange,
}: {
  value: AideLevel;
  onChange: (v: AideLevel) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Niveau d'aide"
      className="inline-flex gap-1 rounded-full border-2 border-[#F1E2CB] bg-white p-1 shadow-softs"
    >
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          aria-pressed={value === o.value}
          className={`min-h-tap rounded-full px-3 py-1.5 text-sm font-extrabold transition-colors ${
            value === o.value ? "bg-sun text-ink" : "text-ink-soft"
          }`}
        >
          <span aria-hidden>{o.emoji}</span> {o.label}
        </button>
      ))}
    </div>
  );
}
