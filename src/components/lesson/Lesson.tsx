"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Son } from "@/data/types";
import {
  SONS,
  pianoVowels,
  knownConsonants,
  keepDecodable,
  allowedMotsOutils,
} from "@/lib/progression";
import { MOTS_OUTILS_BY_PERIOD } from "@/data/order";
import { buildSyllables, isVowelGrapheme } from "@/lib/phonics";
import { soundText, speak } from "@/lib/audio";
import { celebrate } from "@/lib/celebrate";
import { useProgress, useSettings, type AideLevel } from "@/lib/store";

import Piano from "@/components/Piano";
import Mascotte from "@/components/Mascotte";
import { BackLink } from "@/components/ui";
import AideToggle from "@/components/reading/AideToggle";
import { DecodableWord, DecodableText } from "@/components/reading/DecodableText";
import StoryReader from "@/components/reading/StoryReader";
import ListenDiscrim from "./ListenDiscrim";
import EncodeTiles from "./EncodeTiles";
import LetterTrace from "./LetterTrace";

const CONSONANTS = ["l","f","ch","s","m","r","n","v","j","z","p","t","c","b","d","g","k","qu","ph","gn","x","w"];

const CONSONANT_EMOJI: Record<string, string> = SONS.reduce((acc, s) => {
  if (CONSONANTS.includes(s.grapheme)) acc[s.grapheme] = s.emoji;
  return acc;
}, {} as Record<string, string>);

function uniq(a: string[]) {
  return Array.from(new Set(a));
}

