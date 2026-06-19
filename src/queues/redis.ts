import IORedis, { Redis } from 'ioredis';
import { env } from '../config/env';

/**
 * Conexão única reusada por Queue, Worker e QueueEvents.
 * maxRetriesPerRequest: null é exigência do BullMQ (workers usam blocking commands).
 */
export const redisConnection: Redis = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
  // family: 0 habilita lookup DNS dual-stack (IPv4+IPv6). Necessário para a
  // rede privada do Railway (hostname *.railway.internal só resolve em IPv6);
  // inofensivo em localhost/dev.
  family: 0,
});

redisConnection.on('error', (err) => {
  console.error('[redis] erro de conexão:', err.message);
});
