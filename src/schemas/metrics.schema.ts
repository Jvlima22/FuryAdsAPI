import { z } from 'zod';

/** Slug da plataforma na URL (kebab) → enum Platform. */
export const SLUG_TO_PLATFORM = {
  'google-ads': 'GOOGLE_ADS',
  'meta-ads': 'META_ADS',
} as const;

export type PlatformSlug = keyof typeof SLUG_TO_PLATFORM;

const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'data deve estar no formato YYYY-MM-DD');

/** Query params de GET /metrics/:platform/:customerId */
export const metricsQuerySchema = z
  .object({
    from: dateString,
    to: dateString,
  })
  .refine((q) => q.from <= q.to, {
    message: 'from deve ser <= to',
    path: ['from'],
  });

export type MetricsQuery = z.infer<typeof metricsQuerySchema>;

/** Parâmetros internos passados ao MetricsAdapter. */
export interface CampaignMetricsQuery {
  customerId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

/** Métricas agregadas por campanha no período. */
export interface CampaignMetrics {
  campaignId: string;
  campaignName: string;
  status: string;
  impressions: number;
  clicks: number;
  costMicros: number;
  conversions: number;
  ctr: number;
  averageCpcMicros: number;
}
