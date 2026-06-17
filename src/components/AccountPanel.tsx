"use client";

import { useState } from "react";
import { useAuth } from "@/lib/cloud";

function frError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("invalid login")) return "Email ou mot de passe incorrect.";
  if (m.includes("already registered") || m.includes("already been registered"))
    return "Un compte existe déjà avec cet email.";
  if (m.includes("password should be") || m.includes("at least 6"))
    return "Le mot de passe doit faire au moins 6 caractères.";
  if (m.includes("unable to validate email") || m.includes("invalid email"))
    return "Cet email n'est pas valide.";
  if (m.includes("email not confirmed"))
    return "Confirme d'abord ton email (vérifie ta boîte mail).";
  return msg;
}

export default function AccountPanel() {
  const { configured, ready, user, signIn, signUp, signOut } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  if (!configured) {
    return (
      <div className="rounded-xl2 border-2 border-dashed border-[#E0CBA8] bg-cream-soft p-4 text-sm font-semibold text-ink-soft">
        ☁️ La synchronisation entre appareils n'est pas encore activée. Pour
        permettre la connexion par email, configure Supabase (voir{" "}
        <code className="rounded bg-white px-1">SETUP_SUPABASE.md</code> dans le projet).
      </div>
    );
  }

  if (!ready) return <div className="h-24" aria-hidden />;

  if (user) {
    return (
      <div className="rounded-xl2 border-2 border-grass bg-grass/10 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-display font-semibold text-ink">☁️ Progression synchronisée</div>
            <div className="text-xs font-bold text-ink-soft">{user.email}</div>
          </div>
          <button
            onClick={() => signOut()}
            className="min-h-tap rounded-full border-2 border-[#F1E2CB] bg-white px-4 py-2 text-sm font-extrabold text-ink-soft shadow-softs"
          >
            Se déconnecter
          </button>
        </div>
        <p className="mt-2 text-xs font-semibold text-ink-soft">
          La progression de tes enfants est enregistrée sur ce compte : connecte-toi sur
          n'importe quel appareil pour la retrouver.
        </p>
      </div>
    );
  }

  async function submit() {
    if (!email.includes("@")) {
      setMsg({ ok: false, text: "Entre un email valide." });
      return;
    }
    if (password.length < 6) {
      setMsg({ ok: false, text: "Le mot de passe doit faire au moins 6 caractères." });
      return;
    }
    setBusy(true);
    setMsg(null);
    const res = mode === "signin" ? await signIn(email.trim(), password) : await signUp(email.trim(), password);
    setBusy(false);
    if (res.error) {
      setMsg({ ok: false, text: frError(res.error.message) });
      return;
    }
    if (mode === "signup" && res.needsConfirmation) {
      setMsg({ ok: true, text: "Compte créé ! Vérifie ta boîte mail pour confirmer, puis connecte-toi." });
      setMode("signin");
      setPassword("");
    }
    // succès : l'état « connecté » s'affiche automatiquement.
  }

  return (
    <div className="rounded-xl2 border-2 border-[#F1E2CB] bg-white p-4 shadow-softs">
      <div className="mb-3 flex items-center gap-1">
        {(["signin", "signup"] as const).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setMsg(null);
            }}
            aria-pressed={mode === m}
            className={`min-h-tap flex-1 rounded-xl px-3 py-2 text-sm font-extrabold ${
              mode === m ? "bg-sun text-ink" : "bg-cream-soft text-ink-soft"
            }`}
          >
            {m === "signin" ? "Se connecter" : "Créer un compte"}
          </button>
        ))}
      </div>

      <p className="mb-2 text-xs font-semibold text-ink-soft">
        Un compte (parent) pour synchroniser la progression entre le téléphone, la
        tablette et l'ordinateur.
      </p>

      <label className="mb-2 block">
        <span className="text-xs font-extrabold text-ink">Email</span>
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-xl2 border-2 border-[#F1E2CB] px-3 py-2 text-base text-ink outline-none focus:border-sun"
        />
      </label>
      <label className="mb-3 block">
        <span className="text-xs font-extrabold text-ink">Mot de passe</span>
        <input
          type="password"
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-xl2 border-2 border-[#F1E2CB] px-3 py-2 text-base text-ink outline-none focus:border-sun"
        />
      </label>

      <button
        onClick={submit}
        disabled={busy}
        className="min-h-tap w-full rounded-full bg-grass px-5 py-2.5 font-display font-semibold text-white shadow-softs disabled:opacity-50"
      >
        {busy ? "…" : mode === "signin" ? "Se connecter" : "Créer mon compte"}
      </button>

      {msg && (
        <p className={`mt-2 text-sm font-bold ${msg.ok ? "text-grass-dark" : "text-va"}`}>
          {msg.text}
        </p>
      )}
    </div>
  );
}
