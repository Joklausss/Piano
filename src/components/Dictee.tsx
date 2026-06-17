"use client";

import { useMemo, useState } from "react";
import { useProgress } from "@/lib/store";
import { SONS, keepDecodable } from "@/lib/progression";
import EncodeTiles from "@/components/lesson/EncodeTiles";

function shuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Dictee() {
  const { isSonUnlocked } = useProgress();
  const [round, setRound] = useState(0);

  const pool = useMemo(() => {
    const items: { mot: string; emoji?: string }[] = [];
    for (const s of SONS) {
      if (!isSonUnlocked(s.index)) continue;
      for (const d of s.content.dictee || []) {
        if (d && d.mot && keepDecodable([d.mot], s.index).length) {
          items.push({ mot: d.mot, emoji: d.emoji });
        }
      }
    }
    // déduplique
    const seen = new Set<string>();
    return items.filter((d) => (seen.has(d.mot) ? false : (seen.add(d.mot), true)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSonUnlocked]);

  const items = useMemo(() => shuffle(pool, round + 1).slice(0, 8), [pool, round]);

  if (items.length === 0) {
    return (
      <p className="text-center font-bold text-ink-soft">
        Commence quelques leçons de sons, puis reviens écrire des mots ici ✍️
      </p>
    );
  }

  return (
    <div>
      <EncodeTiles key={round} items={items} onDone={() => setRound((r) => r + 1)} />
      <div className="mt-4 text-center">
        <button
          onClick={() => setRound((r) => r + 1)}
          className="min-h-tap rounded-full border-2 border-[#F1E2CB] bg-white px-4 py-2 font-bold text-ink-soft shadow-softs"
        >
          🔁 D'autres mots
        </button>
      </div>
    </div>
  );
}
