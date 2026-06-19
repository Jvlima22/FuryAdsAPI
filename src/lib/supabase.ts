import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';

/**
 * Cliente Supabase do backend — instanciado de forma lazy (como os SDKs de
 * plataforma). A API sobe sem as credenciais; quem precisar do cliente e não o
 * tiver configurado recebe um AppError 500 com mensagem clara.
 *
 * Usa a chave anônima: o backend só faz verificação de token de usuário
 * (`auth.getUser(jwt)`), nunca operações administrativas — logo não precisa da
 * service role key.
 */
let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (client) return client;

  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    throw new AppError(
      'Supabase não configurado: defina SUPABASE_URL e SUPABASE_ANON_KEY no .env',
      500,
    );
  }

  client = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

/**
 * Cliente Supabase com a SERVICE ROLE key — acesso administrativo total. Usado
 * exclusivamente no backend para a admin API (convites). NUNCA deve ir para o
 * browser. Lazy, como o cliente anônimo.
 */
let adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (adminClient) return adminClient;

  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new AppError(
      'Convites indisponíveis: defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env',
      500,
    );
  }

  adminClient = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return adminClient;
}
