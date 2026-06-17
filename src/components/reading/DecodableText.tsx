"use client";

import { Fragment } from "react";
import { syllabify, isVowelGrapheme } from "@/lib/phonics";
import { vowelColor } from "@/lib/colors";
import { speak } from "@/lib/audio";
import type { AideLevel } from "@/lib/store";

const SYL_TINTS = ["#FFF1DA", "#E9F3FF"]; // alternance douce des syllabes

/** Un mot, éventuellement coloré/segmenté par syllabe, tapable pour l'entendre. */
export function DecodableWord({
  word,
  aide = "colore",
  big = false,
  onTap,
}: {
  word: string;
  aide?: AideLevel;
  big?: boolean;
  onTap?: (word: string) => void;
}) {
  // Sépare ponctuation finale du mot lu.
  const m = word.match(/^([^a-zàâäéèêëîïôöùûüçœæ]*)([a-zàâäéèêëîïôöùûüçœæ'-]*)([^a-zàâäéèêëîïôöùûüçœæ]*)$/i);
  const pre = m?.[1] ?? "";
  const core = m?.[2] ?? word;
  const post = m?.[3] ?? "";
  const handle = () => {
    speak(core || word, { rate: 0.72 });
    onTap?.(core || word);
  };

  if (!core) return <span>{word} </span>;

  const sizeCls = big ? "text-3xl" : "text-xl";

  if (aide === "nu") {
    return (
      <button
        onClick={handle}
        className={`font-reading font-bold text-ink ${sizeCls} rounded-lg px-0.5 transition-colors hover:bg-cream-soft`}
      >
        {pre}
        {core}
        {post}
      </button>
    );
  }

  const sylls = syllabify(core);
  return (
    <button
      onClick={handle}
      className={`font-reading font-bold ${sizeCls} rounded-lg px-0.5`}
      aria-label={core}
    >
      {pre}
      {sylls.map((syl, si) => (
        <span
          key={si}
          style={
            aide === "colore"
              ? { background: SYL_TINTS[si % 2], borderRadius: 6, padding: "0 1px" }
              : undefined
          }
        >
          {syl.map((g, gi) => (
            <span
              key={gi}
              style={{ color: isVowelGrapheme(g) ? vowelColor(g) : "#4A3B63" }}
            >
              {g}
            </span>
          ))}
          {aide === "segmente" && si < sylls.length - 1 ? (
            <span className="text-ink-soft">·</span>
          ) : null}
        </span>
      ))}
      {post}
    </button>
  );
}

/** Une phrase ou un texte : chaque mot est tapable. */
export function DecodableText({
  text,
  aide = "colore",
  big = false,
  className = "",
}: {
  text: string;
  aide?: AideLevel;
  big?: boolean;
  className?: string;
}) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <span className={`leading-relaxed ${className}`}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <DecodableWord word={w} aide={aide} big={big} />{" "}
        </Fragment>
      ))}
    </span>
  );
}
