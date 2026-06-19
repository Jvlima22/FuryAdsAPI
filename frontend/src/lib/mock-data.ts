import { PLATFORM_DATA_KEY, type BrandKey, type AdAccount } from "./accounts";

export type CampaignMetrics = {
  campaignId: string;
  campaignName: string;
  status: "ENABLED" | "PAUSED" | "REMOVED";
  impressions: number;
  clicks: number;
  costMicros: number;
  conversions: number;
  ctr: number;
  averageCpcMicros: number;
};

export type ViolationPayload = {
  adId: string;
  tenantId: string;
  platform: "google-ads" | "meta-ads";
  violationType: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  detectedAt: string;
  /** Campanha de origem — usada para puxar a evidência (criativo) exata. */
  campaignId: string;
};

export type JobStatus = {
  id: string;
  status: "waiting" | "active" | "completed" | "failed";
  progress: number;
  createdAt: string;
  durationMs?: number;
  result?: string;
};

export type ComplianceStatus = "ok" | "warning" | "critical";

export type AdComment = {
  id: string;
  author: string;
  avatar: string;
  text: string;
  at: string;
  toxic?: boolean;
};

export type AdCreative = {
  adId: string;
  platform: "google-ads" | "meta-ads";
  brand: string;
  headline: string;
  body: string;
  callToAction: string;
  image: string;
  likes: number;
  comments: number;
  shares: number;
  engagementScore: number; // 0-100
  compliance: ComplianceStatus;
  violation?: { type: string; severity: ViolationPayload["severity"]; message: string };
  recentComments: AdComment[];
};

