"use client";

import { useState } from "react";
import { SONS } from "@/lib/progression";

const CONS = ["l", "m", "r", "s", "f", "n", "v", "j", "ch", "p", "t", "c", "b", "d", "g", "z"];
const VOW = ["a", "e", "i", "o", "u"];
const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

type Fiche = "syllabaire" | "cartes" | "modeles";

function Syllabaire() {
  return (
    <div>
      <h2 className="mb-3 text-center font-display text-2xl font-bold text-ink">Mon syllabaire</h2>
      <table className="w-full border-collapse text-center font-reading">
        <thead>
          <tr>
            <th className="border border-[#E0CBA8] p-1"></th>
            {VOW.map((v) => (
              <th key={v} className="border border-[#E0CBA8] p-1 text-xl text-va">{v}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CONS.map((c) => (
            <tr key={c}>
              <th className="border border-[#E0CBA8] p-1 text-xl text-grass-dark">{c}</th>
              {VOW.map((v) => (
                <td key={v} className="border border-[#E0CBA8] p-1 text-lg font-bold text-ink">
                  {c + v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Cartes() {
  return (
    <div>
      <h2 className="mb-3 text-center font-display text-2xl font-bold text-ink">Les cartes des sons</h2>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {SONS.map((s) => (
          <div key={s.id} className="rounded-xl border border-[#E0CBA8] p-2 text-center">
            <div className="text-2xl">{s.emoji}</div>
            <div className="font-reading text-2xl font-bold text-ink">{s.grapheme}</div>
            <div className="text-[0.6rem] font-bold text-ink-soft">{s.keyword}</div>
            <div className="mt-1 flex justify-center gap-1 text-sm text-ink-soft">
              <span className="font-reading">{s.grapheme.toUpperCase()}</span>
              <span className="font-reading">{s.grapheme}</span>
              <span className="italic [font-family:'Segoe_Script','Comic_Sans_MS',cursive]">{s.grapheme}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Modeles() {
  return (
    <div>
      <h2 className="mb-3 text-center font-display text-2xl font-bold text-ink">Modèles d'écriture</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {ALPHABET.map((l) => (
          <div key={l} className="rounded-xl border border-[#E0CBA8] p-2 text-center">
            <div className="font-reading text-3xl font-bold text-[#cbb896]">{l}</div>
            <div className="text-3xl italic text-[#cbb896] [font-family:'Segoe_Script','Comic_Sans_MS',cursive]">
              {l}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PrintFiches() {
  const [fiche, setFiche] = useState<Fiche>("syllabaire");
  return (
    <div>
      <div className="no-print mb-4 flex flex-wrap items-center justify-center gap-2 print:hidden">
        {([
          ["syllabaire", "Syllabaire"],
          ["cartes", "Cartes des sons"],
          ["modeles", "Modèles d'écriture"],
        ] as [Fiche, string][]).map(([f, label]) => (
          <button
            key={f}
            onClick={() => setFiche(f)}
            aria-pressed={fiche === f}
            className={`min-h-tap rounded-full px-4 py-2 font-display font-semibold shadow-softs ${
              fiche === f ? "bg-ink text-white" : "border-2 border-[#F1E2CB] bg-white text-ink-soft"
            }`}
          >
            {label}
          </button>
        ))}
        <button
          onClick={() => window.print()}
          className="min-h-tap rounded-full bg-grass px-5 py-2 font-display font-semibold text-white shadow-softs"
        >
          🖨️ Imprimer
        </button>
      </div>

      <div className="rounded-xl2 border-2 border-[#F1E2CB] bg-white p-4 shadow-softs print:border-0 print:shadow-none">
        {fiche === "syllabaire" && <Syllabaire />}
        {fiche === "cartes" && <Cartes />}
        {fiche === "modeles" && <Modeles />}
      </div>
    </div>
  );
}
