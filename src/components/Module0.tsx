"use client";

import { useMemo, useState } from "react";
import { useProgress } from "@/lib/store";
import { speak } from "@/lib/audio";
import { celebrate } from "@/lib/celebrate";
import Mascotte from "@/components/Mascotte";
import LetterTrace from "@/components/lesson/LetterTrace";

function shuffle<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

function Done({ onDone }: { onDone: () => void }) {
  return (
    <div className="mt-4 text-center">
      <button
        onClick={() => {
          celebrate();
          onDone();
        }}
        className="min-h-tap rounded-full bg-grass px-6 py-2 font-display text-lg font-semibold text-white shadow-soft"
      >
        ✅ J'ai terminé
      </button>
    </div>
  );
}

// 1. Compter les syllabes (frapper dans les mains)
const SYLL = [
  { emoji: "🐱", word: "chat", n: 1 },
  { emoji: "🐰", word: "lapin", n: 2 },
  { emoji: "🦋", word: "papillon", n: 3 },
  { emoji: "🛵", word: "moto", n: 2 },
  { emoji: "🍍", word: "ananas", n: 3 },
  { emoji: "🤖", word: "robot", n: 2 },
];
function CompterSyllabes({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);
  const [claps, setClaps] = useState(0);
  const [msg, setMsg] = useState("");
  const cur = SYLL[i];
  if (i >= SYLL.length) return <Done onDone={onDone} />;
  function check() {
    if (claps === cur.n) {
      setMsg("Bravo ! 👏");
      celebrate();
      window.setTimeout(() => {
        setMsg("");
        setClaps(0);
        setI(i + 1);
      }, 900);
    } else {
      setMsg("Réessaie en frappant chaque syllabe 🙂");
    }
  }
  return (
    <div className="text-center">
      <p className="mb-2 font-bold text-ink-soft">Frappe dans tes mains pour chaque syllabe.</p>
      <button onClick={() => speak(cur.word, { rate: 0.6 })} className="text-7xl" aria-label={`Écouter ${cur.word}`}>
        {cur.emoji}
      </button>
      <p className="font-display text-xl font-bold text-ink">{cur.word}</p>
      <div className="my-3 text-3xl font-bold text-ink">{claps}</div>
      <div className="flex justify-center gap-2">
        <button onClick={() => setClaps((c) => c + 1)} className="min-h-tap rounded-full bg-sun px-6 py-3 text-2xl shadow-soft active:scale-90">
          👏 Frapper
        </button>
        <button onClick={() => setClaps(0)} className="min-h-tap rounded-full border-2 border-[#F1E2CB] bg-white px-4 py-2 font-bold text-ink-soft">
          ↺
        </button>
      </div>
      <button onClick={check} className="mt-3 min-h-tap rounded-full bg-grass px-5 py-2 font-display font-semibold text-white shadow-softs">
        Vérifier
      </button>
      <div className="mt-2 min-h-[1.5em] font-extrabold text-grass-dark">{msg}</div>
      <div className="text-xs font-bold text-ink-soft">Mot {i + 1}/{SYLL.length}</div>
    </div>
  );
}

// 2. Les rimes
const RIMES = [
  { cible: { emoji: "🐱", word: "chat" }, bon: { emoji: "🐀", word: "rat" }, mauvais: { emoji: "🌙", word: "lune" } },
  { cible: { emoji: "🐰", word: "lapin" }, bon: { emoji: "🥖", word: "pain" }, mauvais: { emoji: "🚲", word: "vélo" } },
  { cible: { emoji: "🐭", word: "souris" }, bon: { emoji: "🛏️", word: "lit" }, mauvais: { emoji: "🍎", word: "pomme" } },
];
function LesRimes({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);
  const [msg, setMsg] = useState("");
  const cur = RIMES[i];
  const options = useMemo(() => (cur ? shuffle([cur.bon, cur.mauvais]) : []), [i]);
  if (i >= RIMES.length) return <Done onDone={onDone} />;
  function answer(word: string) {
    if (word === cur.bon.word) {
      setMsg("Oui, ça rime ! 🎵");
      celebrate();
      window.setTimeout(() => {
        setMsg("");
        setI(i + 1);
      }, 900);
    } else {
      setMsg("Écoute encore la fin du mot 👂");
    }
  }
  return (
    <div className="text-center">
      <p className="mb-2 font-bold text-ink-soft">Quel mot finit comme…</p>
      <button onClick={() => speak(cur.cible.word, { rate: 0.6 })} className="text-6xl">
        {cur.cible.emoji}
      </button>
      <p className="mb-3 font-display text-xl font-bold text-ink">{cur.cible.word} ?</p>
      <div className="flex justify-center gap-3">
        {options.map((o) => (
          <button
            key={o.word}
            onClick={() => {
              speak(o.word, { rate: 0.6 });
              answer(o.word);
            }}
            className="flex min-h-tap flex-col items-center gap-1 rounded-xl2 border-2 border-[#EBD9BE] bg-white px-5 py-3 shadow-softs active:scale-95"
          >
            <span className="text-3xl">{o.emoji}</span>
            <span className="font-display font-bold text-ink">{o.word}</span>
          </button>
        ))}
      </div>
      <div className="mt-3 min-h-[1.5em] font-extrabold text-grass-dark">{msg}</div>
    </div>
  );
}

