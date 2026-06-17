"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  useProfiles,
  useSettings,
  getProgress,
  type AideLevel,
  type Ecriture,
} from "@/lib/store";
import { SONS } from "@/lib/progression";

function Lock({ onUnlock }: { onUnlock: () => void }) {
  const [q, setQ] = useState<{ a: number; b: number } | null>(null);
  const [val, setVal] = useState("");
  const [err, setErr] = useState(false);

  useEffect(() => {
    setQ({ a: 3 + Math.floor(Math.random() * 6), b: 2 + Math.floor(Math.random() * 6) });
  }, []);

  if (!q) return <div className="h-40" aria-hidden />;

  return (
    <div className="mx-auto max-w-sm rounded-xl3 border-2 border-[#F1E2CB] bg-white p-6 text-center shadow-softs">
      <div className="text-4xl" aria-hidden>🔒</div>
      <h2 className="mt-2 font-display text-xl font-semibold text-ink">Espace réservé aux adultes</h2>
      <p className="mt-1 mb-4 text-sm font-bold text-ink-soft">
        Pour entrer, réponds à ce petit calcul : combien font{" "}
        <b className="text-ink">{q.a} + {q.b}</b> ?
      </p>
      <input
        inputMode="numeric"
        value={val}
        onChange={(e) => {
          setVal(e.target.value);
          setErr(false);
        }}
        aria-label="Réponse au calcul"
        className="w-28 rounded-xl2 border-2 border-[#F1E2CB] px-3 py-2 text-center text-lg font-bold text-ink outline-none focus:border-sun"
      />
      <div className="mt-3">
        <button
          onClick={() => {
            if (parseInt(val, 10) === q.a + q.b) onUnlock();
            else setErr(true);
          }}
          className="min-h-tap rounded-full bg-ink px-6 py-2 font-display font-semibold text-white shadow-softs"
        >
          Entrer
        </button>
      </div>
      {err && <p className="mt-2 text-sm font-bold text-va">Pas tout à fait, réessaie 🙂</p>}
    </div>
  );
}

function ProgressCard({ id, name, avatar }: { id: string; name: string; avatar: string }) {
  const p = getProgress(id);
  const mastered = p.masteredSons.length;
  const period = (() => {
    const last = SONS.filter((s) => p.masteredSons.includes(s.id)).at(-1);
    return last ? last.period : 0;
  })();
  const bestFluence = Math.max(0, ...Object.values(p.fluence));
  return (
    <div className="rounded-xl2 border-2 border-[#F1E2CB] bg-white p-4 shadow-softs">
      <div className="flex items-center gap-2">
        <span className="text-2xl" aria-hidden>{avatar}</span>
        <span className="font-display text-lg font-semibold text-ink">{name}</span>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="font-display text-2xl font-bold text-ink">{mastered}</div>
          <div className="text-xs font-bold text-ink-soft">sons / {SONS.length}</div>
        </div>
        <div>
          <div className="font-display text-2xl font-bold text-ink">P{period || "—"}</div>
          <div className="text-xs font-bold text-ink-soft">période</div>
        </div>
        <div>
          <div className="font-display text-2xl font-bold text-ink">{bestFluence || "—"}</div>
          <div className="text-xs font-bold text-ink-soft">mots/min</div>
        </div>
      </div>
      {p.badges.length > 0 && (
        <div className="mt-2 text-sm font-bold text-grass-dark">🏅 {p.badges.length} récompenses</div>
      )}
    </div>
  );
}

