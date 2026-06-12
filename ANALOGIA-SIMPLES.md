# A História do Mural Mágico 🪧

Uma forma simples de explicar a Fury Ads API — tão fácil que uma criança entende.
No fim tem uma tabela ligando a história ao sistema de verdade.

---

## A história

Imagina um **mural gigante** numa praça, cheio de **cartazes** (os anúncios).
Quase todos são legais. Mas, de vez em quando, alguém prega um **cartaz proibido** — que quebra as regras.

Tem um **guarda** que fica de olho. Quando ele vê um cartaz proibido, ele escreve um **bilhete**:

> "O cartaz tal está proibido. Por favor, tirem ele do mural!"

E coloca o bilhete numa **caixinha mágica** na parede.

---

### 1. A caixinha responde na hora ⚡

Assim que o guarda coloca o bilhete, a caixinha entrega um **ticket com um número** e diz:

> "Recebi! Pode deixar que eu cuido. Aqui está seu número pra acompanhar."

O guarda **não precisa ficar esperando** o cartaz ser tirado — ele já volta a vigiar o mural.
(👉 Isso é responder rápido, sem travar ninguém.)

### 2. Os bilhetes entram numa fila 🎫

Os bilhetes não somem: eles entram numa **fila**, um atrás do outro, esperando a vez.

### 3. O ajudante faz o trabalho 🧹

Tem um **ajudante** que pega os bilhetes da fila, **um por um**, e vai até o mural **arrancar o cartaz proibido**.

### 4. E se o cartaz estiver grudado? 🔁

Às vezes o cartaz está **muito grudado** e não sai de primeira.
O ajudante **não desiste na hora**: ele espera um pouquinho e tenta de novo.

- Primeiro espera **1 segundinho** e tenta.
- Se não sair, espera **um pouco mais** (2 segundos) e tenta.
- Depois espera **mais ainda** (4 segundos).

Se depois de **3 tentativas** não sair mesmo, ele anota: "não consegui" — pra alguém olhar depois.
(👉 Esperar cada vez mais entre as tentativas evita ficar puxando feito doido.)

### 5. Dois guardas, o mesmo cartaz 👮👮

E se **dois guardas** virem o **mesmo cartaz** ao mesmo tempo e escreverem dois bilhetes?

A caixinha é esperta: quando o primeiro bilhete chega, ela cola uma **etiqueta** dizendo:

> "Esse cartaz já está sendo resolvido!"

Aí, quando o segundo bilhete chega, ela responde:

> "Calma, já estamos cuidando desse!"

Assim **nunca mandamos dois ajudantes** tirar o mesmo cartaz. Um só basta.
(👉 Isso é não fazer o mesmo trabalho duas vezes.)

### 6. "Já tiraram meu cartaz?" 🔎

O guarda guardou o **número do ticket**. A qualquer momento ele pode perguntar:

> "E aí, o cartaz número tal — já foi tirado? Ainda na fila? Deu algum problema?"

E a caixinha responde o que está acontecendo.

---

## A mágica em 1 frase

> A caixinha **recebe o pedido na hora**, guarda numa **fila**, e um **ajudante** resolve depois — **tentando de novo** se falhar e **sem repetir** trabalho. Quem pediu pode **acompanhar** pelo número.

---

## De onde vem a história ↔ o sistema de verdade

| Na história 🪧 | No sistema real 💻 |
| --- | --- |
| O cartaz proibido | Um anúncio em violação |
| O guarda que avisa | O sistema externo que detecta a violação |
| O bilhete na caixinha | O **webhook** `POST /webhook/violation` |
| "Recebi! Aqui seu número" | Resposta **202** + `jobId` |
| A fila de bilhetes | A **fila do BullMQ** (no Redis) |
| O ajudante | O **worker** |
| Arrancar o cartaz | Chamar a API de **takedown** (via HTTP) |
| Esperar e tentar de novo | **Retry com backoff** (1s, 2s, 4s) |
| Desistir após 3 vezes | `attempts: 3` |
| A etiqueta "já estou cuidando" | **Lock de idempotência** no Redis |
| "Calma, já estamos cuidando" | Resposta **409** (duplicado) |
| "Já tiraram meu cartaz?" | `GET /jobs/:id` (consulta de status) |

---

## Dica pra apresentar

1. Conte a **história do mural** primeiro (sem termos técnicos).
2. Depois diga: *"Agora, traduzindo pro código..."* e mostre a **tabela**.
3. Finalize com a **frase mágica** — é o resumo que gruda na cabeça.
