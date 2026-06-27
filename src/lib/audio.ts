"use client";

// Audio : synthèse vocale fr-FR (Web Speech API) avec état global activé/coupé.
// Repli silencieux si l'API n'est pas disponible (un repli visuel est prévu
// ailleurs dans l'interface).

let voices: SpeechSynthesisVoice[] = [];
let cachedVoice: SpeechSynthesisVoice | null = null;
let globalEnabled = true;
const KEY = "mpm.audio";

function loadVoices() {
  try {
    voices = window.speechSynthesis.getVoices() || [];
  } catch {
    voices = [];
  }
  cachedVoice = null; // forcer le re-choix de la meilleure voix
}

// Voix les plus naturelles (neuronales / enrichies) selon les plateformes.
const PREFERRED = [
  "google", "natural", "neural", "enhanced", "premium",
  "amélie", "amelie", "aurélie", "aurelie", "audrey", "thomas",
  "hortense", "julie", "marie", "céline", "celine", "léa", "lea", "flo", "sandy",
];
const ROBOTIC = ["compact", "eloquence", "pico", "espeak"];

function scoreVoice(v: SpeechSynthesisVoice): number {
  const name = (v.name || "").toLowerCase();
  const lang = (v.lang || "").toLowerCase();
  if (!lang.startsWith("fr")) return -1;
  let s = lang === "fr-fr" ? 6 : 3;
  for (const k of PREFERRED) if (name.includes(k)) s += 4;
  if (name.includes("google")) s += 3; // souvent les plus naturelles (Chrome/Android)
  if (v.localService === false) s += 1;
  for (const k of ROBOTIC) if (name.includes(k)) s -= 6;
  return s;
}

/** Renvoie la voix française la plus « humaine » disponible (ou null). */
export function bestFrenchVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice && voices.includes(cachedVoice)) return cachedVoice;
  let best: SpeechSynthesisVoice | null = null;
  let bestScore = -1;
  for (const v of voices) {
    const sc = scoreVoice(v);
    if (sc > bestScore) {
      bestScore = sc;
      best = v;
    }
  }
  cachedVoice = bestScore >= 0 ? best : null;
  return cachedVoice;
}

if (typeof window !== "undefined") {
  try {
    const v = localStorage.getItem(KEY);
    if (v !== null) globalEnabled = v === "1";
  } catch {}
  if ("speechSynthesis" in window) {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

export function speechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function isAudioEnabled(): boolean {
  return globalEnabled;
}

export function setAudioEnabled(value: boolean): void {
  globalEnabled = value;
  try {
    localStorage.setItem(KEY, value ? "1" : "0");
  } catch {}
  if (!value) stopSpeaking();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("mpm-audio", { detail: value }));
  }
}

export interface SpeakOptions {
  rate?: number;
  pitch?: number;
  /** Forcer la lecture même si le son global est coupé (rare). */
  force?: boolean;
}

export function speak(text: string, opts: SpeakOptions = {}): void {
  if (!text) return;
  if (!globalEnabled && !opts.force) return;
  if (!speechSupported()) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "fr-FR";
    u.rate = opts.rate ?? 0.85;
    u.pitch = opts.pitch ?? 1.0;
    const v = bestFrenchVoice();
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  } catch {}
}

export function stopSpeaking(): void {
  try {
    window.speechSynthesis.cancel();
  } catch {}
}

// Prononciation des sons isolés : on « chante » la lettre plutôt que d'épeler.
const SOUND_TEXT: Record<string, string> = {
  a: "a", i: "i", o: "o", u: "u", e: "eu", é: "é", è: "è", y: "i",
  l: "le", f: "fe", ch: "che", s: "se", m: "me", r: "re", n: "ne",
  v: "ve", j: "je", z: "ze", p: "pe", t: "te", c: "que", b: "be",
  d: "de", g: "gue", k: "que", qu: "que", ph: "fe", gn: "gne",
  ou: "ou", on: "on", an: "an", oi: "oi", in: "in", au: "o", ai: "è",
  eu: "eu", en: "an", ain: "in", oin: "oin", x: "kse", w: "ve", un: "un",
};

/** Texte à prononcer pour un son/graphème isolé. */
export function soundText(grapheme: string): string {
  return SOUND_TEXT[grapheme] ?? grapheme;
}
