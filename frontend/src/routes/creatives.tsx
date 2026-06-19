import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Images,
  RefreshCw,
  Search,
  AlertCircle,
  FileWarning,
  ExternalLink,
  Link2,
  Sparkles,
  Maximize2,
  Download,
  Megaphone,
  CheckCircle2,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { GlassCard } from "@/components/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddAccountDialog } from "@/components/add-account-dialog";
import { ManageAccountsDialog } from "@/components/manage-accounts-dialog";
import { CreativeThumb } from "@/components/creative-picker-dialog";
import { BoardDesignsPanel } from "@/components/board-designs-panel";
import { fetchFigmaFile, renderFigmaNodes } from "@/lib/figma.server";
import { relativeTime } from "@/lib/activity";
import { useAccount } from "@/lib/account-context";
import { platformMeta, type AdAccount } from "@/lib/accounts";
import { creativesForAccount, downloadCreative, type Creative } from "@/lib/creatives";
import { useManage } from "@/lib/manage-store";
import { ClaudeDesignPreview } from "@/components/claude-design-preview";
import { cn } from "@/lib/utils";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import "yet-another-react-lightbox/plugins/captions.css";

export const Route = createFileRoute("/creatives")({
  head: () => ({
    meta: [
      { title: "Criativos · Metrik" },
      { name: "description", content: "Galeria de criativos: Figma (ao vivo via API) e Claude Design (renderizado em iframe)." },
    ],
  }),
  component: CreativesPage,
});

const PAGE_SIZE = 24;
type Source = "figma" | "claude";

