"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { speak, soundText } from "@/lib/audio";
import { syllableParts } from "@/lib/phonics";
import { vowelColor } from "@/lib/colors";

interface PianoProps {
  /** Consonnes = touches colorées (vertes). */
  consonants: string[];
  /** Voyelles = touches foncées. */
  vowels?: string[];
  /** Emoji indice par consonne (mot référent). */
  consonantEmojis?: Record<string, string>;
  /** Afficher l'écriture cursive sur les touches. */
  cursive?: boolean;
  /** Appelé quand une syllabe est « chantée ». */
  onSyllable?: (syllable: string) => void;
}

/** Syllabe affichée à l'écran, colorée consonne/voyelle. */
function ColoredSyllable({ text }: { text: string }) {
  if (!text || text === "·") return <span>·</span>;
  const parts = syllableParts(text);
  return (
    <>
      {parts.map((p, i) => (
        <span
          key={i}
          style={{ color: p.kind === "voy" ? vowelColor(p.g) : "#5E9650" }}
        >
          {p.g}
        </span>
      ))}
    </>
  );
}

export default function Piano({
  consonants,
  vowels = ["a", "e", "i", "o", "u", "y"],
  consonantEmojis = {},
  cursive = false,
  onSyllable,
}: PianoProps) {
  const [held, setHeld] = useState<string | null>(
    consonants.length === 1 ? null : null,
  );
  const [syllable, setSyllable] = useState<string>("·");
  const [hint, setHint] = useState<string>("Touche une touche verte 🎵");
  const [showCursive, setShowCursive] = useState<boolean>(cursive);
  const [glide, setGlide] = useState<{ from: number; to: number; y: number } | null>(
    null,
  );

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const keyRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  function keyCenter(id: string) {
    const wrap = wrapRef.current;
    const el = keyRefs.current[id];
    if (!wrap || !el) return null;
    const w = wrap.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return { x: r.left - w.left + r.width / 2, y: r.top - w.top + r.height / 2 };
  }

  function toggleConsonant(c: string) {
    const next = held === c ? null : c;
    setHeld(next);
    if (next) {
      setSyllable(next + "·");
      setHint("Maintenant, touche une voyelle foncée 🎹");
    } else {
      setSyllable("·");
      setHint("Touche une touche verte 🎵");
    }
  }

  function pressVowel(v: string) {
    if (held) {
      const syl = held + v;
      setSyllable(syl);
      setHint(`Bravo ! Tu as chanté « ${syl} » 👏`);
      speak(held === v ? syl : soundText(held).replace(/e$/, "") + v, { rate: 0.7 });
      onSyllable?.(syl);
      // Animation du doigt qui glisse de la consonne vers la voyelle.
      const a = keyCenter("c-" + held);
      const b = keyCenter("v-" + v);
      if (a && b) setGlide({ from: a.x, to: b.x, y: Math.min(a.y, b.y) - 26 });
      window.setTimeout(() => setGlide(null), 650);
    } else {
      setSyllable(v);
      setHint("Touche d'abord une touche verte 🎵");
      speak(soundText(v), { rate: 0.7 });
    }
  }

  return (
    <div className="select-none">
      {/* Écran */}
      <div className="rounded-xl2 border-[3px] border-[#F1E2CB] bg-white p-4 text-center shadow-softs">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={syllable}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={`font-reading font-bold leading-none text-ink ${
              showCursive ? "italic [font-family:'Segoe_Script','Comic_Sans_MS',cursive]" : ""
            }`}
            style={{ fontSize: "3.4rem", minHeight: "1.05em" }}
          >
            <ColoredSyllable text={syllable} />
          </motion.div>
        </AnimatePresence>
        <div className="mt-1.5 min-h-[1.3em] text-sm font-bold text-ink-soft" aria-live="polite">
          {hint}
        </div>
      </div>

      {/* Clavier */}
      <div
        ref={wrapRef}
        className="relative mt-3 flex justify-center gap-1.5 overflow-x-auto rounded-xl2 p-3"
        style={{
          background: "linear-gradient(180deg,#5E4F77,#4A3B63)",
          boxShadow: "inset 0 3px 0 rgba(255,255,255,.12), 0 8px 22px rgba(74,59,99,.14)",
        }}
        role="group"
        aria-label="Piano des sons"
      >
        {/* Doigt qui glisse */}
        <AnimatePresence>
          {glide && (
            <motion.div
              className="pointer-events-none absolute z-10 text-2xl"
              initial={{ left: glide.from, top: glide.y, opacity: 0, scale: 0.6 }}
              animate={{ left: glide.to, top: glide.y, opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              style={{ transform: "translateX(-50%)" }}
              aria-hidden
            >
              👆
            </motion.div>
          )}
        </AnimatePresence>

        {/* Touches consonnes (vertes) */}
        {consonants.map((c) => (
          <button
            key={"c-" + c}
            ref={(el) => {
              keyRefs.current["c-" + c] = el;
            }}
            onClick={() => toggleConsonant(c)}
            aria-pressed={held === c}
            aria-label={`consonne ${c}`}
            className="relative flex min-h-tap flex-none flex-col items-center justify-end rounded-b-xl2 rounded-t-lg pb-3 font-reading text-[1.6rem] font-bold text-white transition-transform active:translate-y-1"
            style={{
              width: 52,
              height: 120,
              background:
                held === c
                  ? "linear-gradient(180deg,#FFD36B,#F4B63C)"
                  : "linear-gradient(180deg,#8CC079,#7BB36A)",
              color: held === c ? "#3B2F52" : "#fff",
              boxShadow:
                held === c
                  ? "0 1px 0 rgba(0,0,0,.32), 0 0 0 3px #FFE3A0"
                  : "0 5px 0 rgba(0,0,0,.32)",
            }}
          >
            {consonantEmojis[c] && (
              <span className="absolute top-2 text-base" aria-hidden>
                {consonantEmojis[c]}
              </span>
            )}
            <span className={showCursive ? "[font-family:'Segoe_Script','Comic_Sans_MS',cursive] italic" : ""}>
              {c}
            </span>
          </button>
        ))}

        {/* Touches voyelles (foncées) */}
        {vowels.map((v) => (
          <button
            key={"v-" + v}
            ref={(el) => {
              keyRefs.current["v-" + v] = el;
            }}
            onClick={() => pressVowel(v)}
            aria-label={`voyelle ${v}`}
            className="relative flex min-h-tap flex-none flex-col items-center justify-end rounded-b-xl2 rounded-t-lg pb-3 font-reading text-[1.6rem] font-bold text-white transition-transform active:translate-y-1"
            style={{
              width: 44,
              height: 120,
              background: "linear-gradient(180deg,#564775,#3B2F52)",
              boxShadow: held ? "0 5px 0 rgba(0,0,0,.32), 0 0 0 3px rgba(255,255,255,.45)" : "0 5px 0 rgba(0,0,0,.32)",
            }}
          >
            <span
              style={{ color: vowelColor(v) }}
              className={showCursive ? "[font-family:'Segoe_Script','Comic_Sans_MS',cursive] italic" : ""}
            >
              {v}
            </span>
          </button>
        ))}
      </div>

      {/* Verso : script / cursive */}
      <div className="mt-2 flex justify-center">
        <button
          onClick={() => setShowCursive((s) => !s)}
          className="rounded-full border-2 border-[#F1E2CB] bg-white px-4 py-2 text-sm font-bold text-ink-soft shadow-softs min-h-tap"
        >
          {showCursive ? "✏️ Voir en script (a)" : "✒️ Voir en cursive (𝑎)"}
        </button>
      </div>
    </div>
  );
}