export default function Lesson({ son }: { son: Son }) {
  const router = useRouter();
  const idx = son.index;
  const { settings } = useSettings();
  const { completeStep, masterSon, isMastered, setFluence } = useProgress();
  const [aide, setAide] = useState<AideLevel>(settings.aide);
  const [step, setStep] = useState(0);

  const newG = son.graphemes[0] ?? son.grapheme;
  const vowels = useMemo(() => pianoVowels(idx), [idx]);
  const consonants = useMemo(() => knownConsonants(idx), [idx]);

  // Configuration du Piano selon le type de son.
  const piano = useMemo(() => {
    if (CONSONANTS.includes(newG)) {
      return { cons: [newG], vows: vowels.length ? vowels : ["a"] };
    }
    if (son.type === "voyelle") {
      return { cons: consonants.slice(-6), vows: vowels };
    }
    if (isVowelGrapheme(newG)) {
      return { cons: consonants.slice(-6), vows: uniq([newG, ...vowels]).slice(0, 6) };
    }
    return { cons: newG ? [newG] : consonants.slice(-2), vows: vowels };
  }, [newG, son.type, vowels, consonants]);

  // Contenus filtrés (règle de fer).
  const syllabes = useMemo(() => {
    let s = keepDecodable(son.content.syllabes || [], idx);
    if (!s.length) {
      if (CONSONANTS.includes(newG)) s = buildSyllables(newG, vowels);
      else if (consonants.length) s = consonants.slice(-5).map((c) => c + newG);
    }
    return uniq(s).slice(0, 12);
  }, [son.content.syllabes, idx, newG, vowels, consonants]);

  const mots = useMemo(() => keepDecodable(son.content.mots || [], idx).slice(0, 12), [son, idx]);
  const phrases = useMemo(() => keepDecodable(son.content.phrases || [], idx).slice(0, 5), [son, idx]);
  const histoireLignes = useMemo(
    () => keepDecodable(son.content.histoire?.lignes || [], idx),
    [son, idx],
  );
  const dictee = useMemo(() => {
    const allowed = son.content.dictee?.filter((d) => d && keepDecodable([d.mot], idx).length) || [];
    return allowed.slice(0, 6);
  }, [son, idx]);
  const motsOutils = useMemo(() => {
    const allow = allowedMotsOutils(idx);
    let mo = (son.content.motsOutils || []).filter((m) => allow.has(m.toLowerCase()));
    if (!mo.length) mo = (MOTS_OUTILS_BY_PERIOD[son.period] || []).slice(0, 5);
    return uniq(mo).slice(0, 6);
  }, [son, idx]);

  function go(n: number) {
    const next = Math.max(0, Math.min(9, n));
    setStep(next);
    completeStep(son.id, next);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function finish() {
    masterSon(son.id);
    celebrate();
    speak("Bravo ! Tu as fini la leçon.", { rate: 0.9 });
  }

  const STEPS = [
    {
      icon: "👀",
      title: "Je découvre le son",
      consigne: `Voici le son ${son.phoneme}. Écoute bien !`,
      node: (
        <div className="text-center">
          <div className="text-7xl" aria-hidden>{son.emoji}</div>
          <button
            onClick={() => speak(soundText(newG), { rate: 0.6 })}
            className="mx-auto mt-2 inline-flex items-center gap-2 rounded-full bg-grass px-5 py-2 font-display text-lg font-semibold text-white shadow-soft"
          >
            🔊 Le son {son.phoneme}
          </button>
          <p className="mt-3 font-display text-2xl font-bold text-ink">{son.keyword}</p>
          {son.content.mnemonic && (
            <p className="mx-auto mt-2 max-w-[34ch] font-bold text-ink-soft">
              {son.content.mnemonic}
            </p>
          )}
          {son.content.geste && (
            <p className="mt-2 text-sm font-bold text-ink-soft">✋ {son.content.geste}</p>
          )}
        </div>
      ),
    },
    {
      icon: "👂",
      title: "J'écoute",
      consigne: `Dans quels mots entends-tu le son ${son.phoneme} ?`,
      node: (
        <ListenDiscrim
          phoneme={son.phoneme}
          motsAvec={son.content.ecoute?.motsAvec || []}
          motsSans={son.content.ecoute?.motsSans || []}
          onDone={() => go(2)}
        />
      ),
    },
    {
      icon: "🎹",
      title: "Je joue du piano",
      consigne: "Touche une consonne, puis une voyelle, et chante la syllabe !",
      node: (
        <Piano
          consonants={piano.cons}
          vowels={piano.vows}
          consonantEmojis={CONSONANT_EMOJI}
          cursive={settings.ecriture === "cursive"}
        />
      ),
    },
    {
      icon: "🎵",
      title: "Je lis des syllabes",
      consigne: "Touche chaque syllabe et répète à voix haute.",
      node: (
        <div>
          <div className="mb-3 flex justify-center">
            <AideToggle value={aide} onChange={setAide} />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {syllabes.map((s, i) => (
              <span key={i} className="rounded-xl2 border-2 border-[#EBD9BE] bg-white px-3 py-2 shadow-softs">
                <DecodableWord word={s} aide={aide} big />
              </span>
            ))}
            {syllabes.length === 0 && (
              <p className="text-center font-bold text-ink-soft">
                On s'entraîne au piano juste au-dessus 🎹
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      icon: "📖",
      title: "Je lis des mots",
      consigne: "Lis chaque mot. Touche-le pour t'aider.",
      node: (
        <div>
          <div className="mb-3 flex justify-center">
            <AideToggle value={aide} onChange={setAide} />
          </div>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-3">
            {mots.map((w, i) => (
              <DecodableWord key={i} word={w} aide={aide} big />
            ))}
            {mots.length === 0 && (
              <p className="text-center font-bold text-ink-soft">
                Bientôt des mots, quand tu connaîtras plus de sons 💛
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      icon: "💬",
      title: "Je lis des phrases",
      consigne: "Lis la phrase tout doucement, mot après mot.",
      node: (
        <div>
          <div className="mb-3 flex justify-center">
            <AideToggle value={aide} onChange={setAide} />
          </div>
          <div className="space-y-3">
            {phrases.map((p, i) => (
              <div key={i} className="rounded-xl2 border-2 border-[#F1E2CB] bg-white p-3 shadow-softs">
                <DecodableText text={p} aide={aide} />
              </div>
            ))}
            {phrases.length === 0 && (
              <p className="text-center font-bold text-ink-soft">
                Les phrases arrivent très vite ! ✨
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      icon: "🔑",
      title: "Mots outils du jour",
      consigne: "Ces petits mots, on les reconnaît d'un coup d'œil !",
      node: (
        <div className="flex flex-wrap justify-center gap-2">
          {motsOutils.map((m, i) => (
            <button
              key={i}
              onClick={() => speak(m, { rate: 0.75 })}
              className="min-h-tap rounded-xl2 bg-gradient-to-b from-[#F6CC66] to-[#EBAE2E] px-4 py-3 font-reading text-2xl font-bold text-ink shadow-soft active:scale-95"
            >
              {m}
            </button>
          ))}
        </div>
      ),
    },
    {
      icon: "✍️",
      title: "J'encode (dictée)",
      consigne: "Écoute le mot, puis écris-le avec les lettres.",
      node: <EncodeTiles items={dictee} onDone={() => go(8)} />,
    },
    {
      icon: "🖊️",
      title: "J'écris la lettre",
      consigne: "Suis le modèle avec ton doigt.",
      node: <LetterTrace grapheme={son.grapheme} defaultEcriture={settings.ecriture} />,
    },
    {
      icon: "📚",
      title: "Une histoire à lire",
      consigne: "On lit une petite histoire, juste pour le plaisir !",
      node:
        histoireLignes.length > 0 ? (
          <StoryReader
            title={son.content.histoire?.titre || "Mon histoire"}
            lines={histoireLignes}
            aide={aide}
            onFluence={(wpm) => setFluence(son.id, wpm)}
          />
        ) : (
          <p className="text-center font-bold text-ink-soft">
            Une belle histoire t'attend dès que tu connaîtras quelques sons de plus 📖
          </p>
        ),
    },
  ];

  const cur = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <>
      <div className="mb-3 flex items-center justify-between gap-2">
        <BackLink href="/parcours" label="Le parcours" />
        <div className="text-right">
          <div className="font-display text-lg font-semibold text-ink">{son.label}</div>
          <div className="text-xs font-bold text-ink-soft">Étape {step + 1} / 10</div>
        </div>
      </div>

      {/* Fil des étapes */}
      <div className="mb-4 flex flex-wrap justify-center gap-1.5" role="tablist" aria-label="Étapes de la leçon">
        {STEPS.map((s, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            role="tab"
            aria-selected={i === step}
            aria-label={`Étape ${i + 1} : ${s.title}`}
            className={`grid h-9 w-9 place-items-center rounded-xl text-base transition ${
              i === step
                ? "bg-ink text-white shadow-softs"
                : i < step
                ? "bg-grass/30 text-ink"
                : "bg-white text-ink-soft border border-[#F1E2CB]"
            }`}
          >
            {s.icon}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <Mascotte message={cur.consigne} />
      </div>

      <section
        className="rounded-xl3 border-2 border-[#F1E2CB] bg-cream-soft/40 p-4"
        aria-label={cur.title}
      >
        <h2 className="mb-3 text-center font-display text-xl font-semibold text-ink">
          <span aria-hidden>{cur.icon}</span> {cur.title}
        </h2>
        {cur.node}
      </section>

      {/* Navigation */}
      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          onClick={() => go(step - 1)}
          disabled={step === 0}
          className="min-h-tap rounded-full border-2 border-[#F1E2CB] bg-white px-5 py-2 font-display font-semibold text-ink-soft shadow-softs disabled:opacity-40"
        >
          ← Avant
        </button>
        {!isLast ? (
          <button
            onClick={() => go(step + 1)}
            className="min-h-tap rounded-full bg-grass px-6 py-2 font-display text-lg font-semibold text-white shadow-soft"
          >
            Suivant →
          </button>
        ) : (
          <button
            onClick={() => {
              finish();
              window.setTimeout(() => router.push("/parcours"), 1200);
            }}
            className="min-h-tap rounded-full bg-va px-6 py-2 font-display text-lg font-semibold text-white shadow-soft"
          >
            {isMastered(son.id) ? "Revoir ✓" : "J'ai réussi ! 🎉"}
          </button>
        )}
      </div>
    </>
  );
}