export const mockCampaigns: CampaignMetrics[] = [
  { campaignId: "c-001", campaignName: "Black Friday — Search BR", status: "ENABLED", impressions: 1284500, clicks: 42310, costMicros: 18420000000, conversions: 1842, ctr: 0.0329, averageCpcMicros: 435000 },
  { campaignId: "c-002", campaignName: "Brand Awareness — Meta", status: "ENABLED", impressions: 982120, clicks: 21440, costMicros: 9240000000, conversions: 612, ctr: 0.0218, averageCpcMicros: 431000 },
  { campaignId: "c-003", campaignName: "Remarketing Carrinho", status: "PAUSED", impressions: 142300, clicks: 8910, costMicros: 2180000000, conversions: 489, ctr: 0.0626, averageCpcMicros: 244000 },
  { campaignId: "c-004", campaignName: "Performance Max — Geral", status: "ENABLED", impressions: 2104900, clicks: 71220, costMicros: 28330000000, conversions: 2890, ctr: 0.0338, averageCpcMicros: 397000 },
  { campaignId: "c-005", campaignName: "Lead Gen — Instagram", status: "ENABLED", impressions: 612300, clicks: 18240, costMicros: 6810000000, conversions: 412, ctr: 0.0298, averageCpcMicros: 373000 },
  { campaignId: "c-006", campaignName: "Display — Awareness", status: "REMOVED", impressions: 89400, clicks: 1220, costMicros: 980000000, conversions: 34, ctr: 0.0136, averageCpcMicros: 803000 },

  // ── Vintech (wine-tech SaaS) ──────────────────────────────────────────────
  { campaignId: "cv-001", campaignName: "Vinícolas — Search BR", status: "ENABLED", impressions: 412800, clicks: 18940, costMicros: 9870000000, conversions: 742, ctr: 0.0459, averageCpcMicros: 521000 },
  { campaignId: "cv-002", campaignName: "Trial SaaS — Lookalike", status: "ENABLED", impressions: 638200, clicks: 21330, costMicros: 7420000000, conversions: 689, ctr: 0.0334, averageCpcMicros: 348000 },
  { campaignId: "cv-003", campaignName: "Importadoras de Vinho — Search", status: "ENABLED", impressions: 184500, clicks: 9120, costMicros: 5310000000, conversions: 318, ctr: 0.0494, averageCpcMicros: 582000 },
  { campaignId: "cv-004", campaignName: "Webinar Gestão de Adega — Leads", status: "ENABLED", impressions: 296700, clicks: 12480, costMicros: 4120000000, conversions: 564, ctr: 0.0421, averageCpcMicros: 330000 },
  { campaignId: "cv-005", campaignName: "Demonstração Plataforma — PMax", status: "ENABLED", impressions: 921400, clicks: 28760, costMicros: 12640000000, conversions: 1124, ctr: 0.0312, averageCpcMicros: 439000 },
  { campaignId: "cv-006", campaignName: "Awareness — Do terroir aos dados", status: "PAUSED", impressions: 158900, clicks: 4210, costMicros: 1890000000, conversions: 96, ctr: 0.0265, averageCpcMicros: 449000 },

  // ── TGL Solutions (automação + IA sob medida) ─────────────────────────────
  { campaignId: "ct-001", campaignName: "Automação Empresarial — Search BR", status: "ENABLED", impressions: 348200, clicks: 16720, costMicros: 11240000000, conversions: 612, ctr: 0.0480, averageCpcMicros: 672000 },
  { campaignId: "ct-002", campaignName: "Diagnóstico Gratuito — Lookalike", status: "ENABLED", impressions: 712400, clicks: 24180, costMicros: 8160000000, conversions: 814, ctr: 0.0339, averageCpcMicros: 337000 },
  { campaignId: "ct-003", campaignName: "Agentes de IA — Performance Max", status: "ENABLED", impressions: 1042600, clicks: 33410, costMicros: 16980000000, conversions: 1286, ctr: 0.0320, averageCpcMicros: 508000 },
  { campaignId: "ct-004", campaignName: "Agende uma Call — Leads", status: "ENABLED", impressions: 284900, clicks: 11260, costMicros: 4480000000, conversions: 498, ctr: 0.0395, averageCpcMicros: 398000 },
  { campaignId: "ct-005", campaignName: "Consultoria de Processos — Search", status: "ENABLED", impressions: 162300, clicks: 7840, costMicros: 4920000000, conversions: 261, ctr: 0.0483, averageCpcMicros: 627000 },
  { campaignId: "ct-006", campaignName: "Reconhecimento — IA sob medida", status: "PAUSED", impressions: 198400, clicks: 5120, costMicros: 2210000000, conversions: 118, ctr: 0.0258, averageCpcMicros: 431000 },

  // ── Lumen Store (e-commerce de eletrônicos · Google) ──────────────────────
  { campaignId: "cl-001", campaignName: "Black Friday — Search BR", status: "ENABLED", impressions: 1324500, clicks: 43210, costMicros: 18920000000, conversions: 1902, ctr: 0.0326, averageCpcMicros: 437000 },
  { campaignId: "cl-002", campaignName: "Performance Max — Catálogo", status: "ENABLED", impressions: 2154900, clicks: 72120, costMicros: 28930000000, conversions: 2940, ctr: 0.0335, averageCpcMicros: 401000 },
  { campaignId: "cl-003", campaignName: "Shopping — Eletrônicos", status: "ENABLED", impressions: 884200, clicks: 31440, costMicros: 12180000000, conversions: 1488, ctr: 0.0356, averageCpcMicros: 387000 },
  { campaignId: "cl-004", campaignName: "Remarketing Carrinho — Display", status: "PAUSED", impressions: 162300, clicks: 9210, costMicros: 2240000000, conversions: 512, ctr: 0.0568, averageCpcMicros: 243000 },

  // ── Atlas Travel (viagens e turismo · Google) ─────────────────────────────
  { campaignId: "ca-001", campaignName: "Pacotes Caribe — Search BR", status: "ENABLED", impressions: 512800, clicks: 19840, costMicros: 11870000000, conversions: 642, ctr: 0.0387, averageCpcMicros: 598000 },
  { campaignId: "ca-002", campaignName: "Passagens Aéreas — PMax", status: "ENABLED", impressions: 1021400, clicks: 33760, costMicros: 15640000000, conversions: 1124, ctr: 0.0331, averageCpcMicros: 463000 },
  { campaignId: "ca-003", campaignName: "Hotéis All Inclusive — Search", status: "ENABLED", impressions: 284500, clicks: 11120, costMicros: 7310000000, conversions: 398, ctr: 0.0391, averageCpcMicros: 657000 },
  { campaignId: "ca-004", campaignName: "Remarketing Destinos — Display", status: "PAUSED", impressions: 142900, clicks: 5210, costMicros: 1690000000, conversions: 186, ctr: 0.0365, averageCpcMicros: 324000 },

  // ── Aura Cosmetics (skincare e beleza · Meta) ─────────────────────────────
  { campaignId: "cu-001", campaignName: "Skincare Premium — Vendas", status: "ENABLED", impressions: 982120, clicks: 28440, costMicros: 9240000000, conversions: 812, ctr: 0.0290, averageCpcMicros: 325000 },
  { campaignId: "cu-002", campaignName: "Lançamento Sérum — Conversões", status: "ENABLED", impressions: 712300, clicks: 22240, costMicros: 6810000000, conversions: 624, ctr: 0.0312, averageCpcMicros: 306000 },
  { campaignId: "cu-003", campaignName: "Lookalike Compradoras — Leads", status: "ENABLED", impressions: 438200, clicks: 14180, costMicros: 4120000000, conversions: 489, ctr: 0.0324, averageCpcMicros: 290000 },
  { campaignId: "cu-004", campaignName: "Reconhecimento — Vídeo Beleza", status: "PAUSED", impressions: 198400, clicks: 4210, costMicros: 1290000000, conversions: 64, ctr: 0.0212, averageCpcMicros: 306000 },
];

