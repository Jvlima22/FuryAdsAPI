import { Platform, ViolationPayload } from '../schemas/violation.schema';
import { CampaignMetrics, CampaignMetricsQuery } from '../schemas/metrics.schema';

/**
 * Resultado de um takedown executado por um adapter.
 * Vira o `returnvalue` do job BullMQ, exposto em GET /jobs/:id.
 */
export interface TakedownResult {
  platform: Platform;
  action: string; // ex: 'AD_PAUSED'
  resource: string; // resource_name / id do anúncio afetado na plataforma
  durationMs: number;
}

/**
 * Contrato que cada plataforma de anúncio implementa (Strategy Pattern).
 * O worker seleciona o adapter por `payload.platform` e delega a execução.
 */
export interface PlatformAdapter {
  readonly platform: Platform;
  performTakedown(payload: ViolationPayload): Promise<TakedownResult>;
}

/**
 * Capacidade de leitura de métricas (read-only, síncrona — não usa a fila).
 * Separada de PlatformAdapter porque nem toda plataforma a implementa.
 */
export interface MetricsAdapter {
  readonly platform: Platform;
  getCampaignMetrics(query: CampaignMetricsQuery): Promise<CampaignMetrics[]>;
}
