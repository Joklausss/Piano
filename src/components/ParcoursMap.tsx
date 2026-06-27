"use client";

import Link from "next/link";
import { useProgress } from "@/lib/store";
import { SONS, PERIODS, sonsOfPeriod } from "@/lib/progression";
import { PERIOD_TITLES } from "@/data/order";
import { vowelColor } from "@/lib/colors";
import type { Period } from "@/data/types";

const PERIOD_COLOR: Record<number, string> = {
  1: "#F2785C",
  2: "#6BA8E5",
  3: "#5FB6A8",
  4: "#A98CD9",
  5: "#E58FB5",
};

export default function ParcoursMap() {
  const { progress, isSonUnlocked, isMastered } = useProgress();
  const masteredCount = progress.masteredSons.length;
  // « Continuer » vise la 1re leçon non faite après les voyelles (donc L au départ),
  // sinon n'importe quelle leçon débloquée non maîtrisée.
  const nextSon =
    SONS.find((s) => isSonUnlocked(s.index) && !isMastered(s.id) && s.type !== "voyelle") ??
    SONS.find((s) => isSonUnlocked(s.index) && !isMastered(s.id));

  return (
    <div>
      <div className="mb-4 rounded-xl2 border-2 border-[#F1E2CB] bg-white p-4 shadow-softs">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-display text-lg font-semibold text-ink">
              {masteredCount} son{masteredCount > 1 ? "s" : ""} sur {SONS.length}
            </div>
            <div className="text-xs font-bold text-ink-soft">
              {progress.badges.length} récompense{progress.badges.length > 1 ? "s" : ""} 🏅
            </div>
          </div>
          {nextSon && (
            <Link
              href={`/parcours/${nextSon.id}`}
              className="min-h-tap rounded-full bg-grass px-5 py-2 font-display font-semibold text-white shadow-softs"
            >
              ▶︎ Continuer
            </Link>
          )}
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-cream-soft">
          <div
            className="h-full rounded-full bg-grass transition-all"
            style={{ width: `${Math.round((masteredCount / SONS.length) * 100)}%` }}
          />
        </div>
      </div>

      <Link
        href="/module-0"
        className="mb-5 flex items-center gap-3 rounded-xl2 border-2 border-[#F1E2CB] bg-gradient-to-r from-[#FFF1DA] to-white p-3 shadow-softs"
      >
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-vi text-2xl" aria-hidden>🧩</span>
        <span>
          <span className="block font-display font-semibold text-ink">Avant de lire</span>
          <span className="block text-xs font-bold text-ink-soft">Réviser les sons de la maternelle</span>
        </span>
      </Link>

      {PERIODS.map((period: Period) => {
        const sons = sonsOfPeriod(period);
        return (
          <section key={period} className="mb-6">
            <h2 className="mb-2 font-display text-base font-semibold text-ink">
              {PERIOD_TITLES[period]}
            </h2>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {sons.map((s) => {
                const unlocked = isSonUnlocked(s.index);
                const mastered = isMastered(s.id);
                const color = s.type === "voyelle" ? vowelColor(s.grapheme) : PERIOD_COLOR[period];
                const inner = (
                  <>
                    <span className="text-2xl" aria-hidden>{s.emoji}</span>
                    <span className="font-reading text-lg font-bold leading-none">{s.grapheme}</span>
                    {mastered && <span className="absolute right-1 top-1 text-xs" aria-hidden>✅</span>}
                    {!unlocked && <span className="absolute right-1 top-1 text-xs" aria-hidden>🔒</span>}
                  </>
                );
                const base =
                  "relative flex min-h-[76px] flex-col items-center justify-center gap-1 rounded-xl2 border-2 p-2 text-white shadow-softs";
                if (!unlocked) {
                  return (
                    <div
                      key={s.id}
                      className={`${base} border-[#E7D6BC] bg-[#E9DEC9] text-ink-soft opacity-70`}
                      aria-label={`${s.label} (verrouillé)`}
                    >
                      {inner}
                    </div>
                  );
                }
                return (
                  <Link
                    key={s.id}
                    href={`/parcours/${s.id}`}
                    className={`${base} border-transparent transition-transform active:scale-95`}
                    style={{ background: color }}
                    aria-label={s.label}
                  >
                    {inner}
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
