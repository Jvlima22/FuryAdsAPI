import { Sparkles, Images, ImageOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { creativesForAccount, type Creative } from "@/lib/creatives";
import type { AdAccount } from "@/lib/accounts";

const BOARD_BG: Record<"wine" | "neutral", string> = {
  neutral: "linear-gradient(135deg, #041020 0%, #0a2444 55%, #0F6CBD 100%)",
  wine: "linear-gradient(135deg, hsl(350 70% 11%) 0%, hsl(350 55% 22%) 55%, hsl(350 60% 28%) 100%)",
};

/** Miniatura unificada de criativo — imagem (SVG/PNG) ou board do Claude Design. */
export function CreativeThumb({
  kind,
  src,
  tone,
  title,
  className,
}: {
  kind: "image" | "board";
  src: string;
  tone?: "wine" | "neutral";
  title: string;
  className?: string;
}) {
  if (kind === "image") {
    return (
      <img
        src={src}
        alt={title}
        loading="lazy"
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }
  return (
    <div
      className={cn("flex h-full w-full items-center justify-center", className)}
      style={{ background: BOARD_BG[tone ?? "neutral"] }}
    >
      <Sparkles className="size-5 text-white/90" />
    </div>
  );
}

/**
 * Dialog para escolher um criativo da conta e anexá-lo a um grupo/conjunto.
 * Lista `creativesForAccount(account)`; ao clicar, chama `onPick` e fecha.
 */
export function CreativePickerDialog({
  open,
  onOpenChange,
  account,
  onPick,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: AdAccount;
  onPick: (creative: Creative) => void;
}) {
  const creatives = creativesForAccount(account);

  function pick(c: Creative) {
    onPick(c);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <Images className="size-4 text-violet" /> Escolher criativo
          </DialogTitle>
          <DialogDescription>
            Criativos de <strong className="text-foreground">{account.name}</strong> — selecione um para anexar como anúncio.
          </DialogDescription>
        </DialogHeader>

        {creatives.length === 0 ? (
          <div className="py-10 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <ImageOff className="size-5" />
            </div>
            <p className="mt-3 text-sm font-medium">Nenhum criativo nesta conta</p>
            <p className="mx-auto mt-1 max-w-xs text-xs text-muted-foreground">
              Vincule um Figma ou sincronize um projeto do Claude Design em Criativos.
            </p>
          </div>
        ) : (
          <div className="grid max-h-[60vh] grid-cols-2 gap-3 overflow-y-auto p-0.5 sm:grid-cols-3">
            {creatives.map((c) => (
              <button
                key={c.id}
                onClick={() => pick(c)}
                className="group overflow-hidden rounded-xl border border-border/70 bg-white text-left transition-all hover:-translate-y-0.5 hover:border-violet/40 hover:shadow-lg hover:shadow-violet/10"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted/60">
                  <CreativeThumb kind={c.kind} src={c.src} tone={c.thumbTone} title={c.title} />
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded bg-black/55 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                    {c.kind === "board" ? <><Sparkles className="size-2.5" /> Claude</> : "Imagem"}
                  </span>
                </div>
                <div className="p-2.5">
                  <p className="truncate text-xs font-medium">{c.title}</p>
                  <p className="truncate text-[10px] text-muted-foreground">{c.group}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
