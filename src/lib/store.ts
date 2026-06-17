"use client";

import { useCallback, useEffect, useState } from "react";
import type { Profile, ProgressState } from "@/data/types";
import { SONS } from "@/lib/progression";

// Stockage local d'abord (RGPD : collecte minimale, pas de tracking, données
// de progression locales par défaut). Tout est dans le navigateur.

const K_PROFILES = "mpm.profiles";
const K_ACTIVE = "mpm.activeProfile";
const K_PROGRESS = (id: string) => `mpm.progress.${id}`;
const K_SETTINGS = "mpm.settings";

export type AideLevel = "colore" | "segmente" | "nu";
export type Ecriture = "script" | "cursive";

export interface Settings {
  aide: AideLevel;
  ecriture: Ecriture;
  freeNavigation: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  aide: "colore",
  ecriture: "script",
  freeNavigation: false,
};

const DEFAULT_PROGRESS: ProgressState = {
  masteredSons: [],
  completedSteps: [],
  module0Done: [],
  fluence: {},
  badges: [],
};

// ---------- accès bas niveau ----------
function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? ({ ...fallback, ...JSON.parse(raw) } as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
  emit();
}

// ---------- pub/sub pour synchroniser les composants ----------
const EVT = "mpm-store";
function emit() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVT));
}
function useStoreTick(): number {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const bump = () => setTick((t) => t + 1);
    window.addEventListener(EVT, bump);
    window.addEventListener("storage", bump);
    return () => {
      window.removeEventListener(EVT, bump);
      window.removeEventListener("storage", bump);
    };
  }, []);
  return tick;
}

// ---------- profils ----------
export function listProfiles(): Profile[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(K_PROFILES);
    return raw ? (JSON.parse(raw) as Profile[]) : [];
  } catch {
    return [];
  }
}
function saveProfiles(p: Profile[]) {
  write(K_PROFILES, p);
}
export function getActiveId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(K_ACTIVE);
  } catch {
    return null;
  }
}
export function setActiveId(id: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (id) localStorage.setItem(K_ACTIVE, id);
    else localStorage.removeItem(K_ACTIVE);
  } catch {}
  emit();
}

let counter = 0;
function newId() {
  counter += 1;
  return `p${Date.now().toString(36)}${counter}`;
}

export function useProfiles() {
  useStoreTick();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  // Avant le montage : valeurs neutres identiques côté serveur (évite le
  // décalage d'hydratation), puis lecture réelle du localStorage.
  const profiles = ready ? listProfiles() : [];
  const activeId = ready ? getActiveId() : null;
  const active = profiles.find((p) => p.id === activeId) ?? null;

  const create = useCallback((name: string, avatar: string) => {
    const p: Profile = {
      id: newId(),
      name: name.trim() || "Mon enfant",
      avatar,
      createdAt: Date.now(),
    };
    const all = listProfiles();
    all.push(p);
    saveProfiles(all);
    setActiveId(p.id);
    return p;
  }, []);

  const remove = useCallback((id: string) => {
    const all = listProfiles().filter((p) => p.id !== id);
    saveProfiles(all);
    try {
      localStorage.removeItem(K_PROGRESS(id));
    } catch {}
    if (getActiveId() === id) setActiveId(all[0]?.id ?? null);
  }, []);

  const select = useCallback((id: string) => setActiveId(id), []);

  return { ready, profiles, active, activeId, create, remove, select };
}

// ---------- progression ----------
export function getProgress(id: string): ProgressState {
  return read<ProgressState>(K_PROGRESS(id), DEFAULT_PROGRESS);
}

