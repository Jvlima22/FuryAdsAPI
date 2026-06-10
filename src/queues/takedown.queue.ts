import { Queue } from 'bullmq';
import { env } from '../config/env';
import { redisConnection } from './redis';
import { ViolationPayload } from '../schemas/violation.schema';
import { TakedownResult } from '../platforms';

export const TAKEDOWN_QUEUE_NAME = 'takedown';

export type TakedownJobData = ViolationPayload;

export type TakedownJobResult = TakedownResult;

export const takedownQueue = new Queue<TakedownJobData, TakedownJobResult>(
  TAKEDOWN_QUEUE_NAME,
  {
    connection: redisConnection,
    defaultJobOptions: {
      attempts: env.TAKEDOWN_MAX_ATTEMPTS,
      backoff: { type: 'exponential', delay: 1000 },
      removeOnComplete: { age: 3600, count: 1000 },
      removeOnFail: { age: 24 * 3600 },
    },
  },
);

export function buildTakedownJobId(tenantId: string, adId: string): string {
  // BullMQ não permite ":" em customId — usamos "__" como separador estável.
  return `${tenantId}__${adId}`;
}
