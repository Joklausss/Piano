"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useProfiles } from "@/lib/store";
import Mascotte from "@/components/Mascotte";
import { Tile } from "@/components/ui";

const AVATARS = ["🦊", "🐱", "🐰", "🐻", "🦉", "🐼", "🦁", "🐸", "🐧", "🦄"];

function ProfilePicker() {
  const { ready, profiles, activeId, create, select, remove } = useProfiles();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);

  if (!ready) {
    return <div className="h-20" aria-hidden />;
  }

  const showForm = adding || profiles.length === 0;

  return (
    <div className="rounded-xl2 border-2 border-[#F1E2CB] bg-white p-3 shadow-softs">
      {!showForm && (
        <div className="flex flex-wrap items-center gap-2">
          {profiles.map((p) => (
            <button
              key={p.id}
              onClick={() => select(p.id)}
              className={`flex min-h-tap items-center gap-2 rounded-full border-2 px-3 py-1.5 font-display font-semibold ${
                p.id === activeId ? "border-grass bg-grass/10 text-ink" : "border-[#F1E2CB] text-ink-soft"
              }`}
            >
              <span className="text-xl" aria-hidden>{p.avatar}</span> {p.name}
              {p.id === activeId && <span aria-hidden>✓</span>}
            </button>
          ))}
          <button
            onClick={() => setAdding(true)}
            className="min-h-tap rounded-full border-2 border-dashed border-[#E0CBA8] px-3 py-1.5 font-bold text-ink-soft"
          >
            + Ajouter
          </button>
        </div>
      )}

      {showForm && (
        <div>
          <p className="mb-2 font-display font-semibold text-ink">Qui apprend à lire aujourd'hui ?</p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Prénom"
            aria-label="Prénom de l'enfant"
            className="mb-2 w-full rounded-xl2 border-2 border-[#F1E2CB] px-3 py-2 font-body text-base text-ink outline-none focus:border-sun"
          />
          <div className="mb-3 flex flex-wrap gap-1">
            {AVATARS.map((a) => (
              <button
                key={a}
                onClick={() => setAvatar(a)}
                aria-label={`Avatar ${a}`}
                aria-pressed={avatar === a}
                className={`grid h-10 w-10 place-items-center rounded-xl text-xl ${
                  avatar === a ? "bg-sun" : "bg-cream-soft"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                create(name, avatar);
                setAdding(false);
                setName("");
              }}
              className="min-h-tap rounded-full bg-grass px-5 py-2 font-display font-semibold text-white shadow-softs"
            >
              C'est parti !
            </button>
            {profiles.length > 0 && (
              <button
                onClick={() => setAdding(false)}
                className="min-h-tap rounded-full border-2 border-[#F1E2CB] px-4 py-2 font-bold text-ink-soft"
              >
                Annuler
              </button>
            )}
          </div>
          {profiles.length > 0 && (
            <div className="mt-3 border-t border-[#F1E2CB] pt-2">
              {profiles.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-1 text-sm">
                  <span>{p.avatar} {p.name}</span>
                  <button onClick={() => remove(p.id)} className="text-ink-soft underline">
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <div>
      <header className="mb-4 text-center">
        <div className="text-xs font-extrabold uppercase tracking-[0.14em] text-ink-soft">
          Apprendre à lire au CP
        </div>
        <h1 className="font-display text-[2rem] font-bold leading-tight text-ink">
          Mon Piano <span className="text-va">des mots</span>
        </h1>
        <motion.div
          initial={{ scale: 0.8, rotate: -8 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="my-1 text-5xl"
          aria-hidden
        >
          🎹
        </motion.div>
      </header>

      <div className="mb-4">
        <Mascotte
          message="Bonjour ! Moi c'est Mélo. On va chanter les sons et lire nos premiers mots ensemble !"
          speakText="Bonjour ! Moi c'est Mélo. On va chanter les sons et lire nos premiers mots ensemble."
        />
      </div>

      <div className="mb-5">
        <ProfilePicker />
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Tile href="/parcours" emoji="🗺️" title="Le parcours" sub="Mes leçons de sons" color="#F2785C" />
        <Tile href="/piano" emoji="🎹" title="Le piano" sub="Chanter les syllabes" color="#7BB36A" />
        <Tile href="/module-0" emoji="🧩" title="Avant de lire" sub="Réviser la maternelle" color="#F4C04E" />
        <Tile href="/mur-des-sons" emoji="🧱" title="Le mur des sons" sub="Toutes mes cartes" color="#6BA8E5" />
        <Tile href="/atelier" emoji="🔤" title="Atelier de syllabes" sub="Fabriquer des mots" color="#5FB6A8" />
        <Tile href="/dictee" emoji="✍️" title="La dictée" sub="Écrire les mots" color="#A98CD9" />
        <Tile href="/histoires" emoji="📚" title="Les histoires" sub="Lire pour le plaisir" color="#E58FB5" />
        <Tile href="/jeux" emoji="🎲" title="Jeux & défis" sub="Fluence et tri de sons" color="#F4B63C" />
      </div>

      <div className="mt-5 text-center">
        <a
          href="/adulte"
          className="inline-flex min-h-tap items-center gap-2 rounded-full border-2 border-[#F1E2CB] bg-white px-5 py-2 text-sm font-extrabold text-ink-soft shadow-softs"
        >
          👩‍🏫 Espace adulte
        </a>
      </div>

      <p className="mx-auto mt-6 max-w-[40ch] text-center text-[0.7rem] font-semibold text-ink-soft">
        Outil 100 % original, non affilié à un éditeur. Données enregistrées
        seulement sur cet appareil.
      </p>
    </div>
  );
}
