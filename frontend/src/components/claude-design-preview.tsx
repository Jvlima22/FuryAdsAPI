import { useCallback, useEffect, useRef, useState } from "react";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
  type ReactZoomPanPinchContentRef,
} from "react-zoom-pan-pinch";
import { ZoomIn, ZoomOut, Scan } from "lucide-react";

/**
 * Zoomable / pannable preview for a Claude Design board.
 *
 * The board is a self-contained, same-origin HTML page served from /public, so
 * we measure its real content size and size the <iframe> to it — then let
 * react-zoom-pan-pinch handle free 2D pan + wheel/pinch/double-click zoom over
 * the whole board (no competing internal iframe scroll). The iframe itself is
 * pointer-events:none so dragging-to-pan works on top of it.
 *
 * Crucially, the iframe width is the WIDEST carousel row (not just the host
 * width): each `.vt-row` is `overflow-x:auto`, so a row wider than the iframe
 * would clip — and since the iframe can't be scrolled (pointer-events:none),
 * its last slides would be unreachable. Sizing the iframe to the widest row
 * (read via `.vt-row` scrollWidth, which reports full content width even while
 * clipped) makes every slide laid out and visible; we then fit-to-width on load
 * so the full board width shows at once and you pan vertically through groups.
 */

function ZoomControls({ onFit }: { onFit: () => void }) {
  const { zoomIn, zoomOut } = useControls();
  const btn =
    "size-8 flex items-center justify-center rounded-lg text-foreground/70 hover:bg-accent hover:text-foreground transition-colors";
  return (
    <div className="absolute right-3 top-3 z-10 flex flex-col gap-0.5 rounded-xl border border-border/60 bg-white/90 p-1 shadow-sm backdrop-blur">
      <button type="button" onClick={() => zoomIn()} className={btn} title="Aproximar">
        <ZoomIn className="size-4" />
      </button>
      <button type="button" onClick={() => zoomOut()} className={btn} title="Afastar">
        <ZoomOut className="size-4" />
      </button>
      <button type="button" onClick={onFit} className={btn} title="Ajustar à largura">
        <Scan className="size-4" />
      </button>
    </div>
  );
}

export function ClaudeDesignPreview({
  src,
  title,
}: {
  src: string;
  title: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const apiRef = useRef<ReactZoomPanPinchContentRef | null>(null);
  const [hostW, setHostW] = useState(0);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  // Track the available preview width so we can fit-to-width once measured.
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setHostW(el.clientWidth));
    ro.observe(el);
    setHostW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const measure = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    const h = Math.max(
      doc.documentElement?.scrollHeight ?? 0,
      doc.body?.scrollHeight ?? 0,
    );
    // Widest carousel row: scrollWidth is the full content width even while the
    // row clips its overflow — so the iframe can be sized to contain every
    // slide (nothing cut), with shorter rows just left-aligned.
    let rowW = 0;
    doc.querySelectorAll<HTMLElement>(".vt-row").forEach((r) => {
      rowW = Math.max(rowW, r.scrollWidth);
    });
    const w = Math.max(hostW, rowW);
    if (h > 0 && w > 0) setSize({ w, h });
  }, [hostW]);

  // Re-measure when the width changes (content reflows to the new width).
  useEffect(() => {
    measure();
  }, [hostW, measure]);

  // Late-loading images inside the board grow it after onLoad — observe the
  // same-origin content body so the iframe always covers the full board.
  const contentRO = useRef<ResizeObserver | null>(null);
  const observeContent = useCallback(() => {
    measure();
    contentRO.current?.disconnect();
    const body = iframeRef.current?.contentDocument?.body;
    if (!body) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(body);
    contentRO.current = ro;
  }, [measure]);

  useEffect(() => () => contentRO.current?.disconnect(), []);

  // Fit-to-width: scale so the full board width (widest carousel included) fits
  // the host, aligned to the top — then pan vertically through the groups.
  const fitWidth = useCallback(() => {
    if (!size || !hostW || !apiRef.current) return;
    apiRef.current.setTransform(0, 0, Math.min(1, hostW / size.w), 0);
  }, [size, hostW]);

  // Auto-fit once per board+width (a stable key) so late content height changes
  // don't yank a panned view back to the top; the "Ajustar à largura" button
  // re-fits on demand.
  const fitKey = useRef("");
  useEffect(() => {
    if (!size || !hostW) return;
    const key = `${src}@${hostW}`;
    if (fitKey.current === key) return;
    fitKey.current = key;
    fitWidth();
  }, [size, hostW, src, fitWidth]);

  const dims = {
    width: size?.w ?? "100%",
    height: size?.h ?? "100%",
  };

  return (
    <div
      ref={hostRef}
      className="relative flex-1 overflow-hidden"
      style={{ background: "hsl(30 20% 88%)" }}
    >
      <TransformWrapper
        ref={apiRef}
        initialScale={1}
        minScale={0.2}
        maxScale={6}
        centerOnInit={false}
        wheel={{ step: 0.002, activationKeys: ["Control"] }}
        doubleClick={{ step: 0.5 }}
        panning={{ velocityDisabled: false }}
      >
        <ZoomControls onFit={fitWidth} />
        <TransformComponent
          wrapperStyle={{ width: "100%", height: "100%" }}
          contentStyle={dims}
        >
          <iframe
            ref={iframeRef}
            src={src}
            title={title}
            onLoad={observeContent}
            scrolling="no"
            className="block border-0"
            style={{
              ...dims,
              pointerEvents: "none",
              background: "hsl(30 20% 88%)",
            }}
          />
        </TransformComponent>
      </TransformWrapper>

      <div className="pointer-events-none absolute bottom-3 left-3 z-10 rounded-lg bg-foreground/70 px-2.5 py-1 text-[10px] font-medium text-background/90 backdrop-blur">
        Ctrl + scroll = zoom · arrastar = mover · duplo-clique = aproximar
      </div>
    </div>
  );
}
