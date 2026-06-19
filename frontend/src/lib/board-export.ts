/**
 * Exporta peças individuais de um board do Claude Design (same-origin iframe).
 *
 * Porta o pipeline já testado de `public/claude-designs/tgl-posts/design-canvas.jsx`
 * (`dcExport`): clona o nó da peça, **assa os computed styles**, embute
 * `@font-face` / `<img>` / `background-image` como data-URI e serializa num
 * `<svg><foreignObject>`. Desse único artefato saem:
 *   - SVG  → a própria string (download `.svg`, vetorial/self-contained);
 *   - PNG  → `<img>`→`<canvas>`→`toBlob('image/png')` (3×);
 *   - JPG  → idem com fundo branco (`image/jpeg`).
 *
 * Tudo roda contra a `window` do iframe (getComputedStyle/fonts/styleSheets do
 * board), garantido pelo same-origin. A rasterização ocorre no contexto do app
 * — data-URIs são origin-independent, então o canvas não fica "tainted".
 */
import JSZip from "jszip";

export type DesignFormat = "png" | "jpg" | "svg";

export type BoardDesign = {
  id: string;
  label: string;
  section?: string;
  node: HTMLElement;
  width: number;
  height: number;
};

const RASTER_SCALE = 3;

// ── Enumeração das peças ────────────────────────────────────────────────────

/** Tamanho nativo (sem `zoom`) a partir do style inline, com fallback no offset. */
function readNativeSize(el: HTMLElement): { width: number; height: number } {
  const sw = parseFloat(el.style.width);
  const sh = parseFloat(el.style.height);
  if (Number.isFinite(sw) && Number.isFinite(sh) && sw > 0 && sh > 0) {
    return { width: Math.round(sw), height: Math.round(sh) };
  }
  return { width: el.offsetWidth, height: el.offsetHeight };
}

/**
 * Enumera as peças de um board carregado. Suporta os dois formatos em uso:
 *  - DesignCanvas: cada `[data-dc-slot]` → `.dc-card`.
 *  - vt-row (Vintech): cada `.vt-frame`.
 */
export function collectBoardDesigns(doc: Document): BoardDesign[] {
  const slots = Array.from(doc.querySelectorAll<HTMLElement>("[data-dc-slot]"));
  if (slots.length) {
    const out: BoardDesign[] = [];
    slots.forEach((slot) => {
      const card = slot.querySelector<HTMLElement>(".dc-card");
      if (!card) return;
      const id = slot.getAttribute("data-dc-slot") || `slot-${out.length}`;
      const label = slot.querySelector(".dc-labeltext")?.textContent?.trim() || id;
      const section =
        slot.closest<HTMLElement>("[data-dc-section]")?.querySelector(".dc-sectionhead")?.textContent?.trim() ||
        undefined;
      const { width, height } = readNativeSize(card);
      out.push({ id, label, section, node: card, width, height });
    });
    return out;
  }

  const frames = Array.from(doc.querySelectorAll<HTMLElement>(".vt-frame"));
  return frames.map((frame, i) => {
    const label =
      frame.getAttribute("data-name") || frame.getAttribute("data-figma-name") || `design-${i + 1}`;
    const section =
      frame.closest<HTMLElement>(".vt-group")?.querySelector(".vt-group-title")?.textContent?.trim() || undefined;
    const { width, height } = readNativeSize(frame);
    return { id: `vt-${i}`, label, section, node: frame, width, height };
  });
}

// ── Captura ─────────────────────────────────────────────────────────────────

function fetchDataUrl(url: string): Promise<string> {
  return fetch(url)
    .then((r) => r.blob())
    .then(
      (b) =>
        new Promise<string>((res) => {
          const fr = new FileReader();
          fr.onload = () => res(fr.result as string);
          fr.onerror = () => res(url);
          fr.readAsDataURL(b);
        }),
    )
    .catch(() => url);
}

/**
 * Coleta as regras `@font-face` do board (uma vez por board) com as urls de
 * fonte já inlined como data-URI. Sheets cross-origin (fonts.googleapis.com)
 * são buscadas via fetch direto (mandam ACAO:*) e regex-extraídas.
 */
