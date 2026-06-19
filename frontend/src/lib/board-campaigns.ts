/**
 * Classifica e agrupa as peças de um board (do `collectBoardDesigns`) em
 * carrosséis, posts estáticos, reels e stories — base para gerar campanhas a
 * partir do preview.
 *
 * A classificação usa a `section` (ex.: "Carrossel A — Preço secreto da
 * planilha", "Posts unitários", "Reels · Storyboards", "Stories — …") com
 * fallback no `label`. Carrossel = todas as peças que compartilham a mesma
 * seção "Carrossel …" (1 grupo por seção). Posts = todas as peças estáticas
 * agregadas (campanha unificada). Reels/stories ficam fora da geração.
 */
import type { BoardDesign } from "./board-export";

export type PieceType = "carousel" | "post" | "reel" | "story";

/** Grupo de carrossel: uma seção "Carrossel …" com seus slides em ordem. */
export type CarouselGroup = {
  /** Chave estável (a própria seção). */
  key: string;
  /** Nome para a campanha (a seção, limpa). */
  name: string;
  slides: BoardDesign[];
};

export type BoardPieces = {
  carousels: CarouselGroup[];
  /** Todos os posts estáticos do board (campanha unificada). */
  posts: BoardDesign[];
  reels: BoardDesign[];
  stories: BoardDesign[];
};

/** Tipo de uma peça a partir da seção/label. Ordem importa (reel antes de story). */
export function classifyPiece(design: BoardDesign): PieceType {
  const s = `${design.section ?? ""} ${design.label ?? ""}`.toLowerCase();
  if (/carross|carousel|carrousel/.test(s)) return "carousel";
  if (/reel/.test(s)) return "reel";
  if (/stories|story\b|story\s|stor[íi]/.test(s)) return "story";
  return "post";
}

/** Nome de campanha a partir da seção (sem contadores tipo "· 6 slides"). */
function cleanName(section: string): string {
  return section
    .replace(/·\s*\d+\s*(slides?|pe[çc]as?|frames?).*$/i, "")
    .replace(/\s+—\s*$/, "")
    .trim();
}

/** Agrupa as peças do board por tipo (carrosséis por seção; posts agregados). */
export function groupBoardPieces(designs: BoardDesign[]): BoardPieces {
  const carouselMap = new Map<string, CarouselGroup>();
  const posts: BoardDesign[] = [];
  const reels: BoardDesign[] = [];
  const stories: BoardDesign[] = [];

  for (const d of designs) {
    const type = classifyPiece(d);
    if (type === "carousel") {
      const key = d.section?.trim() || d.label || "Carrossel";
      let group = carouselMap.get(key);
      if (!group) {
        group = { key, name: cleanName(key), slides: [] };
        carouselMap.set(key, group);
      }
      group.slides.push(d);
    } else if (type === "reel") {
      reels.push(d);
    } else if (type === "story") {
      stories.push(d);
    } else {
      posts.push(d);
    }
  }

  return { carousels: [...carouselMap.values()], posts, reels, stories };
}
