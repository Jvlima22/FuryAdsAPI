/**
 * Valida as credenciais do Google Ads sem precisar de anúncio nenhum.
 *
 * Chama listAccessibleCustomers() — o teste canônico de "minhas 5 chaves casam?".
 * Em caso de sucesso, lista os customer IDs que o refresh token consegue acessar
 * (qualquer um deles serve como `tenantId` no payload do webhook).
 *
 * Uso:
 *   npm run check:google
 */
import { GoogleAdsApi } from 'google-ads-api';
import dotenv from 'dotenv';

dotenv.config();

const {
  GOOGLE_ADS_CLIENT_ID,
  GOOGLE_ADS_CLIENT_SECRET,
  GOOGLE_ADS_DEVELOPER_TOKEN,
  GOOGLE_ADS_REFRESH_TOKEN,
} = process.env;

const faltando = Object.entries({
  GOOGLE_ADS_CLIENT_ID,
  GOOGLE_ADS_CLIENT_SECRET,
  GOOGLE_ADS_DEVELOPER_TOKEN,
  GOOGLE_ADS_REFRESH_TOKEN,
})
  .filter(([, v]) => !v)
  .map(([k]) => k);

if (faltando.length > 0) {
  console.error('Faltam estas variáveis no .env:\n  ' + faltando.join('\n  '));
  process.exit(1);
}

async function main(): Promise<void> {
  const client = new GoogleAdsApi({
    client_id: GOOGLE_ADS_CLIENT_ID as string,
    client_secret: GOOGLE_ADS_CLIENT_SECRET as string,
    developer_token: GOOGLE_ADS_DEVELOPER_TOKEN as string,
  });

  console.log('Consultando contas acessíveis...\n');
  const { resource_names } = await client.listAccessibleCustomers(
    GOOGLE_ADS_REFRESH_TOKEN as string,
  );

  console.log('✅ Credenciais válidas! Contas acessíveis por este refresh token:\n');
  for (const rn of resource_names) {
    const id = rn.replace('customers/', '');
    console.log(`  - ${id}   (use como tenantId no payload)`);
  }
  console.log(
    '\nDica: para um takedown, o payload precisa de platform="GOOGLE_ADS",\n' +
      'tenantId = um customer_id acima, e adId no formato "{adGroupId}~{adId}".',
  );
}

main().catch((err: unknown) => {
  const e = err as {
    message?: string;
    reason?: string;
    errorInfoMetadata?: { activationUrl?: string };
  };
  console.error('\n❌ Falha ao validar credenciais do Google Ads:\n');
  console.error('  ' + (e.message ?? String(err)));

  if (e.reason === 'SERVICE_DISABLED') {
    console.error(
      '\n👉 A Google Ads API está DESATIVADA no seu projeto do Google Cloud.\n' +
        '   Ative aqui e espere ~2-3 min propagar, depois rode de novo:\n' +
        '   ' +
        (e.errorInfoMetadata?.activationUrl ??
          'https://console.cloud.google.com/apis/library/googleads.googleapis.com'),
    );
  } else {
    console.error(
      '\nCausas comuns:\n' +
        '  - DEVELOPER_TOKEN ainda não aceito/ativado no API Center\n' +
        '  - refresh token de uma conta sem acesso ao Google Ads\n' +
        '  - client_id/secret de outro projeto que não o do refresh token',
    );
  }
  process.exit(1);
});
