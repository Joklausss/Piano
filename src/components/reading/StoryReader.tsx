"use client";

import { useMemo, useRef, useState } from "react";
import { isAudioEnabled } from "@/lib/audio";
import { DecodableWord } from "./DecodableText";
import type { AideLevel } from "@/lib/store";

interface Token {
  line: number;
  word: number;
  text: string;
}

/**
 * Lecteur d'histoires : surlignage mot par mot synchronisé à la voix,
 * vitesse réglable, + mode fluence (l'enfant lit seul, on mesure les mots/min).
 */
export default function StoryReader({
  title,
  lines,
  aide = "colore",
  onFluence,
}: {
  title: string;
  lines: string[];
  aide?: AideLevel;
  onFluence?: (wpm: number) => void;
}) {
  const [rate, setRate] = useState(0.8);
  const [active, setActive] = useState<number>(-1);
  const [playing, setPlaying] = useState(false);
  const stopRef = useRef(false);

  // Fluence
  const [timing, setTiming] = useState(false);
  const startRef = useRef(0);
  const [lastWpm, setLastWpm] = useState<number | null>(null);

  const tokens = useMemo<Token[]>(() => {
    const t: Token[] = [];
    lines.forEach((line, li) => {
      line.split(/\s+/).filter(Boolean).forEach((w, wi) => {
        t.push({ line: li, word: wi, text: w });
      });
    });
    return t;
  }, [lines]);

  const wordCount = tokens.length;

  function stop() {
    stopRef.current = true;
    setPlaying(false);
    setActive(-1);
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }

  function play() {
    if (!isAudioEnabled() || !("speechSynthesis" in window)) {
      // Repli visuel : surlignage rythmé sans voix.
      visualOnly();
      return;
    }
    stopRef.current = false;
    setPlaying(true);
    const speakAt = (i: number) => {
      if (stopRef.current || i >= tokens.length) {
        setPlaying(false);
        setActive(-1);
        return;
      }
      setActive(i);
      const core = tokens[i].text.replace(/[^a-zàâäéèêëîïôöùûüçœæ'-]/gi, "");
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(core || tokens[i].text);
        u.lang = "fr-FR";
        u.rate = rate;
        u.pitch = 1.08;
        u.onend = () => speakAt(i + 1);
        u.onerror = () => speakAt(i + 1);
        window.speechSynthesis.speak(u);
      } catch {
        speakAt(i + 1);
      }
    };
    speakAt(0);
  }

  function visualOnly() {
    stopRef.current = false;
    setPlaying(true);
    let i = 0;
    const step = () => {
      if (stopRef.current || i >= tokens.length) {
        setPlaying(false);
        setActive(-1);
        return;
      }
      setActive(i);
      i += 1;
      window.setTimeout(step, 600 / rate);
    };
    step();
  }

  function toggleFluence() {
    if (!timing) {
      setTiming(true);
      setLastWpm(null);
      startRef.current = Date.now();
    } else {
      const secs = Math.max(1, (Date.now() - startRef.current) / 1000);
      const wpm = Math.round((wordCount / secs) * 60);
      setLastWpm(wpm);
      setTiming(false);
      onFluence?.(wpm);
    }
  }

  let idx = -1;
  return (
    <div>
      <h3 className="mb-2 text-center font-display text-xl font-semibold text-ink">
        {title || "Mon histoire"}
      </h3>

      <div className="rounded-xl2 border-2 border-[#F1E2CB] bg-white p-4 shadow-softs">
        {lines.map((line, li) => (
          <p key={li} className="my-2 leading-relaxed">
            {line.split(/\s+/).filter(Boolean).map((w, wi) => {
              idx += 1;
              const isActive = idx === active;
              return (
                <span
                  key={wi}
                  className={`inline-block rounded-lg ${isActive ? "bg-sun/70" : ""}`}
                >
                  <DecodableWord word={w} aide={aide} />{" "}
                </span>
              );
            })}
          </p>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        {!playing ? (
          <button
            onClick={play}
            className="min-h-tap rounded-full bg-vo px-4 py-2 font-display font-semibold text-white shadow-softs"
          >
            ▶︎ Écouter l'histoire
          </button>
        ) : (
          <button
            onClick={stop}
            className="min-h-tap rounded-full bg-va px-4 py-2 font-display font-semibold text-white shadow-softs"
          >
            ⏸ Arrêter
          </button>
        )}
        <label className="flex items-center gap-2 text-sm font-bold text-ink-soft">
          🐢
          <input
            type="range"
            min={0.5}
            max={1.1}
            step={0.1}
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            aria-label="Vitesse de lecture"
          />
          🐇
        </label>
      </div>

      <div className="mt-3 flex flex-col items-center gap-1">
        <button
          onClick={toggleFluence}
          className={`min-h-tap rounded-full px-4 py-2 font-display font-semibold text-white shadow-softs ${
            timing ? "bg-va" : "bg-grass"
          }`}
        >
          {timing ? "✋ J'ai fini de lire" : "⏱️ Je lis tout seul"}
        </button>
        {lastWpm !== null && (
          <p className="text-sm font-extrabold text-ink">
            Bravo ! Tu as lu ~{lastWpm} mots par minute 🎵
          </p>
        )}
        {timing && (
          <p className="text-xs font-bold text-ink-soft">Lis l'histoire à voix haute…</p>
        )}
      </div>
    </div>
  );
}
