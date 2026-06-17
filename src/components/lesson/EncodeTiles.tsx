"use client";

import { useEffect, useMemo, useState } from "react";
import { speak } from "@/lib/audio";
import { segment } from "@/lib/phonics";
import { celebrate } from "@/lib/celebrate";

interface Tile {
  id: number;
  g: string;
  used: boolean;
}

const DISTRACTORS = ["a", "i", "o", "u", "l", "s", "m", "r", "t", "p", "n"];

/** Étape 8 — encodage / dictée : on entend un mot, on le fabrique avec les lettres. */
export default function EncodeTiles({
  items,
  onDone,
}: {
  items: { mot: string; emoji?: string }[];
  onDone?: () => void;
}) {
  const list = useMemo(() => items.filter((d) => d && d.mot).slice(0, 6), [items]);
  const [i, setI] = useState(0);
  const cur = list[i];
  const target = useMemo(() => (cur ? segment(cur.mot.toLowerCase()) : []), [cur]);

  const [tiles, setTiles] = useState<Tile[]>([]);
  const [built, setBuilt] = useState<number[]>([]);
  const [state, setState] = useState<"" | "ok" | "no">("");

  // (Re)génère les tuiles pour le mot courant.
  useEffect(() => {
    if (!cur) return;
    const pool = [...target];
    const distract = DISTRACTORS.filter((d) => !target.includes(d));
    for (let k = 0; k < 2 && distract.length; k++) {
      pool.push(distract.splice(Math.floor(Math.random() * distract.length), 1)[0]);
    }
    for (let k = pool.length - 1; k > 0; k--) {
      const j = Math.floor(Math.random() * (k + 1));
      [pool[k], pool[j]] = [pool[j], pool[k]];
    }
    setTiles(pool.map((g, id) => ({ id, g, used: false })));
    setBuilt([]);
    setState("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, cur?.mot]);

  if (!cur) {
    return (
      <p className="text-center font-bold text-ink-soft">
        Pas de dictée aujourd'hui — on écrira la prochaine fois ✍️
      </p>
    );
  }

  function tap(t: Tile) {
    if (t.used || state === "ok") return;
    const nextBuilt = [...built, t.id];
    setTiles((ts) => ts.map((x) => (x.id === t.id ? { ...x, used: true } : x)));
    setBuilt(nextBuilt);
    if (nextBuilt.length === target.length) {
      const word = nextBuilt.map((id) => tiles.find((x) => x.id === id)!.g).join("");
      if (word === target.join("")) {
        setState("ok");
        celebrate();
        window.setTimeout(() => {
          if (i + 1 >= list.length) onDone?.();
          else setI(i + 1);
        }, 900);
      } else {
        setState("no");
        window.setTimeout(() => {
          setTiles((ts) => ts.map((x) => ({ ...x, used: false })));
          setBuilt([]);
          setState("");
        }, 800);
      }
    }
  }

  function backspace() {
    if (!built.length) return;
    const last = built[built.length - 1];
    setBuilt(built.slice(0, -1));
    setTiles((ts) => ts.map((x) => (x.id === last ? { ...x, used: false } : x)));
    setState("");
  }

  return (
    <div className="text-center">
      <p className="mb-2 font-bold text-ink-soft">Écoute le mot, puis écris-le avec les lettres.</p>
      <button
        onClick={() => speak(cur.mot, { rate: 0.65 })}
        className="mx-auto mb-3 grid h-20 w-20 place-items-center rounded-full bg-gradient-to-b from-[#B79CE3] to-[#9678CF] text-3xl text-white shadow-soft"
        aria-label="Écouter le mot à écrire"
      >
        {cur.emoji || "🔊"}
      </button>

      {/* Zone de construction */}
      <div
        className={`mx-auto mb-3 flex min-h-[58px] max-w-[320px] flex-wrap items-center justify-center gap-1 rounded-xl2 border-2 border-dashed p-2 ${
          state === "ok" ? "border-grass bg-grass/10" : state === "no" ? "border-va bg-va/10" : "border-[#E0CBA8] bg-cream-soft"
        }`}
        aria-live="polite"
      >
        {built.length === 0 && <span className="text-ink-soft">…</span>}
        {built.map((id) => (
          <span key={id} className="font-reading text-2xl font-bold text-ink">
            {tiles.find((x) => x.id === id)?.g}
          </span>
        ))}
      </div>

      {/* Tuiles disponibles */}
      <div className="flex flex-wrap justify-center gap-2">
        {tiles.map((t) => (
          <button
            key={t.id}
            onClick={() => tap(t)}
            disabled={t.used}
            className={`min-h-tap min-w-tap rounded-xl2 border-2 px-3 py-2 font-reading text-2xl font-bold shadow-softs transition ${
              t.used ? "border-transparent bg-cream-soft text-cream-soft" : "border-[#EBD9BE] bg-white text-ink active:scale-90"
            }`}
          >
            {t.g}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-center gap-3">
        <button onClick={backspace} className="min-h-tap rounded-full border-2 border-[#F1E2CB] bg-white px-4 py-2 text-sm font-extrabold text-ink-soft shadow-softs">
          ⌫ Effacer
        </button>
        <span className="text-xs font-bold text-ink-soft">
          Mot {i + 1} / {list.length}
        </span>
      </div>
    </div>
  );
}
