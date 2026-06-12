# Roteiro de Estudo — Entrevista Fury Ads API

Guia para explicar o conceito e a implementação do desafio, com banco de perguntas técnicas, pontos de melhoria e fundamentos.

**Stack:** Node.js 20+ · TypeScript (strict, CommonJS) · Express 5 · BullMQ + ioredis · Zod 4 · `fetch` nativo

---

## PARTE 1 — Pitch (abertura em ~1 min)

> "É uma mini-API em Node + TypeScript que simula o pipeline de _takedown_ de anúncios em violação. Um sistema externo (ex: detector de violação da Meta) manda um **webhook** `POST /webhook/violation`. A API **valida o payload com Zod**, **enfileira um job no BullMQ** (que usa Redis) e responde **202 Accepted** na hora — ela não espera o takedown acontecer. Um **worker** consome a fila de forma assíncrona, chama a API externa de takedown via HTTP com **timeout e retry/backoff exponencial**, e o cliente acompanha o resultado por `GET /jobs/:id`. Garanto **idempotência** (o mesmo anúncio não gera dois takedowns simultâneos) com um `jobId` determinístico + um lock atômico no Redis."

**Os 4 pilares a plantar na cabeça do entrevistador:**
- **Assíncrono** (fila)
- **Resiliente** (retry / backoff / timeout)
- **Idempotente**
- **Validado/tipado** (Zod + TS strict)

---

## PARTE 2 — Explicação conceito-a-conceito (siga o caminho de uma requisição)

A melhor forma de explicar "como fiz": narrar o ciclo de vida de uma violação.

### 1. Entrada e validação (`routes` → `validate.middleware` → `violation.schema`)
- A rota `POST /webhook/violation` passa por um middleware `validate(violationPayloadSchema, 'body')` **antes** do controller.
- O Zod valida `adId`, `tenantId`, `violationType` (enum), `severity` (enum) e `detectedAt` (ISO 8601). Se falhar, o middleware chama `next(error)` e o erro vira **400** no handler global.
- Detalhe: depois de validar, o middleware **sobrescreve `req.body` com o dado parseado** (`result.data`), então transforms do Zod já chegam aplicados no controller.

### 2. Idempotência + enfileiramento (`webhook.controller` → `idempotency` → `takedown.queue`)
- Monto um `jobId` determinístico: `${tenantId}__${adId}`.
- Adquiro um **lock atômico no Redis** (`SET NX EX`). Se não conseguir o lock → já tem job em andamento → respondo **409**.
- Se conseguir: removo um job "stale" (completed/failed) de mesmo ID se existir, **enfileiro** com `add('takedown', payload, { jobId })`, e respondo **202** com o `jobId`.
- Se o `add` falhar, **libero o lock** pra não travar o ID.

### 3. Processamento assíncrono (`takedown.worker`)
- O `Worker` consome a fila `takedown`. Para cada job, chama `TAKEDOWN_TARGET_URL` via `fetch` nativo com **`AbortController`** controlando o **timeout**.
- Se a resposta não for 2xx, ou estourar o timeout, **lança exceção** → o BullMQ aciona o **retry com backoff exponencial**.
- Eventos: em `completed` libero o lock; em `failed` só libero o lock quando **esgotaram as tentativas**.

### 4. Consulta de status (`jobs.controller`)
- `GET /jobs/:id` busca o job no BullMQ e devolve `status` (estado), `attempts`, `result` (returnvalue) e `error` (failedReason). Se não existir → **404** via `AppError`.

### 5. Infra transversal
- `config/env.ts`: valida envs no boot com Zod, **`exit(1)` se inválidas** (fail-fast).
- `redis.ts`: conexão ioredis única, `maxRetriesPerRequest: null`.
- `server.ts`: sobe API + worker no mesmo processo + **graceful shutdown** (SIGINT/SIGTERM fecham server, worker, queue e conexão Redis).
- `error.middleware.ts`: handler global — ZodError→400, AppError→statusCode próprio, resto→500.

