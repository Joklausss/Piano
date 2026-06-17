import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Configuration via variables d'env publiques (injectées au build).
// Tant qu'elles sont absentes, le « cloud » est désactivé et l'app reste 100 %
// locale (comportement par défaut). La clé « anon » est conçue pour être
// publique : la sécurité repose sur les politiques RLS de la base.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const cloudConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null =
  cloudConfigured && typeof window !== "undefined"
    ? createClient(url as string, anonKey as string, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : null;

/** Table qui stocke l'état complet (profils + progression + réglages) par utilisateur. */
export const STATE_TABLE = "user_state";
