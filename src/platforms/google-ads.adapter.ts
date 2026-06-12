import { GoogleAdsApi, enums, ResourceNames } from 'google-ads-api';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';
import { ViolationPayload } from '../schemas/violation.schema';
import {
  CampaignMetrics,
  CampaignMetricsQuery,
} from '../schemas/metrics.schema';
import {
  MetricsAdapter,
  PlatformAdapter,
  TakedownResult,
} from './platform.interface';

// Cliente é caro de instanciar; memoizamos após a 1ª chamada com credenciais válidas.
let client: GoogleAdsApi | null = null;

function getClient(): GoogleAdsApi {
  const {
    GOOGLE_ADS_CLIENT_ID,
    GOOGLE_ADS_CLIENT_SECRET,
    GOOGLE_ADS_DEVELOPER_TOKEN,
  } = env;

  if (
    !GOOGLE_ADS_CLIENT_ID ||
    !GOOGLE_ADS_CLIENT_SECRET ||
    !GOOGLE_ADS_DEVELOPER_TOKEN
  ) {
    throw new AppError(
      'Credenciais do Google Ads ausentes (GOOGLE_ADS_CLIENT_ID, GOOGLE_ADS_CLIENT_SECRET, GOOGLE_ADS_DEVELOPER_TOKEN).',
      500,
    );
  }

  if (!client) {
    client = new GoogleAdsApi({
      client_id: GOOGLE_ADS_CLIENT_ID,
      client_secret: GOOGLE_ADS_CLIENT_SECRET,
      developer_token: GOOGLE_ADS_DEVELOPER_TOKEN,
    });
  }

  return client;
}

/**
 * Monta o cliente de uma conta-cliente, validando o refresh token.
 *
 * `withLogin=true` injeta o `login_customer_id` (a MCC do .env) — necessário
 * quando a conta-alvo é filha dessa MCC. `withLogin=false` omite o header, o
 * que é exigido por contas com acesso direto que NÃO estão sob essa MCC
 * (passar a MCC nesses casos gera erro de permissão). Ver `withCustomer`.
 */
function buildCustomer(customerId: string, withLogin = true) {
  const { GOOGLE_ADS_REFRESH_TOKEN, GOOGLE_ADS_LOGIN_CUSTOMER_ID } = env;
  if (!GOOGLE_ADS_REFRESH_TOKEN) {
    throw new AppError('GOOGLE_ADS_REFRESH_TOKEN ausente.', 500);
  }
  const digits = customerId.replace(/\D/g, '');
  if (!digits) {
    throw new AppError(
      'customer_id do Google Ads deve conter dígitos (veio do tenantId / da URL).',
      400,
    );
  }
  return getClient().Customer({
    customer_id: digits,
    refresh_token: GOOGLE_ADS_REFRESH_TOKEN,
    ...(withLogin && GOOGLE_ADS_LOGIN_CUSTOMER_ID
      ? { login_customer_id: GOOGLE_ADS_LOGIN_CUSTOMER_ID }
      : {}),
  });
}

/**
 * Heurística: a falha veio de passar um `login_customer_id` que não gerencia a
 * conta-alvo? A API responde pedindo o header de login-customer-id / negando a
 * permissão. Nesses casos vale reexecutar sem o header (acesso direto).
 */
function isLoginCustomerIdError(err: unknown): boolean {
  const e = err as { errors?: Array<{ message?: string }>; message?: string };
  const msg = (e.errors?.[0]?.message ?? e.message ?? '').toLowerCase();
  return (
    msg.includes('login-customer-id') || msg.includes("doesn't have permission")
  );
}

/**
 * Executa uma operação contra uma conta Google Ads tentando primeiro COM o
 * `login_customer_id` (MCC) configurado — caminho correto para contas filhas da
 * MCC. Se a conta não está sob essa MCC mas o refresh token tem acesso direto, a
 * API recusa pedindo o login-customer-id; nesse caso reexecutamos SEM o header.
 */