---

## PARTE 3 — Banco de perguntas técnicas (com respostas)

### A. Filas / BullMQ

**P1. Por que usar uma fila aqui em vez de fazer o takedown direto no handler do webhook?**
Porque o takedown é uma operação lenta, externa e que pode falhar. Se fosse síncrono: (a) o webhook ficaria pendurado esperando a API externa, e quem dispara webhook geralmente tem timeout curto e re-tenta se você demora; (b) uma falha transitória perderia o evento. Com fila eu **desacoplo** o recebimento do processamento — respondo `202` em milissegundos, e ganho **durabilidade** (o job fica no Redis), **retry/backoff** e a capacidade de **escalar workers** independente da API.

**P2. O que é o BullMQ e o que ele usa por baixo?**
É uma biblioteca de filas para Node baseada em **Redis**. Usa estruturas do Redis (listas, sorted sets, hashes) e scripts Lua para operações atômicas. Componentes: `Queue` (produz jobs), `Worker` (consome), `QueueEvents` (eventos), e os `Job` com estados.

**P3. Quais são os estados de um job no BullMQ?**
`waiting` (na fila), `active` (sendo processado), `delayed` (aguardando — ex: entre retries no backoff), `completed`, `failed`, `paused`, e em fluxos `waiting-children`/`prioritized`. No projeto trato `waiting/active/delayed/completed/failed` e caio em `unknown` como fallback.

**P4. Onde está configurado o retry e por que ali?**
No `defaultJobOptions` da `Queue` (`takedown.queue.ts`): `attempts: 3`, `backoff: { type: 'exponential', delay: 1000 }`. Fica **na fila e não no worker** porque é uma política do job, não da lógica de processamento. O worker só precisa **lançar uma exceção** — o BullMQ decide se re-tenta e quando.

**P5. Como funciona o backoff exponencial com delay 1000?**
A espera entre tentativas cresce exponencialmente: ~1s, depois ~2s, depois ~4s (`delay * 2^(tentativa)`). Evita martelar a API externa que pode estar instável. Entre tentativas o job fica em `delayed`.

**P6. `removeOnComplete`/`removeOnFail` — para que servem?**
Housekeeping pra não encher o Redis. Mantenho completed por 1h (ou até 1000 jobs) e failed por 24h (mais tempo, pra investigar falhas). Sem isso o Redis cresceria indefinidamente.

### B. Idempotência (provavelmente o tópico mais explorado)

**P7. O enunciado pede que o mesmo `adId+tenantId` não gere dois jobs simultâneos. Como você resolveu?**
Duas camadas:
1. **`jobId` determinístico** (`tenantId__adId`): o BullMQ não cria duas vezes um job com o mesmo `jobId` enquanto ele existir.
2. **Lock atômico no Redis** (`SET key 1 NX EX ttl`): fecho a janela de corrida entre `getJob` e `add` quando duas requisições chegam ao mesmo tempo.

**P8. Se o BullMQ já deduplica por `jobId`, por que precisa do lock?**
Por causa de uma **race condition**. Duas requisições concorrentes poderiam ambas passar pela verificação e tentar enfileirar quase ao mesmo tempo — e o dedup do BullMQ silenciosamente ignora o segundo `add` (não dá erro), então **ambas responderiam 202** sem que eu conseguisse distinguir o duplicado pra devolver **409**. O `SET NX` é **atômico**: só uma requisição ganha o lock, a outra recebe `409` de forma determinística.

**P9. Por que você remove o job "stale" antes de re-enfileirar?**
Porque o BullMQ **não recria** um job com `jobId` já existente — mesmo se ele já estiver `completed`/`failed`. Se um anúncio violou, foi processado, e **depois viola de novo**, eu preciso reprocessar. Então removo a instância antiga concluída e adiciono uma nova com o mesmo ID. Isso acontece **dentro do lock**, então é seguro.