function CreativesPage() {
  const qc = useQueryClient();
  const { activeAccount } = useAccount();
  const figmaKey = activeAccount.figmaFileKey ?? "";
  const hasFigma = !!figmaKey;
  // Criativos da conta (imagens prontas + boards do Claude Design), escopados pela marca.
  const accountCreatives = useMemo(() => creativesForAccount(activeAccount), [activeAccount]);
  const hasClaude = accountCreatives.length > 0;

  const [source, setSource] = useState<Source>("figma");
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [figmaOpen, setFigmaOpen] = useState(false);
  const [figmaIndex, setFigmaIndex] = useState(0);
  const [boardPreview, setBoardPreview] = useState<Creative | null>(null);
  const [boardView, setBoardView] = useState<"board" | "designs">("board");
  const [useCreative, setUseCreative] = useState<Creative | null>(null);
  const [manageOpen, setManageOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  // Reset view + pick a sensible default source when the account changes.
  useEffect(() => {
    setSource(activeAccount.figmaFileKey ? "figma" : "claude");
    setSelectedPageId(null);
    setSearch("");
    setVisible(PAGE_SIZE);
  }, [activeAccount.id, activeAccount.figmaFileKey]);

  // Cada board abre na visão "Board"; "Designs" é opt-in por board.
  useEffect(() => {
    setBoardView("board");
  }, [boardPreview?.id]);

  const fileQuery = useQuery({
    queryKey: ["figma-file", figmaKey],
    queryFn: () => fetchFigmaFile({ data: figmaKey }),
    enabled: source === "figma" && hasFigma,
    staleTime: 5 * 60_000,
  });

  const pages = fileQuery.data?.pages ?? [];
  const activePageId =
    selectedPageId ?? pages.find((p) => p.frames.length)?.id ?? pages[0]?.id ?? null;
  const activePage = pages.find((p) => p.id === activePageId) ?? null;

  const filtered = useMemo(() => {
    const frames = activePage?.frames ?? [];
    const q = search.trim().toLowerCase();
    return q ? frames.filter((f) => f.name.toLowerCase().includes(q)) : frames;
  }, [activePage, search]);

  const visibleFrames = filtered.slice(0, visible);

  const imagesQuery = useQuery({
    queryKey: ["figma-images", figmaKey, activePageId, search, visible],
    queryFn: () => renderFigmaNodes({ data: { fileKey: figmaKey, ids: visibleFrames.map((f) => f.id) } }),
    enabled: source === "figma" && hasFigma && visibleFrames.length > 0,
    placeholderData: keepPreviousData,
    staleTime: 5 * 60_000,
  });
  const images = imagesQuery.data ?? {};

  // Slides fed to the Figma image viewer — only frames whose image is loaded,
  // so prev/next walks the whole visible gallery.
  const figmaSlides = useMemo(
    () =>
      visibleFrames
        .filter((f) => images[f.id])
        .map((f) => ({ id: f.id, src: images[f.id]!, title: f.name })),
    [visibleFrames, images],
  );

  function openFigma(frameId: string) {
    const idx = figmaSlides.findIndex((s) => s.id === frameId);
    if (idx >= 0) {
      setFigmaIndex(idx);
      setFigmaOpen(true);
    }
  }

  function selectPage(id: string) {
    setSelectedPageId(id);
    setVisible(PAGE_SIZE);
    setSearch("");
  }

  function sync() {
    qc.invalidateQueries({ queryKey: ["figma-file"] });
    qc.invalidateQueries({ queryKey: ["figma-images"] });
  }

  const totalFrames = pages.reduce((a, p) => a + p.frames.length, 0);
  const syncing = fileQuery.isFetching || imagesQuery.isFetching;
  const pm = platformMeta[activeAccount.platform];
  const noSource = !hasFigma && !hasClaude;

  return (
    <AppShell>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
              <span
                className="size-3.5 rounded flex items-center justify-center text-white text-[9px] font-bold"
                style={{ background: pm.gradient }}
              >
                {pm.short}
              </span>
              {activeAccount.name}
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mt-1 flex items-center gap-2 sm:gap-3">
              <Images className="size-6 sm:size-7 text-violet" />
              Criativos
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {source === "figma" && fileQuery.data
                ? <>Figma · <strong className="text-foreground">{fileQuery.data.fileName}</strong> · {totalFrames} telas · atualizado {relativeTime(fileQuery.data.lastModified)}</>
                : source === "claude"
                  ? <>Criativos da conta · <strong className="text-foreground">{accountCreatives.length}</strong> prontos para baixar ou usar na campanha</>
                  : "Designs desta conta"}
            </p>
          </div>
          {source === "figma" && hasFigma && (
            <Button onClick={sync} disabled={syncing} variant="outline" className="gap-2">
              <RefreshCw className={`size-4 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Sincronizando..." : "Sincronizar"}
            </Button>
          )}
        </header>

        {/* Source switch */}
        {hasFigma && hasClaude && (
          <div className="inline-flex rounded-xl border border-border bg-white/70 p-1 text-sm">
            <button
              onClick={() => setSource("figma")}
              className={cn(
                "px-4 py-1.5 rounded-lg font-medium transition-colors",
                source === "figma" ? "bg-foreground text-background" : "text-foreground/70 hover:bg-accent",
              )}
            >
              Figma
            </button>
            <button
              onClick={() => setSource("claude")}
              className={cn(
                "px-4 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5",
                source === "claude" ? "bg-foreground text-background" : "text-foreground/70 hover:bg-accent",
              )}
            >
              <Sparkles className="size-3.5" /> Criativos da conta
            </button>
          </div>
        )}

        {/* No source linked */}
        {noSource && (
          <GlassCard className="p-10 text-center">
            <div className="size-12 rounded-2xl bg-violet/10 text-violet flex items-center justify-center mx-auto">
              <Link2 className="size-5" />
            </div>
            <p className="font-display font-semibold mt-4">Nenhuma fonte de design vinculada</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
              A conta <strong className="text-foreground">{activeAccount.name}</strong> ainda não tem um arquivo Figma.
              Vincule um para ver os criativos dela aqui.
            </p>
            <Button
              onClick={() => setManageOpen(true)}
              className="mt-5 bg-gradient-to-r from-violet to-cyan text-white border-0 hover:opacity-90"
            >
              <Link2 className="size-4" /> Vincular arquivo Figma
            </Button>
          </GlassCard>
        )}

        {/* ================= CRIATIVOS DA CONTA ================= */}
        {source === "claude" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {accountCreatives.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="group flex flex-col rounded-2xl overflow-hidden border border-border/70 bg-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet/10 transition-all"
              >
                <button
                  onClick={() => (c.kind === "board" ? setBoardPreview(c) : window.open(c.src, "_blank", "noopener"))}
                  className="relative block aspect-[4/3] overflow-hidden bg-muted/60 text-left"
                >
                  <CreativeThumb kind={c.kind} src={c.src} tone={c.thumbTone} title={c.title} />
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-white bg-black/55 backdrop-blur-sm px-2 py-1 rounded">
                    {c.kind === "board" ? <><Sparkles className="size-3" /> Claude Design</> : "Imagem"}
                  </span>
                  <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-gradient-to-t from-black/60 to-transparent py-3 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="size-3" /> {c.kind === "board" ? "Abrir preview" : "Abrir imagem"}
                  </span>
                </button>
                <div className="flex flex-1 flex-col p-3">
                  <p className="font-display font-semibold leading-tight truncate">{c.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{c.group}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      size="sm"
                      className="h-8 flex-1 gap-1.5 bg-foreground text-background hover:bg-foreground/90"
                      onClick={() => setUseCreative(c)}
                    >
                      <Megaphone className="size-3.5" /> Usar na campanha
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 gap-1.5"
                      onClick={() => downloadCreative(c)}
                      title="Baixar criativo"
                    >
                      <Download className="size-3.5" /> Baixar
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ================= FIGMA ================= */}
        {source === "figma" && hasFigma && fileQuery.isError && (
          <GlassCard className="p-6 border-rose-200/70">
            <div className="flex items-start gap-3">
              <div className="size-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertCircle className="size-4" />
              </div>
              <div>
                <p className="font-semibold text-sm">Não foi possível ler o Figma desta conta</p>
                <p className="text-sm text-muted-foreground mt-1">{(fileQuery.error as Error).message}</p>
                <Button onClick={() => setManageOpen(true)} variant="outline" size="sm" className="mt-3">
                  Abrir gerenciador
                </Button>
              </div>
            </div>
          </GlassCard>
        )}

        {source === "figma" && hasFigma && fileQuery.isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-muted/60 animate-pulse aspect-[3/4]" />
            ))}
          </div>
        )}

        {source === "figma" && hasFigma && fileQuery.data && (
          <>
            <GlassCard className="p-3 flex flex-wrap items-center gap-2">
              <div className="flex flex-wrap gap-1.5 flex-1">
                {pages.map((p) => {
                  const active = p.id === activePageId;
                  return (
                    <button
                      key={p.id}
                      onClick={() => selectPage(p.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                        active ? "bg-foreground text-background" : "text-foreground/70 hover:bg-accent"
                      }`}
                    >
                      {p.name}
                      <span className={`tabular-nums ${active ? "text-background/70" : "text-muted-foreground"}`}>
                        {p.frames.length}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setVisible(PAGE_SIZE);
                  }}
                  placeholder="Buscar tela..."
                  className="h-9 pl-9 bg-white"
                />
              </div>
            </GlassCard>

            {filtered.length === 0 ? (
              <GlassCard className="p-10 text-center">
                <FileWarning className="size-8 text-muted-foreground mx-auto" />
                <p className="text-sm font-medium mt-3">Nenhuma tela nesta página</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {search ? "Tente outro termo de busca." : "Esta página do Figma não tem frames de topo."}
                </p>
              </GlassCard>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {visibleFrames.map((frame, i) => {
                    const url = images[frame.id];
                    return (
                      <motion.button
                        key={frame.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i, 12) * 0.02 }}
                        onClick={() => url && openFigma(frame.id)}
                        className="group text-left rounded-2xl overflow-hidden bg-white border border-border/70 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet/10 transition-all"
                      >
                        <div className="relative aspect-[3/4] bg-muted/60 overflow-hidden flex items-center justify-center">
                          {url ? (
                            <img
                              src={url}
                              alt={frame.name}
                              loading="lazy"
                              className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-500"
                            />
                          ) : (
                            <div className="size-full animate-pulse bg-muted/60" />
                          )}
                        </div>
                        <div className="p-2.5">
                          <p className="text-xs font-medium truncate">{frame.name}</p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {filtered.length > visible && (
                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      onClick={() => setVisible((v) => v + PAGE_SIZE)}
                      disabled={imagesQuery.isFetching}
                    >
                      Carregar mais ({filtered.length - visible} restantes)
                    </Button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </motion.div>

      {/* Figma image viewer — zoom / pan / ←→ navigation / fullscreen */}
      <Lightbox
        open={figmaOpen}
        close={() => setFigmaOpen(false)}
        index={figmaIndex}
        on={{ view: ({ index }) => setFigmaIndex(index) }}
        slides={figmaSlides.map((s) => ({ src: s.src, title: s.title }))}
        plugins={[Zoom, Fullscreen, Counter, Captions]}
        zoom={{ maxZoomPixelRatio: 4, scrollToZoom: true }}
        captions={{ descriptionTextAlign: "center" }}
        counter={{ container: { style: { top: 0, bottom: "unset" } } }}
        styles={{ container: { backgroundColor: "rgba(10, 12, 20, 0.96)" } }}
      />

      {/* Claude Design iframe lightbox (boards) */}
      <Dialog open={!!boardPreview} onOpenChange={(o) => !o && setBoardPreview(null)}>
        <DialogContent className="max-w-[96vw] w-[96vw] sm:max-w-[96vw] p-0 overflow-hidden bg-white h-[90dvh] max-h-[90dvh] flex flex-col gap-0">
          {boardPreview && (
            <>
              <div className="flex flex-wrap items-center gap-3 px-5 pt-4 pb-3 shrink-0">
                <DialogTitle className="font-display text-base flex items-center gap-2">
                  <Sparkles className="size-4 text-violet" />
                  {boardPreview.title}
                </DialogTitle>
                {/* Toggle Board / Designs */}
                <div className="inline-flex rounded-lg border border-border bg-white p-0.5 text-xs ml-auto">
                  <button
                    onClick={() => setBoardView("board")}
                    className={cn(
                      "px-3 py-1 rounded-md font-medium transition-colors",
                      boardView === "board" ? "bg-foreground text-background" : "text-foreground/70 hover:bg-accent",
                    )}
                  >
                    Board
                  </button>
                  <button
                    onClick={() => setBoardView("designs")}
                    className={cn(
                      "px-3 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5",
                      boardView === "designs" ? "bg-foreground text-background" : "text-foreground/70 hover:bg-accent",
                    )}
                  >
                    <Images className="size-3.5" /> Designs
                  </button>
                </div>
              </div>

              {boardView === "board" ? (
                <ClaudeDesignPreview src={boardPreview.src} title={boardPreview.title} />
              ) : (
                <BoardDesignsPanel creative={boardPreview} />
              )}

              <div className="px-5 py-3 border-t border-border flex justify-between items-center shrink-0">
                <button onClick={() => downloadCreative(boardPreview)} className="text-xs text-violet hover:underline flex items-center gap-1.5">
                  <Download className="size-3" /> Baixar HTML
                </button>
                <a href={boardPreview.src} target="_blank" rel="noreferrer" className="text-xs text-violet hover:underline flex items-center gap-1.5">
                  Abrir em nova aba <ExternalLink className="size-3" />
                </a>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Usar criativo na campanha */}
      <UseInCampaignDialog account={activeAccount} creative={useCreative} onOpenChange={(o) => !o && setUseCreative(null)} />

      {/* Account / Figma management */}
      <ManageAccountsDialog
        open={manageOpen}
        onOpenChange={setManageOpen}
        onAddAccount={() => {
          setManageOpen(false);
          setAddOpen(true);
        }}
      />
      <AddAccountDialog open={addOpen} onOpenChange={setAddOpen} />
    </AppShell>
  );
}

/**
 * Anexa um criativo da galeria a uma campanha → grupo (Google) / conjunto (Meta)
 * da conta ativa, via `store.attachCreative`. Mostra confirmação ao concluir.
 */
function UseInCampaignDialog({
  account,
  creative,
  onOpenChange,
}: {
  account: AdAccount;
  creative: Creative | null;
  onOpenChange: (open: boolean) => void;
}) {
  const store = useManage();
  const campaigns = creative ? store.getCampaigns(account) : [];

  const [campaignId, setCampaignId] = useState("");
  const [parentId, setParentId] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setCampaignId("");
    setParentId("");
    setDone(false);
  }, [creative?.id]);

  const campaign = campaigns.find((c) => c.id === campaignId);
  const isGoogle = campaign?.platform === "GOOGLE_ADS";
  const parents = campaign ? (isGoogle ? campaign.adGroups : campaign.adSets) : [];
  const parentLabel = isGoogle ? "Grupo de anúncios" : "Conjunto de anúncios";

  function confirm() {
    if (!creative || !campaign || !parentId) return;
    store.attachCreative(account, campaign.id, parentId, creative);
    setDone(true);
  }

  return (
    <Dialog open={!!creative} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <Megaphone className="size-4 text-violet" /> Usar na campanha
          </DialogTitle>
          <DialogDescription>
            Anexar <strong className="text-foreground">{creative?.title}</strong> como anúncio em {account.name}.
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="py-6 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="size-6" />
            </div>
            <p className="mt-3 text-sm font-medium">Criativo anexado</p>
            <p className="mx-auto mt-1 max-w-xs text-xs text-muted-foreground">
              "{creative?.title}" foi adicionado ao {parentLabel.toLowerCase()} de <strong className="text-foreground">{campaign?.name}</strong>.
            </p>
            <Button className="mt-4" onClick={() => onOpenChange(false)}>Concluir</Button>
          </div>
        ) : campaigns.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Esta conta ainda não tem campanhas. Crie uma em Gestão de Campanhas primeiro.
          </p>
        ) : (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Campanha</label>
              <Select value={campaignId} onValueChange={(v) => { setCampaignId(v); setParentId(""); }}>
                <SelectTrigger><SelectValue placeholder="Selecione uma campanha" /></SelectTrigger>
                <SelectContent>
                  {campaigns.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">{parentLabel}</label>
              <Select value={parentId} onValueChange={setParentId} disabled={!campaign}>
                <SelectTrigger><SelectValue placeholder={campaign ? `Selecione um ${parentLabel.toLowerCase()}` : "Escolha a campanha primeiro"} /></SelectTrigger>
                <SelectContent>
                  {parents.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
              {campaign && parents.length === 0 && (
                <p className="text-[11px] text-amber-600">
                  Esta campanha não tem {parentLabel.toLowerCase()}. Crie um em Gerir campanha.
                </p>
              )}
            </div>

            <Button className="w-full gap-1.5" disabled={!parentId} onClick={confirm}>
              <Megaphone className="size-4" /> Anexar criativo
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