export async function collectFontCss(win: Window): Promise<string> {
  const doc = win.document;
  try {
    await doc.fonts?.ready;
  } catch {
    /* ignore */
  }
  const fontRules: { css: string; base: string }[] = [];
  const pending: Promise<void>[] = [];
  const seen = new Set<string>();

  const scrapeCss = (href: string) => {
    if (seen.has(href)) return;
    seen.add(href);
    pending.push(
      fetch(href)
        .then((r) => r.text())
        .then((css) => {
          for (const m of css.match(/@font-face\s*{[^}]*}/g) || []) fontRules.push({ css: m, base: href });
          for (const m of css.matchAll(/@import\s+(?:url\()?['"]?([^'")\s;]+)/g))
            scrapeCss(new URL(m[1], href).href);
        })
        .catch(() => {}),
    );
  };
  const walk = (rules: CSSRuleList, base: string) => {
    for (const r of Array.from(rules)) {
      const rule = r as CSSRule & { styleSheet?: CSSStyleSheet; cssRules?: CSSRuleList };
      if (rule.type === CSSRule.FONT_FACE_RULE) fontRules.push({ css: rule.cssText, base });
      else if (rule.type === CSSRule.IMPORT_RULE && rule.styleSheet) {
        const ibase = rule.styleSheet.href || base;
        try {
          walk(rule.styleSheet.cssRules, ibase);
        } catch {
          scrapeCss(ibase);
        }
      } else if (rule.cssRules) walk(rule.cssRules, base);
    }
  };
  for (const ss of Array.from(doc.styleSheets)) {
    const base = ss.href || win.location.href;
    try {
      walk(ss.cssRules, base);
    } catch {
      if (ss.href) scrapeCss(ss.href);
    }
  }
  while (pending.length) await pending.shift();

  return (
    await Promise.all(
      fontRules.map(async (rule) => {
        let out = rule.css;
        let m: RegExpExecArray | null;
        const re = /url\((['"]?)([^'")]+)\1\)/g;
        while ((m = re.exec(rule.css))) {
          if (m[2].indexOf("data:") === 0) continue;
          let abs: string;
          try {
            abs = new URL(m[2], rule.base).href;
          } catch {
            continue;
          }
          out = out.split(m[0]).join('url("' + (await fetchDataUrl(abs)) + '")');
        }
        return out;
      }),
    )
  ).join("\n");
}

/**
 * Clona um nó com os computed styles assados + imagens inlined, e serializa o
 * HTML. Neutraliza `zoom` (vt-frame usa 0.3) e força w/h nativos no root.
 */
async function prepareDesignXml(win: Window, node: HTMLElement, w: number, h: number): Promise<string> {
  const doc = win.document;

  const cloneStyled = (src: Node): Node => {
    if (src.nodeType === 8 || (src.nodeType === 1 && (src as Element).tagName === "SCRIPT"))
      return doc.createTextNode("");
    const dst = src.cloneNode(false);
    if (src.nodeType === 1) {
      const el = src as Element;
      const cs = win.getComputedStyle(el);
      let txt = "";
      for (let i = 0; i < cs.length; i++) txt += cs[i] + ":" + cs.getPropertyValue(cs[i]) + ";";
      (dst as Element).setAttribute("style", txt + "animation:none;transition:none;");
      if (el.tagName === "CANVAS") {
        try {
          const im = doc.createElement("img");
          im.src = (el as HTMLCanvasElement).toDataURL();
          im.setAttribute("style", txt);
          return im;
        } catch {
          /* fall through to normal clone */
        }
      }
    }
    for (let c = src.firstChild; c; c = c.nextSibling) dst.appendChild(cloneStyled(c));
    return dst;
  };

  const clone = cloneStyled(node) as HTMLElement;
  clone.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
  clone.style.boxShadow = "none";
  clone.style.borderRadius = "0";
  clone.style.margin = "0";
  clone.style.zoom = "1"; // neutraliza o zoom:0.3 das vt-frame
  clone.style.width = w + "px";
  clone.style.height = h + "px";

  // <img>: resolve o src bruto contra a base do board e inline como data-URI.
  const jobs: Promise<void>[] = [];
  clone.querySelectorAll("img").forEach((el) => {
    const s = el.getAttribute("src");
    if (!s || s.indexOf("data:") === 0) return;
    let abs: string;
    try {
      abs = new URL(s, win.location.href).href;
    } catch {
      abs = s;
    }
    jobs.push(fetchDataUrl(abs).then((d) => el.setAttribute("src", d)));
  });
  // background-image (já absoluto no computed style) → data-URI.
  [clone, ...Array.from(clone.querySelectorAll<HTMLElement>("*"))].forEach((el) => {
    const bg = el.style.backgroundImage;
    if (!bg) return;
    let m: RegExpExecArray | null;
    const re = /url\(["']?([^"')]+)["']?\)/g;
    while ((m = re.exec(bg))) {
      const tok = m[0];
      const url = m[1];
      if (url.indexOf("data:") === 0) continue;
      jobs.push(
        fetchDataUrl(url).then((d) => {
          el.style.backgroundImage = el.style.backgroundImage.split(tok).join('url("' + d + '")');
        }),
      );
    }
  });
  await Promise.all(jobs);

  return new XMLSerializer().serializeToString(clone);
}

function composeSvg(xml: string, fontCss: string, w: number, h: number, scale: number): string {
  return (
    '<svg xmlns="http://www.w3.org/2000/svg" width="' +
    w * scale +
    '" height="' +
    h * scale +
    '" viewBox="0 0 ' +
    w +
    " " +
    h +
    '"><foreignObject width="' +
    w +
    '" height="' +
    h +
    '">' +
    (fontCss ? "<style><![CDATA[" + fontCss + "]]></style>" : "") +
    xml +
    "</foreignObject></svg>"
  );
}

function rasterize(
  svg: string,
  outW: number,
  outH: number,
  type: "image/png" | "image/jpeg",
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const cv = document.createElement("canvas");
      cv.width = outW;
      cv.height = outH;
      const ctx = cv.getContext("2d");
      if (!ctx) return reject(new Error("canvas 2d indisponível"));
      if (type === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, outW, outH);
      }
      ctx.drawImage(img, 0, 0, outW, outH);
      cv.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("toBlob falhou"))),
        type,
        type === "image/jpeg" ? (quality ?? 0.92) : undefined,
      );
    };
    img.onerror = () => reject(new Error("falha ao carregar o SVG"));
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  });
}