**P10. Quando o lock é liberado?**
- Em `completed`: libero imediatamente.
- Em `failed`: só libero quando `attemptsMade >= max` (esgotou retries). **Entre retries o lock é mantido** — senão uma nova requisição entraria no meio do retry e criaria confusão.
- Tem também um **TTL de segurança** (`timeout * maxAttempts + 30s`): se o worker morrer sem liberar, o lock expira sozinho e o ID não fica preso pra sempre.

**P11. Esse lock é um lock distribuído robusto? Quais limitações?**
É um lock simples baseado em `SET NX EX` — suficiente pra um único Redis. Limitação clássica: o `releaseLock` é um `DEL` puro, **não verifica dono** (não usa token + script Lua compare-and-delete como o Redlock). Num cenário extremo (lock expira por TTL, outro processo readquire, e o primeiro tenta liberar) eu poderia deletar o lock de outro. Em produção com múltiplos Redis usaria **Redlock** ou um delete condicional via Lua. Pro escopo do desafio (um Redis), está adequado.

### C. Worker / HTTP / resiliência

**P12. Como implementou o timeout da chamada HTTP?**
`fetch` nativo não tem opção de timeout, então uso **`AbortController`**: crio um `setTimeout` que chama `controller.abort()` após `TAKEDOWN_HTTP_TIMEOUT_MS`, e passo `signal: controller.signal` no fetch. Se abortar, o fetch rejeita com `AbortError`, que eu transformo numa mensagem de timeout clara. Sempre faço `clearTimeout` no `finally`.

**P13. Por que `await response.text()` mesmo sem usar o body?**
Pra **consumir/drenar o body e liberar o socket** da conexão. Se você não lê o corpo, o socket pode ficar preso até o GC, vazando conexões sob carga.

**P14. O que faz o worker re-tentar?**
Qualquer **exceção lançada** dentro do processor. No meu caso: resposta HTTP não-2xx (`!response.ok`) e timeout (AbortError). O BullMQ captura a exceção, incrementa `attemptsMade` e reagenda com backoff até `attempts`.

**P15. Por que `fetch` nativo em vez de axios?**
Node 20+ tem `fetch` estável (undici) — **menos dependências**, menos superfície de manutenção. Pro que preciso (um GET com timeout) é suficiente.

### D. Validação / tipagem / Zod

**P16. Por que validar variáveis de ambiente com Zod no startup?**
**Fail-fast**: se faltar/estiver errada uma env, o processo morre no boot com `exit(1)` em vez de quebrar em runtime no meio de uma requisição. E o `env` exportado fica **tipado** (number já transformado de string), então o resto do código consome com segurança de tipos.

**P17. As envs chegam como string. Como vira number?**
Com `.transform(Number)` / `.transform(v => Number(v))` no schema do Zod. `process.env` é sempre string; o transform converte e o tipo inferido já vira `number`.

**P18. Como o erro de validação do payload vira 400?**
O `validate` middleware faz `safeParse`; se falhar, `next(result.error)` (um `ZodError`). No `errorHandler` global, `err instanceof ZodError` → responde **400** com `errors: err.flatten().fieldErrors` (campo→mensagens).

### E. Express / arquitetura / erros

**P19. Como está organizada a aplicação?**
Camadas: **routes** (mapeiam URL→handler) → **middlewares** (validação) → **controllers** (orquestram) → **queues/workers** (infra de fila). Schemas (Zod) e config isolados. É uma separação de responsabilidades clássica que facilita testar e evoluir.

**P20. Como funciona o tratamento de erros centralizado?**
Um único `errorHandler` registrado por último (`app.use(errorHandler)`). Controllers usam `try/catch` e `next(err)`. O handler distingue: `ZodError`→400, `AppError`→`statusCode` próprio, e qualquer outro→500 genérico (sem vazar stack pro cliente). Isso evita repetir tratamento de erro em todo handler.

