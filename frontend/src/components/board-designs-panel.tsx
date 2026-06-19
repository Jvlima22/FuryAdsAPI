import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, Download, ImageOff, Loader2, Megaphone, Package, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Creative } from "@/lib/creatives";
import {
  collectBoardDesigns,
  collectFontCss,
  exportAllZip,
  exportDesign,
  renderThumbDataUrl,
  sanitizeName,
  type BoardDesign,
  type DesignFormat,
} from "@/lib/board-export";
import { groupBoardPieces } from "@/lib/board-campaigns";
import { useAccount } from "@/lib/account-context";
import { useManage, type GeneratedAd } from "@/lib/manage-store";
import { platformMeta } from "@/lib/accounts";
import { GenerateCampaignDialog } from "@/components/generate-campaign-dialog";

const FORMATS: { value: DesignFormat; label: string }[] = [
  { value: "png", label: "PNG" },
  { value: "jpg", label: "JPG" },
  { value: "svg", label: "SVG" },
];

function fmtDate(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

/**
 * Painel "Designs" do board: monta um iframe oculto same-origin, enumera as
 * peças, gera miniaturas e permite baixar cada uma (PNG/JPG/SVG) — com detalhe
 * por peça — além de "Baixar todos" num ZIP.
 */
export function BoardDesignsPanel({ creative }: { creative: Creative }) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const winRef = useRef<Window | null>(null);
  const fontCssRef = useRef<string>("");

  const [designs, setDesigns] = useState<BoardDesign[]>([]);
  const [thumbs, setThumbs] = useState<Record<string, string>>({});
  const thumbsRef = useRef<Record<string, string>>({});
  const [status, setStatus] = useState<"loading" | "ready" | "empty">("loading");
  const [selected, setSelected] = useState<BoardDesign | null>(null);
  const [detailUrl, setDetailUrl] = useState<string | null>(null);
  const [zipFormat, setZipFormat] = useState<DesignFormat>("png");
  const [zipping, setZipping] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  // Geração de campanhas a partir das peças.
  const [generating, setGenerating] = useState<string | null>(null);
  const [dlBusy, setDlBusy] = useState<string | null>(null);
  // Grupo pendente de confirmação no diálogo de geração.
  const [pending, setPending] = useState<{
    key: string;
    name: string;
    pieces: BoardDesign[];
    unified: boolean;
  } | null>(null);

  const { activeAccount, accounts } = useAccount();
  const store = useManage();

  // Carrosséis (1 campanha cada) + posts estáticos (campanha unificada) + reels/stories.
  const grouped = useMemo(() => groupBoardPieces(designs), [designs]);

  // "Espelhado nas duas contas da marca": todas as contas com a mesma brandKey
  // (Google + Meta). Sem brandKey, cai na conta ativa.
  const brandAccounts = useMemo(() => {
    const brand = activeAccount.brandKey;
    const list = brand ? accounts.filter((a) => a.brandKey === brand) : [];
    return list.length ? list : [activeAccount];
  }, [accounts, activeAccount]);

  const brandPlatforms = useMemo(
    () => [...new Set(brandAccounts.map((a) => a.platform))],
    [brandAccounts],
  );

  /** Rasteriza cada peça num thumb JPEG compacto (ad creativeSrc, leve p/ localStorage). */
  async function rasterizeAds(pieces: BoardDesign[]): Promise<GeneratedAd[]> {
    const win = winRef.current;
    if (!win) return [];
    const out: GeneratedAd[] = [];
    for (const p of pieces) {
      let src = thumbsRef.current[p.id] ?? "";
      try {
        src = await renderThumbDataUrl(win, p, fontCssRef.current, 300, "image/jpeg", 0.72);
      } catch {
        /* mantém o thumb PNG do índice se a rasterização falhar */
      }
      if (src) out.push({ name: p.label, src, kind: "image" });
    }
    return out;
  }

  /** Confirma o diálogo: gera a(s) campanha(s) nas contas da marca (espelhado). */
  async function confirmGenerate(name: string, budgetDailyMicros: number) {
    if (!pending || generating) return;
    setGenerating(pending.key);
    try {
      const ads = await rasterizeAds(pending.pieces);
      if (!ads.length) {
        toast.error("Não foi possível preparar os criativos desta seleção.");
        return;
      }
      for (const acc of brandAccounts)
        store.createCampaignWithAds(acc, { name, ads, budgetDailyMicros });
      toast.success(`Campanha "${name}" criada`, {
        description: `${ads.length} anúncios · ${brandAccounts.length} conta(s) · ${brandPlatforms
          .map((p) => platformMeta[p].label)
          .join(" + ")} · status pausado`,
      });
      setPending(null);
    } catch {
      toast.error("Falha ao gerar a campanha.");
    } finally {
      setGenerating(null);
    }
  }

  /** Baixa as peças de um grupo num ZIP (reusa o pipeline de export). */
  async function downloadGroup(key: string, name: string, pieces: BoardDesign[]) {
    const win = winRef.current;
    if (!win || dlBusy || !pieces.length) return;
    setDlBusy(key);
    try {
      await exportAllZip(win, pieces, fontCssRef.current, zipFormat, sanitizeName(`${creative.title}-${name}`));
    } finally {
      setDlBusy(null);
    }
  }

  function onFrameLoad() {
    const iframe = frameRef.current;
    const win = iframe?.contentWindow as Window | null;
    const doc = iframe?.contentDocument;
    if (!win || !doc) return;
    winRef.current = win;

    // Os boards compilam JSX em runtime (Babel standalone), então as peças só
    // aparecem alguns ticks depois do load — faz polling até achar (ou desistir).
    let tries = 0;
    const poll = window.setInterval(async () => {
      tries += 1;
      const found = collectBoardDesigns(doc);
      if (found.length) {
        window.clearInterval(poll);
        fontCssRef.current = await collectFontCss(win);
        setDesigns(found);
        setStatus("ready");
      } else if (tries > 50) {
        window.clearInterval(poll);
        setStatus("empty");
      }
    }, 150);
  }

  // Gera as miniaturas sequencialmente (evita 40+ rasterizações em paralelo).
  useEffect(() => {
    if (!designs.length || !winRef.current) return;
    let cancelled = false;
    (async () => {
      for (const d of designs) {
        if (cancelled) return;
        try {
          const url = await renderThumbDataUrl(winRef.current!, d, fontCssRef.current, 360);
          if (!cancelled) {
            thumbsRef.current[d.id] = url;
            setThumbs((t) => ({ ...t, [d.id]: url }));
          }
        } catch {
          /* ignora peça que falhar */
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [designs]);

  // Preview maior ao abrir o detalhe de uma peça.
  useEffect(() => {
    if (!selected || !winRef.current) {
      setDetailUrl(null);
      return;
    }
    let cancelled = false;
    setDetailUrl(thumbsRef.current[selected.id] ?? null); // thumb como placeholder
    (async () => {
      try {
        const url = await renderThumbDataUrl(winRef.current!, selected, fontCssRef.current, 900);
        if (!cancelled) setDetailUrl(url);
      } catch {
        /* mantém o thumb */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selected]);

  async function download(design: BoardDesign, format: DesignFormat) {
    if (!winRef.current) return;
    setBusy(`${design.id}:${format}`);
    try {
      await exportDesign(winRef.current, design, fontCssRef.current, format);
    } finally {
      setBusy(null);
    }
  }

  async function downloadAll() {
    if (!winRef.current || !designs.length) return;
    setZipping(true);
    try {
      await exportAllZip(winRef.current, designs, fontCssRef.current, zipFormat, sanitizeName(creative.title));
    } finally {
      setZipping(false);
    }
  }

  const date = fmtDate(creative.date);

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-muted/30">
      {/* iframe oculto same-origin — fonte dos nós das peças */}
      <iframe
        ref={frameRef}
        src={creative.src}
        title={`${creative.title} (fonte)`}
        onLoad={onFrameLoad}
        aria-hidden
        tabIndex={-1}
        style={{ position: "absolute", left: -99999, top: 0, width: 1280, height: 900, opacity: 0, pointerEvents: "none", border: 0 }}
      />

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 border-b border-border bg-white/70 px-4 py-2.5 backdrop-blur">
        <p className="text-xs text-muted-foreground">
          {status === "ready" ? `${designs.length} peças` : status === "loading" ? "Carregando peças..." : "Sem peças"}
        </p>
        <div className="flex items-center gap-2">
          <Select value={zipFormat} onValueChange={(v) => setZipFormat(v as DesignFormat)}>
            <SelectTrigger className="h-8 w-20"><SelectValue /></SelectTrigger>
            <SelectContent>
              {FORMATS.map((f) => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button size="sm" className="h-8 gap-1.5" disabled={status !== "ready" || zipping} onClick={downloadAll}>
            {zipping ? <Loader2 className="size-3.5 animate-spin" /> : <Package className="size-3.5" />}
            Baixar todos (ZIP)
          </Button>
        </div>
      </div>

      {/* Conteúdo */}
      {status === "loading" ? (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          <Loader2 className="mr-2 size-4 animate-spin" /> Renderizando as peças do board...
        </div>
      ) : status === "empty" ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <ImageOff className="size-7 text-muted-foreground" />
          <p className="mt-2 text-sm font-medium">Não foi possível ler as peças deste board</p>
          <p className="mt-1 max-w-xs text-xs text-muted-foreground">Use "Baixar HTML" / "Abrir em nova aba" no rodapé.</p>
        </div>
      ) : selected ? (
        // ── Detalhe de uma peça ───────────────────────────────────────────
        <DesignDetail
          design={selected}
          previewUrl={detailUrl}
          date={date}
          busy={busy}
          onBack={() => setSelected(null)}
          onDownload={download}
        />
      ) : (
        // ── Peças agrupadas: carrosséis (1 campanha cada) + posts (unificada) ──
        <div className="flex-1 space-y-6 overflow-y-auto p-4">
          {/* Resumo do destino da geração */}
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-violet/20 bg-violet/5 px-3 py-2 text-[11px] text-muted-foreground">
            <Sparkles className="size-3.5 text-violet" />
            <span>
              Campanhas serão criadas (pausadas) em{" "}
              <strong className="text-foreground">{brandAccounts.length} conta(s)</strong>:{" "}
              {brandPlatforms.map((p) => platformMeta[p].label).join(" + ")}.
            </span>
          </div>

          {grouped.carousels.map((g) => (
            <GroupSection
              key={g.key}
              icon={<Sparkles className="size-4 text-violet" />}
              title={g.name}
              subtitle={`${g.slides.length} slides · carrossel`}
              actions={
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1.5"
                    disabled={!!dlBusy}
                    onClick={() => downloadGroup(g.key, g.name, g.slides)}
                  >
                    {dlBusy === g.key ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
                    ZIP
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 gap-1.5 bg-gradient-to-r from-violet to-cyan text-white border-0 hover:opacity-90"
                    disabled={!!generating}
                    onClick={() => setPending({ key: g.key, name: g.name, pieces: g.slides, unified: false })}
                  >
                    {generating === g.key ? <Loader2 className="size-3.5 animate-spin" /> : <Megaphone className="size-3.5" />}
                    Criar campanha
                  </Button>
                </>
              }
            >
              {g.slides.map((d) => (
                <PieceCard key={d.id} d={d} thumb={thumbs[d.id]} onClick={() => setSelected(d)} />
              ))}
            </GroupSection>
          ))}

          {grouped.posts.length > 0 && (
            <GroupSection
              icon={<Megaphone className="size-4 text-violet" />}
              title="Posts estáticos"
              subtitle={`${grouped.posts.length} peças · campanha unificada`}
              actions={
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1.5"
                    disabled={!!dlBusy}
                    onClick={() => downloadGroup("posts", "posts", grouped.posts)}
                  >
                    {dlBusy === "posts" ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
                    ZIP
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 gap-1.5 bg-gradient-to-r from-violet to-cyan text-white border-0 hover:opacity-90"
                    disabled={!!generating}
                    onClick={() =>
                      setPending({
                        key: "posts",
                        name: `Posts estáticos · ${creative.title}`,
                        pieces: grouped.posts,
                        unified: true,
                      })
                    }
                  >
                    {generating === "posts" ? <Loader2 className="size-3.5 animate-spin" /> : <Megaphone className="size-3.5" />}
                    Criar campanha unificada
                  </Button>
                </>
              }
            >
              {grouped.posts.map((d) => (
                <PieceCard key={d.id} d={d} thumb={thumbs[d.id]} onClick={() => setSelected(d)} />
              ))}
            </GroupSection>
          )}

          {(["reels", "stories"] as const).map((kind) =>
            grouped[kind].length > 0 ? (
              <GroupSection
                key={kind}
                icon={<Package className="size-4 text-muted-foreground" />}
                title={kind === "reels" ? "Reels" : "Stories"}
                subtitle={`${grouped[kind].length} peças · somente download`}
                actions={
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1.5"
                    disabled={!!dlBusy}
                    onClick={() => downloadGroup(kind, kind, grouped[kind])}
                  >
                    {dlBusy === kind ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
                    ZIP
                  </Button>
                }
              >
                {grouped[kind].map((d) => (
                  <PieceCard key={d.id} d={d} thumb={thumbs[d.id]} onClick={() => setSelected(d)} />
                ))}
              </GroupSection>
            ) : null,
          )}
        </div>
      )}

      <GenerateCampaignDialog
        open={!!pending}
        onOpenChange={(o) => !o && setPending(null)}
        defaultName={pending?.name ?? ""}
        unified={pending?.unified ?? false}
        pieces={pending?.pieces ?? []}
        thumbs={thumbs}
        accounts={brandAccounts}
        busy={!!generating}
        onConfirm={confirmGenerate}
      />
    </div>
  );
}

function DesignDetail({
  design,
  previewUrl,
  date,
  busy,
  onBack,
  onDownload,
}: {
  design: BoardDesign;
  previewUrl: string | null;
  date: string | null;
  busy: string | null;
  onBack: () => void;
  onDownload: (design: BoardDesign, format: DesignFormat) => void;
}) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
      {/* Preview */}
      <div className="relative flex flex-1 items-center justify-center overflow-auto bg-[hsl(30_20%_88%)] p-6">
        <button
          onClick={onBack}
          className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-lg border border-border bg-white/90 px-2.5 py-1.5 text-xs font-medium backdrop-blur hover:bg-white"
        >
          <ArrowLeft className="size-3.5" /> Voltar
        </button>
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={design.label}
            className="max-h-full max-w-full rounded-md object-contain shadow-xl"
          />
        ) : (
          <Loader2 className="size-5 animate-spin text-foreground/40" />
        )}
      </div>

      {/* Detalhes + downloads */}
      <div className="w-full shrink-0 space-y-4 border-t border-border bg-white p-5 md:w-72 md:border-l md:border-t-0">
        <div>
          <p className="font-display text-base font-semibold leading-tight">{design.label}</p>
          {design.section && <p className="mt-0.5 text-xs text-muted-foreground">{design.section}</p>}
        </div>

        <dl className="space-y-2 text-sm">
          <Row label="Dimensões" value={`${design.width} × ${design.height}px`} />
          {date && <Row label="Criado em" value={date} />}
          <Row label="Formato" value="PNG · JPG · SVG" />
        </dl>

        <div className="space-y-2 pt-1">
          <p className="text-xs font-medium text-muted-foreground">Baixar</p>
          <div className="grid grid-cols-3 gap-2">
            {FORMATS.map((f) => {
              const isBusy = busy === `${design.id}:${f.value}`;
              return (
                <Button
                  key={f.value}
                  variant="outline"
                  size="sm"
                  className="h-9 gap-1.5"
                  disabled={!!busy}
                  onClick={() => onDownload(design, f.value)}
                >
                  {isBusy ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
                  {f.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-2 last:border-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn("font-medium tabular-nums")}>{value}</dd>
    </div>
  );
}

/** Seção de um grupo de peças (carrossel / posts / reels) com ações no topo. */
function GroupSection({
  icon,
  title,
  subtitle,
  actions,
  children,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  actions: ReactNode;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-violet/10">{icon}</span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-tight">{title}</p>
            <p className="truncate text-[11px] text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{children}</div>
    </section>
  );
}

/** Card de uma peça do board (thumbnail + label) — abre o detalhe ao clicar. */
function PieceCard({ d, thumb, onClick }: { d: BoardDesign; thumb?: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group overflow-hidden rounded-xl border border-border/70 bg-white text-left transition-all hover:-translate-y-0.5 hover:border-violet/40 hover:shadow-lg hover:shadow-violet/10"
    >
      <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-muted/50">
        {thumb ? (
          <img src={thumb} alt={d.label} className="h-full w-full object-contain" />
        ) : (
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        )}
      </div>
      <div className="p-2">
        <p className="truncate text-[11px] font-medium">{d.label}</p>
        {d.section && <p className="truncate text-[10px] text-muted-foreground">{d.section}</p>}
      </div>
    </button>
  );
}