async function withCustomer<T>(
  customerId: string,
  run: (customer: ReturnType<typeof buildCustomer>) => Promise<T>,
): Promise<T> {
  const hasLogin = Boolean(env.GOOGLE_ADS_LOGIN_CUSTOMER_ID);
  try {
    return await run(buildCustomer(customerId, true));
  } catch (err) {
    if (hasLogin && isLoginCustomerIdError(err)) {
      return run(buildCustomer(customerId, false));
    }
    throw err;
  }
}

/** Converte o enum numérico de status da campanha em string legível. */
function campaignStatusLabel(status: unknown): string {
  if (typeof status === 'number') {
    return enums.CampaignStatus[status] ?? String(status);
  }
  return status ? String(status) : 'UNKNOWN';
}

/**
 * Traduz a falha do SDK do Google Ads (objeto com array `errors`) num AppError
 * com a mensagem real — pro endpoint/worker não devolver 500 genérico.
 */
function toAppError(err: unknown): AppError {
  if (err instanceof AppError) return err;
  const e = err as {
    errors?: Array<{ message?: string }>;
    message?: string;
  };
  const msg =
    e.errors?.[0]?.message ??
    e.message ??
    'erro desconhecido ao chamar a Google Ads API';
  return new AppError(`Google Ads: ${msg}`, 502);
}

/**
 * Pausa um anúncio no Google Ads.
 *
 * Mapeamento do payload:
 * - `tenantId` → customer_id da conta Google Ads (somente dígitos).
 * - `adId`     → composto `{adGroupId}~{adId}` (formato do ad_group_ad no Google Ads).
 */
export const googleAdsAdapter: PlatformAdapter & MetricsAdapter = {
  platform: 'GOOGLE_ADS',

  async performTakedown(payload: ViolationPayload): Promise<TakedownResult> {
    const [adGroupId, adId] = payload.adId.split('~');
    if (!adGroupId || !adId) {
      throw new AppError(
        'adId do Google Ads deve estar no formato "{adGroupId}~{adId}".',
        400,
      );
    }

    const customerId = payload.tenantId.replace(/\D/g, '');
    const resourceName = ResourceNames.adGroupAd(customerId, adGroupId, adId);

    const startedAt = Date.now();
    try {
      await withCustomer(customerId, (customer) =>
        customer.adGroupAds.update([
          { resource_name: resourceName, status: enums.AdGroupAdStatus.PAUSED },
        ]),
      );
    } catch (err) {
      throw toAppError(err);
    }

    return {
      platform: 'GOOGLE_ADS',
      action: 'AD_PAUSED',
      resource: resourceName,
      durationMs: Date.now() - startedAt,
    };
  },

  /**
   * Lê métricas agregadas por campanha no período [startDate, endDate].
   * Sem segments.date, a API soma as métricas por campanha no intervalo.
   */
  async getCampaignMetrics(
    query: CampaignMetricsQuery,
  ): Promise<CampaignMetrics[]> {
    let rows;
    try {
      rows = await withCustomer(query.customerId, (customer) =>
        customer.report({
          entity: 'campaign',
          attributes: ['campaign.id', 'campaign.name', 'campaign.status'],
          metrics: [
            'metrics.impressions',
            'metrics.clicks',
            'metrics.cost_micros',
            'metrics.conversions',
            'metrics.ctr',
            'metrics.average_cpc',
          ],
          from_date: query.startDate,
          to_date: query.endDate,
        }),
      );
    } catch (err) {
      throw toAppError(err);
    }

    return rows.map((row) => {
      const c = row.campaign ?? {};
      const m = row.metrics ?? {};
      return {
        campaignId: String(c.id ?? ''),
        campaignName: String(c.name ?? ''),
        status: campaignStatusLabel(c.status),
        impressions: Number(m.impressions ?? 0),
        clicks: Number(m.clicks ?? 0),
        costMicros: Number(m.cost_micros ?? 0),
        conversions: Number(m.conversions ?? 0),
        ctr: Number(m.ctr ?? 0),
        averageCpcMicros: Number(m.average_cpc ?? 0),
      };
    });
  },
};
