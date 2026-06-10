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
| `TAKEDOWN_HTTP_TIMEOUT_MS` | `5000` | Timeout da execução do takedown no worker |
| `TAKEDOWN_MAX_ATTEMPTS` | `3` | Tentativas máximas antes do job ser dado como falho |

**Credenciais das plataformas** (todas opcionais no boot — a API sobe sem elas; um takedown para uma plataforma sem credencial falha o job com erro claro, sem derrubar o processo):

| Var | Plataforma | Descrição |
| --- | --- | --- |
| `GOOGLE_ADS_CLIENT_ID` / `GOOGLE_ADS_CLIENT_SECRET` | Google Ads | OAuth client |
| `GOOGLE_ADS_DEVELOPER_TOKEN` | Google Ads | Developer token da API |
| `GOOGLE_ADS_REFRESH_TOKEN` | Google Ads | Refresh token OAuth |
| `GOOGLE_ADS_LOGIN_CUSTOMER_ID` | Google Ads | (opcional) MCC/login customer id |
| `META_ADS_ACCESS_TOKEN` | Meta Ads | Access token da Graph API |
| `META_ADS_APP_ID` / `META_ADS_APP_SECRET` | Meta Ads | Credenciais do app |

---

## Endpoints

### `POST /webhook/violation`

Recebe a notificação, valida com Zod e enfileira o job de takedown.

**Request body**

```json
{
  "adId": "ad_123",
  "tenantId": "tenant_abc",
  "platform": "META_ADS",
  "violationType": "PROHIBITED_TERM",
  "severity": "HIGH",
  "detectedAt": "2026-05-21T12:34:56.000Z"
}
```

| Campo | Tipo | Regras |
| --- | --- | --- |
| `adId` | string | obrigatório, não vazio. Para `GOOGLE_ADS`, formato `{adGroupId}~{adId}` |
| `tenantId` | string | obrigatório, não vazio. Para `GOOGLE_ADS`, o customer_id (dígitos) |
| `platform` | enum | `GOOGLE_ADS` \| `META_ADS` |
| `violationType` | enum | `PROHIBITED_TERM` \| `BRAND_VIOLATION` \| `COMPLIANCE_FAIL` |
| `severity` | enum | `LOW` \| `MEDIUM` \| `HIGH` \| `CRITICAL` |
| `detectedAt` | string | ISO 8601 |

> **Multi-plataforma (Strategy Pattern).** O worker seleciona o adapter por `platform` e delega o takedown: `GoogleAdsAdapter` (SDK `google-ads-api`) ou `MetaAdsAdapter` (SDK `facebook-nodejs-business-sdk`), ambos pausando o anúncio (`status: PAUSED`). Novas plataformas = novo adapter em `src/platforms/` + uma entrada no enum. Sem credenciais válidas, o job vai a `failed` com mensagem explícita — fila, idempotência e status seguem testáveis.

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
  "result": { "platform": "META_ADS", "action": "AD_PAUSED", "resource": "ad_123", "durationMs": 187 },
  "error": null
}
```

Estados possíveis (`status`): `waiting`, `active`, `delayed`, `completed`, `failed`, `unknown`.

### `GET /metrics/:platform/:customerId`

Leitura **read-only e síncrona** de métricas de campanha (não passa pela fila). Hoje só `google-ads` implementa.

- **URL**: `/metrics/google-ads/:customerId?from=YYYY-MM-DD&to=YYYY-MM-DD`
- `customerId` — o customer_id da conta Google Ads (dígitos; aceita com ou sem traços)
- `from` / `to` — intervalo (obrigatórios, formato `YYYY-MM-DD`, `from <= to`)

**Resposta (`200 OK`)** — uma linha por campanha, métricas agregadas no período:

```json
{
  "platform": "GOOGLE_ADS",
  "customerId": "1234567890",
  "from": "2024-01-01",
  "to": "2024-01-31",
  "count": 1,
  "campaigns": [
    {
      "campaignId": "123",
      "campaignName": "Black Friday",
      "status": "ENABLED",
      "impressions": 45200,
      "clicks": 1830,
      "costMicros": 920000000,
      "conversions": 74,
      "ctr": 0.0405,
      "averageCpcMicros": 502732
    }
  ]
}
```

- `400` — `platform` desconhecida, ou `from`/`to` inválidos
- Valores em *micros* (`costMicros`, `averageCpcMicros`): divida por 1.000.000 para a moeda da conta.

> **Pré-requisito de acesso**: como o takedown, a leitura usa o developer token. Em nível *Test account* só lê **contas de teste**; para uma conta real é preciso **Basic access** aprovado no API Center do Google.

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
    "platform": "META_ADS",
    "violationType": "PROHIBITED_TERM",
    "severity": "HIGH",
    "detectedAt": "2026-05-21T12:34:56.000Z"
  }'

# Consultar status
curl http://localhost:3000/jobs/tenant_abc__ad_123
```

