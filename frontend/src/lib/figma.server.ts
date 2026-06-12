import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createServerFn } from "@tanstack/react-start";

import { parseFigmaFileKey, type FigmaFileIndex, type FigmaPage } from "./figma";

/**
 * Server-only Figma access. The personal access token is read from the
 * environment (or, as a dev convenience, parsed from `frontend/.env`) and is
 * never sent to the client — only rendered image URLs cross the wire.
 */

const FIGMA_API = "https://api.figma.com/v1";

type FigmaNode = {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
};

/** Reads the Figma token from env, with a dev fallback to frontend/.env. */
function getToken(): string | undefined {
  let token = process.env.FIGMA_TOKEN?.trim();
  if (!token) {
    try {
      const env = readFileSync(resolve(process.cwd(), ".env"), "utf8");
      for (const line of env.split(/\r?\n/)) {
        const m = line.match(/^\s*FIGMA_TOKEN\s*=\s*(.*)$/);
        if (m) token = m[1].trim();
      }
    } catch {
      /* no .env on disk — rely on process.env */
    }
  }
  return token;
}

/** Collect FRAME nodes that sit directly on a page (CANVAS) or inside a SECTION. */
function collectFrames(node: FigmaNode, parentType: string, out: { id: string; name: string }[]) {
  if (node.type === "FRAME" && (parentType === "CANVAS" || parentType === "SECTION")) {
    out.push({ id: node.id, name: node.name });
  }
  for (const child of node.children ?? []) collectFrames(child, node.type, out);
}

/** Reads the file structure (pages → frames). No images — fast index call. */
export const fetchFigmaFile = createServerFn({ method: "GET" })
  .validator((fileKeyOrLink: string) => fileKeyOrLink)
  .handler(async ({ data: fileKeyOrLink }): Promise<FigmaFileIndex> => {
    const token = getToken();
    const fileKey = parseFigmaFileKey(fileKeyOrLink ?? "");
    if (!token) throw new Error("FIGMA_TOKEN ausente — preencha o frontend/.env.");
    if (!fileKey) throw new Error("Esta conta não tem um arquivo Figma vinculado.");

    const res = await fetch(`${FIGMA_API}/files/${fileKey}?depth=3`, {
      headers: { "X-Figma-Token": token },
    });
    if (!res.ok) {
      const detail = res.status === 403 ? " (token sem acesso a este arquivo)" : res.status === 404 ? " (arquivo não encontrado)" : "";
      throw new Error(`Figma respondeu ${res.status} ao ler o arquivo${detail}.`);
    }

    const data = (await res.json()) as {
      name: string;
      lastModified: string;
      document: FigmaNode;
    };

    const pages: FigmaPage[] = (data.document.children ?? []).map((page) => {
      const frames: { id: string; name: string }[] = [];
      for (const child of page.children ?? []) collectFrames(child, "CANVAS", frames);
      return { id: page.id, name: page.name, frames };
    });

    return { fileName: data.name, lastModified: data.lastModified, fileKey, pages };
  });

/** Renders a set of node ids to PNG URLs (Figma S3, short-lived). Batched + parallel. */
export const renderFigmaNodes = createServerFn({ method: "POST" })
  .validator((input: { fileKey: string; ids: string[] }) => input)
  .handler(async ({ data: { fileKey: fileKeyOrLink, ids } }): Promise<Record<string, string>> => {
    const token = getToken();
    const fileKey = parseFigmaFileKey(fileKeyOrLink ?? "");
    if (!token || !fileKey) throw new Error("Configuração do Figma ausente.");
    if (!ids.length) return {};

    const BATCH = 40;
    const chunks: string[][] = [];
    for (let i = 0; i < ids.length; i += BATCH) chunks.push(ids.slice(i, i + BATCH));

    const maps = await Promise.all(
      chunks.map(async (chunk) => {
        const url = `${FIGMA_API}/images/${fileKey}?ids=${encodeURIComponent(chunk.join(","))}&format=png&scale=1`;
        const res = await fetch(url, { headers: { "X-Figma-Token": token } });
        if (!res.ok) throw new Error(`Figma respondeu ${res.status} ao renderizar imagens.`);
        const json = (await res.json()) as { images: Record<string, string | null> };
        return json.images ?? {};
      }),
    );

    const out: Record<string, string> = {};
    for (const images of maps) {
      for (const [id, link] of Object.entries(images)) {
        if (link) out[id] = link;
      }
    }
    return out;
  });
