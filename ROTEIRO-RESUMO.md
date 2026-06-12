# Cola Rápida — Entrevista Fury Ads API

Resumo do `ROTEIRO-ENTREVISTA.md` para consulta de última hora.

**Stack:** Node 20+ · TS strict (CommonJS) · Express 5 · BullMQ + ioredis · Zod 4 · `fetch` nativo

---

## Pitch (30s)

Mini-API que simula o pipeline de _takedown_ de anúncios. Sistema externo manda `POST /webhook/violation` → API **valida com Zod**, **enfileira no BullMQ** e responde **202** na hora. Um **worker** consome a fila, chama a API de takedown via HTTP com **timeout + retry/backoff**, e o cliente acompanha por `GET /jobs/:id`. Garante **idempotência** com `jobId` determinístico + lock atômico no Redis.

**4 pilares:** Assíncrono · Resiliente · Idempotente · Validado/tipado

---

## Fluxo de uma violação (o que mais cai)

1. **Validação** — `validate(schema)` antes do controller; Zod checa campos; falha → **400**. Sobrescreve `req.body` com o dado parseado.
2. **Idempotência + enqueue** — `jobId = tenantId__adId`. Lock `SET NX EX`: sem lock → **409**. Com lock → remove job stale, `add()`, responde **202**. Se `add` falha, libera o lock.
3. **Worker** — `fetch` + `AbortController` (timeout). Resposta não-2xx ou timeout → **lança exceção** → BullMQ faz retry/backoff. `completed` libera lock; `failed` só libera ao esgotar tentativas.
4. **Status** — `GET /jobs/:id` → `status`, `attempts`, `result`, `error`; inexistente → **404**.
5. **Infra** — env validada no boot (fail-fast, exit 1); ioredis com `maxRetriesPerRequest: null`; graceful shutdown; errorHandler global (Zod→400, AppError→status, resto→500).

---

## Perguntas-chave (respostas em 1 linha)

**Por que fila e não takedown direto?** Operação lenta/externa que pode falhar. Desacopla recebimento de processamento → responde 202 rápido + durabilidade + retry + escala.

**Por que lock se o BullMQ já deduplica por `jobId`?** Race condition: dois `add` concorrentes — o dedup ignora o 2º **sem erro**, ambos dariam 202. `SET NX` é atômico: só um ganha, o outro recebe 409 determinístico.

**Por que remover job stale antes de re-enfileirar?** BullMQ não recria `jobId` existente, mesmo completed/failed. Se o anúncio viola de novo, preciso reprocessar. Feito dentro do lock = seguro.

**Quando libera o lock?** `completed`: na hora. `failed`: só ao esgotar retries (mantém entre tentativas). + TTL de segurança (`timeout * maxAttempts + 30s`) se o worker morrer.

**Onde fica o retry?** `defaultJobOptions` da Queue (`attempts: 3`, backoff exponencial `delay: 1000` → ~1s/2s/4s). É política do job, não do worker; o worker só lança exceção.

**Timeout HTTP?** `fetch` não tem timeout nativo → `AbortController` + `setTimeout(abort)`, `clearTimeout` no `finally`.

**Por que `await response.text()` sem usar?** Drenar o body e liberar o socket (evita vazar conexões).

**Por que validar env no startup?** Fail-fast: morre no boot, não em runtime. E o `env` exportado fica tipado.

**`maxRetriesPerRequest: null`?** Exigência do BullMQ — workers usam comandos bloqueantes (BZPOPMIN); um limite finito lançaria erro neles.

**Graceful shutdown?** SIGINT/SIGTERM fecham server → worker (termina job atual) → queue → Redis. Evita jobs stalled e conexões penduradas.

**Worker no mesmo processo?** Simplicidade pro escopo. Pra escalar: extrair entry-point próprio + N workers (fila compartilhada no Redis).

**Node single-thread aguenta I/O?** Event loop + libuv: I/O não-bloqueante. Só CPU pesada síncrona trava.

**Por que 202 e não 200?** 202 = "aceitei, vou processar"; o trabalho real acontece depois. 200 implicaria conclusão.

---

## "O que melhoraria?" (ter 3-4 na ponta da língua)

1. **HMAC** no webhook (verificar assinatura da origem).
2. **Testes** (integração com supertest + testcontainers pro Redis).
3. **Conexão dedicada do worker** + `concurrency` explícita.
4. **Observabilidade**: logger estruturado (pino), métricas, Bull Board.
5. **Colisão de `jobId`** se `__` aparecer no id → separador impossível ou hash.
6. **Dead Letter Queue** pra falhas definitivas.

---

## Mapa de arquivos

| Arquivo | Responsabilidade |
| --- | --- |
| `src/utils/server.ts` | Entry-point: API + worker + graceful shutdown |
| `src/config/env.ts` | Validação Zod das envs (fail-fast) |
| `src/schemas/violation.schema.ts` | `ViolationPayload` (Zod) |
| `src/queues/redis.ts` | Conexão ioredis singleton |
| `src/queues/takedown.queue.ts` | Queue + defaultJobOptions + `buildTakedownJobId` |
| `src/queues/idempotency.ts` | Lock atômico Redis (`SET NX EX`) |
| `src/workers/takedown.worker.ts` | fetch + AbortController + eventos |
| `src/controllers/webhook.controller.ts` | `POST /webhook/violation` |
| `src/controllers/jobs.controller.ts` | `GET /jobs/:id` |
| `src/middlewares/{validate,error}.middleware.ts` | Validação + handler global |
| `src/utils/AppError.ts` | Erro operacional com `statusCode` |
