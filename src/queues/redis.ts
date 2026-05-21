import IORedis, { Redis } from 'ioredis';
import { env } from '../config/env';

/**
 * Conexão única reusada por Queue, Worker e QueueEvents.
 * maxRetriesPerRequest: null é exigência do BullMQ (workers usam blocking commands).
 */
export const redisConnection: Redis = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

redisConnection.on('error', (err) => {
  console.error('[redis] erro de conexão:', err.message);
});
