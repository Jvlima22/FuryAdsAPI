# Testes via Insomnia — Fury Ads API

Documento de validação manual da API contra o **Desafio Técnico FURY · Click Hero**.
Cada teste abaixo cobre um requisito específico do enunciado e descreve **request → resposta esperada → o que o teste prova**.

---

## 0. Pré-requisitos

Antes de começar os testes:

```bash
# 1. Subir o Redis local (porta 6380 no host)
docker compose up -d redis

# 2. Conferir se o Redis respondeu
docker exec fury-ads-redis redis-cli ping
# -> PONG

# 3. Subir a API + worker em modo dev
npm run dev
```

Saída esperada no terminal:

```
API rodando na porta 3000 [development]
Worker "takedown" iniciado — alvo HTTP: https://jsonplaceholder.typicode.com/posts/1
```

> Se a porta `3000` estiver ocupada, defina `PORT` no `.env`.
> Se já houver Redis em `6379`, o `docker-compose.yml` mapeia para `6380` justamente para evitar conflito.

---

## 1. Configurando o Insomnia

1. Abra o Insomnia → **Create** → **Request Collection** → nome: `Fury Ads API`.
2. Crie um **Environment** (`Manage Environments` → `Base Environment`):
   ```json
   {
     "base_url": "http://localhost:3000"
   }
   ```
3. Crie as requests abaixo dentro da coleção. Em todas que tiverem corpo, use **Body → JSON**.

---

## 2. Mapeamento Desafio → Teste

