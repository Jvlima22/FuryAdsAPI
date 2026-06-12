/**
 * Campaign-management mock layer — modelo de árvore NATIVO por plataforma.
 *
 * Fluxos nativos separados: Google e Meta têm hierarquias diferentes e o modelo
 * reflete isso fielmente em vez de forçar uma abstração:
 *
 *   Google:  Campaign(googleType, bidStrategy, geoTargets) → AdGroup[] → Keyword[]
 *   Meta:    Campaign(objective, budgetMode)              → AdSet[](targeting:
 *                                                           geo, demografia,
 *                                                           interesses, públicos)
 *
 * Escopo por conta: tudo é gerado de forma determinística a partir de
 * (campanha/entidade, conta ativa) — trocar de conta no switcher muda os dados.
 * As EDIÇÕES/CRIAÇÕES do usuário vivem no `manage-store` (localStorage), que
 * materializa esta árvore na 1ª leitura e depois é a fonte da verdade.
 */
import { accountScale, type AccountPlatform, type AdAccount, type BrandKey } from "./accounts";
import { formatMicros } from "./mock-data";

export type ManagePlatform = AccountPlatform; // "GOOGLE_ADS" | "META_ADS"
export type EntityStatus = "ENABLED" | "PAUSED" | "REMOVED";
export type MatchType = "EXACT" | "PHRASE" | "BROAD";
export type AudienceType = "interest" | "lookalike" | "custom" | "remarketing";

// Google
export type GoogleChannelType = "SEARCH" | "PERFORMANCE_MAX" | "DISPLAY" | "SHOPPING" | "DEMAND_GEN";
export type GoogleBidStrategy =
  | "MAXIMIZE_CLICKS"
  | "MAXIMIZE_CONVERSIONS"
  | "MAXIMIZE_CONVERSION_VALUE"
  | "TARGET_CPA"
  | "TARGET_ROAS"
  | "MANUAL_CPC";

// Meta
export type MetaObjective =
  | "OUTCOME_SALES"
  | "OUTCOME_LEADS"
  | "OUTCOME_ENGAGEMENT"
  | "OUTCOME_AWARENESS"
  | "OUTCOME_TRAFFIC"
  | "OUTCOME_APP_PROMOTION";
export type MetaBidStrategy = "LOWEST_COST" | "COST_CAP" | "BID_CAP";
export type MetaOptimizationGoal =
  | "OFFSITE_CONVERSIONS"
  | "LINK_CLICKS"
  | "LANDING_PAGE_VIEWS"
  | "LEAD_GENERATION"
  | "REACH"
  | "IMPRESSIONS";
export type MetaBudgetMode = "CBO" | "ABO";

export type GeoKind = "country" | "region" | "city" | "radius";
export type GeoTarget = {
  id: string;
  kind: GeoKind;
  name: string;
  reach: number;
  excluded: boolean;
};

export type Demographics = {
  ageMin: number;
  ageMax: number; // 65 = 65+
  genders: ("male" | "female")[]; // vazio = todos
  devices: ("MOBILE" | "DESKTOP" | "TABLET")[]; // vazio = todos
};

export type Metrics = {
  impressions: number;
  clicks: number;
  costMicros: number;
  conversions: number;
};

export type Keyword = Metrics & {
  id: string;
  text: string;
  matchType: MatchType;
  status: EntityStatus;
  qualityScore: number; // 1-10, 0 = sem dados
};

export type Audience = Metrics & {
  id: string;
  name: string;
  type: AudienceType;
  status: EntityStatus;
  sizeEstimate: number;
};

export type AdGroup = Metrics & {
  id: string;
  name: string;
  status: EntityStatus;
  defaultCpcMicros: number;
  keywords: Keyword[];
};

export type AdSet = Metrics & {
  id: string;
  name: string;
  status: EntityStatus;
  budgetDailyMicros: number; // usado quando a campanha é ABO
  optimizationGoal: MetaOptimizationGoal;
  bidStrategy: MetaBidStrategy;
  geoTargets: GeoTarget[];
  demographics: Demographics;
  interests: string[];
  audiences: Audience[];
};

export type Campaign = Metrics & {
  id: string;
  platform: ManagePlatform;
  name: string;
  status: EntityStatus;
  channelType: string; // rótulo legível (display)
  budgetDailyMicros: number;
  spentTodayMicros: number;
  ctr: number;
  averageCpcMicros: number;
  // Google
  googleType?: GoogleChannelType;
  googleBidStrategy?: GoogleBidStrategy;
  geoTargets: GeoTarget[]; // Google: nível de campanha (Meta usa vazio aqui)
  adGroups: AdGroup[];
  // Meta
  objective?: MetaObjective;
  budgetMode?: MetaBudgetMode;
  metaBidStrategy?: MetaBidStrategy;
  adSets: AdSet[];
};

// Compat: nome antigo usado em imports espalhados.
export type ManagedCampaign = Campaign;

// ── Theming / rótulos ───────────────────────────────────────────────────────

export const entityStatusMeta: Record<EntityStatus, { label: string; cls: string; dot: string }> = {
  ENABLED: { label: "Ativa", cls: "border-emerald-200 text-emerald-700 bg-emerald-50", dot: "bg-emerald-500" },
  PAUSED: { label: "Pausada", cls: "border-amber-200 text-amber-700 bg-amber-50", dot: "bg-amber-500" },
  REMOVED: { label: "Removida", cls: "border-zinc-200 text-zinc-500 bg-zinc-50", dot: "bg-zinc-400" },
};

export const matchTypeMeta: Record<MatchType, { label: string; cls: string }> = {
  EXACT: { label: "Exata", cls: "border-violet/30 text-violet bg-violet/5" },
  PHRASE: { label: "Frase", cls: "border-cyan/30 text-cyan bg-cyan/5" },
  BROAD: { label: "Ampla", cls: "border-zinc-200 text-zinc-600 bg-zinc-50" },
};

export const audienceTypeMeta: Record<AudienceType, { label: string; cls: string }> = {
  interest: { label: "Interesse", cls: "border-cyan/30 text-cyan bg-cyan/5" },
  lookalike: { label: "Lookalike", cls: "border-violet/30 text-violet bg-violet/5" },
  custom: { label: "Personalizado", cls: "border-amber-200 text-amber-700 bg-amber-50" },
  remarketing: { label: "Remarketing", cls: "border-emerald-200 text-emerald-700 bg-emerald-50" },
};

export const googleChannelMeta: Record<GoogleChannelType, string> = {
  SEARCH: "Rede de Pesquisa",
  PERFORMANCE_MAX: "Performance Max",
  DISPLAY: "Display",
  SHOPPING: "Shopping",
  DEMAND_GEN: "Demand Gen",
};

export const googleBidMeta: Record<GoogleBidStrategy, string> = {
  MAXIMIZE_CLICKS: "Maximizar cliques",
  MAXIMIZE_CONVERSIONS: "Maximizar conversões",
  MAXIMIZE_CONVERSION_VALUE: "Maximizar valor de conv.",
  TARGET_CPA: "CPA desejado",
  TARGET_ROAS: "ROAS desejado",
  MANUAL_CPC: "CPC manual",
};

