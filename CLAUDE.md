# Fury Ads API

Mini-API Node.js + TypeScript que recebe webhooks de violação de anúncio, enfileira jobs de _takedown_ no BullMQ e expõe o status via REST. Desafio técnico FURY · Click Hero.

## Stack

- Node.js 20+, Express 5, TypeScript (CommonJS, `strict: true`)
- BullMQ + ioredis (fila + worker no mesmo processo)
- Zod 4 para validação de envs e payloads
- Takedown multi-plataforma via Strategy Pattern (`src/platforms/`): SDKs `google-ads-api` e `facebook-nodejs-business-sdk`
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
- `src/platforms/` — Strategy Pattern: `platform.interface.ts` (`PlatformAdapter` p/ takedown + `MetricsAdapter` p/ leitura), `google-ads.adapter.ts` (implementa ambos), `meta-ads.adapter.ts`, `index.ts` (`getPlatformAdapter` / `getMetricsAdapter`)
- `src/workers/takedown.worker.ts` — seleciona o adapter por `payload.platform` e delega; timeout via `Promise.race`
- `src/controllers/webhook.controller.ts` — `POST /webhook/violation`
- `src/controllers/jobs.controller.ts` — `GET /jobs/:id`
- `src/controllers/metrics.controller.ts` — `GET /metrics/:platform/:customerId` (read-only, síncrono)
- `src/middlewares/{validate,error}.middleware.ts` — validação Zod + handler global
- `src/utils/AppError.ts` — erros operacionais com `statusCode`

## Endpoints

- `POST /webhook/violation` → `202` enfileirado, `409` se duplicado, `400` payload inválido
- `GET /jobs/:id` → `{ jobId, status, attempts, result, error }`
- `GET /metrics/:platform/:customerId?from=&to=` → métricas de campanha agregadas (read-only, síncrono; só `google-ads` por enquanto)
- `GET /health`

## Variáveis de ambiente

| Var | Default |
| --- | --- |
| `NODE_ENV` | `development` |
| `PORT` | `3000` |
| `REDIS_URL` | `redis://localhost:6379` |
| `TAKEDOWN_HTTP_TIMEOUT_MS` | `5000` |
| `TAKEDOWN_MAX_ATTEMPTS` | `3` |
| `GOOGLE_ADS_*` / `META_ADS_*` | (opcionais) credenciais por plataforma |

Validadas no startup por `src/config/env.ts` — processo encerra com `exit(1)` se inválidas. Credenciais de plataforma são opcionais: a API sobe sem elas e o job falha com erro claro se faltarem. Use `.env.example` como referência.

## Convenções

- **Idempotência**: `jobId = ${tenantId}__${adId}`. BullMQ rejeita duplicatas enquanto o job está em `waiting/active/delayed`. O webhook detecta e devolve `409`.
- **Retry/backoff**: configurado no `defaultJobOptions` da queue, não no worker. Qualquer exceção lançada pelo processor aciona o retry do BullMQ.
- **Erros**: lance `AppError(msg, statusCode)` para erros esperados (404, 409, etc.); deixe o `errorHandler` global devolver `500` para o resto. ZodError vira `400` automaticamente.
- **Worker no mesmo processo da API** por simplicidade do desafio. Para escalar, extrair `startTakedownWorker()` para um entry-point próprio.
- **Multi-plataforma**: payload exige `platform` (`GOOGLE_ADS` | `META_ADS`). Nova plataforma = novo adapter em `src/platforms/` + entrada no enum `platformSchema` e no `Record<Platform, PlatformAdapter>` (o compilador força a cobertura). SDKs instanciados lazy dentro do adapter.
- **Takedown vs métricas**: takedown é **assíncrono** (fila BullMQ, write/mutate, com retry); leitura de métricas é **síncrona** (`GET`, read-only, sem fila). Capacidades separadas — `PlatformAdapter` vs `MetricsAdapter`; nem toda plataforma implementa métricas (`getMetricsAdapter` lança `400` se não houver).
- Não commitar `.env`.
- Manter mudanças focadas; o desafio pede qualidade, não quantidade de features.
