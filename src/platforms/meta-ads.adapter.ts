import { FacebookAdsApi, Ad } from 'facebook-nodejs-business-sdk';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';
import { ViolationPayload } from '../schemas/violation.schema';
import { PlatformAdapter, TakedownResult } from './platform.interface';

// O SDK é inicializado uma vez por processo com o access token.
let initialized = false;

function ensureInit(): void {
  if (!env.META_ADS_ACCESS_TOKEN) {
    throw new AppError(
      'Credenciais do Meta Ads ausentes (META_ADS_ACCESS_TOKEN).',
      500,
    );
  }
  if (!initialized) {
    FacebookAdsApi.init(env.META_ADS_ACCESS_TOKEN);
    initialized = true;
  }
}

/**
 * Pausa um anúncio no Meta Ads.
 *
 * Mapeamento do payload:
 * - `adId`     → id do anúncio (global na Graph API; basta o id para pausar).
 * - `tenantId` → conta de anúncios dona do ad (não exigido pela operação de update).
 */
export const metaAdsAdapter: PlatformAdapter = {
  platform: 'META_ADS',

  async performTakedown(payload: ViolationPayload): Promise<TakedownResult> {
    ensureInit();

    const startedAt = Date.now();
    const ad = new Ad(payload.adId);
    await ad.update([], { status: 'PAUSED' });

    return {
      platform: 'META_ADS',
      action: 'AD_PAUSED',
      resource: payload.adId,
      durationMs: Date.now() - startedAt,
    };
  },
};