export const metaObjectiveMeta: Record<MetaObjective, string> = {
  OUTCOME_SALES: "Vendas",
  OUTCOME_LEADS: "Cadastros (leads)",
  OUTCOME_ENGAGEMENT: "Engajamento",
  OUTCOME_AWARENESS: "Reconhecimento",
  OUTCOME_TRAFFIC: "Tráfego",
  OUTCOME_APP_PROMOTION: "Promoção de app",
};

export const metaBidMeta: Record<MetaBidStrategy, string> = {
  LOWEST_COST: "Menor custo",
  COST_CAP: "Limite de custo",
  BID_CAP: "Limite de lance",
};

export const metaOptGoalMeta: Record<MetaOptimizationGoal, string> = {
  OFFSITE_CONVERSIONS: "Conversões",
  LINK_CLICKS: "Cliques no link",
  LANDING_PAGE_VIEWS: "Views da landing",
  LEAD_GENERATION: "Geração de leads",
  REACH: "Alcance",
  IMPRESSIONS: "Impressões",
};

export const geoKindMeta: Record<GeoKind, string> = {
  country: "País",
  region: "Região/Estado",
  city: "Cidade",
  radius: "Raio",
};

// ── Geração determinística ──────────────────────────────────────────────────

function seed(...parts: string[]): number {
  return Array.from(parts.join("|")).reduce((a, c) => a + c.charCodeAt(0), 0);
}