**P21. Para que serve o `AppError`?**
Distinguir **erros operacionais esperados** (404 job não encontrado, 409 duplicata) de **bugs/erros inesperados** (500). Carrego `statusCode` e `isOperational`, e o handler usa isso pra responder o status certo.

**P22. (Pegadinha Express 5) Você precisa do try/catch nos controllers async?**
Express 5 passou a **encaminhar automaticamente** promises rejeitadas de handlers async pro error handler. Então o try/catch é parcialmente redundante — mas eu mantive **explícito** pra controlar exatamente o que faço antes de propagar (ex: liberar o lock no `webhook.controller` antes do `throw`). É uma escolha de clareza/controle.

### F. Redis / conexão / processo

**P23. Por que `maxRetriesPerRequest: null` na conexão?**
É **exigência do BullMQ**. Workers usam **comandos bloqueantes** do Redis (tipo `BZPOPMIN`) pra esperar jobs. Com um limite finito de retentativas por request, o ioredis lançaria erro nesses comandos de longa duração. `null` desabilita esse limite.

**P24. Você compartilha uma conexão entre Queue e Worker. Isso é ok?**
Funciona e simplifica o desafio. Porém a recomendação do BullMQ é que o **Worker** tenha conexão dedicada, porque comandos bloqueantes podem "ocupar" a conexão. Em produção eu **duplicaria a conexão** (`connection.duplicate()`) pro worker. Bom ponto de melhoria.

**P25. O que é graceful shutdown e por que importa numa app com fila?**
Ao receber SIGINT/SIGTERM eu fecho o `server` (para de aceitar requests), o `worker` (termina o job em andamento antes de morrer), a `queue` e a conexão Redis. Sem isso, matar o processo no meio de um job deixaria jobs "stalled" e conexões penduradas. Garante encerramento limpo em deploys/restart.

**P26. Worker no mesmo processo da API — prós e contras?**
**Pró**: simplicidade — um comando sobe tudo, ideal pro escopo "mini-API". **Contra**: não escala separadamente e CPU do worker compete com a API. Pra escalar, eu extrairia `startTakedownWorker()` num entry-point próprio e rodaria N workers independentes (a fila no Redis é compartilhada).

### G. TypeScript / tooling

**P27. O que `strict: true` te dá?**
Liga várias checagens: `strictNullChecks`, `noImplicitAny`, etc. Pega `undefined`/`null` em tempo de compilação, evitando uma classe inteira de bugs. Combina com o Zod: valido a borda (runtime) e o TS garante o resto (compile-time).

**P28. Por que CommonJS e não ESM?**
Escolha de compatibilidade/simplicidade pro ecossistema Node atual. O `tsconfig` compila pra `module: CommonJS`, `target: ES2022`. `tsx` roda direto o TS em dev (watch).

---

## PARTE 4 — Pontos fracos / "o que você melhoraria?"

Tenha 3-4 na ponta da língua — mostra maturidade:

1. **Segurança do webhook**: hoje não valido autenticidade. Webhooks reais precisam de **verificação de assinatura HMAC** (header tipo `X-Signature`) pra garantir que veio mesmo da origem. Adicionaria isso.
2. **Testes**: o `test` é placeholder. Adicionaria testes de integração (supertest na API) e unitários do worker/idempotência, com Redis em container (testcontainers).
3. **Conexão dedicada do worker** (ver P24) e **`concurrency`** explícita no Worker pra processar N jobs em paralelo.
4. **Observabilidade**: hoje é `console.log`. Usaria logger estruturado (pino) com `correlationId`, métricas (Prometheus) e o **Bull Board** (dashboard da fila).
5. **Colisão de `jobId`**: se `tenantId` ou `adId` puderem conter `__`, o separador colide. Usaria um separador impossível ou hash.
6. **Dead Letter Queue**: jobs que falharam definitivamente poderiam ir pra uma fila de "falhas" pra reprocessamento manual/alertas.
7. **`detectedAt` é validado mas não usado** — poderia priorizar jobs por severidade/idade.