/** Prefixo de id de campanha por marca (escopa o conjunto do dashboard). */
const BRAND_PREFIX: Record<BrandKey, string> = {
  lumen: "cl-",
  atlas: "ca-",
  aura: "cu-",
  vintech: "cv-",
  tgl: "ct-",
};

/**
 * Campanhas do dashboard escopadas pela marca da conta ativa. Sem `brand`
 * (contas criadas pelo usuário) devolve o conjunto genérico de fallback (c-00x).
 */
export function campaignsForBrand(brand?: BrandKey): CampaignMetrics[] {
  if (brand) {
    const prefix = BRAND_PREFIX[brand];
    return mockCampaigns.filter((c) => c.campaignId.startsWith(prefix));
  }
  return mockCampaigns.filter((c) => /^c-\d/.test(c.campaignId));
}

export const mockTrend = Array.from({ length: 30 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  return {
    iso: d.toISOString().slice(0, 10), // YYYY-MM-DD — usado pelo filtro de data
    date: d.toISOString().slice(5, 10),
    impressions: 80000 + Math.round(Math.sin(i / 2) * 22000 + Math.random() * 18000),
    clicks: 2800 + Math.round(Math.cos(i / 3) * 700 + Math.random() * 600),
    engagement: 1800 + Math.round(Math.sin(i / 1.8) * 600 + Math.random() * 500),
    conversions: 90 + Math.round(Math.sin(i / 1.5) * 30 + Math.random() * 25),
    cost: 1200 + Math.round(Math.cos(i / 2) * 280 + Math.random() * 200),
  };
});

export function campaignTrend(seed: string) {
  const base = Array.from(seed).reduce((a, c) => a + c.charCodeAt(0), 0);
  return Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const wobble = Math.sin((i + base) / 3) * 0.4 + Math.cos((i + base) / 5) * 0.2;
    return {
      date: d.toISOString().slice(5, 10),
      impressions: Math.round(40000 + wobble * 18000 + Math.random() * 8000),
      clicks: Math.round(1400 + wobble * 600 + Math.random() * 300),
      conversions: Math.round(50 + wobble * 25 + Math.random() * 15),
      ctr: +(2.2 + wobble * 1.2).toFixed(2),
    };
  });
}

export const deviceMix = [
  { name: "Mobile", value: 58 },
  { name: "Desktop", value: 31 },
  { name: "Tablet", value: 11 },
];

// ── Violações por conta (derivadas dos próprios criativos da conta) ─────────
//
// Cada conta gera suas violações a partir das SUAS campanhas/criativos: os
// criativos flagrados (compliance ≠ ok) viram violações reais, e algumas
// sintéticas determinísticas (seed = accountId) dão volume + variação de
// severidade/data. A evidência sempre aponta para a campanha de origem
// (`campaignId`), então nenhum dado de outra conta aparece.

const VIOLATION_POOL: { type: string; severity: ViolationPayload["severity"] }[] = [
  { type: "TRADEMARK_INFRINGEMENT", severity: "CRITICAL" },
  { type: "MISLEADING_CLAIM", severity: "HIGH" },
  { type: "COPYRIGHT", severity: "HIGH" },
  { type: "PROHIBITED_PRODUCT", severity: "MEDIUM" },
  { type: "LOW_QUALITY_IMAGE", severity: "LOW" },
  { type: "ADULT_CONTENT", severity: "CRITICAL" },
];

