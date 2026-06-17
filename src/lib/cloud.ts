"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase, cloudConfigured, STATE_TABLE } from "./supabase";
import { exportState, importState } from "./store";

// Synchronisation « état complet » (profils + progression + réglages) par compte.
// Dernière écriture gagnante (suffisant pour une famille).

let currentUserId: string | null = null;
let applyingRemote = false;
let pushTimer: ReturnType<typeof setTimeout> | null = null;
let initialized = false;

export async function pushNow(): Promise<void> {
  if (!supabase || !currentUserId) return;
  try {
    await supabase.from(STATE_TABLE).upsert(
      { user_id: currentUserId, data: exportState(), updated_at: new Date().toISOString() },
      { onConflict: "user_id" },
    );
  } catch {
    /* hors-ligne : on retentera au prochain changement */
  }
}

export async function pullState(): Promise<void> {
  if (!supabase || !currentUserId) return;
  try {
    const { data, error } = await supabase
      .from(STATE_TABLE)
      .select("data")
      .eq("user_id", currentUserId)
      .maybeSingle();
    if (error) return;
    if (data && data.data) {
      applyingRemote = true;
      importState(data.data);
      applyingRemote = false;
    } else {
      // Premier login sur ce compte : on envoie l'état local actuel.
      await pushNow();
    }
  } catch {
    /* ignore */
  }
}

function schedulePush() {
  if (!supabase || !currentUserId || applyingRemote) return;
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(pushNow, 1200);
}

/** À appeler une fois au démarrage (côté client). */
export function initCloudSync(): void {
  if (!supabase || initialized || typeof window === "undefined") return;
  initialized = true;
  window.addEventListener("mpm-store", schedulePush);
  supabase.auth.getSession().then(({ data }) => {
    currentUserId = data.session?.user?.id ?? null;
    if (currentUserId) pullState();
  });
  supabase.auth.onAuthStateChange((_event, session) => {
    const id = session?.user?.id ?? null;
    if (id && id !== currentUserId) {
      currentUserId = id;
      pullState();
    } else if (!id) {
      currentUserId = null;
    }
  });
}

export interface AuthResult {
  error?: { message: string } | null;
  needsConfirmation?: boolean;
}

/** Hook d'authentification (email + mot de passe). */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setReady(true);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signUp(email: string, password: string): Promise<AuthResult> {
    if (!supabase) return { error: { message: "Synchronisation non configurée." } };
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error };
    return { needsConfirmation: !data.session };
  }

  async function signIn(email: string, password: string): Promise<AuthResult> {
    if (!supabase) return { error: { message: "Synchronisation non configurée." } };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ?? null };
  }

  async function signOut(): Promise<void> {
    if (!supabase) return;
    await supabase.auth.signOut();
  }

  return { configured: cloudConfigured, ready, user, signUp, signIn, signOut, syncNow: pushNow };
}
