import { Worker, Job } from 'bullmq';
import { env } from '../config/env';
import { redisConnection } from '../queues/redis';
import { releaseLock } from '../queues/idempotency';
import { getPlatformAdapter } from '../platforms';
import {
  TAKEDOWN_QUEUE_NAME,
  TakedownJobData,
  TakedownJobResult,
} from '../queues/takedown.queue';

/**
 * Garante que a chamada ao adapter não pendure o worker além do timeout.
 * Os SDKs de plataforma têm seus próprios timeouts internos, mas blindamos aqui
 * para que qualquer travamento vire um erro retentável pelo BullMQ.
 */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`Timeout (${ms}ms) ao executar takedown`)),
      ms,
    );
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      },
    );
  });
}

async function processTakedown(
  job: Job<TakedownJobData, TakedownJobResult>,
): Promise<TakedownJobResult> {
  const { adId, tenantId, platform, violationType, severity } = job.data;
  console.log(
    `[worker] takedown attempt=${job.attemptsMade + 1}/${job.opts.attempts} ` +
      `platform=${platform} tenant=${tenantId} ad=${adId} type=${violationType} severity=${severity}`,
  );

  // Seleciona a estratégia da plataforma (Strategy Pattern) e delega.
  // Qualquer exceção lançada aqui aciona o retry/backoff do BullMQ.
  const adapter = getPlatformAdapter(platform);
  const result = await withTimeout(
    adapter.performTakedown(job.data),
    env.TAKEDOWN_HTTP_TIMEOUT_MS,
  );

  console.log(
    `[worker] takedown ok platform=${platform} action=${result.action} resource=${result.resource}`,
  );
  return result;
}

export function startTakedownWorker(): Worker<TakedownJobData, TakedownJobResult> {
  const worker = new Worker<TakedownJobData, TakedownJobResult>(
    TAKEDOWN_QUEUE_NAME,
    processTakedown,
    { connection: redisConnection },
  );

  worker.on('completed', async (job, result) => {
    console.log(
      `[worker] completed job=${job.id} platform=${result.platform} action=${result.action} duration=${result.durationMs}ms`,
    );
    if (job.id) await releaseLock(job.id);
  });

  worker.on('failed', async (job, err) => {
    const attempts = job?.attemptsMade ?? 0;
    const max = job?.opts.attempts ?? env.TAKEDOWN_MAX_ATTEMPTS;
    console.warn(
      `[worker] failed job=${job?.id} attempt=${attempts}/${max} error="${err.message}"`,
    );
    // Só libera o lock quando não há mais retries pela frente.
    if (job?.id && attempts >= max) await releaseLock(job.id);
  });

  worker.on('error', (err) => {
    console.error('[worker] erro:', err.message);
  });

  return worker;
}
