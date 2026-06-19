/**
 * Biblioteca de criativos POR CONTA — fonte única para a galeria e para o
 * "usar na campanha".
 *
 * Junta duas origens já existentes no projeto, escopadas pela marca da conta:
 *  - Imagens prontas (SVG) em `public/creatives/<brand>/` — criativos de anúncio
 *    direto-ao-uso (download imediato).
 *  - Boards do Claude Design (`claudeDesignProjects`), filtrados por `brandKey`.
 *
 * Contas sem criativos retornam lista vazia (a galeria esconde a fonte).
 */
import type { AdAccount, BrandKey } from "./accounts";
import { claudeDesignProjects } from "./claude-designs";

export type CreativeKind = "image" | "board";

export type Creative = {
  id: string;
  title: string;
  kind: CreativeKind;
  /** Caminho servido de /public (SVG p/ imagem, HTML p/ board). */
  src: string;
  /** Rótulo curto (ex.: "Imagem · 1200×675" ou "5 carrosséis · 28 slides"). */
  group: string;
  /** Tom usado no card de board (reusa o estilo da galeria). */
  thumbTone?: "wine" | "neutral";
  /** Nome sugerido ao baixar. */
  downloadName: string;
  /** Data de criação/sync (ISO) — só para boards do Claude Design. */
  date?: string;
};

/** Criativos de imagem prontos, por marca. Hoje só a TGL tem assets. */
const IMAGE_CREATIVES: Partial<Record<BrandKey, Creative[]>> = {
  tgl: [
    ["ct-001", "A Tese"],
    ["ct-002", "Dor Real"],
    ["ct-003", "Agentes de IA"],
    ["ct-004", "A Solução"],
    ["ct-005", "Manual Prático"],
    ["ct-006", "A Entrega"],
  ].map(([file, title]) => ({
    id: `img-tgl-${file}`,
    title,
    kind: "image" as const,
    src: `/creatives/tgl/${file}.svg`,
    group: "Imagem · 1200×675",
    downloadName: `tgl-${file}.svg`,
  })),
};

function slug(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Boards do Claude Design pertencentes à marca da conta. */
function boardCreatives(brand?: BrandKey): Creative[] {
  if (!brand) return [];
  return claudeDesignProjects
    .filter((p) => p.brandKey === brand)
    .flatMap((p) =>
      p.designs.map((d) => ({
        id: `board-${p.projectId}-${d.id}`,
        title: d.title,
        kind: "board" as const,
        src: d.path,
        group: d.group,
        thumbTone: d.tone,
        downloadName: `${slug(p.name)}-${d.id}.html`,
        date: p.createdAt,
      })),
    );
}

/** Todos os criativos disponíveis para a conta (imagens + boards). */
export function creativesForAccount(account: AdAccount): Creative[] {
  const images = account.brandKey ? IMAGE_CREATIVES[account.brandKey] ?? [] : [];
  return [...images, ...boardCreatives(account.brandKey)];
}

/** Dispara o download de um criativo (âncora programática same-origin). */
export function downloadCreative(creative: Creative): void {
  const a = document.createElement("a");
  a.href = creative.src;
  a.download = creative.downloadName;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
