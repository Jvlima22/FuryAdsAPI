# Fury Ads API

Mini-API em **Node.js + TypeScript** que recebe webhooks de violação de anúncio, valida o payload com Zod, enfileira um job de _takedown_ no **BullMQ** (Redis) e expõe o status do job via REST.

> Desafio técnico FURY · Click Hero — Full Stack Pleno.

---

## Stack

| Camada | Tech |
| --- | --- |
| Runtime | Node.js 20+ |
| Linguagem | TypeScript 5 (strict) |
| HTTP | Express 5 |
| Fila | BullMQ + ioredis |
| Validação | Zod 4 |
| Dev | tsx (watch mode), ESLint, Prettier |

---

## Pré-requisitos

- Node.js 20+
- Redis acessível (local via Docker, ou Upstash free tier)

---

## Setup

```bash
# 1. Instalar deps
npm install

# 2. Copiar variáveis de ambiente
cp .env.example .env   # (Windows: copy .env.example .env)

# 3. Subir o Redis local (opcional — pule se usar Upstash)
docker compose up -d redis

# 4. Rodar em modo dev (API + Worker no mesmo processo)
npm run dev
```

A API sobe em `http://localhost:3000` e o worker do BullMQ inicia junto.

> **Nota sobre a porta do Redis**: o `docker-compose.yml` expõe o Redis em `6380` no host (evita conflito caso já exista outro Redis em `6379`). O `.env.example` já vem ajustado para `redis://localhost:6380`. Se for usar Redis em `6379` (Upstash, instalação local etc.), basta sobrescrever `REDIS_URL` no `.env`.

### Variáveis de ambiente

| Var | Default | Descrição |
| --- | --- | --- |
| `NODE_ENV` | `development` | `development` \| `production` \| `test` |
| `PORT` | `3000` | Porta HTTP |
| `REDIS_URL` | `redis://localhost:6379` | URL do Redis (ioredis) |
| `TAKEDOWN_TARGET_URL` | `https://jsonplaceholder.typicode.com/posts/1` | Endpoint HTTP que o worker chama (mock da Meta API) |
| `TAKEDOWN_HTTP_TIMEOUT_MS` | `5000` | Timeout da chamada HTTP do worker |
| `TAKEDOWN_MAX_ATTEMPTS` | `3` | Tentativas máximas antes do job ser dado como falho |

---

## Endpoints

### `POST /webhook/violation`

Recebe a notificação, valida com Zod e enfileira o job de takedown.

**Request body**

```json
{
  "adId": "ad_123",
  "tenantId": "tenant_abc",
  "violationType": "PROHIBITED_TERM",
  "severity": "HIGH",
  "detectedAt": "2026-05-21T12:34:56.000Z"
}
```

| Campo | Tipo | Regras |
| --- | --- | --- |
| `adId` | string | obrigatório, não vazio |
| `tenantId` | string | obrigatório, não vazio |
| `violationType` | enum | `PROHIBITED_TERM` \| `BRAND_VIOLATION` \| `COMPLIANCE_FAIL` |
| `severity` | enum | `LOW` \| `MEDIUM` \| `HIGH` \| `CRITICAL` |
| `detectedAt` | string | ISO 8601 |

**Respostas**

- `202 Accepted` — job enfileirado: `{ "status": "enqueued", "jobId": "tenant_abc__ad_123" }`
- `409 Conflict` — já existe job em andamento com mesmo `tenantId:adId`
- `400 Bad Request` — payload inválido (campos com erro detalhado em `errors`)

### `GET /jobs/:id`

Retorna o status atual do job.

```json
{
  "jobId": "tenant_abc__ad_123",
  "status": "completed",
  "attempts": 1,
  "result": { "status": 200, "url": "https://jsonplaceholder.typicode.com/posts/1", "durationMs": 187 },
  "error": null
}
```

Estados possíveis (`status`): `waiting`, `active`, `delayed`, `completed`, `failed`, `unknown`.

### `GET /health`

Healthcheck simples — `{ "status": "ok", "env": "...", "ts": "..." }`.

---

## Exemplos com curl

```bash
# Enfileirar um job
curl -X POST http://localhost:3000/webhook/violation \
  -H "Content-Type: application/json" \
  -d '{
    "adId": "ad_123",
    "tenantId": "tenant_abc",
    "violationType": "PROHIBITED_TERM",
    "severity": "HIGH",
    "detectedAt": "2026-05-21T12:34:56.000Z"
  }'

# Consultar status
curl http://localhost:3000/jobs/tenant_abc__ad_123
```

---

## Como reproduzir o `409` (idempotência)