/** PRNG determinístico (mulberry32). */
function rng(n: number): number {
  let t = (n + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function synthMetrics(base: number, i: number, scale: number): Metrics {
  const impressions = Math.round((300 + rng(base + i * 131) * 4700) * scale);
  const ctr = 0.008 + rng(base + i * 977) * 0.06;
  const clicks = Math.max(0, Math.round(impressions * ctr));
  const cpcMicros = Math.round(70_000 + rng(base + i * 53) * 520_000);
  const costMicros = clicks * cpcMicros;
  const conversions = Math.round(clicks * rng(base + i * 17) * 0.08);
  return { impressions, clicks, costMicros, conversions };
}

function sumMetrics(items: Metrics[]): Metrics {
  return items.reduce(
    (a, m) => ({
      impressions: a.impressions + m.impressions,
      clicks: a.clicks + m.clicks,
      costMicros: a.costMicros + m.costMicros,
      conversions: a.conversions + m.conversions,
    }),
    { impressions: 0, clicks: 0, costMicros: 0, conversions: 0 },
  );
}

const KEYWORD_POOL = [
  "tênis de corrida", "comprar tênis online", "tênis masculino", "loja de calçados",
  "tênis nike preço", "frete grátis calçados", "tênis para academia", "outlet de tênis",
  "tênis feminino promoção", "melhor tênis 2026", "tênis casual barato", "sapato esportivo",
  "tênis caminhada conforto", "comprar sapato online", "tênis running profissional",
  "tênis para corrida de rua", "tênis amortecimento", "tênis leve para treino",
  "tênis basquete cano alto", "tênis skate masculino", "tênis branco feminino",
  "tênis chunky moda", "tênis slip on", "tênis couro casual", "tênis trail running",
  "tênis para caminhada longa", "tênis academia crossfit", "tênis voleibol",
  "tênis futsal quadra", "tênis infantil promoção", "tênis plataforma feminino",
  "tênis retrô vintage", "tênis ultra leve", "tênis para esteira", "tênis maratona",
  "tênis impermeável", "tênis antiderrapante trabalho", "tênis confortável dia a dia",
  "tênis estiloso barato", "tênis edição limitada", "comprar tênis parcelado",
  "tênis com desconto", "tênis frete rápido", "tênis original garantido",
  "tênis tamanho grande", "tênis numeração especial", "tênis para pisada pronada",
  "tênis pisada supinada", "tênis corrida iniciante", "tênis performance elite",
  "tênis treino funcional", "tênis casual urbano", "tênis lançamento 2026",
  "tênis promoção relâmpago", "tênis queima de estoque", "tênis premium importado",
  "tênis nacional qualidade", "tênis day use", "tênis academia feminino",
  "tênis corrida masculino",
];

const AUDIENCE_POOL: { name: string; type: AudienceType }[] = [
  { name: "Lookalike 1% — Compradores", type: "lookalike" },
  { name: "Interesse: Corrida de rua", type: "interest" },
  { name: "Remarketing — Carrinho 7d", type: "remarketing" },
  { name: "Custom — Visitantes site 30d", type: "custom" },
  { name: "Interesse: Fitness e bem-estar", type: "interest" },
  { name: "Lookalike 2% — Leads", type: "lookalike" },
  { name: "Custom — Engajou Instagram 90d", type: "custom" },
  { name: "Remarketing — Viu produto 14d", type: "remarketing" },
  { name: "Interesse: Moda esportiva", type: "interest" },
  { name: "Custom — Lista de e-mails", type: "custom" },
  { name: "Interesse: Vida saudável", type: "interest" },
  { name: "Lookalike 3% — Compradores 180d", type: "lookalike" },
];

export const INTEREST_POOL = [
  "Corrida", "Fitness", "Moda esportiva", "Vida saudável", "Maratona", "Crossfit",
  "Yoga", "Ciclismo", "Tênis e calçados", "Academia", "Bem-estar", "Vida ao ar livre",
];

const GEO_POOL: { kind: GeoKind; name: string }[] = [
  { kind: "country", name: "Brasil" },
  { kind: "region", name: "São Paulo (estado)" },
  { kind: "region", name: "Rio de Janeiro (estado)" },
  { kind: "region", name: "Paraná" },
  { kind: "city", name: "São Paulo" },
  { kind: "city", name: "Rio de Janeiro" },
  { kind: "city", name: "Belo Horizonte" },
  { kind: "city", name: "Curitiba" },
  { kind: "city", name: "Porto Alegre" },
  { kind: "radius", name: "10 km de São Paulo" },
  { kind: "radius", name: "25 km de Curitiba" },
  { kind: "radius", name: "15 km do Rio de Janeiro" },
];

const MATCH_TYPES: MatchType[] = ["EXACT", "PHRASE", "BROAD"];

function buildKeywords(seedBase: number, prefix: string, scale: number, n: number, pool: string[]): Keyword[] {
  const start = seedBase % pool.length;
  return Array.from({ length: n }).map((_, i) => ({
    id: `${prefix}-kw-${i}`,
    text: pool[(start + i) % pool.length],
    matchType: MATCH_TYPES[(seedBase + i) % MATCH_TYPES.length],
    status: rng(seedBase + i * 7) > 0.85 ? "PAUSED" : "ENABLED",
    qualityScore: 4 + Math.floor(rng(seedBase + i * 3) * 7),
    ...synthMetrics(seedBase, i, scale),
  }));
}

function buildAudiences(seedBase: number, prefix: string, scale: number, n: number, pool: { name: string; type: AudienceType }[]): Audience[] {
  const start = seedBase % pool.length;
  return Array.from({ length: n }).map((_, i) => {
    const pick = pool[(start + i) % pool.length];
    return {
      id: `${prefix}-aud-${i}`,
      name: pick.name,
      type: pick.type,
      status: rng(seedBase + i * 7) > 0.85 ? "PAUSED" : "ENABLED",
      sizeEstimate: Math.round((50_000 + rng(seedBase + i * 23) * 3_500_000) * scale),
      ...synthMetrics(seedBase, i, scale * 1.6),
    };
  });
}

function buildGeoTargets(seedBase: number, prefix: string, scale: number, n: number, pool: { kind: GeoKind; name: string }[]): GeoTarget[] {
  const start = seedBase % pool.length;
  return Array.from({ length: n }).map((_, i) => {
    const g = pool[(start + i) % pool.length];
    return {
      id: `${prefix}-geo-${i}`,
      kind: g.kind,
      name: g.name,
      reach: Math.round((80_000 + rng(seedBase + i * 19) * 6_000_000) * scale),
      excluded: false,
    };
  });
}

function buildDemographics(seedBase: number): Demographics {
  const r = rng(seedBase);
  return {
    ageMin: r > 0.5 ? 18 : 25,
    ageMax: r > 0.5 ? 54 : 65,
    genders: [],
    devices: [],
  };
}

const GROUP_NAMES = ["Genérico", "Marca", "Concorrentes", "Promoções", "Produtos top", "Long tail"];
const SET_NAMES = ["Lookalike compradores", "Interesse — fitness", "Remarketing 30d", "Públicos frios", "Engajou IG"];

// ── Campanhas base (5 Google + 4 Meta) ──────────────────────────────────────

type BaseCampaign = {
  id: string;
  platform: ManagePlatform;
  name: string;
  status: EntityStatus;
  channelType: string;
  budgetDailyMicros: number;
  spentTodayMicros: number;
  googleType?: GoogleChannelType;
  googleBidStrategy?: GoogleBidStrategy;
  objective?: MetaObjective;
  budgetMode?: MetaBudgetMode;
  metaBidStrategy?: MetaBidStrategy;
};

const baseCampaigns: BaseCampaign[] = [
  { id: "g-search-bf", platform: "GOOGLE_ADS", name: "Black Friday — Search BR", status: "ENABLED", channelType: "Rede de Pesquisa", budgetDailyMicros: 500_000_000, spentTodayMicros: 372_400_000, googleType: "SEARCH", googleBidStrategy: "MAXIMIZE_CONVERSIONS" },
  { id: "g-pmax", platform: "GOOGLE_ADS", name: "Performance Max — Catálogo", status: "ENABLED", channelType: "Performance Max", budgetDailyMicros: 800_000_000, spentTodayMicros: 541_900_000, googleType: "PERFORMANCE_MAX", googleBidStrategy: "MAXIMIZE_CONVERSION_VALUE" },
  { id: "g-shopping", platform: "GOOGLE_ADS", name: "Shopping — Calçados", status: "ENABLED", channelType: "Shopping", budgetDailyMicros: 350_000_000, spentTodayMicros: 298_100_000, googleType: "SHOPPING", googleBidStrategy: "MAXIMIZE_CLICKS" },
  { id: "g-display", platform: "GOOGLE_ADS", name: "Display — Remarketing", status: "PAUSED", channelType: "Display", budgetDailyMicros: 120_000_000, spentTodayMicros: 0, googleType: "DISPLAY", googleBidStrategy: "TARGET_CPA" },
  { id: "g-search-brand", platform: "GOOGLE_ADS", name: "Search — Marca", status: "ENABLED", channelType: "Rede de Pesquisa", budgetDailyMicros: 90_000_000, spentTodayMicros: 61_200_000, googleType: "SEARCH", googleBidStrategy: "MAXIMIZE_CLICKS" },
  { id: "m-conv", platform: "META_ADS", name: "Conversões — Lookalike BR", status: "ENABLED", channelType: "Vendas", budgetDailyMicros: 400_000_000, spentTodayMicros: 288_300_000, objective: "OUTCOME_SALES", budgetMode: "CBO", metaBidStrategy: "LOWEST_COST" },
  { id: "m-traffic", platform: "META_ADS", name: "Tráfego — Blog", status: "ENABLED", channelType: "Tráfego", budgetDailyMicros: 150_000_000, spentTodayMicros: 102_700_000, objective: "OUTCOME_TRAFFIC", budgetMode: "ABO", metaBidStrategy: "LOWEST_COST" },
  { id: "m-leads", platform: "META_ADS", name: "Geração de Leads — IG", status: "ENABLED", channelType: "Cadastros (leads)", budgetDailyMicros: 300_000_000, spentTodayMicros: 247_500_000, objective: "OUTCOME_LEADS", budgetMode: "CBO", metaBidStrategy: "COST_CAP" },
  { id: "m-aware", platform: "META_ADS", name: "Reconhecimento — Vídeo", status: "PAUSED", channelType: "Reconhecimento", budgetDailyMicros: 80_000_000, spentTodayMicros: 0, objective: "OUTCOME_AWARENESS", budgetMode: "CBO", metaBidStrategy: "LOWEST_COST" },
];

// ── Pools e campanhas por marca (brand-aware) ───────────────────────────────
//
// Cada conta com `brandKey` usa um conjunto de dados próprio (campanhas,
// keywords, públicos, interesses, geo). Contas sem brandKey caem no conjunto
// genérico (`defaultPools` + `baseCampaigns`) — comportamento original intacto.

type BrandPools = {
  keywords: string[];
  audiences: { name: string; type: AudienceType }[];
  interests: string[];
  geos: { kind: GeoKind; name: string }[];
};

const defaultPools: BrandPools = {
  keywords: KEYWORD_POOL,
  audiences: AUDIENCE_POOL,
  interests: INTEREST_POOL,
  geos: GEO_POOL,
};

// Vintech — SaaS wine-tech (vinícolas, importadoras, adegas, D2C de vinho).
const VINTECH_POOLS: BrandPools = {
  keywords: [
    "software para vinícola", "sistema de gestão de adega", "erp para importadora de vinho",
    "plataforma e-commerce de vinhos", "controle de estoque de vinhos", "gestão de carta de vinhos",
    "sistema para enoteca", "software wine club", "automação de vendas de vinho",
    "crm para importadora de vinhos", "gestão de rótulos de vinho", "plataforma clube de vinho",
    "controle de safra vinícola", "sistema de reservas restaurante", "gestão de distribuidora de bebidas",
    "software para sommelier", "precificação de vinhos", "marketplace de vinhos",
    "gestão de vinícola boutique", "rastreabilidade de vinho", "etiqueta inteligente vinho",
    "vendas diretas vinícola", "plataforma d2c vinho", "gestão de degustação",
    "software importadora de bebidas", "controle de validade bebidas", "sistema fiscal bebidas",
    "logística de vinhos", "gestão multicanal vinho", "dashboard de vendas vinícola",
    "previsão de demanda vinho", "gestão de pedidos vinícola", "integração marketplace vinho",
    "fidelidade clube de vinho", "automação de adega", "controle de barricas",
    "gestão de enoturismo", "reserva de degustação online", "estoque inteligente vinho",
    "software para wine bar", "gestão de importação de vinhos", "nota fiscal bebida alcoólica",
    "plataforma de assinatura de vinhos", "crm enoteca", "relatório de vendas vinho",
    "gestão de fornecedores vinícola", "controle de lote vinho", "vendas online vinícola",
    "automação de cobrança vinícola", "gestão de safra e colheita", "software para distribuidora de vinho",
    "precificação dinâmica bebidas", "gestão de cardápio de vinhos", "integração ifood vinho",
    "controle de temperatura adega", "gestão de eventos vinícola", "sistema pdv vinícola",
    "relatório fiscal bebidas", "kpi de vendas vinho",
  ],
  audiences: [
    { name: "Lookalike 1% — Trials ativados", type: "lookalike" },
    { name: "Interesse: Enologia e vinhos", type: "interest" },
    { name: "Remarketing — Visitou a demo 14d", type: "remarketing" },
    { name: "Custom — Donos de vinícola", type: "custom" },
    { name: "Interesse: Gestão e ERP", type: "interest" },
    { name: "Lookalike 2% — Clientes pagantes", type: "lookalike" },
    { name: "Custom — Importadores de bebidas", type: "custom" },
    { name: "Interesse: Restaurantes e enotecas", type: "interest" },
    { name: "Remarketing — Abandonou trial", type: "remarketing" },
    { name: "Custom — Leads do webinar", type: "custom" },
    { name: "Interesse: Wine clubs", type: "interest" },
    { name: "Lookalike 3% — Assinantes", type: "lookalike" },
  ],
  interests: [
    "Vinhos", "Enologia", "Sommelier", "Gastronomia", "Gestão empresarial", "ERP",
    "Empreendedorismo", "E-commerce", "Importação", "Restaurantes", "Tecnologia", "SaaS",
  ],
  geos: [
    { kind: "country", name: "Brasil" },
    { kind: "region", name: "Rio Grande do Sul" },
    { kind: "region", name: "São Paulo (estado)" },
    { kind: "city", name: "Bento Gonçalves" },
    { kind: "city", name: "São Roque" },
    { kind: "city", name: "São Paulo" },
    { kind: "city", name: "Porto Alegre" },
    { kind: "radius", name: "30 km da Serra Gaúcha" },
    { kind: "region", name: "Vale do São Francisco" },
    { kind: "city", name: "Garibaldi" },
    { kind: "radius", name: "20 km do Vale dos Vinhedos" },
    { kind: "city", name: "Curitiba" },
  ],
};

// TGL Solutions — automação + IA sob medida para empresas.
const TGL_POOLS: BrandPools = {
  keywords: [
    "automação de processos empresariais", "consultoria de inteligência artificial",
    "agente de ia para empresas", "automação de atendimento whatsapp", "integração de sistemas erp",
    "chatbot com ia", "rpa para empresas", "automação de vendas", "consultoria de automação",
    "implantação de crm", "automação de marketing", "fluxo de trabalho automatizado",
    "ia para pequenas empresas", "automação financeira", "integração de apis",
    "automação de relatórios", "assistente virtual empresarial", "digitalização de processos",
    "automação de cobrança", "sistema sob medida", "software personalizado para empresa",
    "automação de agendamento", "ia generativa para negócios", "consultoria de transformação digital",
    "automação de backoffice", "orquestração de agentes ia", "automação de planilhas",
    "integração whatsapp api", "automação de leads", "redução de custo operacional com ia",
    "automação de e-mail marketing", "bot de atendimento", "automação de propostas comerciais",
    "consultoria de processos", "integração de erp e crm", "automação de nota fiscal",
    "agente de ia atendimento", "automação de pós-venda", "dashboard automatizado",
    "ia para gestão de estoque", "automação de recrutamento", "consultoria de dados",
    "automação de onboarding", "ia para suporte ao cliente", "automação de pipeline de vendas",
    "integração de pagamentos", "automação de follow-up", "ia para análise de documentos",
    "automação de aprovações", "consultoria de eficiência operacional", "sistema de gestão sob medida",
    "automação de marketing whatsapp", "ia para previsão de demanda", "automação de contratos",
    "agente de ia comercial", "automação de relatórios gerenciais", "consultoria de inovação",
    "ia para pequenas e médias empresas", "automação de processos administrativos",
    "transformação digital para pme",
  ],
  audiences: [
    { name: "Lookalike 1% — Clientes fechados", type: "lookalike" },
    { name: "Interesse: Transformação digital", type: "interest" },
    { name: "Remarketing — Viu o diagnóstico 7d", type: "remarketing" },
    { name: "Custom — Donos de PME", type: "custom" },
    { name: "Interesse: Inteligência artificial", type: "interest" },
    { name: "Lookalike 2% — Leads qualificados", type: "lookalike" },
    { name: "Custom — Gestores de operações", type: "custom" },
    { name: "Interesse: Automação e produtividade", type: "interest" },
    { name: "Remarketing — Não agendou call", type: "remarketing" },
    { name: "Custom — Lista de e-mails frios", type: "custom" },
    { name: "Interesse: Empreendedorismo", type: "interest" },
    { name: "Lookalike 3% — Reuniões agendadas", type: "lookalike" },
  ],
  interests: [
    "Inteligência artificial", "Automação", "Transformação digital", "Produtividade",
    "Empreendedorismo", "Gestão empresarial", "Tecnologia", "Startups", "Marketing digital",
    "Vendas B2B", "No-code", "SaaS",
  ],
  geos: GEO_POOL,
};

// Campanhas base por marca (mesma forma de `baseCampaigns`, com identidade).
const VINTECH_CAMPAIGNS: BaseCampaign[] = [
  { id: "vin-g-search", platform: "GOOGLE_ADS", name: "Vinícolas — Search BR", status: "ENABLED", channelType: "Rede de Pesquisa", budgetDailyMicros: 450_000_000, spentTodayMicros: 331_800_000, googleType: "SEARCH", googleBidStrategy: "MAXIMIZE_CONVERSIONS" },
  { id: "vin-g-pmax", platform: "GOOGLE_ADS", name: "Demonstração Plataforma — PMax", status: "ENABLED", channelType: "Performance Max", budgetDailyMicros: 700_000_000, spentTodayMicros: 488_200_000, googleType: "PERFORMANCE_MAX", googleBidStrategy: "MAXIMIZE_CONVERSION_VALUE" },
  { id: "vin-g-import", platform: "GOOGLE_ADS", name: "Importadoras de Vinho — Search", status: "ENABLED", channelType: "Rede de Pesquisa", budgetDailyMicros: 280_000_000, spentTodayMicros: 213_600_000, googleType: "SEARCH", googleBidStrategy: "MAXIMIZE_CLICKS" },
  { id: "vin-g-display", platform: "GOOGLE_ADS", name: "Remarketing Trial — Display", status: "PAUSED", channelType: "Display", budgetDailyMicros: 110_000_000, spentTodayMicros: 0, googleType: "DISPLAY", googleBidStrategy: "TARGET_CPA" },
  { id: "vin-g-brand", platform: "GOOGLE_ADS", name: "Search — Marca Vintech", status: "ENABLED", channelType: "Rede de Pesquisa", budgetDailyMicros: 80_000_000, spentTodayMicros: 52_400_000, googleType: "SEARCH", googleBidStrategy: "MAXIMIZE_CLICKS" },
  { id: "vin-m-trial", platform: "META_ADS", name: "Trial SaaS — Lookalike", status: "ENABLED", channelType: "Cadastros (leads)", budgetDailyMicros: 350_000_000, spentTodayMicros: 268_900_000, objective: "OUTCOME_LEADS", budgetMode: "CBO", metaBidStrategy: "COST_CAP" },
  { id: "vin-m-content", platform: "META_ADS", name: "Conteúdo Enoteca — Tráfego", status: "ENABLED", channelType: "Tráfego", budgetDailyMicros: 140_000_000, spentTodayMicros: 96_300_000, objective: "OUTCOME_TRAFFIC", budgetMode: "ABO", metaBidStrategy: "LOWEST_COST" },
  { id: "vin-m-webinar", platform: "META_ADS", name: "Webinar Gestão de Adega — Leads", status: "ENABLED", channelType: "Cadastros (leads)", budgetDailyMicros: 260_000_000, spentTodayMicros: 201_700_000, objective: "OUTCOME_LEADS", budgetMode: "CBO", metaBidStrategy: "LOWEST_COST" },
  { id: "vin-m-aware", platform: "META_ADS", name: "Awareness — Do terroir aos dados", status: "PAUSED", channelType: "Reconhecimento", budgetDailyMicros: 70_000_000, spentTodayMicros: 0, objective: "OUTCOME_AWARENESS", budgetMode: "CBO", metaBidStrategy: "LOWEST_COST" },
];

const TGL_CAMPAIGNS: BaseCampaign[] = [
  { id: "tgl-g-auto", platform: "GOOGLE_ADS", name: "Automação Empresarial — Search BR", status: "ENABLED", channelType: "Rede de Pesquisa", budgetDailyMicros: 520_000_000, spentTodayMicros: 401_200_000, googleType: "SEARCH", googleBidStrategy: "MAXIMIZE_CONVERSIONS" },
  { id: "tgl-g-pmax", platform: "GOOGLE_ADS", name: "Agentes de IA — Performance Max", status: "ENABLED", channelType: "Performance Max", budgetDailyMicros: 820_000_000, spentTodayMicros: 612_500_000, googleType: "PERFORMANCE_MAX", googleBidStrategy: "MAXIMIZE_CONVERSION_VALUE" },
  { id: "tgl-g-consult", platform: "GOOGLE_ADS", name: "Consultoria de Processos — Search", status: "ENABLED", channelType: "Rede de Pesquisa", budgetDailyMicros: 300_000_000, spentTodayMicros: 224_900_000, googleType: "SEARCH", googleBidStrategy: "MAXIMIZE_CLICKS" },
  { id: "tgl-g-display", platform: "GOOGLE_ADS", name: "Remarketing Diagnóstico — Display", status: "PAUSED", channelType: "Display", budgetDailyMicros: 120_000_000, spentTodayMicros: 0, googleType: "DISPLAY", googleBidStrategy: "TARGET_CPA" },
  { id: "tgl-g-brand", platform: "GOOGLE_ADS", name: "Search — Marca TGL Solutions", status: "ENABLED", channelType: "Rede de Pesquisa", budgetDailyMicros: 95_000_000, spentTodayMicros: 63_100_000, googleType: "SEARCH", googleBidStrategy: "MAXIMIZE_CLICKS" },
  { id: "tgl-m-diag", platform: "META_ADS", name: "Diagnóstico Gratuito — Lookalike", status: "ENABLED", channelType: "Cadastros (leads)", budgetDailyMicros: 380_000_000, spentTodayMicros: 297_400_000, objective: "OUTCOME_LEADS", budgetMode: "CBO", metaBidStrategy: "COST_CAP" },
  { id: "tgl-m-cases", platform: "META_ADS", name: "Cases de Automação — Tráfego", status: "ENABLED", channelType: "Tráfego", budgetDailyMicros: 160_000_000, spentTodayMicros: 118_200_000, objective: "OUTCOME_TRAFFIC", budgetMode: "ABO", metaBidStrategy: "LOWEST_COST" },
  { id: "tgl-m-call", platform: "META_ADS", name: "Agende uma Call — Leads", status: "ENABLED", channelType: "Cadastros (leads)", budgetDailyMicros: 290_000_000, spentTodayMicros: 233_800_000, objective: "OUTCOME_LEADS", budgetMode: "CBO", metaBidStrategy: "LOWEST_COST" },
  { id: "tgl-m-aware", platform: "META_ADS", name: "Reconhecimento — IA sob medida", status: "PAUSED", channelType: "Reconhecimento", budgetDailyMicros: 85_000_000, spentTodayMicros: 0, objective: "OUTCOME_AWARENESS", budgetMode: "CBO", metaBidStrategy: "LOWEST_COST" },
];

// Lumen Store — e-commerce de eletrônicos.
const LUMEN_POOLS: BrandPools = {
  keywords: [
    "comprar smartphone", "notebook em oferta", "fone de ouvido bluetooth", "smart tv 4k",
    "console de videogame", "comprar celular barato", "tablet promoção", "smartwatch oferta",
    "caixa de som bluetooth", "carregador rápido usb c", "mouse gamer", "teclado mecânico",
    "monitor 144hz", "ssd 1tb", "câmera de segurança wifi", "robô aspirador",
    "air fryer promoção", "geladeira inverter", "máquina de lavar", "micro-ondas barato",
    "cafeteira expresso", "echo dot alexa", "kindle promoção", "headset gamer",
    "webcam full hd", "roteador wifi 6", "power bank", "smartphone 5g", "notebook gamer",
    "tv box android", "soundbar", "drone com câmera", "projetor portátil",
    "impressora multifuncional", "mouse sem fio", "cabo hdmi 2.1", "fonte atx 600w",
    "placa de vídeo", "memória ram ddr5", "processador ryzen", "gabinete gamer",
    "cadeira gamer", "purificador de água", "liquidificador", "fritadeira elétrica",
    "smart lâmpada", "fechadura digital", "tomada inteligente", "smartphone dobrável",
    "relógio inteligente", "fone tws", "carregador por indução", "estabilizador",
    "nobreak", "switch de rede", "ar condicionado inverter", "aspirador vertical",
    "ventilador de coluna", "cooktop por indução", "lavadora de alta pressão",
  ],
  audiences: [
    { name: "Lookalike 1% — Compradores eletrônicos", type: "lookalike" },
    { name: "Remarketing — Carrinho 7d", type: "remarketing" },
    { name: "Interesse: Tecnologia e gadgets", type: "interest" },
    { name: "Custom — Visitantes do site 30d", type: "custom" },
    { name: "Interesse: Games e consoles", type: "interest" },
    { name: "Lookalike 2% — Compradores 180d", type: "lookalike" },
    { name: "Custom — Lista de clientes", type: "custom" },
    { name: "Remarketing — Viu produto 14d", type: "remarketing" },
    { name: "Interesse: Smart home", type: "interest" },
    { name: "Custom — Abandono de checkout", type: "custom" },
    { name: "Interesse: Fotografia", type: "interest" },
    { name: "Lookalike 3% — Alto ticket", type: "lookalike" },
  ],
  interests: [
    "Tecnologia", "Eletrônicos", "Games", "Smartphones", "Smart home", "Gadgets",
    "Informática", "Fotografia", "Áudio", "Wearables", "E-commerce", "Ofertas",
  ],
  geos: GEO_POOL,
};

// Atlas Travel — viagens e turismo.
const ATLAS_POOLS: BrandPools = {
  keywords: [
    "pacotes de viagem", "passagens aéreas baratas", "hotel all inclusive", "cruzeiro pelo caribe",
    "viagem para europa", "resort em cancún", "passagem promocional", "pacote para disney",
    "viagem em família", "lua de mel", "viagem para maldivas", "aluguel de carro viagem",
    "seguro viagem", "passagem nacional barata", "hotel 5 estrelas", "pacote nordeste",
    "viagem internacional parcelada", "passagem ida e volta", "voo direto para miami",
    "pacote praia caribe", "viagem econômica", "hotel fazenda", "pousada romântica",
    "destinos baratos", "viagem de última hora", "pacote serra gaúcha", "passagem para portugal",
    "viagem para argentina", "pacote bariloche", "hotel com café da manhã", "viagem de réveillon",
    "pacote carnaval", "ingressos parques orlando", "transfer aeroporto", "mochilão europa",
    "pacote dubai", "cruzeiro mediterrâneo", "viagem cancún tudo incluso", "hospedagem barata",
    "passagem black friday", "viagem fernando de noronha", "pacote gramado", "viagem para chile",
    "hotel com piscina", "resort com spa", "viagem para tailândia", "pacote maceió",
    "passagem para orlando", "viagem para buenos aires", "resort all inclusive nordeste",
    "pacote porto seguro", "hotel próximo à praia", "viagem para fortaleza", "pacote natal rn",
    "passagem para lisboa", "cruzeiro nacional", "viagem para foz do iguaçu", "pacote jericoacoara",
    "hotel com tudo incluso", "viagem para punta cana",
  ],
  audiences: [
    { name: "Lookalike 1% — Viajantes frequentes", type: "lookalike" },
    { name: "Interesse: Viagens internacionais", type: "interest" },
    { name: "Remarketing — Pesquisou destino 14d", type: "remarketing" },
    { name: "Custom — Compradores de pacotes", type: "custom" },
    { name: "Interesse: Praias e resorts", type: "interest" },
    { name: "Lookalike 2% — Lua de mel", type: "lookalike" },
    { name: "Custom — Abandono de reserva", type: "custom" },
    { name: "Interesse: Cruzeiros", type: "interest" },
    { name: "Remarketing — Viu voo 7d", type: "remarketing" },
    { name: "Custom — Lista de e-mails", type: "custom" },
    { name: "Interesse: Aventura e ecoturismo", type: "interest" },
    { name: "Lookalike 3% — Alto ticket viagem", type: "lookalike" },
  ],
  interests: [
    "Viagens", "Turismo", "Praias", "Cruzeiros", "Resorts", "Aventura", "Gastronomia",
    "Cultura", "Ecoturismo", "Vida ao ar livre", "Fotografia de viagem", "Luxo",
  ],
  geos: [
    { kind: "country", name: "Brasil" },
    { kind: "city", name: "São Paulo" },
    { kind: "city", name: "Rio de Janeiro" },
    { kind: "region", name: "São Paulo (estado)" },
    { kind: "country", name: "Estados Unidos (destino)" },
    { kind: "country", name: "Portugal (destino)" },
    { kind: "city", name: "Cancún (destino)" },
    { kind: "city", name: "Curitiba" },
    { kind: "city", name: "Belo Horizonte" },
    { kind: "radius", name: "20 km de São Paulo" },
    { kind: "city", name: "Porto Alegre" },
    { kind: "country", name: "Argentina (destino)" },
  ],
};

// Aura Cosmetics — skincare e beleza (conta Meta).
const AURA_POOLS: BrandPools = {
  keywords: [
    "sérum vitamina c", "skincare para acne", "creme anti-idade", "protetor solar facial",
    "hidratante facial", "ácido hialurônico", "limpeza de pele", "maquiagem vegana",
    "base de cobertura natural", "batom matte", "kit skincare", "rotina de cuidados com a pele",
    "creme para olheiras", "esfoliante facial", "máscara facial", "tônico facial",
    "água micelar", "retinol para rugas", "clareador de manchas", "primer facial",
    "corretivo líquido", "paleta de sombras", "delineador à prova d'água", "rímel volume",
    "iluminador líquido", "blush cremoso", "creme para o corpo", "óleo corporal",
    "sabonete facial", "demaquilante", "lip oil", "gloss labial", "bruma facial",
    "creme noturno", "gel de limpeza", "vitamina c para o rosto", "hidratante corporal",
    "perfume feminino", "kit de maquiagem completo", "dermocosmético para acne",
    "sérum clareador", "máscara de argila", "esfoliante corporal", "protetor solar com cor",
    "antissinais", "cuidados pós-sol", "creme firmador", "óleo facial", "lip tint",
    "base líquida hd", "pó compacto matte", "fixador de maquiagem", "kit autocuidado",
    "creme para mãos", "tratamento para poros", "hidratante com fps", "sérum noturno",
    "limpador facial suave", "tônico adstringente",
  ],
  audiences: [
    { name: "Lookalike 1% — Compradoras skincare", type: "lookalike" },
    { name: "Interesse: Beleza e cuidados com a pele", type: "interest" },
    { name: "Remarketing — Visitou produto 14d", type: "remarketing" },
    { name: "Custom — Engajou no Instagram 90d", type: "custom" },
    { name: "Interesse: Maquiagem", type: "interest" },
    { name: "Lookalike 2% — Clientes recorrentes", type: "lookalike" },
    { name: "Custom — Clientes VIP", type: "custom" },
    { name: "Interesse: Autocuidado e bem-estar", type: "interest" },
    { name: "Remarketing — Abandono de carrinho", type: "remarketing" },
    { name: "Custom — Assinantes da newsletter", type: "custom" },
    { name: "Interesse: Cosméticos naturais", type: "interest" },
    { name: "Lookalike 3% — Alto ticket beleza", type: "lookalike" },
  ],
  interests: [
    "Beleza", "Skincare", "Maquiagem", "Autocuidado", "Bem-estar", "Cosméticos naturais",
    "Perfumes", "Moda", "Dermocosméticos", "Vida saudável", "Lifestyle", "Cabelos",
  ],
  geos: GEO_POOL,
};

const LUMEN_CAMPAIGNS: BaseCampaign[] = [
  { id: "lum-g-bf", platform: "GOOGLE_ADS", name: "Black Friday — Search BR", status: "ENABLED", channelType: "Rede de Pesquisa", budgetDailyMicros: 520_000_000, spentTodayMicros: 388_900_000, googleType: "SEARCH", googleBidStrategy: "MAXIMIZE_CONVERSIONS" },
  { id: "lum-g-pmax", platform: "GOOGLE_ADS", name: "Performance Max — Catálogo", status: "ENABLED", channelType: "Performance Max", budgetDailyMicros: 820_000_000, spentTodayMicros: 561_400_000, googleType: "PERFORMANCE_MAX", googleBidStrategy: "MAXIMIZE_CONVERSION_VALUE" },
  { id: "lum-g-shop", platform: "GOOGLE_ADS", name: "Shopping — Eletrônicos", status: "ENABLED", channelType: "Shopping", budgetDailyMicros: 360_000_000, spentTodayMicros: 311_700_000, googleType: "SHOPPING", googleBidStrategy: "MAXIMIZE_CLICKS" },
  { id: "lum-g-display", platform: "GOOGLE_ADS", name: "Remarketing Carrinho — Display", status: "PAUSED", channelType: "Display", budgetDailyMicros: 130_000_000, spentTodayMicros: 0, googleType: "DISPLAY", googleBidStrategy: "TARGET_CPA" },
  { id: "lum-g-brand", platform: "GOOGLE_ADS", name: "Search — Marca Lumen", status: "ENABLED", channelType: "Rede de Pesquisa", budgetDailyMicros: 95_000_000, spentTodayMicros: 64_800_000, googleType: "SEARCH", googleBidStrategy: "MAXIMIZE_CLICKS" },
];

const ATLAS_CAMPAIGNS: BaseCampaign[] = [
  { id: "atl-g-caribe", platform: "GOOGLE_ADS", name: "Pacotes Caribe — Search BR", status: "ENABLED", channelType: "Rede de Pesquisa", budgetDailyMicros: 480_000_000, spentTodayMicros: 356_200_000, googleType: "SEARCH", googleBidStrategy: "MAXIMIZE_CONVERSIONS" },
  { id: "atl-g-voos", platform: "GOOGLE_ADS", name: "Passagens Aéreas — PMax", status: "ENABLED", channelType: "Performance Max", budgetDailyMicros: 750_000_000, spentTodayMicros: 528_300_000, googleType: "PERFORMANCE_MAX", googleBidStrategy: "MAXIMIZE_CONVERSION_VALUE" },
  { id: "atl-g-hotel", platform: "GOOGLE_ADS", name: "Hotéis All Inclusive — Search", status: "ENABLED", channelType: "Rede de Pesquisa", budgetDailyMicros: 320_000_000, spentTodayMicros: 247_100_000, googleType: "SEARCH", googleBidStrategy: "MAXIMIZE_CLICKS" },
  { id: "atl-g-display", platform: "GOOGLE_ADS", name: "Remarketing Destinos — Display", status: "PAUSED", channelType: "Display", budgetDailyMicros: 110_000_000, spentTodayMicros: 0, googleType: "DISPLAY", googleBidStrategy: "TARGET_CPA" },
  { id: "atl-g-brand", platform: "GOOGLE_ADS", name: "Search — Marca Atlas Travel", status: "ENABLED", channelType: "Rede de Pesquisa", budgetDailyMicros: 85_000_000, spentTodayMicros: 57_900_000, googleType: "SEARCH", googleBidStrategy: "MAXIMIZE_CLICKS" },
];

const AURA_CAMPAIGNS: BaseCampaign[] = [
  { id: "aur-m-vendas", platform: "META_ADS", name: "Skincare Premium — Vendas", status: "ENABLED", channelType: "Vendas", budgetDailyMicros: 400_000_000, spentTodayMicros: 294_600_000, objective: "OUTCOME_SALES", budgetMode: "CBO", metaBidStrategy: "LOWEST_COST" },
  { id: "aur-m-serum", platform: "META_ADS", name: "Lançamento Sérum — Conversões", status: "ENABLED", channelType: "Vendas", budgetDailyMicros: 300_000_000, spentTodayMicros: 226_800_000, objective: "OUTCOME_SALES", budgetMode: "ABO", metaBidStrategy: "LOWEST_COST" },
  { id: "aur-m-leads", platform: "META_ADS", name: "Lookalike Compradoras — Leads", status: "ENABLED", channelType: "Cadastros (leads)", budgetDailyMicros: 220_000_000, spentTodayMicros: 168_400_000, objective: "OUTCOME_LEADS", budgetMode: "CBO", metaBidStrategy: "COST_CAP" },
  { id: "aur-m-aware", platform: "META_ADS", name: "Reconhecimento — Vídeo Beleza", status: "PAUSED", channelType: "Reconhecimento", budgetDailyMicros: 75_000_000, spentTodayMicros: 0, objective: "OUTCOME_AWARENESS", budgetMode: "CBO", metaBidStrategy: "LOWEST_COST" },
];

const brandPools: Record<BrandKey, BrandPools> = {
  lumen: LUMEN_POOLS,
  atlas: ATLAS_POOLS,
  aura: AURA_POOLS,
  vintech: VINTECH_POOLS,
  tgl: TGL_POOLS,
};

const brandCampaigns: Record<BrandKey, BaseCampaign[]> = {
  lumen: LUMEN_CAMPAIGNS,
  atlas: ATLAS_CAMPAIGNS,
  aura: AURA_CAMPAIGNS,
  vintech: VINTECH_CAMPAIGNS,
  tgl: TGL_CAMPAIGNS,
};

function poolsFor(brand?: BrandKey): BrandPools {
  return brand ? brandPools[brand] : defaultPools;
}

function baseCampaignsFor(brand?: BrandKey): BaseCampaign[] {
  return brand ? brandCampaigns[brand] : baseCampaigns;
}

// ── Construção da árvore (account-aware) ────────────────────────────────────

const OPT_GOALS: MetaOptimizationGoal[] = ["OFFSITE_CONVERSIONS", "LINK_CLICKS", "LEAD_GENERATION", "REACH"];

function buildAdGroups(bc: BaseCampaign, accountId: string, pools: BrandPools): AdGroup[] {
  const base = seed(bc.id, accountId);
  const scale = accountScale(accountId);
  const nGroups = 3 + Math.floor(rng(base) * 2); // 3–4
  const perGroup = 17 + Math.floor(rng(base + 1) * 4); // 17–20 → 51–80 keywords no total (50+)
  return Array.from({ length: nGroups }).map((_, gi) => {
    const gid = `${bc.id}-ag-${gi}`;
    const gbase = seed(gid, accountId);
    const keywords = buildKeywords(gbase, gid, scale, perGroup, pools.keywords);
    const m = sumMetrics(keywords);
    return {
      id: gid,
      name: GROUP_NAMES[gi % GROUP_NAMES.length],
      status: rng(gbase) > 0.85 ? "PAUSED" : "ENABLED",
      defaultCpcMicros: Math.round(120_000 + rng(gbase + 7) * 400_000),
      keywords,
      ...m,
    };
  });
}

function buildAdSets(bc: BaseCampaign, accountId: string, pools: BrandPools): AdSet[] {
  const base = seed(bc.id, accountId);
  const scale = accountScale(accountId);
  const nSets = 2 + Math.floor(rng(base) * 2); // 2–3
  return Array.from({ length: nSets }).map((_, si) => {
    const sid = `${bc.id}-as-${si}`;
    const sbase = seed(sid, accountId);
    const audiences = buildAudiences(sbase, sid, scale, 3 + Math.floor(rng(sbase) * 3), pools.audiences);
    const m = sumMetrics(audiences);
    const interests = pools.interests.filter((_, i) => rng(sbase + i * 11) > 0.6).slice(0, 4);
    return {
      id: sid,
      name: SET_NAMES[si % SET_NAMES.length],
      status: rng(sbase) > 0.85 ? "PAUSED" : "ENABLED",
      budgetDailyMicros: Math.round((bc.budgetDailyMicros / nSets) * scale),
      optimizationGoal: OPT_GOALS[si % OPT_GOALS.length],
      bidStrategy: bc.metaBidStrategy ?? "LOWEST_COST",
      geoTargets: buildGeoTargets(sbase, sid, scale, 1 + Math.floor(rng(sbase + 3) * 2), pools.geos),
      demographics: buildDemographics(sbase),
      interests: interests.length ? interests : [pools.interests[si % pools.interests.length]],
      audiences,
      ...m,
    };
  });
}

/** Materializa UMA campanha (com toda a subárvore) escalada pela conta. */
function buildCampaign(bc: BaseCampaign, accountId: string, pools: BrandPools): Campaign {
  const scale = accountScale(accountId);
  const isGoogle = bc.platform === "GOOGLE_ADS";
  const adGroups = isGoogle ? buildAdGroups(bc, accountId, pools) : [];
  const adSets = isGoogle ? [] : buildAdSets(bc, accountId, pools);
  const children: Metrics[] = isGoogle ? adGroups : adSets;
  const m = sumMetrics(children);
  const ctr = m.impressions ? m.clicks / m.impressions : 0;
  const averageCpcMicros = m.clicks ? Math.round(m.costMicros / m.clicks) : 0;
  return {
    id: bc.id,
    platform: bc.platform,
    name: bc.name,
    status: bc.status,
    channelType: bc.channelType,
    budgetDailyMicros: Math.round(bc.budgetDailyMicros * scale),
    spentTodayMicros: Math.round(bc.spentTodayMicros * scale),
    impressions: m.impressions,
    clicks: m.clicks,
    costMicros: m.costMicros,
    conversions: m.conversions,
    ctr,
    averageCpcMicros,
    googleType: bc.googleType,
    googleBidStrategy: bc.googleBidStrategy,
    geoTargets: isGoogle ? buildGeoTargets(seed(bc.id, accountId, "geo"), `${bc.id}-c`, scale, 2 + Math.floor(rng(seed(bc.id, accountId)) * 2), pools.geos) : [],
    adGroups,
    objective: bc.objective,
    budgetMode: bc.budgetMode,
    metaBidStrategy: bc.metaBidStrategy,
    adSets,
  };
}

/** Árvore completa da conta (campanhas da plataforma da conta). */
export function buildAccountTree(account: AdAccount): Campaign[] {
  const pools = poolsFor(account.brandKey);
  return baseCampaignsFor(account.brandKey)
    .filter((c) => c.platform === account.platform)
    .map((c) => buildCampaign(c, account.accountId, pools));
}

// ── Helpers de agregação / recálculo ────────────────────────────────────────

/** Recalcula métricas roll-up de uma campanha a partir dos filhos (após edição). */
export function recalcCampaign(c: Campaign): Campaign {
  const children: Metrics[] = c.platform === "GOOGLE_ADS" ? c.adGroups : c.adSets;
  const m = sumMetrics(children);
  return {
    ...c,
    impressions: m.impressions,
    clicks: m.clicks,
    costMicros: m.costMicros,
    conversions: m.conversions,
    ctr: m.impressions ? m.clicks / m.impressions : 0,
    averageCpcMicros: m.clicks ? Math.round(m.costMicros / m.clicks) : 0,
  };
}

export function recalcGroup(g: AdGroup): AdGroup {
  return { ...g, ...sumMetrics(g.keywords) };
}

export function recalcSet(s: AdSet): AdSet {
  return { ...s, ...sumMetrics(s.audiences) };
}

export function segmentationCount(c: Campaign): number {
  if (c.platform === "GOOGLE_ADS") return c.adGroups.reduce((a, g) => a + g.keywords.length, 0);
  return c.adSets.reduce((a, s) => a + s.audiences.length, 0);
}

// ── Séries e histórico (account-aware) ──────────────────────────────────────

export function campaignSeries(c: Campaign, accountId: string): { label: string; spend: number; conversions: number; clicks: number }[] {
  const base = seed(c.id, accountId);
  const dailyCost = c.costMicros / 30 / 1_000_000;
  const dailyConv = c.conversions / 30;
  const dailyClicks = c.clicks / 30;
  return Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const w = 0.7 + rng(base + i * 41) * 0.6;
    return {
      label: d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      spend: Math.round(dailyCost * w),
      conversions: Math.round(dailyConv * w),
      clicks: Math.round(dailyClicks * w),
    };
  });
}

