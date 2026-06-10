/**
 * Lê métricas de campanha de uma conta Google Ads — exercita o MESMO
 * googleAdsAdapter.getCampaignMetrics() que o endpoint GET /metrics usa,
 * sem precisar subir Redis nem o servidor.
 *
 * `import 'dotenv/config'` precisa vir ANTES de importar ../src/platforms
 * (que carrega config/env.ts na inicialização do módulo).
 *
 * Uso:
 *   npm run metrics:google -- <customerId> <from YYYY-MM-DD> <to YYYY-MM-DD>
 * Ex.:
 *   npm run metrics:google -- 4777509197 2024-01-01 2024-12-31
 */
import 'dotenv/config';
import { getMetricsAdapter } from '../src/platforms';

const [customerId, from, to] = process.argv.slice(2);

if (!customerId || !from || !to) {
  console.error(
    'Uso: npm run metrics:google -- <customerId> <from YYYY-MM-DD> <to YYYY-MM-DD>',
  );
  process.exit(1);
}

async function main(): Promise<void> {
  const adapter = getMetricsAdapter('GOOGLE_ADS');
  const campaigns = await adapter.getCampaignMetrics({
    customerId,
    startDate: from,
    endDate: to,
  });

  console.log(`\n✅ ${campaigns.length} campanha(s) em ${customerId} [${from} → ${to}]:\n`);
  console.log(JSON.stringify(campaigns, null, 2));
}

main().catch((err: unknown) => {
  const e = err as {
    message?: string;
    code?: unknown;
    errors?: Array<{ message?: string; error_code?: unknown }>;
    details?: unknown;
  };
  console.error('\n❌ Erro ao ler métricas:\n');
  if (Array.isArray(e.errors) && e.errors.length > 0) {
    for (const item of e.errors) {
      console.error('  - ' + (item.message ?? '?'));
      console.error('    error_code: ' + JSON.stringify(item.error_code ?? {}));
    }
  } else {
    console.error('  message: ' + (e.message ?? String(err)));
  }
  if (e.code !== undefined) console.error('  code: ' + String(e.code));
  if (e.details !== undefined) console.error('  details: ' + String(e.details));
  process.exit(1);
});
