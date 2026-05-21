import { Worker, Job } from 'bullmq';
import { env } from '../config/env';
import { redisConnection } from '../queues/redis';
import { releaseLock } from '../queues/idempotency';
import {
  TAKEDOWN_QUEUE_NAME,
  TakedownJobData,
  TakedownJobResult,
} from '../queues/takedown.queue';

async function processTakedown(
  job: Job<TakedownJobData, TakedownJobResult>,
): Promise<TakedownJobResult> {
  const { adId, tenantId, violationType, severity } = job.data;
  console.log(
    `[worker] takedown attempt=${job.attemptsMade + 1}/${job.opts.attempts} ` +
      `tenant=${tenantId} ad=${adId} type=${violationType} severity=${severity}`,
  );

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    env.TAKEDOWN_HTTP_TIMEOUT_MS,
  );

  const startedAt = Date.now();
  try {
    const response = await fetch(env.TAKEDOWN_TARGET_URL, {
      method: 'GET',
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status} ao chamar ${env.TAKEDOWN_TARGET_URL}`,
      );
    }

    // consome o body para liberar o socket (não usamos o conteúdo)
    await response.text();

    return {
      status: response.status,
      url: env.TAKEDOWN_TARGET_URL,
      durationMs: Date.now() - startedAt,
    };
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error(
        `Timeout (${env.TAKEDOWN_HTTP_TIMEOUT_MS}ms) ao chamar ${env.TAKEDOWN_TARGET_URL}`,
        { cause: err },
      );
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

export function startTakedownWorker(): Worker<TakedownJobData, TakedownJobResult> {
  const worker = new Worker<TakedownJobData, TakedownJobResult>(
    TAKEDOWN_QUEUE_NAME,
    processTakedown,
    { connection: redisConnection },
  );

  worker.on('completed', async (job, result) => {
    console.log(
      `[worker] completed job=${job.id} status=${result.status} duration=${result.durationMs}ms`,
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