Conforme o enunciado, *"o mesmo `adId + tenantId` não deve gerar dois jobs **simultâneos** na fila"*. O bloqueio vale enquanto o job está em `waiting`/`active`/`delayed`. Como o `jsonplaceholder` responde em ~50–200ms, o job conclui antes de você conseguir clicar "Send" pela segunda vez no Insomnia — por isso uma sequência manual de POSTs idênticos volta `202` toda vez (comportamento correto: o job anterior já não está mais "em andamento").

Duas formas de observar o `409` na prática:

**A) Disparo concorrente.** Abra duas abas do Insomnia com o mesmo body, clique "Send" nas duas o mais rápido possível (ou rode `curl` em paralelo). Uma volta `202`, a outra `409`:

```bash
# bash/PowerShell — dispara dois POSTs em paralelo
curl -X POST http://localhost:3000/webhook/violation -H "Content-Type: application/json" -d '{"adId":"ad_x","tenantId":"t_x","violationType":"PROHIBITED_TERM","severity":"HIGH","detectedAt":"2026-05-21T12:00:00.000Z"}' &
curl -X POST http://localhost:3000/webhook/violation -H "Content-Type: application/json" -d '{"adId":"ad_x","tenantId":"t_x","violationType":"PROHIBITED_TERM","severity":"HIGH","detectedAt":"2026-05-21T12:00:00.000Z"}' &
wait
```

**B) Atrasar o alvo HTTP.** Aponte temporariamente `TAKEDOWN_TARGET_URL` para um endpoint lento, expandindo a janela em que o job fica `active`. Reinicie o `npm run dev` após editar o `.env`:

```env
TAKEDOWN_TARGET_URL=https://httpbin.org/delay/3
```

Agora qualquer segundo POST com o mesmo `tenantId+adId` dentro desses ~3s devolve `409`.

---

## Decisões técnicas

- **Idempotência por `jobId` determinístico (`${tenantId}__${adId}`) + lock atômico no Redis**: além do dedup nativo do BullMQ, o webhook adquire um lock `SET NX EX` antes de enfileirar. Isso elimina a corrida entre duas requisições concorrentes com mesmo `tenantId+adId` que poderiam passar entre `getJob` e `add`. Em caso de duplicidade, devolve `409`. O lock é liberado pelo worker quando o job conclui (`completed`) ou esgota todas as tentativas (`failed` definitivo); entre retries, o lock é mantido. TTL de segurança calculado a partir de `TAKEDOWN_HTTP_TIMEOUT_MS * TAKEDOWN_MAX_ATTEMPTS + 30s` garante que o lock não fique preso caso o worker caia.
- **Retry com backoff exponencial**: configurado no nível da fila (`attempts: 3`, `backoff: exponential 1000ms`). Falhas HTTP (não-2xx) e timeout viram exceções no worker, acionando o retry do BullMQ.
- **Worker no mesmo processo da API**: o desafio é uma "mini-API" e não exige escala separada — manter em um único processo simplifica o setup local. Em produção, basta extrair `startTakedownWorker()` para um entry-point próprio.
- **`fetch` nativo (Node 20+)** em vez de axios: menos dependências.
- **Validação centralizada via middleware `validate(schema, source)`**: erros do Zod caem no `errorHandler` global e viram `400` com `errors` detalhados (conforme exigido pelo enunciado).
- **`AppError` para erros operacionais**: distingue 4xx esperados (job não encontrado, duplicidade) de erros internos.
- **Sem banco de dados**: o estado do job é o do BullMQ (Redis). O desafio explicitamente não pede persistência.

---

## Estrutura

```
src/
├── config/env.ts              # validação Zod das envs
├── controllers/
│   ├── webhook.controller.ts  # POST /webhook/violation
│   └── jobs.controller.ts     # GET /jobs/:id
├── middlewares/
│   ├── validate.middleware.ts # validate(schema, source)
│   └── error.middleware.ts    # handler global (Zod + AppError)
├── queues/
│   ├── redis.ts               # ioredis singleton
│   ├── takedown.queue.ts      # Queue + defaultJobOptions
│   └── idempotency.ts         # lock atômico Redis (SET NX EX)
├── routes/
│   ├── index.ts
│   ├── webhook.routes.ts
│   └── jobs.routes.ts
├── schemas/
│   └── violation.schema.ts    # ViolationPayload (Zod)
├── workers/
│   └── takedown.worker.ts     # processa o job + chama HTTP
└── utils/
    ├── AppError.ts
    └── server.ts              # entry-point (API + worker + graceful shutdown)
```

---

## Comandos

```bash
npm run dev    # API + worker em modo watch
npm run build  # compila TS -> dist/
npm start      # roda a build de produção
npm run lint   # ESLint em src/
```
