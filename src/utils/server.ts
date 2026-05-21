import express from 'express';
import { env } from '../config/env';
import { errorHandler } from '../middlewares/error.middleware';
import routes from '../routes';
import { startTakedownWorker } from '../workers/takedown.worker';
import { redisConnection } from '../queues/redis';
import { takedownQueue } from '../queues/takedown.queue';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', env: env.NODE_ENV, ts: new Date().toISOString() });
});

app.use(routes);

app.use(errorHandler);

const worker = startTakedownWorker();

const server = app.listen(env.PORT, () => {
  console.log(`API rodando na porta ${env.PORT} [${env.NODE_ENV}]`);
  console.log(`Worker "takedown" iniciado — alvo HTTP: ${env.TAKEDOWN_TARGET_URL}`);
});

async function shutdown(signal: string): Promise<void> {
  console.log(`\n[${signal}] encerrando...`);
  server.close();
  await worker.close();
  await takedownQueue.close();
  await redisConnection.quit();
  process.exit(0);
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));
