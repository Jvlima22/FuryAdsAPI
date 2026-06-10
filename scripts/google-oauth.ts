/**
 * Gera o GOOGLE_ADS_REFRESH_TOKEN para o .env.
 *
 * Pré-requisitos no .env (ou exportados no shell):
 *   GOOGLE_ADS_CLIENT_ID
 *   GOOGLE_ADS_CLIENT_SECRET
 * O OAuth client deve ser do tipo "Desktop app" (permite loopback http://localhost).
 *
 * Uso:
 *   npm run token:google
 *   # (ou) npx tsx scripts/google-oauth.ts
 *
 * O script abre o navegador, você autoriza com a conta que tem acesso ao Google Ads,
 * e o refresh token é impresso no terminal. Cole-o em GOOGLE_ADS_REFRESH_TOKEN.
 */
import http from 'node:http';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import dotenv from 'dotenv';

dotenv.config();

const CLIENT_ID = process.env.GOOGLE_ADS_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_ADS_CLIENT_SECRET;
const PORT = Number(process.env.OAUTH_PORT ?? 4318);
const SCOPE = 'https://www.googleapis.com/auth/adwords';
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    'Faltam GOOGLE_ADS_CLIENT_ID e/ou GOOGLE_ADS_CLIENT_SECRET no .env.\n' +
      'Crie um OAuth client (tipo "Desktop app") no Google Cloud Console e preencha o .env antes de rodar.',
  );
  process.exit(1);
}

interface TokenResponse {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
  error?: string;
  error_description?: string;
}

const state = crypto.randomBytes(16).toString('hex');

const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
authUrl.searchParams.set('client_id', CLIENT_ID);
authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('scope', SCOPE);
authUrl.searchParams.set('access_type', 'offline'); // exige refresh_token
authUrl.searchParams.set('prompt', 'consent'); // força reemissão do refresh_token
authUrl.searchParams.set('state', state);

function html(title: string, body: string): string {
  return `<!doctype html><meta charset="utf-8"><title>${title}</title>
<body style="font-family:system-ui;max-width:540px;margin:64px auto;line-height:1.5">
<h2>${title}</h2><p>${body}</p><p>Pode fechar esta aba e voltar ao terminal.</p></body>`;
}

function openBrowser(url: string): void {
  // No Windows, `start` quebra com os "&" da query string mesmo entre aspas.
  // Passamos via cmd.exe com argumentos verbatim; em qualquer caso a URL também
  // é impressa no terminal como fallback manual confiável.
  if (process.platform === 'win32') {
    const child = spawn('cmd.exe', ['/c', 'start', '""', url], {
      windowsVerbatimArguments: true,
      stdio: 'ignore',
      detached: true,
    });
    child.on('error', () => {
      /* fallback é a URL já impressa no terminal */
    });
    child.unref();
    return;
  }
  const cmd = process.platform === 'darwin' ? 'open' : 'xdg-open';
  spawn(cmd, [url], { stdio: 'ignore', detached: true }).unref();
}

async function exchangeCode(code: string): Promise<TokenResponse> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: CLIENT_ID as string,
      client_secret: CLIENT_SECRET as string,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  });
  return (await res.json()) as TokenResponse;
}

const server = http.createServer(async (req, res) => {
  if (!req.url) return;
  const reqUrl = new URL(req.url, `http://localhost:${PORT}`);

  // Rota raiz: redireciona pra URL (gigante) de consent do Google.
  // Abrir o navegador nesta rota curta evita que o shell trunque os "&" da query.
  if (reqUrl.pathname === '/') {
    res.writeHead(302, { Location: authUrl.toString() }).end();
    return;
  }

  if (reqUrl.pathname !== '/oauth2callback') {
    res.writeHead(404).end();
    return;
  }

  const finish = (code: number, page: string): void => {
    res.writeHead(code, { 'Content-Type': 'text/html; charset=utf-8' }).end(page);
    server.close();
  };

  const oauthError = reqUrl.searchParams.get('error');
  if (oauthError) {
    console.error(`\nAutorização negada: ${oauthError}`);
    finish(400, html('Autorização negada', oauthError));
    process.exitCode = 1;
    return;
  }

  if (reqUrl.searchParams.get('state') !== state) {
    console.error('\nState não confere — possível CSRF. Abortando.');
    finish(400, html('Erro', 'State inválido.'));
    process.exitCode = 1;
    return;
  }

  const code = reqUrl.searchParams.get('code');
  if (!code) {
    finish(400, html('Erro', 'Sem authorization code na resposta.'));
    process.exitCode = 1;
    return;
  }

  try {
    const token = await exchangeCode(code);
    if (token.error || !token.refresh_token) {
      const msg = token.error_description ?? token.error ?? 'refresh_token ausente na resposta';
      console.error(`\nFalha ao trocar o code: ${msg}`);
      if (!token.error) {
        console.error(
          'Dica: se você já autorizou este app antes, o Google pode não reemitir o refresh_token.\n' +
            'Revogue o acesso em https://myaccount.google.com/permissions e rode de novo.',
        );
      }
      finish(400, html('Erro', String(msg)));
      process.exitCode = 1;
      return;
    }

    console.log('\n✅ Refresh token gerado. Cole no seu .env:\n');
    console.log(`GOOGLE_ADS_REFRESH_TOKEN=${token.refresh_token}\n`);
    finish(200, html('Pronto!', 'Refresh token gerado — confira o terminal.'));
  } catch (err) {
    console.error('\nErro na troca do code:', (err as Error).message);
    finish(500, html('Erro', 'Falha ao contatar o endpoint de token.'));
    process.exitCode = 1;
  }
});

server.listen(PORT, () => {
  const localUrl = `http://localhost:${PORT}/`;
  console.log(`Servidor de callback ouvindo em ${REDIRECT_URI}\n`);
  console.log('Tentando abrir o navegador... Se nada abrir, acesse esta URL curta no navegador:\n');
  console.log(`  ${localUrl}\n`);
  console.log('(ela redireciona para o consent do Google automaticamente)\n');
  openBrowser(localUrl);
});
