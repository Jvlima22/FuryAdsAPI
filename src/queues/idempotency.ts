import { redisConnection } from './redis';
import { env } from '../config/env';

const LOCK_PREFIX = 'lock:takedown:';

/**
 * TTL do lock = janela máxima realista do job (timeout * max attempts + folga).
 * É um safety net caso o worker caia antes de liberar; em condições normais
 * o lock é deletado pelos handlers `completed`/`failed` do worker.
 */
function lockTtlSeconds(): number {
  return Math.ceil(
    (env.TAKEDOWN_HTTP_TIMEOUT_MS * env.TAKEDOWN_MAX_ATTEMPTS) / 1000 + 30,
  );
}

export function lockKey(jobId: string): string {
  return `${LOCK_PREFIX}${jobId}`;
}

/**
 * Adquire lock atômico (SET NX EX) para o jobId.
 * Retorna true se conseguiu (cliente deve prosseguir), false se já estava locked (duplicata).
 */
export async function acquireLock(jobId: string): Promise<boolean> {
  const result = await redisConnection.set(
    lockKey(jobId),
    '1',
    'EX',
    lockTtlSeconds(),
    'NX',
  );
  return result === 'OK';
}

export async function releaseLock(jobId: string): Promise<void> {
  await redisConnection.del(lockKey(jobId));
}
