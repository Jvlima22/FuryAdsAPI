# Plan: Fury Ads — Glassmorphism Frontend

## Resumo
Construir um frontend em TanStack Start + React + Tailwind v4 com estilo Glassmorphism para a **Fury Ads API**. A paleta escolhida foi **Cyber Ocean** (fundo `#03061f`, azul `#0a2a6e`, ciano `#2dd4ff`, roxo `#7c3aed`).

## Páginas / Rotas

1. **Dashboard de Métricas** (`/dashboard`) — Página principal.
   - Filtros lateral/superior: `from`, `to`, plataforma (`Google Ads` / `Meta Ads`), `customerId`.
   - Cards de resumo glassmorphism com 6 KPIs (Impressões, Cliques, Custo, Conversões, CTR, CPC).
   - Gráficos de linha e barra (recharts).
   - Tabela paginada de `CampaignMetrics`.
2. **Violações** (`/violations`) — Lista e detalhes de violações.
   - Tabela com colunas: `adId`, `platform`, `violationType`, `severity`, `detectedAt`.
   - Filtros por severity e type.
   - Modal glassmorphism com detalhes completos do `ViolationPayload`.
3. **Status de Jobs** (`/jobs`) — Consulta simples.
   - Campo de busca por `jobId`.
   - Card glassmorphism exibindo status (`waiting`, `active`, `completed`, `failed`).

## Design System (Glassmorphism Cyber Ocean)

- **Background**: gradiente radial sutil `#03061f` → `#0a2a6e`.
- **Cards glass**: `background: rgba(255,255,255,0.05)`, `backdrop-filter: blur(16px)`, bordas semi-transparentes `rgba(255,255,255,0.1)`, `box-shadow` sutil.
- **Acentos**: Ciano `#2dd4ff` para dados/CTAs, Roxo `#7c3aed` para badges e destaques secundários.
- **Tipografia**: Fonte moderna — Space Grotesk (headings) + DM Sans (body).
- **Animações**: Framer Motion para entrada suave dos cards e transições de página.

## Arquitetura

- `src/routes/dashboard.tsx` — Layout com sidebar + conteúdo.
- `src/routes/violations.tsx` — Página de violações.
- `src/routes/jobs.tsx` — Consulta de jobs.
- `src/routes/index.tsx` — Redireciona para `/dashboard`.
- `src/components/glass-card.tsx` — Componente reutilizável de card glassmorphism.
- `src/components/sidebar.tsx` — Navegação lateral glassmorphism.
- `src/lib/api.ts` — Funções server para chamadas mock (ainda sem backend real).

## Dados

Como a API real da Fury Ads não está conectada, usaremos **dados mock** para demonstrar a interface completa:
- Mock de `CampaignMetrics` com valores realistas.
- Mock de `ViolationPayload`.
- Mock de status de jobs.

## Dependências

- `framer-motion` (animações)
- `recharts` (gráficos)
- `lucide-react` (já presente, ícones)
- `@fontsource/space-grotesk`, `@fontsource/dm-sans` (tipografia)

## SEO / Metadados

Cada rota terá `head()` com título e descrição únicos. Nenhuma reindexação global necessária nesta fase.