export function useProgress() {
  useStoreTick();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const activeId = ready ? getActiveId() : null;
  const progress = ready && activeId ? getProgress(activeId) : DEFAULT_PROGRESS;
  const settings = ready ? read<Settings>(K_SETTINGS, DEFAULT_SETTINGS) : DEFAULT_SETTINGS;

  const update = useCallback(
    (mut: (p: ProgressState) => ProgressState) => {
      const id = getActiveId();
      if (!id) return;
      write(K_PROGRESS(id), mut(getProgress(id)));
    },
    [],
  );

  const completeStep = useCallback(
    (sonId: string, step: number) =>
      update((p) => {
        const key = `${sonId}:${step}`;
        if (p.completedSteps.includes(key)) return p;
        return { ...p, completedSteps: [...p.completedSteps, key] };
      }),
    [update],
  );

  const masterSon = useCallback(
    (sonId: string) =>
      update((p) => {
        const masteredSons = p.masteredSons.includes(sonId)
          ? p.masteredSons
          : [...p.masteredSons, sonId];
        const badges = computeBadges(masteredSons, p.badges);
        return { ...p, masteredSons, badges };
      }),
    [update],
  );

  const toggleModule0 = useCallback(
    (actId: string) =>
      update((p) => ({
        ...p,
        module0Done: p.module0Done.includes(actId)
          ? p.module0Done
          : [...p.module0Done, actId],
      })),
    [update],
  );

  const setFluence = useCallback(
    (storyId: string, wpm: number) =>
      update((p) => ({
        ...p,
        fluence: {
          ...p.fluence,
          [storyId]: Math.max(p.fluence[storyId] ?? 0, Math.round(wpm)),
        },
      })),
    [update],
  );

  const isStepDone = (sonId: string, step: number) =>
    progress.completedSteps.includes(`${sonId}:${step}`);
  const isMastered = (sonId: string) => progress.masteredSons.includes(sonId);

  const isSonUnlocked = (index: number) => {
    if (settings.freeNavigation) return true;
    if (index <= 0) return true;
    return progress.masteredSons.includes(SONS[index - 1].id);
  };

  return {
    ready,
    progress,
    settings,
    completeStep,
    masterSon,
    toggleModule0,
    setFluence,
    isStepDone,
    isMastered,
    isSonUnlocked,
  };
}

// ---------- réglages (espace adulte) ----------
export function useSettings() {
  useStoreTick();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const settings = ready ? read<Settings>(K_SETTINGS, DEFAULT_SETTINGS) : DEFAULT_SETTINGS;
  const set = useCallback((patch: Partial<Settings>) => {
    const cur = read<Settings>(K_SETTINGS, DEFAULT_SETTINGS);
    write(K_SETTINGS, { ...cur, ...patch });
  }, []);
  return { ready, settings, set };
}

// ---------- badges ----------
function computeBadges(masteredSons: string[], current: string[]): string[] {
  const set = new Set(current);
  const masteredSet = new Set(masteredSons);
  // Badge par période entièrement maîtrisée
  for (let period = 1; period <= 5; period++) {
    const ids = SONS.filter((s) => s.period === period).map((s) => s.id);
    if (ids.length > 0 && ids.every((id) => masteredSet.has(id))) {
      set.add(`periode-${period}`);
    }
  }
  // Paliers de sons maîtrisés
  const milestones = [1, 5, 10, 20, 30, 53];
  for (const m of milestones) {
    if (masteredSons.length >= m) set.add(`sons-${m}`);
  }
  return [...set];
}

// ---------- synchronisation cloud : export / import de l'état complet ----------
export interface AppState {
  v: number;
  profiles: Profile[];
  progress: Record<string, ProgressState>;
  settings: Settings;
  active: string | null;
}

/** Sérialise tout l'état local (profils + progression + réglages). */
export function exportState(): AppState {
  const profiles = listProfiles();
  const progress: Record<string, ProgressState> = {};
  for (const p of profiles) progress[p.id] = getProgress(p.id);
  return {
    v: 1,
    profiles,
    progress,
    settings: read<Settings>(K_SETTINGS, DEFAULT_SETTINGS),
    active: getActiveId(),
  };
}

/** Réinjecte un état (venu du cloud) dans le localStorage et notifie l'UI. */
export function importState(state: Partial<AppState> | null | undefined): void {
  if (!state || typeof window === "undefined") return;
  try {
    if (state.profiles) localStorage.setItem(K_PROFILES, JSON.stringify(state.profiles));
    if (state.progress) {
      for (const [id, pr] of Object.entries(state.progress)) {
        localStorage.setItem(K_PROGRESS(id), JSON.stringify(pr));
      }
    }
    if (state.settings) localStorage.setItem(K_SETTINGS, JSON.stringify(state.settings));
    if (state.active) localStorage.setItem(K_ACTIVE, state.active);
  } catch {}
  emit();
}