---

## Como reproduzir o `409` (idempotência)

Conforme o enunciado, *"o mesmo `adId + tenantId` não deve gerar dois jobs **simultâneos** na fila"*. O bloqueio vale enquanto o job está em `waiting`/`active`/`delayed`. Sem credenciais de plataforma, o job falha rápido; com elas, a chamada ao SDK leva alguns ms — em ambos os casos a janela "em andamento" é curta, então uma sequência manual de POSTs idênticos tende a voltar `202` toda vez (comportamento correto: o job anterior já não está mais "em andamento").

Para observar o `409` na prática — **disparo concorrente.** Abra duas abas do Insomnia com o mesmo body, clique "Send" nas duas o mais rápido possível (ou rode `curl` em paralelo). Uma volta `202`, a outra `409`:

```bash
# bash/PowerShell — dispara dois POSTs em paralelo
curl -X POST http://localhost:3000/webhook/violation -H "Content-Type: application/json" -d '{"adId":"ad_x","tenantId":"t_x","platform":"META_ADS","violationType":"PROHIBITED_TERM","severity":"HIGH","detectedAt":"2026-05-21T12:00:00.000Z"}' &
curl -X POST http://localhost:3000/webhook/violation -H "Content-Type: application/json" -d '{"adId":"ad_x","tenantId":"t_x","platform":"META_ADS","violationType":"PROHIBITED_TERM","severity":"HIGH","detectedAt":"2026-05-21T12:00:00.000Z"}' &
wait
```

---

## Decisões técnicas

- **Idempotência por `jobId` determinístico (`${tenantId}__${adId}`) + lock atômico no Redis**: além do dedup nativo do BullMQ, o webhook adquire um lock `SET NX EX` antes de enfileirar. Isso elimina a corrida entre duas requisições concorrentes com mesmo `tenantId+adId` que poderiam passar entre `getJob` e `add`. Em caso de duplicidade, devolve `409`. O lock é liberado pelo worker quando o job conclui (`completed`) ou esgota todas as tentativas (`failed` definitivo); entre retries, o lock é mantido. TTL de segurança calculado a partir de `TAKEDOWN_HTTP_TIMEOUT_MS * TAKEDOWN_MAX_ATTEMPTS + 30s` garante que o lock não fique preso caso o worker caia.
- **Retry com backoff exponencial**: configurado no nível da fila (`attempts: 3`, `backoff: exponential 1000ms`). Falhas HTTP (não-2xx) e timeout viram exceções no worker, acionando o retry do BullMQ.
- **Arquitetura multi-plataforma via Strategy Pattern**: o worker não conhece detalhes de Google/Meta — delega para um `PlatformAdapter` selecionado por `payload.platform` (`src/platforms/`). Cada adapter encapsula seu SDK oficial e a lógica de pausar o anúncio. Adicionar uma plataforma = um novo adapter + uma entrada no enum/map (o `Record<Platform, PlatformAdapter>` força o compilador a cobrir todas). SDKs instanciados de forma _lazy_, então a API sobe mesmo sem credenciais; nesse caso o job falha com erro operacional claro.
- **Worker no mesmo processo da API**: o desafio é uma "mini-API" e não exige escala separada — manter em um único processo simplifica o setup local. Em produção, basta extrair `startTakedownWorker()` para um entry-point próprio.
- **Timeout via `Promise.race` no worker**: blinda contra um SDK que pendure, transformando o estouro em exceção retentável pelo BullMQ (antes era o `AbortController` do `fetch`).
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
│   ├── jobs.controller.ts     # GET /jobs/:id
│   └── metrics.controller.ts  # GET /metrics/:platform/:customerId
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
├── platforms/                 # Strategy Pattern por plataforma de anúncio
│   ├── index.ts               # getPlatformAdapter(platform)
│   ├── platform.interface.ts  # contrato PlatformAdapter + TakedownResult
│   ├── google-ads.adapter.ts  # SDK google-ads-api (takedown + métricas)
│   └── meta-ads.adapter.ts    # SDK facebook-nodejs-business-sdk (takedown)
├── schemas/
│   ├── violation.schema.ts    # ViolationPayload + platform (Zod)
│   └── metrics.schema.ts      # query de métricas + tipos de campanha (Zod)
├── workers/
│   └── takedown.worker.ts     # seleciona o adapter e delega o takedown
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
