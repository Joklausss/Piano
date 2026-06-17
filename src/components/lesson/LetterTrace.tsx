"use client";

import { useEffect, useRef, useState } from "react";
import type { Ecriture } from "@/lib/store";

/** Étape 9 — j'écris la lettre : modèle (script / cursive) + zone d'entraînement au doigt. */
export default function LetterTrace({
  grapheme,
  defaultEcriture = "script",
}: {
  grapheme: string;
  defaultEcriture?: Ecriture;
}) {
  const [ecriture, setEcriture] = useState<Ecriture>(defaultEcriture);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ratio = window.devicePixelRatio || 1;
    const w = c.clientWidth;
    const h = c.clientHeight;
    c.width = w * ratio;
    c.height = h * ratio;
    const ctx = c.getContext("2d");
    if (ctx) {
      ctx.scale(ratio, ratio);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 10;
      ctx.strokeStyle = "#7BB36A";
    }
  }, []);

  function pos(e: React.PointerEvent) {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  function down(e: React.PointerEvent) {
    drawing.current = true;
    const ctx = canvasRef.current!.getContext("2d")!;
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }
  function move(e: React.PointerEvent) {
    if (!drawing.current) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const p = pos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  }
  function up() {
    drawing.current = false;
  }
  function clear() {
    const c = canvasRef.current!;
    c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
  }

  const cursiveStyle =
    ecriture === "cursive"
      ? "italic [font-family:'Segoe_Script','Comic_Sans_MS',cursive]"
      : "font-reading";

  return (
    <div className="text-center">
      <div className="mb-3 inline-flex gap-1 rounded-full border-2 border-[#F1E2CB] bg-white p-1 shadow-softs">
        {(["script", "cursive"] as Ecriture[]).map((e) => (
          <button
            key={e}
            onClick={() => setEcriture(e)}
            aria-pressed={ecriture === e}
            className={`min-h-tap rounded-full px-4 py-1.5 text-sm font-extrabold ${
              ecriture === e ? "bg-sun text-ink" : "text-ink-soft"
            }`}
          >
            {e === "script" ? "Script a" : "Cursive 𝑎"}
          </button>
        ))}
      </div>

      <div className="relative mx-auto h-[210px] w-full max-w-[320px] overflow-hidden rounded-xl2 border-2 border-[#F1E2CB] bg-white shadow-softs">
        {/* lignes du cahier */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[#EAD9BB]" />
        {/* modèle pâle */}
        <span
          className={`pointer-events-none absolute inset-0 grid place-items-center text-[8rem] font-bold leading-none text-[#EFE4CF] ${cursiveStyle}`}
          aria-hidden
        >
          {grapheme}
        </span>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full touch-none"
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerLeave={up}
        />
      </div>
      <p className="mt-2 text-sm font-bold text-ink-soft">
        Suis le modèle avec ton doigt ✍️
      </p>
      <button
        onClick={clear}
        className="mt-2 min-h-tap rounded-full border-2 border-[#F1E2CB] bg-white px-4 py-2 text-sm font-extrabold text-ink-soft shadow-softs"
      >
        🧽 Effacer
      </button>
    </div>
  );
}