function vSeed(...parts: string[]): number {
  return Array.from(parts.join("|")).reduce((a, c) => a + c.charCodeAt(0), 0);
}

/** mulberry32 determinístico → [0,1). */
function vRng(n: number): number {
  let t = (n + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function shortCode(accountId: string): string {
  const digits = accountId.replace(/\D/g, "");
  return digits.slice(0, 4) || "0000";
}

/** Timestamp determinístico espalhado nos últimos ~30 dias (para o filtro de data). */
function detectedAtFor(accountId: string, idx: number): string {
  const daysAgo = Math.floor(vRng(vSeed(accountId, String(idx), "d")) * 29);
  const minsAgo = Math.floor(vRng(vSeed(accountId, String(idx), "m")) * 1440);
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setMinutes(d.getMinutes() - minsAgo);
  return d.toISOString();
}

/** Violações da conta ativa — escopadas à sua marca/plataforma. */
export function violationsForAccount(account: AdAccount): ViolationPayload[] {
  const platform = PLATFORM_DATA_KEY[account.platform];
  const camps = campaignsForBrand(account.brandKey).filter(
    (c) => getCreative(c.campaignId).platform === platform,
  );
  if (!camps.length) return [];

  const code = shortCode(account.accountId);
  const tenantId = `tnt_${code}`;

  type Slot = { campaignId: string; type: string; severity: ViolationPayload["severity"] };
  const slots: Slot[] = [];

  // 1) Criativos realmente flagrados da conta.
  camps.forEach((c) => {
    const v = getCreative(c.campaignId).violation;
    if (v) slots.push({ campaignId: c.campaignId, type: v.type, severity: v.severity });
  });

  // 2) Sintéticas para dar volume e variar severidade/data (≥6 no total).
  const target = Math.max(6, slots.length + 3);
  for (let i = 0; slots.length < target && i < 60; i++) {
    const c = camps[i % camps.length];
    const pick = VIOLATION_POOL[(vSeed(account.accountId, c.campaignId) + i) % VIOLATION_POOL.length];
    slots.push({ campaignId: c.campaignId, type: pick.type, severity: pick.severity });
  }

  return slots
    .map((s, idx) => ({
      adId: `ad_${code}${String(idx + 1).padStart(2, "0")}`,
      tenantId,
      platform,
      violationType: s.type,
      severity: s.severity,
      detectedAt: detectedAtFor(account.accountId, idx),
      campaignId: s.campaignId,
    }))
    .sort((a, b) => b.detectedAt.localeCompare(a.detectedAt));
}

const commentPool: Omit<AdComment, "id" | "at">[] = [
  { author: "Marina S.", avatar: "MS", text: "Acabei de comprar, entrega rápida demais 🔥" },
  { author: "Rafael L.", avatar: "RL", text: "Esse preço é real mesmo? Parece bom demais." },
  { author: "Júlia P.", avatar: "JP", text: "Vocês entregam em Manaus?" },
  { author: "Diego A.", avatar: "DA", text: "Péssimo atendimento, não recomendo a ninguém.", toxic: true },
  { author: "Carla M.", avatar: "CM", text: "Já é o terceiro que compro, qualidade impecável ❤️" },
  { author: "Bruno T.", avatar: "BT", text: "Cadê o frete grátis prometido?" },
  { author: "Lara F.", avatar: "LF", text: "Amei a estética da campanha!" },
  { author: "Pedro V.", avatar: "PV", text: "Golpe, fugam disso!!", toxic: true },
];

function buildComments(seed: number): AdComment[] {
  const n = 3 + (seed % 3);
  return Array.from({ length: n }).map((_, i) => {
    const c = commentPool[(seed + i) % commentPool.length];
    const d = new Date(Date.now() - (i + 1) * 1000 * 60 * (7 + (seed % 23)));
    return { ...c, id: `cm-${seed}-${i}`, at: d.toISOString() };
  });
}

const creativeSeed: Record<string, { brand: string; headline: string; body: string; cta: string; image: string; platform: "google-ads" | "meta-ads"; compliance: ComplianceStatus; violation?: AdCreative["violation"] }> = {
  "c-001": {
    brand: "Lumen Store", platform: "google-ads", compliance: "ok",
    headline: "Black Friday começou — até 70% OFF",
    body: "Eletrônicos selecionados com frete grátis para todo o Brasil. Só hoje.",
    cta: "Comprar agora",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80&auto=format&fit=crop",
  },
  "c-002": {
    brand: "Aura Cosmetics", platform: "meta-ads", compliance: "warning",
    headline: "Sua pele merece o melhor",
    body: "Descubra a nova linha de skincare premium. Resultado em 7 dias.",
    cta: "Saiba mais",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&q=80&auto=format&fit=crop",
    violation: { type: "MISLEADING_CLAIM", severity: "MEDIUM", message: "Termo 'resultado garantido' detectado no copy." },
  },
  "c-003": {
    brand: "Nimbus Wear", platform: "meta-ads", compliance: "ok",
    headline: "Esqueceu algo no carrinho?",
    body: "Volte e finalize com 15% OFF exclusivo para você.",
    cta: "Recuperar carrinho",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80&auto=format&fit=crop",
  },
  "c-004": {
    brand: "Lumen Store", platform: "google-ads", compliance: "ok",
    headline: "Performance Max — multicanal",
    body: "Anúncios automatizados em Search, Display, YouTube e Discover.",
    cta: "Ver ofertas",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80&auto=format&fit=crop",
  },
  "c-005": {
    brand: "Forge Academy", platform: "meta-ads", compliance: "critical",
    headline: "Aprenda marketing em 30 dias",
    body: "Mentoria completa com certificação reconhecida no mercado.",
    cta: "Quero me inscrever",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80&auto=format&fit=crop",
    violation: { type: "PROHIBITED_TERM", severity: "CRITICAL", message: "Promessa de retorno financeiro garantido viola política de Meta Ads." },
  },
  "c-006": {
    brand: "Atlas Travel", platform: "google-ads", compliance: "warning",
    headline: "Pacotes para o Caribe",
    body: "7 dias all inclusive a partir de R$ 4.890.",
    cta: "Reservar",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80&auto=format&fit=crop",
    violation: { type: "BRAND_VIOLATION", severity: "HIGH", message: "Logo de terceiro identificado no criativo." },
  },

  // ── Vintech (wine-tech SaaS) ──────────────────────────────────────────────
  "cv-001": {
    brand: "Vintech", platform: "google-ads", compliance: "ok",
    headline: "Do terroir aos dados",
    body: "A plataforma que conecta sua vinícola da colheita à venda direta.",
    cta: "Agendar demo",
    image: "/claude-designs/vintech/assets/vineyard_aerial.jpg",
  },
  "cv-002": {
    brand: "Vintech", platform: "meta-ads", compliance: "ok",
    headline: "Sua adega no piloto automático",
    body: "Estoque, reservas e wine club num só lugar. Teste 14 dias grátis.",
    cta: "Começar trial",
    image: "/claude-designs/vintech/assets/bottles.jpg",
  },
  "cv-003": {
    brand: "Vintech", platform: "google-ads", compliance: "warning",
    headline: "Gestão completa para importadoras",
    body: "Controle fiscal, logística e precificação de bebidas sem planilha.",
    cta: "Falar com especialista",
    image: "/claude-designs/vintech/assets/wine_products.jpg",
    violation: { type: "MISLEADING_CLAIM", severity: "MEDIUM", message: "Termo 'sem nenhum imposto' detectado — revisar conformidade fiscal." },
  },
  "cv-004": {
    brand: "Vintech", platform: "meta-ads", compliance: "ok",
    headline: "Webinar: o fim da ruptura de estoque",
    body: "Aprenda a prever a demanda da sua carta de vinhos com IA.",
    cta: "Inscrever-se",
    image: "/claude-designs/vintech/assets/hero_winery.jpg",
  },
  "cv-005": {
    brand: "Vintech", platform: "google-ads", compliance: "ok",
    headline: "Venda direto ao consumidor",
    body: "E-commerce D2C de vinhos integrado ao seu estoque em tempo real.",
    cta: "Ver plataforma",
    image: "/claude-designs/vintech/assets/hero-wine.jpg",
  },
  "cv-006": {
    brand: "Vintech", platform: "meta-ads", compliance: "warning",
    headline: "Tecnologia que respeita o terroir",
    body: "Dados que ajudam o enólogo — não que o substituem.",
    cta: "Conhecer",
    image: "/claude-designs/vintech/assets/enotourism.jpg",
    violation: { type: "ALCOHOL_TARGETING", severity: "MEDIUM", message: "Segmentação de bebida alcoólica exige restrição de faixa etária (18+)." },
  },

  // ── TGL Solutions (automação + IA sob medida) ─────────────────────────────
  "ct-001": {
    brand: "TGL Solutions", platform: "google-ads", compliance: "ok",
    headline: "Sua empresa não precisa de mais um site",
    body: "Precisa de automação sob medida. A gente resolve isso — de verdade.",
    cta: "Diagnóstico grátis",
    image: "/creatives/tgl/ct-001.svg",
  },
  "ct-002": {
    brand: "TGL Solutions", platform: "meta-ads", compliance: "ok",
    headline: "Pare de depender da memória da recepcionista",
    body: "Automatize o que trava sua operação. Sem mais planilha desatualizada.",
    cta: "Agendar diagnóstico",
    image: "/creatives/tgl/ct-002.svg",
  },
  "ct-003": {
    brand: "TGL Solutions", platform: "google-ads", compliance: "critical",
    headline: "Agentes de IA que trabalham 24/7",
    body: "Atendimento, vendas e backoffice no automático com IA sob medida.",
    cta: "Quero saber mais",
    image: "/creatives/tgl/ct-003.svg",
    violation: { type: "MISLEADING_CLAIM", severity: "CRITICAL", message: "'Substitui 100% da sua equipe' viola política de alegações exageradas." },
  },
  "ct-004": {
    brand: "TGL Solutions", platform: "meta-ads", compliance: "ok",
    headline: "30 minutos podem mudar sua operação",
    body: "Mapeamos seus gargalos e mostramos onde a IA economiza horas.",
    cta: "Agendar call",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=80&auto=format&fit=crop",
  },
  "ct-005": {
    brand: "TGL Solutions", platform: "google-ads", compliance: "ok",
    headline: "Do caos no caderno ao processo digital",
    body: "Digitalizamos e automatizamos seus processos sob medida.",
    cta: "Falar com a TGL",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80&auto=format&fit=crop",
  },
  "ct-006": {
    brand: "TGL Solutions", platform: "meta-ads", compliance: "warning",
    headline: "IA de verdade, não enrolação",
    body: "Soluções sob medida que pagam o próprio investimento.",
    cta: "Conhecer cases",
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=1200&q=80&auto=format&fit=crop",
    violation: { type: "PROHIBITED_TERM", severity: "HIGH", message: "Promessa de retorno financeiro ('paga o próprio investimento') requer disclaimer." },
  },

  // ── Lumen Store (e-commerce de eletrônicos) ───────────────────────────────
  "cl-001": {
    brand: "Lumen Store", platform: "google-ads", compliance: "ok",
    headline: "Black Friday começou — até 70% OFF",
    body: "Eletrônicos selecionados com frete grátis para todo o Brasil. Só hoje.",
    cta: "Comprar agora",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80&auto=format&fit=crop",
  },
  "cl-002": {
    brand: "Lumen Store", platform: "google-ads", compliance: "ok",
    headline: "Performance Max — multicanal",
    body: "Anúncios automatizados em Search, Display, YouTube e Discover.",
    cta: "Ver ofertas",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&q=80&auto=format&fit=crop",
  },
  "cl-003": {
    brand: "Lumen Store", platform: "google-ads", compliance: "warning",
    headline: "Fones bluetooth com 50% OFF",
    body: "Cancelamento de ruído e 30h de bateria. Estoque limitado.",
    cta: "Aproveitar",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80&auto=format&fit=crop",
    violation: { type: "MISLEADING_CLAIM", severity: "MEDIUM", message: "Termo 'menor preço do Brasil garantido' não comprovado no criativo." },
  },
  "cl-004": {
    brand: "Lumen Store", platform: "google-ads", compliance: "ok",
    headline: "Esqueceu algo no carrinho?",
    body: "Volte e finalize com 15% OFF exclusivo para você.",
    cta: "Recuperar carrinho",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1200&q=80&auto=format&fit=crop",
  },

  // ── Atlas Travel (viagens e turismo) ──────────────────────────────────────
  "ca-001": {
    brand: "Atlas Travel", platform: "google-ads", compliance: "warning",
    headline: "Pacotes para o Caribe",
    body: "7 dias all inclusive a partir de R$ 4.890.",
    cta: "Reservar",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80&auto=format&fit=crop",
    violation: { type: "BRAND_VIOLATION", severity: "HIGH", message: "Logo de companhia aérea de terceiro identificado no criativo." },
  },
  "ca-002": {
    brand: "Atlas Travel", platform: "google-ads", compliance: "ok",
    headline: "Passagens aéreas a partir de R$ 199",
    body: "Voos nacionais e internacionais com parcelamento em até 12x.",
    cta: "Buscar voos",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80&auto=format&fit=crop",
  },
  "ca-003": {
    brand: "Atlas Travel", platform: "google-ads", compliance: "ok",
    headline: "Hotéis all inclusive sem pegadinha",
    body: "Diárias com tudo incluso e cancelamento grátis até 24h antes.",
    cta: "Ver hotéis",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80&auto=format&fit=crop",
  },
  "ca-004": {
    brand: "Atlas Travel", platform: "google-ads", compliance: "ok",
    headline: "Ainda pensando naquela viagem?",
    body: "O destino que você pesquisou está com preço especial esta semana.",
    cta: "Retomar busca",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80&auto=format&fit=crop",
  },

  // ── Aura Cosmetics (skincare e beleza) ────────────────────────────────────
  "cu-001": {
    brand: "Aura Cosmetics", platform: "meta-ads", compliance: "warning",
    headline: "Sua pele merece o melhor",
    body: "Descubra a nova linha de skincare premium. Resultado em 7 dias.",
    cta: "Saiba mais",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&q=80&auto=format&fit=crop",
    violation: { type: "MISLEADING_CLAIM", severity: "MEDIUM", message: "Termo 'resultado garantido em 7 dias' detectado no copy." },
  },
  "cu-002": {
    brand: "Aura Cosmetics", platform: "meta-ads", compliance: "ok",
    headline: "Novo sérum de vitamina C",
    body: "Glow natural e uniformização do tom em uma rotina simples.",
    cta: "Comprar",
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=1200&q=80&auto=format&fit=crop",
  },
  "cu-003": {
    brand: "Aura Cosmetics", platform: "meta-ads", compliance: "ok",
    headline: "Rotina de autocuidado em 3 passos",
    body: "Limpeza, tratamento e hidratação com a linha Aura completa.",
    cta: "Montar kit",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80&auto=format&fit=crop",
  },
  "cu-004": {
    brand: "Aura Cosmetics", platform: "meta-ads", compliance: "critical",
    headline: "Apague as rugas para sempre",
    body: "Efeito clínico comprovado — substitui o botox de verdade.",
    cta: "Quero agora",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&q=80&auto=format&fit=crop",
    violation: { type: "PROHIBITED_TERM", severity: "CRITICAL", message: "Alegação médica ('substitui botox', 'para sempre') viola política de saúde/beleza." },
  },
};

export function getCreative(campaignId: string): AdCreative {
  const s = creativeSeed[campaignId] ?? creativeSeed["c-001"];
  const c = mockCampaigns.find((x) => x.campaignId === campaignId) ?? mockCampaigns[0];
  const seed = Array.from(campaignId).reduce((a, ch) => a + ch.charCodeAt(0), 0);
  const likes = Math.round(c.clicks * (0.18 + (seed % 7) / 100));
  const comments = Math.round(likes * 0.12);
  const shares = Math.round(likes * 0.06);
  return {
    adId: `ad_${seed}`,
    platform: s.platform,
    brand: s.brand,
    headline: s.headline,
    body: s.body,
    callToAction: s.cta,
    image: s.image,
    likes, comments, shares,
    engagementScore: Math.min(100, Math.round((likes + comments * 3 + shares * 5) / (c.impressions / 1000))),
    compliance: s.compliance,
    violation: s.violation,
    recentComments: buildComments(seed),
  };
}

export function mockJob(id: string): JobStatus {
  const statuses: JobStatus["status"][] = ["waiting", "active", "completed", "failed"];
  const hash = Array.from(id).reduce((a, c) => a + c.charCodeAt(0), 0);
  const status = statuses[hash % statuses.length];
  return {
    id,
    status,
    progress: status === "completed" ? 100 : status === "active" ? 64 : status === "waiting" ? 0 : 42,
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    durationMs: status === "completed" ? 8420 : undefined,
    result: status === "completed" ? "Takedown executed successfully" : status === "failed" ? "Platform returned 403 — auth expired" : undefined,
  };
}

export function formatMicros(micros: number) {
  return (micros / 1000000).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatNumber(n: number) {
  return n.toLocaleString("pt-BR");
}

export function formatCompact(n: number) {
  return Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}
