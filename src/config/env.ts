import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000').transform(Number),
  REDIS_URL: z.string().url().default('redis://localhost:6379'),
  TAKEDOWN_HTTP_TIMEOUT_MS: z
    .string()
    .default('5000')
    .transform((v) => Number(v)),
  TAKEDOWN_MAX_ATTEMPTS: z
    .string()
    .default('3')
    .transform((v) => Number(v)),

  // Supabase — provê a autenticação (GoTrue) e a base de usuários (Postgres).
  // Opcionais no boot, no mesmo espírito das credenciais de plataforma: a API
  // sobe sem elas. O middleware `requireAuth` retorna 500 com erro claro se uma
  // rota protegida for acessada sem essas variáveis configuradas.
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),

  // Service role key (SECRETA — nunca exposta ao browser). Usada só no backend
  // para a admin API de convites (inviteUserByEmail). Opcional no boot.
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // Allowlist de e-mails que podem enviar convites de cadastro. Lista separada
  // por vírgula. Vazia = ninguém convida (sistema fechado até configurar).
  INVITE_ADMINS: z
    .string()
    .default('')
    .transform((v) =>
      v
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean),
    ),

  // Origem do frontend liberada no CORS + base do link de convite. O dev server
  // (vite-config da Lovable) roda em :8080 por padrão.
  FRONTEND_ORIGIN: z.string().url().default('http://localhost:8080'),

  // Credenciais das plataformas. Opcionais no boot: a API sobe sem elas.
  // Se um takedown chegar para uma plataforma sem credencial, o job falha
  // com erro claro (ver src/platforms/*.adapter.ts).
  GOOGLE_ADS_CLIENT_ID: z.string().optional(),
  GOOGLE_ADS_CLIENT_SECRET: z.string().optional(),
  GOOGLE_ADS_DEVELOPER_TOKEN: z.string().optional(),
  GOOGLE_ADS_REFRESH_TOKEN: z.string().optional(),
  GOOGLE_ADS_LOGIN_CUSTOMER_ID: z.string().optional(),

  META_ADS_ACCESS_TOKEN: z.string().optional(),
  META_ADS_APP_ID: z.string().optional(),
  META_ADS_APP_SECRET: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Variáveis de ambiente inválidas:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
