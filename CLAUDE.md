# Fury Ads API

Mini-API Node.js + TypeScript que recebe webhooks de violação de anúncio, enfileira jobs de _takedown_ no BullMQ e expõe o status via REST. Desafio técnico FURY · Click Hero.

## Stack

- Node.js 20+, Express 5, TypeScript (CommonJS, `strict: true`)
- BullMQ + ioredis (fila + worker no mesmo processo)
- Zod 4 para validação de envs e payloads
- `fetch` nativo no worker (sem axios)
- ESLint + Prettier

## Comandos

```bash
npm run dev    # API + worker em modo watch (tsx)
npm run build  # tsc -> dist/
npm start      # node dist/utils/server.js
npm run lint   # eslint src/
docker compose up -d redis   # Redis local
```

## Estrutura

- `src/utils/server.ts` — entry-point (API + `startTakedownWorker()` + graceful shutdown)
- `src/config/env.ts` — validação Zod das envs
- `src/schemas/violation.schema.ts` — `ViolationPayload` (Zod)
- `src/queues/redis.ts` — ioredis singleton (`maxRetriesPerRequest: null`)
- `src/queues/takedown.queue.ts` — `Queue` + `defaultJobOptions` (attempts, backoff exponencial)
- `src/workers/takedown.worker.ts` — chama `TAKEDOWN_TARGET_URL` via fetch com `AbortController`
- `src/controllers/webhook.controller.ts` — `POST /webhook/violation`
- `src/controllers/jobs.controller.ts` — `GET /jobs/:id`
- `src/middlewares/{validate,error}.middleware.ts` — validação Zod + handler global
- `src/utils/AppError.ts` — erros operacionais com `statusCode`

## Endpoints

- `POST /webhook/violation` → `202` enfileirado, `409` se duplicado, `400` payload inválido
- `GET /jobs/:id` → `{ jobId, status, attempts, result, error }`
- `GET /health`

## Variáveis de ambiente

| Var | Default |
| --- | --- |
| `NODE_ENV` | `development` |
| `PORT` | `3000` |
| `REDIS_URL` | `redis://localhost:6379` |
| `TAKEDOWN_TARGET_URL` | `https://jsonplaceholder.typicode.com/posts/1` |
| `TAKEDOWN_HTTP_TIMEOUT_MS` | `5000` |
| `TAKEDOWN_MAX_ATTEMPTS` | `3` |

Validadas no startup por `src/config/env.ts` — processo encerra com `exit(1)` se inválidas. Use `.env.example` como referência.

## Convenções

- **Idempotência**: `jobId = ${tenantId}__${adId}`. BullMQ rejeita duplicatas enquanto o job está em `waiting/active/delayed`. O webhook detecta e devolve `409`.
- **Retry/backoff**: configurado no `defaultJobOptions` da queue, não no worker. Qualquer exceção lançada pelo processor aciona o retry do BullMQ.
- **Erros**: lance `AppError(msg, statusCode)` para erros esperados (404, 409, etc.); deixe o `errorHandler` global devolver `500` para o resto. ZodError vira `400` automaticamente.
- **Worker no mesmo processo da API** por simplicidade do desafio. Para escalar, extrair `startTakedownWorker()` para um entry-point próprio.
- Não commitar `.env`.
- Manter mudanças focadas; o desafio pede qualidade, não quantidade de features.
