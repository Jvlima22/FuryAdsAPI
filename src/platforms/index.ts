import { Platform } from '../schemas/violation.schema';
import { AppError } from '../utils/AppError';
import { MetricsAdapter, PlatformAdapter } from './platform.interface';
import { googleAdsAdapter } from './google-ads.adapter';
import { metaAdsAdapter } from './meta-ads.adapter';

// Map exaustivo: o compilador obriga uma entrada para cada Platform do enum.
const adapters: Record<Platform, PlatformAdapter> = {
  GOOGLE_ADS: googleAdsAdapter,
  META_ADS: metaAdsAdapter,
};

export function getPlatformAdapter(platform: Platform): PlatformAdapter {
  const adapter = adapters[platform];
  if (!adapter) {
    throw new AppError(`Plataforma sem adapter registrado: ${platform}`, 400);
  }
  return adapter;
}

// Leitura de métricas é opcional por plataforma — só quem implementa entra aqui.
const metricsAdapters: Partial<Record<Platform, MetricsAdapter>> = {
  GOOGLE_ADS: googleAdsAdapter,
};

export function getMetricsAdapter(platform: Platform): MetricsAdapter {
  const adapter = metricsAdapters[platform];
  if (!adapter) {
    throw new AppError(
      `Plataforma ${platform} ainda não suporta leitura de métricas.`,
      400,
    );
  }
  return adapter;
}

export type {
  PlatformAdapter,
  MetricsAdapter,
  TakedownResult,
} from './platform.interface';
