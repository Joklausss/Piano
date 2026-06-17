"use client";

import { useAudio } from "@/hooks/useAudio";

/** Bouton 🔊/🔇 global, fixé en haut à droite. */
export default function SoundButton() {
  const { enabled, toggle, speak } = useAudio();
  return (
    <button
      onClick={() => {
        const was = enabled;
        toggle();
        if (!was) speak("On y va", { rate: 0.9 });
      }}
      aria-label={enabled ? "Couper le son" : "Activer le son"}
      title="Son"
      className="fixed right-3 top-3 z-50 grid h-12 w-12 place-items-center rounded-full border-2 border-[#F1E2CB] bg-white text-xl text-ink shadow-softs print:hidden"
    >
      {enabled ? "🔊" : "🔇"}
    </button>
  );
}
