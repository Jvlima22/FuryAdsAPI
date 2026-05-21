import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000').transform(Number),
  REDIS_URL: z.string().url().default('redis://localhost:6379'),
  TAKEDOWN_TARGET_URL: z
    .string()
    .url()
    .default('https://jsonplaceholder.typicode.com/posts/1'),
  TAKEDOWN_HTTP_TIMEOUT_MS: z
    .string()
    .default('5000')
    .transform((v) => Number(v)),
  TAKEDOWN_MAX_ATTEMPTS: z
    .string()
    .default('3')
    .transform((v) => Number(v)),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Variáveis de ambiente inválidas:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