---

## PARTE 5 — Perguntas conceituais amplas (fundamentos)

**P29. O Node é single-thread. Como ele aguenta I/O concorrente (várias chamadas HTTP no worker)?**
Pelo **event loop** + libuv. Operações de I/O são não-bloqueantes: o Node dispara a operação e continua; quando o I/O termina, o callback/promise é agendado. Então uma chamada HTTP "esperando" não trava o processo. O que trava é **CPU pesada síncrona**.

**P30. Diferença entre processamento síncrono e baseado em fila/mensageria?**
Síncrono: requisição espera a resposta completa, acoplamento temporal forte. Fila: produtor e consumidor são **desacoplados no tempo**; ganha resiliência (retry, durabilidade), absorção de picos (buffer) e escala independente. Custo: complexidade e **consistência eventual** (o resultado não é imediato).

**P31. O que é idempotência e por que webhooks exigem isso?**
Idempotente = executar a mesma operação N vezes tem o mesmo efeito de executar 1 vez. Webhooks frequentemente fazem **retries** (a origem reenvia se não recebe 2xx rápido), então o mesmo evento chega duplicado. Sem idempotência você dispararia dois takedowns pro mesmo anúncio.

**P32. Por que responder 202 e não 200?**
**202 Accepted** = "recebi e vou processar, mas ainda não terminei". É semanticamente correto pra processamento assíncrono — o trabalho real (takedown) acontece depois, e o cliente acompanha por `GET /jobs/:id`. 200 implicaria que já concluí.

**P33. O que acontece se o worker cair no meio de um job?**
O job fica **`active`** sem progredir. O BullMQ tem detecção de **stalled jobs**: se o lock interno do job não é renovado dentro de `lockDuration`, ele considera "stalled" e **reprocessa** (até `maxStalledCount`). Além disso meu **lock de idempotência tem TTL**, então não fica preso. É por isso que jobs idealmente são idempotentes também no lado do efeito.

**P34. Como você escalaria isso pra milhões de webhooks/dia?**
Separar worker da API; rodar **N réplicas de worker** (a fila no Redis distribui); ajustar `concurrency`; **rate limiting** no Worker pra respeitar limites da API externa; Redis em cluster/gerenciado; e possivelmente particionar filas por severidade (CRITICAL processa antes).

---

## Prioridade de estudo

Se o tempo for curto: domine **PARTE 2 (o fluxo)**, depois **B (idempotência)** e **A (filas/retry)** — é onde o desafio concentra a "graça" e onde o entrevistador vai cavar. As perguntas **C** (timeout/AbortController) e **F** (Redis/graceful shutdown) são o segundo nível de profundidade.

---

## Mapa rápido de arquivos (para localizar na hora)

| Arquivo | Responsabilidade |
| --- | --- |
| `src/utils/server.ts` | Entry-point: API + worker + graceful shutdown |
| `src/config/env.ts` | Validação Zod das envs (fail-fast, exit 1) |
| `src/schemas/violation.schema.ts` | `ViolationPayload` (Zod) |
| `src/queues/redis.ts` | Conexão ioredis singleton |
| `src/queues/takedown.queue.ts` | `Queue` + `defaultJobOptions` (attempts, backoff) + `buildTakedownJobId` |
| `src/queues/idempotency.ts` | Lock atômico Redis (`SET NX EX`) + TTL |
| `src/workers/takedown.worker.ts` | Processa job: fetch + AbortController + eventos completed/failed |
| `src/controllers/webhook.controller.ts` | `POST /webhook/violation` (lock + enqueue) |
| `src/controllers/jobs.controller.ts` | `GET /jobs/:id` |
| `src/middlewares/validate.middleware.ts` | `validate(schema, source)` |
| `src/middlewares/error.middleware.ts` | Handler global (Zod→400, AppError, 500) |
| `src/utils/AppError.ts` | Erro operacional com `statusCode` |