| # | Requisito do desafio | Teste |
| --- | --- | --- |
| R1 | API sobe e responde | [Teste 1 — Health Check](#teste-1--health-check) |
| R2 | Webhook recebe POST e enfileira job | [Teste 2 — Enfileirar takedown (happy path)](#teste-2--enfileirar-takedown-happy-path) |
| R3 | Worker chama HTTP externo (JSONPlaceholder) | [Teste 3 — Consultar job concluído](#teste-3--consultar-job-conclu%C3%ADdo) |
| R4 | Endpoint `GET /jobs/:id` retorna status | [Teste 3](#teste-3--consultar-job-conclu%C3%ADdo) + [Teste 4](#teste-4--job-inexistente) |
| R5 | Zod valida payload e retorna 400 com erros detalhados | [Testes 5–8](#teste-5--payload-vazio) |
| R6 | Idempotência (mesmo `adId+tenantId` ≠ 2 jobs simultâneos) | [Teste 9](#teste-9--idempot%C3%AAncia-409) |
| R7 | Retry com backoff exponencial (máx 3) | [Teste 10](#teste-10--retry-com-backoff-exponencial) |
| R8 | Tipagem TS consistente / lint | [Teste 11](#teste-11--lint--build-fora-do-insomnia) |

---

## Teste 1 — Health check

**Prova R1**: a API está no ar.

- **Método**: `GET`
- **URL**: `{{ base_url }}/health`
- **Body**: nenhum

**Resposta esperada (`200 OK`)**:
```json
{
  "status": "ok",
  "env": "development",
  "ts": "2026-05-22T12:00:00.000Z"
}
```

**Imagem do teste:**

![Teste 1 — Health check](https://res.cloudinary.com/ditlmzgrh/image/upload/v1779475106/teste_1_oeqqa6.png)

---

## Teste 2 — Enfileirar takedown (happy path)

**Prova R2 + R3 (lado HTTP)**: o webhook aceita um payload válido, enfileira o job e responde `202`.

- **Método**: `POST`
- **URL**: `{{ base_url }}/webhook/violation`
- **Headers**: `Content-Type: application/json`
- **Body (JSON)**:
```json
{
  "adId": "ad-001",
  "tenantId": "tenant-001",
  "violationType": "PROHIBITED_TERM",
  "severity": "HIGH",
  "detectedAt": "2026-05-22T12:00:00.000Z"
}
```

**Resposta esperada (`202 Accepted`)**:
```json
{
  "status": "enqueued",
  "jobId": "tenant-001__ad-001"
}
```

**No terminal da API**, você verá algo como:
```
[worker] takedown attempt=1/3 tenant=tenant-001 ad=ad-001 type=PROHIBITED_TERM severity=HIGH
[worker] completed job=tenant-001__ad-001 status=200 duration=312ms
```

> **Por que `tenant-001__ad-001`**: o jobId é construído a partir de `tenantId + "__" + adId` para garantir idempotência (ver Teste 9).

**Imagens do teste:**

![Teste 2 — POST /webhook/violation → 202](https://res.cloudinary.com/ditlmzgrh/image/upload/v1779475106/teste_2_qzyioz.png)

![Teste 2.1 — log do worker](https://res.cloudinary.com/ditlmzgrh/image/upload/v1779475427/teste_2.1_egfbvb.png)

---

## Teste 3 — Consultar job concluído

**Prova R4**: o `GET /jobs/:id` retorna o formato exigido `{ jobId, status, attempts, result, error }`.

- **Método**: `GET`
- **URL**: `{{ base_url }}/jobs/tenant-001__ad-001`

**Resposta esperada (`200 OK`)**:
```json
{
  "jobId": "tenant-001__ad-001",
  "status": "completed",
  "attempts": 1,
  "result": {
    "status": 200,
    "url": "https://jsonplaceholder.typicode.com/posts/1",
    "durationMs": 312
  },
  "error": null
}
```

> O `status` pode aparecer como `waiting`, `active`, `delayed` ou `completed` dependendo de quando você consultar. Se rodar o GET imediatamente após o POST, talvez pegue `active`. Espere ~1s e refaça para ver `completed`.

**Imagem do teste:**

![Teste 3 — GET /jobs/:id (completed)](https://res.cloudinary.com/ditlmzgrh/image/upload/v1779479003/teste_3_o1isls.png)

---

## Teste 4 — Job inexistente

**Prova R4 (erro)**: o endpoint devolve `404` quando o jobId não existe.

- **Método**: `GET`
- **URL**: `{{ base_url }}/jobs/inexistente__123`

**Resposta esperada (`404 Not Found`)**:
```json
{
  "status": "error",
  "message": "Job não encontrado"
}
```

**Imagem do teste:**

![Teste 4 — GET /jobs/:id (404)](https://res.cloudinary.com/ditlmzgrh/image/upload/v1779475106/teste_4_dlwczm.png)

---

## Teste 5 — Payload vazio

**Prova R5**: Zod barra payload vazio com `400` e lista os campos faltantes.

- **Método**: `POST`
- **URL**: `{{ base_url }}/webhook/violation`
- **Body (JSON)**:
```json
{}
```

**Resposta esperada (`400 Bad Request`)**:
```json
{
  "status": "error",
  "message": "Dados inválidos",
  "errors": {
    "adId": ["Invalid input: expected string, received undefined"],
    "tenantId": ["Invalid input: expected string, received undefined"],
    "violationType": ["Invalid input: expected one of \"PROHIBITED_TERM\"|\"BRAND_VIOLATION\"|\"COMPLIANCE_FAIL\""],
    "severity": ["Invalid input: expected one of \"LOW\"|\"MEDIUM\"|\"HIGH\"|\"CRITICAL\""],
    "detectedAt": ["Invalid input: expected string, received undefined"]
  }
}
```

> As mensagens exatas podem variar com a versão do Zod 4; o que importa é que a chave `errors` retorne **erro detalhado por campo**.

**Imagem do teste:**

![Teste 5 — payload vazio (400)](https://res.cloudinary.com/ditlmzgrh/image/upload/v1779475105/teste_5_scdpaf.png)

---

## Teste 6 — `violationType` inválido

**Prova R5**: enum é validado.

- **Método**: `POST`
- **URL**: `{{ base_url }}/webhook/violation`
- **Body (JSON)**:
```json
{
  "adId": "ad-002",
  "tenantId": "tenant-001",
  "violationType": "ALGO_INVALIDO",
  "severity": "HIGH",
  "detectedAt": "2026-05-22T12:00:00.000Z"
}
```

**Resposta esperada (`400 Bad Request`)** — campo `violationType` listado em `errors`.

**Imagem do teste:**

![Teste 6 — violationType inválido (400)](https://res.cloudinary.com/ditlmzgrh/image/upload/v1779475105/teste_6_ejgr89.png)

---

## Teste 7 — `severity` inválido

- **Body (JSON)**:
```json
{
  "adId": "ad-003",
  "tenantId": "tenant-001",
  "violationType": "BRAND_VIOLATION",
  "severity": "URGENT",
  "detectedAt": "2026-05-22T12:00:00.000Z"
}
```

**Resposta esperada (`400 Bad Request`)** — campo `severity` listado em `errors`.

**Imagem do teste:**

![Teste 7 — severity inválida (400)](https://res.cloudinary.com/ditlmzgrh/image/upload/v1779475104/teste_7_ykkily.png)

---

## Teste 8 — `detectedAt` não-ISO

**Prova R5**: validação de datetime ISO 8601.

- **Body (JSON)**:
```json
{
  "adId": "ad-004",
  "tenantId": "tenant-001",
  "violationType": "COMPLIANCE_FAIL",
  "severity": "LOW",
  "detectedAt": "ontem"
}
```

**Resposta esperada (`400 Bad Request`)** — campo `detectedAt` listado em `errors`.

**Imagem do teste:**

![Teste 8 — detectedAt não-ISO (400)](https://res.cloudinary.com/ditlmzgrh/image/upload/v1779475104/teste_8_qbzenj.png)

---

## Teste 9 — Idempotência (409)

**Prova R6**: o mesmo `adId + tenantId` **não gera dois jobs simultâneos** na fila.

> ⚠️ **Entenda o que está sendo testado.** O enunciado exige que não existam **dois jobs simultâneos** com a mesma chave — ou seja, o `409` aparece **enquanto o job ainda está na fila** (`waiting` / `active` / `delayed`). Assim que o job termina, a chave é liberada de propósito e um novo POST volta a ser aceito (`202`). Esse é o comportamento esperado.
>
> Por isso, com a `TAKEDOWN_TARGET_URL` padrão (`jsonplaceholder.typicode.com`, que responde em ~200 ms), o 1º job geralmente completa antes do 2º POST chegar, e os dois acabam retornando `202`. Para **reproduzir o conflito de forma confiável**, é preciso garantir que o 1º job ainda esteja na fila quando o 2º POST for enviado — o roteiro abaixo faz exatamente isso.

### Preparação — apontar o worker para uma URL lenta

Edite o arquivo `.env` na raiz do projeto e troque temporariamente:

```env
TAKEDOWN_TARGET_URL=https://httpbin.org/delay/5
TAKEDOWN_HTTP_TIMEOUT_MS=10000
```

Reinicie a API com `Ctrl+C` e `npm run dev`. Agora cada job vai demorar ~5 s para terminar, dando tempo de sobra para o 2º POST encontrar o 1º ainda em `active`.

### Passo 9.1 — Enviar a primeira requisição

- **Método**: `POST`
- **URL**: `{{ base_url }}/webhook/violation`
- **Body (JSON)**:
```json
{
  "adId": "ad-dup",
  "tenantId": "tenant-001",
  "violationType": "PROHIBITED_TERM",
  "severity": "CRITICAL",
  "detectedAt": "2026-05-22T12:00:00.000Z"
}
```

**Resposta esperada (`202 Accepted`)**:
```json
{
  "status": "enqueued",
  "jobId": "tenant-001__ad-dup"
}
```

No terminal da API você verá:
```
[worker] takedown attempt=1/3 tenant=tenant-001 ad=ad-dup ...
```
(e o `completed` só aparece ~5 s depois).

### Passo 9.2 — Reenviar a mesma request **dentro dos próximos 5 segundos**

Clique em **Send** no Insomnia uma 2ª vez, **sem alterar nada**, antes do log `[worker] completed ...` aparecer.

**Resposta esperada (`409 Conflict`)**:
```json
{
  "status": "duplicate",
  "message": "Já existe um job em andamento para este tenantId+adId",
  "jobId": "tenant-001__ad-dup",
  "state": "active"
}
```

> O campo `state` pode aparecer como `waiting`, `active` ou `delayed` dependendo de em qual fase do ciclo o job está quando o 2º POST chega. Qualquer um desses três valores confirma o conflito.

### Passo 9.3 — Após o job terminar, o mesmo POST volta a ser aceito

Espere o log `[worker] completed job=tenant-001__ad-dup ...` aparecer no terminal (~5 s após o passo 9.1) e dispare o **mesmo POST** uma 3ª vez.

**Resposta esperada (`202 Accepted`)** — `jobId: "tenant-001__ad-dup"` novamente.

> Isso **não é regressão**: o requisito do desafio é "não simultâneos". Como o job anterior já saiu da fila, não há mais conflito. Se quisesse idempotência histórica (bloquear para sempre), o enunciado teria pedido explicitamente — e ele avisa que "ambiguidade proposital não faz parte deste desafio".

### Limpeza

Restaure o `.env` ao valor original e reinicie a API:

```env
TAKEDOWN_TARGET_URL=https://jsonplaceholder.typicode.com/posts/1
TAKEDOWN_HTTP_TIMEOUT_MS=5000
```

**Imagens do teste:**

![Teste 9 — visão geral](https://res.cloudinary.com/ditlmzgrh/image/upload/v1779475104/teste_9_m5fhpe.png)

![Teste 9.1 — 1º POST (202)](https://res.cloudinary.com/ditlmzgrh/image/upload/v1779475104/teste_9.1_mcsszj.png)

![Teste 9.2 — 2º POST simultâneo (409)](https://res.cloudinary.com/ditlmzgrh/image/upload/v1779475104/teste_9.2_sh3xce.png)

![Teste 9.3 — POST após conclusão (202)](https://res.cloudinary.com/ditlmzgrh/image/upload/v1779475104/teste_9.3_bjsqlh.png)

![Teste 9.4 — extra](https://res.cloudinary.com/ditlmzgrh/image/upload/v1779476006/teste_9.4_lkbufw.png)

---

## Teste 10 — Retry com backoff exponencial

**Prova R7**: o worker tenta no máximo 3 vezes com backoff exponencial.

### Passo 10.1 — Forçar uma falha

Edite o `.env` (ou exporte temporariamente). Escolha **uma** das opções abaixo:

```env
# Opção A — força HTTP 500 (precisa de acesso de saída para httpstat.us)
TAKEDOWN_TARGET_URL=https://httpstat.us/500

# Opção B — força falha de rede sem depender de internet
# (nada escutando nessa porta = ECONNREFUSED em todas as tentativas)
TAKEDOWN_TARGET_URL=http://localhost:9999
```

> Use a Opção B se sua rede bloqueia o `httpstat.us` (proxy corporativo, firewall, etc.). O teste prova o requisito **R7** do mesmo jeito — o que importa é o worker tentar 3 vezes e terminar em `failed`, independente da causa.

Reinicie a API (`npm run dev`).

### Passo 10.2 — Disparar um webhook

- **Método**: `POST`
- **URL**: `{{ base_url }}/webhook/violation`
- **Body (JSON)**:
```json
{
  "adId": "ad-fail",
  "tenantId": "tenant-001",
  "violationType": "BRAND_VIOLATION",
  "severity": "HIGH",
  "detectedAt": "2026-05-22T12:00:00.000Z"
}
```

**No terminal**, observe 3 tentativas com delays crescentes (~1s, ~2s, ~4s):

```
[worker] takedown attempt=1/3 ...
[worker] failed job=tenant-001__ad-fail attempt=1/3 error="..."
[worker] takedown attempt=2/3 ...
[worker] failed job=tenant-001__ad-fail attempt=2/3 error="..."
[worker] takedown attempt=3/3 ...
[worker] failed job=tenant-001__ad-fail attempt=3/3 error="..."
```

### Passo 10.3 — Consultar o status final

- **Método**: `GET`
- **URL**: `{{ base_url }}/jobs/tenant-001__ad-fail`

**Resposta esperada (`200 OK`)** — o formato é fixo; o conteúdo de `error` varia conforme o tipo de falha:

```json
{
  "jobId": "tenant-001__ad-fail",
  "status": "failed",
  "attempts": 3,
  "result": null,
  "error": "<mensagem da falha>"
}
```

Possíveis valores para o campo `error`, todos válidos e provam o mesmo R7:

| Cenário | Mensagem em `error` |
| --- | --- |
| Opção A funcionou (httpstat.us respondeu 500) | `"HTTP 500 ao chamar https://httpstat.us/500"` |
| Opção A foi bloqueada pela rede (DNS/firewall/proxy) | `"fetch failed"` |
| Opção B (porta local sem listener) | `"fetch failed"` |
| Variante de timeout (ver abaixo) | `"Timeout (2000ms) ao chamar ..."` |

> O que **prova** o requisito é o par `status: "failed"` + `attempts: 3` — ou seja, o worker tentou o máximo permitido e desistiu. A string em `error` é só o motivo da última tentativa.

> **Não esqueça** de restaurar `TAKEDOWN_TARGET_URL=https://jsonplaceholder.typicode.com/posts/1` depois do teste.

### Variante: testar timeout

Exponha um endpoint propositalmente lento e force o `AbortController`:

```env
TAKEDOWN_TARGET_URL=https://httpbin.org/delay/10
TAKEDOWN_HTTP_TIMEOUT_MS=2000
```

A mensagem de erro final será: `Timeout (2000ms) ao chamar https://httpbin.org/delay/10`.

**Imagens do teste:**

![Teste 10 — visão geral (POST → 202)](https://res.cloudinary.com/ditlmzgrh/image/upload/v1779479187/teste_10_lyaqhh.png)

![Teste 10.2 — POST disparando o job](https://res.cloudinary.com/ditlmzgrh/image/upload/v1779479382/teste_10.2_ugyx9y.png)

![Teste 10.3 — GET /jobs/:id (failed, attempts: 3, error: fetch failed)](https://res.cloudinary.com/ditlmzgrh/image/upload/v1779475104/teste_10.2_hgrry9.png)

![Teste 10 — log do worker (3 tentativas, fetch failed)](https://res.cloudinary.com/ditlmzgrh/image/upload/v1779475104/teste_10.1_phipig.png)

![Teste 10 — variante de timeout (3 tentativas com Timeout 2000ms)](https://res.cloudinary.com/ditlmzgrh/image/upload/v1779476648/teste_10.3_xill5n.png)

---

## Teste 11 — Lint + build (fora do Insomnia)

**Prova R8**: tipagem e padrões de código.

```bash
npm run lint     # eslint deve passar sem erros
npm run build    # tsc deve compilar para dist/
```

Ambos devem terminar com exit code `0`.

**Imagens do teste:**

![Teste 11 — npm run lint](https://res.cloudinary.com/ditlmzgrh/image/upload/v1779475104/teste_11_wbdmwl.png)

![Teste 11.1 — npm run build](https://res.cloudinary.com/ditlmzgrh/image/upload/v1779475104/teste_11.1_j36mq9.png)

---

## 3. Roteiro sugerido (ordem dos testes)

Para uma validação rápida ponta-a-ponta:

1. **Teste 1** — confirma que a API e o worker estão de pé.
2. **Testes 5, 6, 7, 8** — validam a camada Zod (todos `400` com `errors` por campo).
3. **Teste 4** — `GET /jobs/inexistente` → `404`.
4. **Teste 2** — `POST` válido → `202`.
5. **Teste 3** — `GET /jobs/tenant-001__ad-001` → `completed`, `attempts: 1`.
6. **Teste 9** — repete o `POST` rápido o suficiente para ver `409`.
7. **Teste 10** — troca `TAKEDOWN_TARGET_URL` para uma URL que retorna 500 e observa 3 retries com backoff exponencial → `failed`.
8. **Teste 11** — `npm run lint && npm run build` no terminal.

---

## 4. Conferência final do desafio

| Item do desafio | Onde está no código | Teste que prova |
| --- | --- | --- |
| Node.js + TypeScript, sem `any` | `tsconfig.json` (`strict: true`), todos os arquivos `src/**/*.ts` | Teste 11 |
| Webhook POST | `src/routes/webhook.routes.ts`, `src/controllers/webhook.controller.ts` | Teste 2 |
| Validação Zod | `src/schemas/violation.schema.ts`, `src/middlewares/validate.middleware.ts` | Testes 5–8 |
| `400` com erros detalhados | `src/middlewares/error.middleware.ts` (branch `ZodError`) | Testes 5–8 |
| BullMQ + Redis | `src/queues/redis.ts`, `src/queues/takedown.queue.ts` | Testes 2, 3 |
| Chamada HTTP externa (JSONPlaceholder) | `src/workers/takedown.worker.ts` (linha do `fetch`) | Teste 3 |
| Retry exponencial (máx 3) | `defaultJobOptions` em `src/queues/takedown.queue.ts` | Teste 10 |
| Idempotência `adId + tenantId` | `buildTakedownJobId` + `acquireLock` (`src/queues/idempotency.ts`) | Teste 9 |
| `GET /jobs/:id` com `{ jobId, status, attempts, result, error }` | `src/controllers/jobs.controller.ts` | Testes 3, 4 |
| README com instruções | `README.md` | — |

Se todos os testes acima passarem, o projeto está **fiel ao enunciado** e pronto para entrega no formulário.
