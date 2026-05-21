

| FURY · Click Hero Desafio Técnico — Full Stack Pleno  |
| :---- |

| CONTEXTO |
| :---- |

Você está sendo avaliado para uma posição de Full Stack Pleno no projeto FURY — um gestor autônomo de tráfego pago movido a IA. Uma das funcionalidades centrais do produto é a integração com a Meta Ads API: nosso sistema precisa buscar dados de anúncios, processá-los e enfileirar ações automaticamente.

Este desafio simula uma tarefa real do Sprint 1 do projeto.

| O DESAFIO |
| :---- |

**Objetivo**

Construir uma mini-API em Node.js \+ TypeScript que:

* Receba um webhook POST simulando uma notificação de anúncio com violação

* Valide o payload recebido com Zod

* Enfileire um job de 'takedown' usando BullMQ

* O worker desse job deve fazer uma chamada HTTP externa para simular a integração com a Meta API. Use a API pública JSONPlaceholder (https://jsonplaceholder.typicode.com/posts/1) como endpoint substituto — ela existe apenas para testar o fluxo HTTP (sucesso, falha, retry). Não é necessário validar ou mapear o conteúdo da resposta, apenas tratar corretamente os cenários de sucesso (2xx) e falha (4xx/5xx ou timeout)

* Exponha um endpoint GET /jobs/:id que retorne o status atual do job na fila

**Payload do webhook (POST /webhook/violation)**

| {  "adId": "string (obrigatório)",  "tenantId": "string (obrigatório)",  "violationType": "PROHIBITED\_TERM | BRAND\_VIOLATION | COMPLIANCE\_FAIL",  "severity": "LOW | MEDIUM | HIGH | CRITICAL",  "detectedAt": "ISO 8601 datetime"} |
| :---- |

**Requisitos técnicos**

* TypeScript com tipagem consistente — sem any espalhado

* Zod para validação do payload — retornar 400 com erros detalhados se inválido

* BullMQ \+ Redis (pode usar Redis local via Docker ou Upstash free tier)

* O worker deve tratar falhas: retry automático com backoff exponencial (máx 3 tentativas)

* Idempotência: o mesmo adId \+ tenantId não deve gerar dois jobs simultâneos na fila

* Endpoint GET /jobs/:id retornando: { jobId, status, attempts, result, error }

* README com instruções claras para rodar o projeto localmente

| REGRAS E ENTREGA |
| :---- |

* Prazo: até domingo às 20h

* Entrega: preencha o formulário em [https://forms.gle/SzsmQo2JJVX1AfJ57](https://forms.gle/SzsmQo2JJVX1AfJ57) com o link do seu repositório público no GitHub

* Pode e deve usar Claude Code com a IDE de sua preferência — faça isso naturalmente como no seu dia a dia

* Não é necessário autenticação, banco de dados ou front-end

* Foque em qualidade de código, não em quantidade de features

*Em caso de dúvidas sobre o enunciado, entre em contato antes de assumir. Ambiguidade proposital não faz parte deste desafio.*