// 3. Les voyelles (tap the vowels)
const LETTERS = ["a", "b", "i", "m", "o", "r", "u", "e", "s", "l"];
const VOWELS = new Set(["a", "i", "o", "u", "e", "y"]);
function LesVoyelles({ onDone }: { onDone: () => void }) {
  const [found, setFound] = useState<string[]>([]);
  const target = LETTERS.filter((l) => VOWELS.has(l));
  const complete = target.every((v) => found.includes(v));
  return (
    <div className="text-center">
      <p className="mb-3 font-bold text-ink-soft">
        Touche les <b className="text-ink">voyelles</b> (les lettres qui chantent toutes seules).
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {LETTERS.map((l) => {
          const isV = VOWELS.has(l);
          const got = found.includes(l);
          return (
            <button
              key={l}
              onClick={() => {
                speak(l, { rate: 0.6 });
                if (isV && !got) setFound((f) => [...f, l]);
              }}
              className={`grid h-14 w-14 place-items-center rounded-xl2 border-2 font-reading text-2xl font-bold shadow-softs ${
                got ? "border-grass bg-grass/20 text-grass-dark" : "border-[#EBD9BE] bg-white text-ink"
              }`}
            >
              {l}
            </button>
          );
        })}
      </div>
      {complete && <Done onDone={onDone} />}
    </div>
  );
}

// 4. Les 3 écritures
const TROIS = ["a", "m", "i", "r", "o"];
function Les3Ecritures({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);
  const [msg, setMsg] = useState("");
  const cur = TROIS[i];
  const options = useMemo(() => (cur ? shuffle([cur, ...shuffle(TROIS.filter((x) => x !== cur)).slice(0, 2)]) : []), [i]);
  if (i >= TROIS.length) return <Done onDone={onDone} />;
  function answer(l: string) {
    if (l === cur) {
      setMsg("Oui, c'est la même lettre ! 🎉");
      celebrate();
      window.setTimeout(() => {
        setMsg("");
        setI(i + 1);
      }, 900);
    } else {
      setMsg("Regarde bien la forme 🔍");
    }
  }
  return (
    <div className="text-center">
      <p className="mb-2 font-bold text-ink-soft">Voici une lettre en CAPITALE et en cursive. Retrouve-la en script (a).</p>
      <div className="mb-3 flex items-center justify-center gap-6">
        <span className="font-reading text-5xl font-bold text-ink">{cur.toUpperCase()}</span>
        <span className="text-5xl italic [font-family:'Segoe_Script','Comic_Sans_MS',cursive]">{cur}</span>
      </div>
      <div className="flex justify-center gap-3">
        {options.map((o, k) => (
          <button
            key={k}
            onClick={() => answer(o)}
            className="grid h-16 w-16 place-items-center rounded-xl2 border-2 border-[#EBD9BE] bg-white font-reading text-3xl font-bold text-ink shadow-softs active:scale-90"
          >
            {o}
          </button>
        ))}
      </div>
      <div className="mt-3 min-h-[1.5em] font-extrabold text-grass-dark">{msg}</div>
    </div>
  );
}

// 5. Geste d'écriture
function Geste({ onDone }: { onDone: () => void }) {
  return (
    <div>
      <LetterTrace grapheme="a" defaultEcriture="script" />
      <Done onDone={onDone} />
    </div>
  );
}

