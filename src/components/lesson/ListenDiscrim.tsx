"use client";

import { useMemo, useState } from "react";
import { speak } from "@/lib/audio";
import { celebrate } from "@/lib/celebrate";

interface Item {
  word: string;
  has: boolean;
}

/** Étape 2 — discrimination auditive : « entends-tu le son ? » (écoute, pas lecture). */
export default function ListenDiscrim({
  phoneme,
  motsAvec,
  motsSans,
  onDone,
}: {
  phoneme: string;
  motsAvec: string[];
  motsSans: string[];
  onDone?: () => void;
}) {
  const items = useMemo<Item[]>(() => {
    const a = motsAvec.slice(0, 5).map((word) => ({ word, has: true }));
    const b = motsSans.slice(0, 4).map((word) => ({ word, has: false }));
    const all = [...a, ...b];
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    return all;
  }, [motsAvec, motsSans]);

  const [i, setI] = useState(0);
  const [feedback, setFeedback] = useState<"" | "ok" | "no">("");
  const [score, setScore] = useState(0);
  const finished = i >= items.length;
  const cur = items[i];

  if (items.length === 0) {
    return (
      <p className="text-center font-bold text-ink-soft">
        Écoute bien le son {phoneme} autour de toi aujourd'hui !
      </p>
    );
  }

  function answer(saidYes: boolean) {
    if (!cur) return;
    const correct = saidYes === cur.has;
    if (correct) {
      setScore((s) => s + 1);
      setFeedback("ok");
      celebrate();
      window.setTimeout(() => {
        setFeedback("");
        setI((n) => n + 1);
      }, 700);
    } else {
      setFeedback("no");
      window.setTimeout(() => setFeedback(""), 700);
    }
  }

  if (finished) {
    return (
      <div className="text-center">
        <p className="font-display text-xl font-semibold text-ink">
          🎉 Super écoute ! {score}/{items.length}
        </p>
        <button
          onClick={onDone}
          className="mt-3 min-h-tap rounded-full bg-grass px-5 py-2 font-display font-semibold text-white shadow-softs"
        >
          Continuer →
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className="mb-3 font-bold text-ink-soft">
        Écoute le mot. Entends-tu le son <b className="text-ink">{phoneme}</b> ?
      </p>
      <button
        onClick={() => speak(cur.word, { rate: 0.7 })}
        className="mx-auto mb-4 grid h-24 w-24 place-items-center rounded-full bg-gradient-to-b from-[#7FB5EA] to-[#5793DB] text-4xl text-white shadow-soft"
        aria-label="Écouter le mot"
      >
        🔊
      </button>
      <div className="mb-2 text-xs font-bold text-ink-soft">
        Mot {i + 1} / {items.length}
      </div>
      <div className="flex justify-center gap-3">
        <button
          onClick={() => answer(true)}
          className="min-h-tap rounded-xl2 bg-grass px-5 py-3 font-display text-lg font-semibold text-white shadow-soft active:scale-95"
        >
          👂 J'entends {phoneme}
        </button>
        <button
          onClick={() => answer(false)}
          className="min-h-tap rounded-xl2 bg-va px-5 py-3 font-display text-lg font-semibold text-white shadow-soft active:scale-95"
        >
          🚫 Je n'entends pas
        </button>
      </div>
      <div className="mt-3 min-h-[1.5em] font-extrabold">
        {feedback === "ok" && <span className="text-grass-dark">Bravo ! 👏</span>}
        {feedback === "no" && <span className="text-va">Réécoute bien 🙂</span>}
      </div>
    </div>
  );
}
