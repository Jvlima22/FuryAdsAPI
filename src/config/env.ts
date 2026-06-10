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
