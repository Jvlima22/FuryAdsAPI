import { Request, Response, NextFunction } from 'express';
import { getMetricsAdapter } from '../platforms';
import { AppError } from '../utils/AppError';
import {
  metricsQuerySchema,
  SLUG_TO_PLATFORM,
  PlatformSlug,
} from '../schemas/metrics.schema';

/**
 * GET /metrics/:platform/:customerId?from=YYYY-MM-DD&to=YYYY-MM-DD
 * Read-only e síncrono — não passa pela fila.
 */
export async function getCampaignMetrics(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const slug = String(req.params.platform);
    const platform = SLUG_TO_PLATFORM[slug as PlatformSlug];
    if (!platform) {
      throw new AppError(
        `Plataforma desconhecida: "${slug}". Use "google-ads" ou "meta-ads".`,
        400,
      );
    }

    const parsed = metricsQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      next(parsed.error);
      return;
    }

    const customerId = String(req.params.customerId);
    const adapter = getMetricsAdapter(platform);
    const campaigns = await adapter.getCampaignMetrics({
      customerId,
      startDate: parsed.data.from,
      endDate: parsed.data.to,
    });

    res.json({
      platform,
      customerId,
      from: parsed.data.from,
      to: parsed.data.to,
      count: campaigns.length,
      campaigns,
    });
  } catch (err) {
    next(err);
  }
}
