import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase do navegador. Lê as chaves PÚBLICAS expostas via Vite
 * (`VITE_*`) — a anon key é segura no cliente (o RLS do Supabase protege os
 * dados). Persiste a sessão no localStorage e a renova automaticamente.
 *
 * Instanciado de forma lazy e só no browser: durante o SSR retornamos `null`
 * para não tocar em `localStorage`. O AuthProvider trata esse caso.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (typeof window === "undefined") return null;
  if (client) return client;

  if (!url || !anonKey) {
    console.warn(
      "[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY ausentes — auth desabilitada.",
    );
    return null;
  }

  client = createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: "fury:auth",
    },
  });
  return client;
}

export const isSupabaseConfigured = Boolean(url && anonKey);