export default function EspaceAdulte() {
  const [unlocked, setUnlocked] = useState(false);
  const { ready, profiles } = useProfiles();
  const { settings, set } = useSettings();

  if (!unlocked) return <Lock onUnlock={() => setUnlocked(true)} />;

  return (
    <div className="space-y-6">
      {/* Progrès */}
      <section>
        <h2 className="mb-2 font-display text-lg font-semibold text-ink">📊 Suivi des enfants</h2>
        {!ready ? null : profiles.length === 0 ? (
          <p className="font-bold text-ink-soft">Aucun profil pour l'instant.</p>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {profiles.map((p) => (
              <ProgressCard key={p.id} id={p.id} name={p.name} avatar={p.avatar} />
            ))}
          </div>
        )}
      </section>

      {/* Réglages */}
      <section>
        <h2 className="mb-2 font-display text-lg font-semibold text-ink">⚙️ Réglages</h2>
        <div className="space-y-3 rounded-xl2 border-2 border-[#F1E2CB] bg-white p-4 shadow-softs">
          <div>
            <div className="mb-1 text-sm font-extrabold text-ink">Niveau d'aide à la lecture</div>
            <div className="flex gap-1">
              {(["colore", "segmente", "nu"] as AideLevel[]).map((a) => (
                <button
                  key={a}
                  onClick={() => set({ aide: a })}
                  className={`min-h-tap flex-1 rounded-xl px-2 py-2 text-sm font-bold ${
                    settings.aide === a ? "bg-sun text-ink" : "bg-cream-soft text-ink-soft"
                  }`}
                >
                  {a === "colore" ? "Couleurs" : a === "segmente" ? "Coupé" : "Sans aide"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-1 text-sm font-extrabold text-ink">Écriture montrée</div>
            <div className="flex gap-1">
              {(["script", "cursive"] as Ecriture[]).map((e) => (
                <button
                  key={e}
                  onClick={() => set({ ecriture: e })}
                  className={`min-h-tap flex-1 rounded-xl px-2 py-2 text-sm font-bold ${
                    settings.ecriture === e ? "bg-sun text-ink" : "bg-cream-soft text-ink-soft"
                  }`}
                >
                  {e === "script" ? "Script (a)" : "Cursive (𝑎)"}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center justify-between gap-3">
            <span className="text-sm font-extrabold text-ink">
              Navigation libre
              <span className="block text-xs font-bold text-ink-soft">Déverrouiller toutes les leçons</span>
            </span>
            <input
              type="checkbox"
              checked={settings.freeNavigation}
              onChange={(e) => set({ freeNavigation: e.target.checked })}
              className="h-6 w-6 accent-grass"
            />
          </label>
        </div>
      </section>

      {/* Fiches à imprimer */}
      <section>
        <h2 className="mb-2 font-display text-lg font-semibold text-ink">🖨️ Fiches à imprimer</h2>
        <Link
          href="/adulte/fiches"
          className="flex min-h-tap items-center justify-between rounded-xl2 border-2 border-[#F1E2CB] bg-white p-4 font-display font-semibold text-ink shadow-softs"
        >
          Syllabaire · cartes des sons · modèles d'écriture <span aria-hidden>→</span>
        </Link>
      </section>

      {/* Guide */}
      <section>
        <h2 className="mb-2 font-display text-lg font-semibold text-ink">💡 Comment accompagner</h2>
        <div className="space-y-2 rounded-xl2 border-2 border-[#F1E2CB] bg-white p-4 text-sm font-semibold text-ink-soft shadow-softs">
          <p>• Des séances <b className="text-ink">courtes</b> (10–15 min) valent mieux que de longues séances.</p>
          <p>• Asseyez-vous à côté de l'enfant, touchez les touches <b className="text-ink">ensemble</b>, répétez à voix haute.</p>
          <p>• On déchiffre, on ne devine pas : aidez à <b className="text-ink">chanter</b> les syllabes, pas à reconnaître le mot.</p>
          <p>• L'erreur fait partie de l'apprentissage : on réessaie sans pénalité.</p>
          <p>• Données enregistrées uniquement sur cet appareil, sans publicité ni suivi.</p>
        </div>
      </section>

      <p className="text-center text-[0.7rem] font-semibold text-ink-soft">
        « Mon Piano des mots » est un outil autonome et 100 % original, non affilié à un éditeur.
      </p>
    </div>
  );
}