/** Gera o blob de uma peça no formato pedido (+ extensão sugerida). */
export async function designToBlob(
  win: Window,
  design: BoardDesign,
  fontCss: string,
  format: DesignFormat,
): Promise<{ blob: Blob; ext: string }> {
  const xml = await prepareDesignXml(win, design.node, design.width, design.height);
  if (format === "svg") {
    const svg = composeSvg(xml, fontCss, design.width, design.height, 1);
    return { blob: new Blob([svg], { type: "image/svg+xml" }), ext: "svg" };
  }
  const svg = composeSvg(xml, fontCss, design.width, design.height, RASTER_SCALE);
  const type = format === "jpg" ? "image/jpeg" : "image/png";
  const blob = await rasterize(svg, design.width * RASTER_SCALE, design.height * RASTER_SCALE, type);
  return { blob, ext: format };
}

/**
 * Miniatura (data-URL) ajustada a `maxPx`. PNG por padrão (índice de peças);
 * use `image/jpeg` + `quality` para thumbs compactos de anúncio (ficam num
 * `<img src>` e são persistidos no localStorage — evitar PNG pesado aqui).
 */
export async function renderThumbDataUrl(
  win: Window,
  design: BoardDesign,
  fontCss: string,
  maxPx = 360,
  type: "image/png" | "image/jpeg" = "image/png",
  quality?: number,
): Promise<string> {
  const xml = await prepareDesignXml(win, design.node, design.width, design.height);
  const scale = Math.min(1, maxPx / Math.max(design.width, design.height));
  const svg = composeSvg(xml, fontCss, design.width, design.height, scale);
  const blob = await rasterize(
    svg,
    Math.round(design.width * scale),
    Math.round(design.height * scale),
    type,
    quality,
  );
  return await blobToDataUrl(blob);
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((res) => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result as string);
    fr.readAsDataURL(blob);
  });
}

// ── Download ────────────────────────────────────────────────────────────────

export function sanitizeName(s: string): string {
  return (s || "design").replace(/[^\w\s.-]+/g, "_").replace(/\s+/g, "_").slice(0, 80);
}

function saveBlob(blob: Blob, filename: string): void {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

/** Baixa UMA peça no formato escolhido. */
export async function exportDesign(
  win: Window,
  design: BoardDesign,
  fontCss: string,
  format: DesignFormat,
): Promise<void> {
  const { blob, ext } = await designToBlob(win, design, fontCss, format);
  saveBlob(blob, `${sanitizeName(design.label)}.${ext}`);
}

/** Baixa TODAS as peças do board num único `.zip` (nomes = labels, prefixados). */
export async function exportAllZip(
  win: Window,
  designs: BoardDesign[],
  fontCss: string,
  format: DesignFormat,
  zipName: string,
): Promise<void> {
  const zip = new JSZip();
  const pad = (n: number) => String(n + 1).padStart(2, "0");
  for (let i = 0; i < designs.length; i++) {
    const d = designs[i];
    const { blob, ext } = await designToBlob(win, d, fontCss, format);
    zip.file(`${pad(i)}-${sanitizeName(d.label)}.${ext}`, blob);
  }
  const out = await zip.generateAsync({ type: "blob" });
  saveBlob(out, `${sanitizeName(zipName)}.zip`);
}
