"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useProgress } from "@/lib/store";
import { SONS } from "@/lib/progression";
import { soundText, speak } from "@/lib/audio";
import { celebrate } from "@/lib/celebrate";

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function sample<T>(arr: T[], n: number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}

/** Tri de sons — on entend un mot, on touche le bon son. */
function TriDeSons() {
  const { isSonUnlocked } = useProgress();
  const pool = useMemo(
    () => SONS.filter((s) => isSonUnlocked(s.index) && (s.content.ecoute?.motsAvec?.length ?? 0) > 0),
    [isSonUnlocked],
  );
  const [seed, setSeed] = useState(0);
  const [score, setScore] = useState(0);
  const [msg, setMsg] = useState("");

  const round = useMemo(() => {
    if (pool.length < 2) return null;
    const target = pick(pool);
    const word = pick(target.content.ecoute!.motsAvec);
    const distract = sample(pool.filter((s) => s.id !== target.id), Math.min(2, pool.length - 1));
    const options = sample([target, ...distract], distract.length + 1);
    return { target, word, options };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed, pool]);

  if (!round) {
    return (
      <p className="text-center font-bold text-ink-soft">
        Apprends au moins 2 sons pour jouer au tri de sons 🎧
      </p>
    );
  }

  function answer(id: string) {
    if (id === round!.target.id) {
      setScore((s) => s + 1);
      setMsg("Bravo ! 🎉");
      celebrate();
    } else {
      setMsg(`C'était ${round!.target.phoneme} 🙂`);
    }
    window.setTimeout(() => {
      setMsg("");
      setSeed((s) => s + 1);
    }, 900);
  }

  return (
    <div className="text-center">
      <p className="mb-3 font-bold text-ink-soft">Écoute le mot. Quel son entends-tu ?</p>
      <button
        onClick={() => speak(round.word, { rate: 0.7 })}
        className="mx-auto mb-4 grid h-24 w-24 place-items-center rounded-full bg-gradient-to-b from-[#F58A70] to-[#E85F40] text-4xl text-white shadow-soft"
        aria-label="Écouter le mot"
      >
        🔊
      </button>
      <div className="flex flex-wrap justify-center gap-3">
        {round.options.map((s) => (
          <button
            key={s.id}
            onClick={() => answer(s.id)}
            className="flex min-h-tap flex-col items-center gap-1 rounded-xl2 border-2 border-[#EBD9BE] bg-white px-5 py-3 shadow-softs active:scale-95"
          >
            <span className="text-2xl" aria-hidden>{s.emoji}</span>
            <span className="font-reading text-2xl font-bold text-ink">{s.grapheme}</span>
          </button>
        ))}
      </div>
      <div className="mt-3 min-h-[1.5em] font-extrabold text-grass-dark">{msg}</div>
      <div className="text-xs font-bold text-ink-soft">Score : {score} ⭐</div>
    </div>
  );
}

const CONFUSIONS = [
  ["b", "d", "p", "q"],
  ["m", "n"],
  ["ch", "j"],
  ["f", "v"],
];

/** Confusions — touche la lettre qui correspond au modèle. */
function ConfusionGame() {
  const [seed, setSeed] = useState(0);
  const [score, setScore] = useState(0);
  const [msg, setMsg] = useState("");

  const round = useMemo(() => {
    const set = pick(CONFUSIONS);
    const target = pick(set);
    return { target, options: sample(set, set.length) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);

  function answer(g: string) {
    if (g === round.target) {
      setScore((s) => s + 1);
      setMsg("Oui ! 👏");
      speak(soundText(g), { rate: 0.6 });
      celebrate();
    } else {
      setMsg("Regarde bien la forme 🔍");
    }
    window.setTimeout(() => {
      setMsg("");
      setSeed((s) => s + 1);
    }, 900);
  }

  return (
    <div className="text-center">
      <p className="mb-2 font-bold text-ink-soft">Touche la lettre identique au modèle.</p>
      <div className="mx-auto mb-4 grid h-24 w-24 place-items-center rounded-xl3 border-2 border-[#F1E2CB] bg-white font-reading text-6xl font-bold text-ink shadow-softs">
        {round.target}
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {round.options.map((g, i) => (
          <button
            key={i}
            onClick={() => answer(g)}
            className="min-h-tap min-w-[64px] rounded-xl2 border-2 border-[#EBD9BE] bg-white px-5 py-3 font-reading text-4xl font-bold text-ink shadow-softs active:scale-90"
          >
            {g}
          </button>
        ))}
      </div>
      <div className="mt-3 min-h-[1.5em] font-extrabold text-grass-dark">{msg}</div>
      <div className="text-xs font-bold text-ink-soft">Score : {score} ⭐</div>
    </div>
  );
}

export default function Jeux() {
  const [game, setGame] = useState<"tri" | "confusion">("tri");
  return (
    <div>
      <div className="mb-4 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setGame("tri")}
          aria-pressed={game === "tri"}
          className={`min-h-tap rounded-full px-4 py-2 font-display font-semibold shadow-softs ${
            game === "tri" ? "bg-ink text-white" : "border-2 border-[#F1E2CB] bg-white text-ink-soft"
          }`}
        >
          🎧 Tri de sons
        </button>
        <button
          onClick={() => setGame("confusion")}
          aria-pressed={game === "confusion"}
          className={`min-h-tap rounded-full px-4 py-2 font-display font-semibold shadow-softs ${
            game === "confusion" ? "bg-ink text-white" : "border-2 border-[#F1E2CB] bg-white text-ink-soft"
          }`}
        >
          🔍 Confusions
        </button>
        <Link
          href="/histoires"
          className="min-h-tap rounded-full border-2 border-[#F1E2CB] bg-white px-4 py-2 font-display font-semibold text-ink-soft shadow-softs"
        >
          ⏱️ Fluence
        </Link>
      </div>

      <div className="rounded-xl3 border-2 border-[#F1E2CB] bg-cream-soft/40 p-4">
        {game === "tri" ? <TriDeSons /> : <ConfusionGame />}
      </div>
    </div>
  );
}