export type HistoryEntry = { id: string; at: string; actor: string; action: string; detail: string };

export function campaignHistory(c: Campaign, accountId: string): HistoryEntry[] {
  const base = seed(c.id, accountId);
  const segWord = c.platform === "GOOGLE_ADS" ? "palavra-chave" : "público";
  const pool: { action: string; detail: string }[] = [
    { action: "Campanha ativada", detail: "Status alterado para ENABLED" },
    { action: "Orçamento ajustado", detail: `Diário ${formatMicros(c.budgetDailyMicros * 0.8)} → ${formatMicros(c.budgetDailyMicros)}` },
    { action: `${segWord[0].toUpperCase()}${segWord.slice(1)} pausado(a)`, detail: "Custo por conversão acima da meta" },
    { action: "Lance otimizado", detail: "CPC alvo reduzido em 8% pelo sistema" },
    { action: "Geolocalização atualizada", detail: "Novo alvo geográfico adicionado" },
    { action: `Novo(a) ${segWord} adicionado(a)`, detail: "Sugestão automática aceita" },
  ];
  const n = 4 + Math.floor(rng(base) * 3);
  return Array.from({ length: n }).map((_, i) => {
    const p = pool[(base + i) % pool.length];
    const d = new Date();
    d.setMinutes(d.getMinutes() - Math.round((i + 1) * (90 + rng(base + i * 13) * 600)));
    return {
      id: `${c.id}-h-${i}`,
      at: d.toISOString(),
      actor: rng(base + i * 5) > 0.5 ? "Sistema (auto)" : "você",
      action: p.action,
      detail: p.detail,
    };
  });
}

export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.round(diff / 60_000);
  if (min < 1) return "agora";
  if (min < 60) return `há ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `há ${h}h`;
  return `há ${Math.round(h / 24)}d`;
}

// ── Factories para CRIAÇÃO (usadas pelo store) ──────────────────────────────

export function makeId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e4).toString(36)}`;
}

export function emptyDemographics(): Demographics {
  return { ageMin: 18, ageMax: 65, genders: [], devices: [] };
}