// 6. Principe alphabétique (explication)
function Principe({ onDone }: { onDone: () => void }) {
  return (
    <div className="text-center">
      <Mascotte
        message="Quand on lit, on va toujours de gauche à droite, comme une petite fourmi sur la ligne."
        size="sm"
      />
      <div className="my-4 flex items-center justify-center gap-2 text-3xl">
        <span>👉</span>
        <span className="font-reading text-2xl font-bold text-ink">l &nbsp; i &nbsp; r &nbsp; e</span>
      </div>
      <p className="mx-auto max-w-[34ch] font-bold text-ink-soft">
        Les lettres codent les sons qu'on entend. On les lit dans l'ordre, une à une.
      </p>
      <Done onDone={onDone} />
    </div>
  );
}

const ACTIVITIES: {
  id: string;
  emoji: string;
  title: string;
  consigne: string;
  Comp: (p: { onDone: () => void }) => JSX.Element;
}[] = [
  { id: "m0-syllabes", emoji: "👏", title: "Compter les syllabes", consigne: "On frappe les syllabes des mots.", Comp: CompterSyllabes },
  { id: "m0-rimes", emoji: "🎵", title: "Les rimes", consigne: "On cherche les mots qui finissent pareil.", Comp: LesRimes },
  { id: "m0-voyelles", emoji: "🔤", title: "Les voyelles", consigne: "On repère les lettres qui chantent toutes seules.", Comp: LesVoyelles },
  { id: "m0-ecritures", emoji: "✒️", title: "Les 3 écritures", consigne: "Une même lettre a plusieurs habits.", Comp: Les3Ecritures },
  { id: "m0-principe", emoji: "➡️", title: "Lire de gauche à droite", consigne: "On découvre le principe de l'écrit.", Comp: Principe },
  { id: "m0-geste", emoji: "✍️", title: "Le geste d'écriture", consigne: "On s'entraîne à tracer une lettre.", Comp: Geste },
];

export default function Module0() {
  const { progress, toggleModule0 } = useProgress();
  const [active, setActive] = useState<string | null>(null);
  const current = ACTIVITIES.find((a) => a.id === active);

  if (current) {
    const Comp = current.Comp;
    return (
      <div>
        <button
          onClick={() => setActive(null)}
          className="mb-3 inline-flex min-h-tap items-center gap-2 rounded-full border-2 border-[#F1E2CB] bg-white px-4 py-2 text-sm font-extrabold text-ink-soft shadow-softs"
        >
          ← Les activités
        </button>
        <div className="mb-4">
          <Mascotte message={current.consigne} />
        </div>
        <section className="rounded-xl3 border-2 border-[#F1E2CB] bg-cream-soft/40 p-4">
          <h2 className="mb-3 text-center font-display text-xl font-semibold text-ink">
            {current.emoji} {current.title}
          </h2>
          <Comp
            onDone={() => {
              toggleModule0(current.id);
              setActive(null);
            }}
          />
        </section>
      </div>
    );
  }

  const doneCount = ACTIVITIES.filter((a) => progress.module0Done.includes(a.id)).length;

  return (
    <div>
      <div className="mb-4">
        <Mascotte message="Avant de lire au CP, on révise ce qu'on a vu à la maternelle. On y va ?" />
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {ACTIVITIES.map((a) => {
          const done = progress.module0Done.includes(a.id);
          return (
            <button
              key={a.id}
              onClick={() => setActive(a.id)}
              className="flex min-h-tap items-center gap-3 rounded-xl2 border-2 border-[#F1E2CB] bg-white p-3 text-left shadow-softs active:scale-[0.98]"
            >
              <span className="grid h-12 w-12 flex-none place-items-center rounded-2xl bg-vi text-2xl" aria-hidden>{a.emoji}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-display font-semibold text-ink">{a.title}</span>
              </span>
              {done && <span aria-hidden>✅</span>}
            </button>
          );
        })}
      </div>

      {doneCount === ACTIVITIES.length && (
        <div className="mt-5 rounded-xl3 border-2 border-grass bg-grass/10 p-4 text-center">
          <p className="font-display text-xl font-bold text-grass-dark">🎉 Je suis prêt·e pour le CP !</p>
          <a href="/parcours" className="mt-2 inline-block min-h-tap rounded-full bg-grass px-6 py-2 font-display font-semibold text-white shadow-softs">
            Commencer les leçons →
          </a>
        </div>
      )}
    </div>
  );
}
