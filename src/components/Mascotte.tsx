"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAudio } from "@/hooks/useAudio";

/**
 * Mélo, le petit hibou musicien — mascotte originale qui guide et encourage,
 * et lit les consignes à voix haute (pour les enfants non-lecteurs).
 */
export default function Mascotte({
  message,
  speakText,
  size = "md",
  autoSpeak = true,
}: {
  message: React.ReactNode;
  /** Texte réellement prononcé (par défaut = message s'il est une chaîne). */
  speakText?: string;
  size?: "sm" | "md";
  autoSpeak?: boolean;
}) {
  const { speak } = useAudio();
  const said = useRef("");
  const toSay = speakText ?? (typeof message === "string" ? message : "");

  useEffect(() => {
    if (autoSpeak && toSay && said.current !== toSay) {
      said.current = toSay;
      const t = window.setTimeout(() => speak(toSay, { rate: 0.85 }), 350);
      return () => window.clearTimeout(t);
    }
  }, [toSay, autoSpeak, speak]);

  const face = size === "sm" ? "text-3xl" : "text-5xl";

  return (
    <div className="flex items-start gap-3">
      <motion.button
        type="button"
        onClick={() => toSay && speak(toSay, { rate: 0.85 })}
        aria-label="Réécouter la consigne"
        initial={{ rotate: -4 }}
        animate={{ rotate: [-4, 4, -4] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="relative grid h-16 w-16 flex-none place-items-center rounded-full bg-gradient-to-b from-[#FFE3A0] to-[#F4C04E] shadow-softs"
      >
        <span className={face} aria-hidden>
          🦉
        </span>
        <span className="absolute -right-1 -top-1 text-lg" aria-hidden>
          🎵
        </span>
      </motion.button>
      <div className="relative max-w-[42ch] rounded-xl2 border-2 border-[#F1E2CB] bg-white px-4 py-3 text-[0.98rem] font-bold text-ink shadow-softs">
        <span
          className="absolute -left-2 top-5 h-3 w-3 rotate-45 border-b-2 border-l-2 border-[#F1E2CB] bg-white"
          aria-hidden
        />
        {message}
      </div>
    </div>
  );
}
