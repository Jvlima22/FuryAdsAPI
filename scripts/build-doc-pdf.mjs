/**
 * Monta um PDF a partir do GOOGLE-ADS-API-DESIGN-DOC.md, com a Figure 1
 * (docs/figure1.png) embutida inline. Saída: docs/google-ads-api-design-doc.pdf
 *
 * Uso:  node scripts/build-doc-pdf.mjs
 * Requer: Google Chrome instalado + `marked` em node_modules.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { marked } from 'marked';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const MD = join(root, 'GOOGLE-ADS-API-DESIGN-DOC.md');
const PNG = join(root, 'docs', 'figure1.png');
const OUT_HTML = join(root, 'docs', 'google-ads-api-design-doc.print.html');
const OUT_PDF = join(root, 'docs', 'google-ads-api-design-doc.pdf');

const CHROME_CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
];
const chrome = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!chrome) {
  console.error('Chrome/Edge não encontrado. Instale o Chrome ou ajuste CHROME_CANDIDATES.');
  process.exit(1);
}

// 1. Lê o markdown e remove o apêndice interno (comentário HTML).
let md = readFileSync(MD, 'utf8');
md = md.replace(/<!--[\s\S]*?-->/g, '').trimEnd() + '\n';

// 2. Markdown -> HTML.
let body = marked.parse(md, { mangle: false, headerIds: false });

// 3. Injeta a Figure 1 (PNG em base64) no lugar da legenda em itálico.
const pngBase64 = readFileSync(PNG).toString('base64');
const figureHtml =
  `<figure class="fig">` +
  `<img alt="System architecture" src="data:image/png;base64,${pngBase64}" />` +
  `<figcaption>$1</figcaption>` +
  `</figure>`;
const before = body;
body = body.replace(
  /<p><em>(Figure 1 —[\s\S]*?)<\/em><\/p>/,
  figureHtml,
);
if (body === before) {
  console.warn('Aviso: legenda da Figure 1 não encontrada — diagrama não embutido.');
}

// 4. Envelopa com o CSS de impressão.
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<title>Fury Ads — Google Ads API Tool Design Document</title>
<style>
  @page { size: A4; margin: 16mm 16mm 18mm; }
  * { box-sizing: border-box; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body {
    font-family: "Segoe UI", -apple-system, Roboto, Helvetica, Arial, sans-serif;
    color: #1a2233; font-size: 11pt; line-height: 1.5; margin: 0;
  }
  h1 { font-size: 20pt; letter-spacing: -0.01em; margin: 0 0 14px; }
  h2 { font-size: 14pt; margin: 26px 0 10px; padding-bottom: 5px;
       border-bottom: 2px solid #e2e8f0; }
  h3 { font-size: 12pt; margin: 16px 0 6px; }
  h2, h3 { page-break-after: avoid; }
  p { margin: 9px 0; }
  strong { color: #0f172a; }
  hr { border: none; border-top: 1px solid #e2e8f0; margin: 22px 0; }
  a { color: #2563eb; text-decoration: none; }

  table { border-collapse: collapse; width: 100%; margin: 12px 0; font-size: 10pt; }
  th, td { border: 1px solid #cbd5e1; padding: 7px 10px; text-align: left;
           vertical-align: top; }
  th { background: #f1f5f9; font-weight: 650; }

  code { font-family: ui-monospace, "Cascadia Code", Consolas, monospace;
         font-size: 9.5pt; background: #f1f5f9; padding: 1px 5px; border-radius: 4px; }
  pre { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;
        padding: 12px 14px; overflow: hidden; page-break-inside: avoid; }
  pre code { background: none; padding: 0; font-size: 9pt; line-height: 1.45;
             white-space: pre; }

  figure.fig { margin: 16px 0 18px; page-break-inside: avoid; text-align: center; }
  figure.fig img { width: 100%; border: 1px solid #e2e8f0; border-radius: 10px; }
  figure.fig figcaption { font-size: 9.5pt; color: #5b6678; font-style: italic;
                          margin-top: 8px; }

  /* O cabeçalho de metadados (Company/Website/...) vem como parágrafo com <br>. */
  h1 + p { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;
           padding: 12px 16px; font-size: 10pt; line-height: 1.7; }
  em { color: #5b6678; }
</style></head>
<body>
${body}
</body></html>`;

writeFileSync(OUT_HTML, html, 'utf8');
console.log('HTML imprimível:', OUT_HTML);

// 5. Chrome headless -> PDF.
const args = [
  '--headless=new',
  '--disable-gpu',
  '--no-pdf-header-footer',
  '--print-to-pdf-no-header',
  `--print-to-pdf=${OUT_PDF}`,
  pathToFileURL(OUT_HTML).href,
];
const r = spawnSync(chrome, args, { encoding: 'utf8' });
if (r.status !== 0 && !existsSync(OUT_PDF)) {
  console.error('Falha ao gerar PDF.\n', r.stderr || r.stdout);
  process.exit(1);
}
console.log('PDF gerado:', OUT_PDF);
