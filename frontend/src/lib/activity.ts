import {
  ShieldAlert,
  PauseCircle,
  CheckCircle2,
  XCircle,
  BarChart3,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

/**
 * In-app activity timeline + the "AI Policy Assistant" knowledge base.
 * Pure mock data — mirrors the kind of events the Fury Ads worker would emit
 * (violations detected, ads auto-paused, jobs finishing) and the policy
 * rationale shown when a user asks "why was this blocked?".
 */

export type ActivityKind =
  | "violation"
  | "auto_pause"
  | "job_done"
  | "job_failed"
  | "metric"
  | "system";

export type ActivityEvent = {
  id: string;
  kind: ActivityKind;
  title: string;
  detail: string;
  at: string; // ISO timestamp
};

export const activityIcon: Record<ActivityKind, LucideIcon> = {
  violation: ShieldAlert,
  auto_pause: PauseCircle,
  job_done: CheckCircle2,
  job_failed: XCircle,
  metric: BarChart3,
  system: Sparkles,
};

export type ActivityTone = { bg: string; text: string; glow: string };

export const activityTone: Record<ActivityKind, ActivityTone> = {
  violation: { bg: "bg-rose-100", text: "text-rose-600", glow: "shadow-[0_0_0_3px_rgba(244,63,94,0.12)]" },
  auto_pause: { bg: "bg-amber-100", text: "text-amber-600", glow: "shadow-[0_0_0_3px_rgba(245,158,11,0.12)]" },
  job_done: { bg: "bg-emerald-100", text: "text-emerald-600", glow: "shadow-[0_0_0_3px_rgba(16,185,129,0.12)]" },
  job_failed: { bg: "bg-rose-100", text: "text-rose-600", glow: "shadow-[0_0_0_3px_rgba(244,63,94,0.12)]" },
  metric: { bg: "bg-cyan-100", text: "text-cyan-600", glow: "shadow-[0_0_0_3px_rgba(6,182,212,0.12)]" },
  system: { bg: "bg-violet-100", text: "text-violet-600", glow: "shadow-[0_0_0_3px_rgba(124,58,237,0.12)]" },
};

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

export const activityFeed: ActivityEvent[] = [
  {
    id: "ev-01",
    kind: "violation",
    title: "Violação crítica detectada",
    detail: "ad_9281 · TRADEMARK_INFRINGEMENT em campanha Black Friday — Search BR",
    at: minutesAgo(4),
  },
  {
    id: "ev-02",
    kind: "auto_pause",
    title: "Anúncio pausado automaticamente",
    detail: "ad_9281 pausado pelo worker após severidade CRITICAL",
    at: minutesAgo(4),
  },
  {
    id: "ev-03",
    kind: "job_done",
    title: "Takedown concluído",
    detail: "job tnt_001__ad_9283 finalizado em 8.42s — status PAUSED confirmado",
    at: minutesAgo(12),
  },
  {
    id: "ev-04",
    kind: "violation",
    title: "Claim enganoso flagrado",
    detail: "ad_9282 · MISLEADING_CLAIM em Brand Awareness — Meta",
    at: minutesAgo(31),
  },
  {
    id: "ev-05",
    kind: "job_failed",
    title: "Takedown falhou",
    detail: "job tnt_002__ad_7740 — plataforma retornou 403 (auth expirada), reentrando na fila",
    at: minutesAgo(46),
  },
  {
    id: "ev-06",
    kind: "metric",
    title: "Pico de custo no Google Ads",
    detail: "Performance Max +8.4% de CPC nas últimas 6h",
    at: minutesAgo(58),
  },
  {
    id: "ev-07",
    kind: "auto_pause",
    title: "Anúncio pausado automaticamente",
    detail: "ad_9285 · COPYRIGHT — criativo retido para revisão",
    at: minutesAgo(95),
  },
  {
    id: "ev-08",
    kind: "system",
    title: "Resumo diário gerado",
    detail: "7 violações processadas · 5 takedowns · 98% de saúde da conta",
    at: minutesAgo(140),
  },
];

/** "agora", "há 4 min", "há 2h", "há 3d" */
export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.round(diff / 60_000);
  if (min < 1) return "agora";
  if (min < 60) return `há ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `há ${h}h`;
  const d = Math.round(h / 24);
  return `há ${d}d`;
}

export type Policy = {
  rule: string;
  platform: "Google Ads" | "Meta Ads";
  explanation: string;
  suggestion: string;
  reference: string;
  trigger: string;
};

const policies: Record<string, Policy> = {
  TRADEMARK_INFRINGEMENT: {
    rule: "Uso indevido de marca registrada",
    platform: "Google Ads",
    explanation:
      "O anúncio usa uma marca registrada de terceiro no título ou texto sem autorização, o que pode confundir o usuário sobre a origem do produto.",
    suggestion:
      "Remova o nome da marca de terceiro do criativo ou anexe o comprovante de autorização de uso na Central de Marcas do Google Ads.",
    reference: "support.google.com/adspolicy/answer/6118",
    trigger: 'Termo de marca "Nimbus®" no headline',
  },
  MISLEADING_CLAIM: {
    rule: "Alegação enganosa ou não comprovada",
    platform: "Meta Ads",
    explanation:
      "O texto promete um resultado garantido que não pode ser comprovado, violando a política de afirmações exageradas.",
    suggestion:
      'Substitua promessas absolutas ("resultado garantido") por linguagem realista e adicione disclaimers quando aplicável.',
    reference: "transparency.fb.com/policies/ad-standards",
    trigger: 'Expressão "resultado garantido em 7 dias"',
  },
  ADULT_CONTENT: {
    rule: "Conteúdo adulto / sensível",
    platform: "Google Ads",
    explanation:
      "O criativo contém imagem ou linguagem de natureza adulta inadequada para a segmentação configurada.",
    suggestion:
      "Troque o criativo por uma versão apropriada para todos os públicos ou ajuste a segmentação para conteúdo restrito permitido.",
    reference: "support.google.com/adspolicy/answer/6023699",
    trigger: "Classificador de imagem: nudez parcial (score 0.91)",
  },
  PROHIBITED_PRODUCT: {
    rule: "Produto ou serviço proibido",
    platform: "Meta Ads",
    explanation:
      "O produto anunciado está na lista de itens proibidos pela plataforma e não pode ser veiculado.",
    suggestion:
      "Verifique a lista de produtos proibidos e remova o item, ou solicite revisão se acreditar que a classificação está incorreta.",
    reference: "transparency.fb.com/policies/ad-standards/prohibited-content",
    trigger: "Categoria detectada: suplemento não regulamentado",
  },
  COPYRIGHT: {
    rule: "Violação de direitos autorais",
    platform: "Google Ads",
    explanation:
      "O criativo reutiliza material protegido por direitos autorais (imagem, música ou vídeo) sem licença comprovada.",
    suggestion:
      "Substitua o ativo por conteúdo licenciado ou próprio e mantenha o comprovante de licença disponível para auditoria.",
    reference: "support.google.com/adspolicy/answer/176108",
    trigger: "Match de fingerprint com acervo licenciado de terceiro",
  },
  LOW_QUALITY_IMAGE: {
    rule: "Imagem de baixa qualidade",
    platform: "Meta Ads",
    explanation:
      "A imagem do criativo está abaixo do padrão mínimo de resolução/nitidez, prejudicando a experiência do usuário.",
    suggestion:
      "Envie uma imagem com resolução mínima recomendada (1080×1080) e sem excesso de texto sobreposto.",
    reference: "transparency.fb.com/policies/ad-standards/low-quality",
    trigger: "Resolução 320×240 abaixo do mínimo",
  },
};

const fallbackPolicy: Policy = {
  rule: "Violação de política da plataforma",
  platform: "Google Ads",
  explanation:
    "O anúncio foi sinalizado por um classificador automático de compliance por violar uma política da plataforma.",
  suggestion:
    "Revise o criativo e o texto à luz das diretrizes da plataforma e reenvie para nova análise.",
  reference: "support.google.com/adspolicy",
  trigger: "Sinal automático de compliance",
};

export function getPolicy(violationType: string): Policy {
  return policies[violationType] ?? {
    ...fallbackPolicy,
    rule: `${violationType.replace(/_/g, " ")} — política da plataforma`,
  };
}
