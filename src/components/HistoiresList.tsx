"use client";

import Link from "next/link";
import { useProgress } from "@/lib/store";
import { SONS, keepDecodable } from "@/lib/progression";

export default function HistoiresList() {
  const { isSonUnlocked } = useProgress();

  const stories = SONS.filter((s) => {
    if (!isSonUnlocked(s.index)) return false;
    const lines = keepDecodable(s.content.histoire?.lignes || [], s.index);
    return lines.length > 0 && s.content.histoire?.titre;
  });

  if (stories.length === 0) {
    return (
      <p className="text-center font-bold text-ink-soft">
        Tes premières histoires apparaîtront ici dès que tu auras appris quelques sons 📖
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {stories.map((s) => (
        <Link
          key={s.id}
          href={`/histoires/${s.id}`}
          className="flex items-center gap-3 rounded-xl2 border-2 border-[#F1E2CB] bg-white p-3 shadow-softs active:scale-[0.98]"
        >
          <span className="grid h-12 w-12 flex-none place-items-center rounded-2xl bg-vy text-2xl" aria-hidden>
            {s.emoji}
          </span>
          <span className="min-w-0">
            <span className="block font-display font-semibold text-ink">
              {s.content.histoire?.titre}
            </span>
            <span className="block text-xs font-bold text-ink-soft">Avec le son {s.phoneme}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
