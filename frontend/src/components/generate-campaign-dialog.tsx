import { useEffect, useState } from "react";
import { Loader2, Megaphone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlatformBadge } from "@/components/platform-badge";
import type { BoardDesign } from "@/lib/board-export";
import { platformMeta, type AdAccount } from "@/lib/accounts";

/**
 * Confirmação antes de gerar campanha(s) a partir de um carrossel ou do bloco
 * de posts estáticos: nome editável, orçamento diário e preview dos anúncios.
 * A geração em si (rasterização + criação) fica no `BoardDesignsPanel`.
 */
export function GenerateCampaignDialog({
  open,
  onOpenChange,
  defaultName,
  unified,
  pieces,
  thumbs,
  accounts,
  busy,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultName: string;
  /** true = campanha unificada de posts; false = 1 campanha de carrossel. */
  unified: boolean;
  pieces: BoardDesign[];
  thumbs: Record<string, string>;
  accounts: AdAccount[];
  busy: boolean;
  onConfirm: (name: string, budgetDailyMicros: number) => void;
}) {
  const [name, setName] = useState(defaultName);
  const [budget, setBudget] = useState("50");

  // (Re)inicializa ao abrir um novo grupo.
  useEffect(() => {
    if (open) {
      setName(defaultName);
      setBudget("50");
    }
  }, [open, defaultName]);

  const budgetNum = Number(budget.replace(",", "."));
  const valid = name.trim().length > 1 && Number.isFinite(budgetNum) && budgetNum > 0;
  const platforms = [...new Set(accounts.map((a) => a.platform))];

  function confirm() {
    if (!valid || busy) return;
    onConfirm(name.trim(), Math.round(budgetNum * 1_000_000));
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !busy && onOpenChange(o)}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <Megaphone className="size-4 text-violet" />
            {unified ? "Criar campanha unificada" : "Criar campanha do carrossel"}
          </DialogTitle>
          <DialogDescription>
            {unified
              ? `Cada post estático vira um anúncio numa única campanha.`
              : `Os slides do carrossel viram os anúncios da campanha.`}{" "}
            Criada como pausada.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Nome da campanha</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} autoFocus />
          </div>

          <div className="space-y-1.5">
            <Label>Orçamento diário (R$)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">R$</span>
              <Input
                type="number"
                min={1}
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="pl-9"
              />
            </div>
            <p className="text-[11px] text-muted-foreground">Aplicado a cada campanha criada.</p>
          </div>

          {/* Contas de destino (espelhado) */}
          <div className="space-y-1.5">
            <Label>Contas de destino · {platforms.length} plataforma(s)</Label>
            <div className="flex flex-wrap gap-1.5">
              {accounts.map((a) => (
                <span
                  key={a.id}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-2 py-1 text-xs"
                >
                  <PlatformBadge platform={a.platform} className="size-4 text-[9px]" />
                  {a.name} · {platformMeta[a.platform].label}
                </span>
              ))}
            </div>
          </div>

          {/* Preview dos anúncios */}
          <div className="space-y-1.5">
            <Label>
              {pieces.length} anúncio{pieces.length === 1 ? "" : "s"} · {accounts.length} campanha(s) no total
            </Label>
            <div className="grid max-h-56 grid-cols-4 gap-2 overflow-y-auto rounded-lg border border-border bg-muted/30 p-2 sm:grid-cols-5">
              {pieces.map((d) => (
                <div key={d.id} className="overflow-hidden rounded-md border border-border/60 bg-white">
                  <div className="flex aspect-[4/5] items-center justify-center overflow-hidden bg-muted/50">
                    {thumbs[d.id] ? (
                      <img src={thumbs[d.id]} alt={d.label} className="h-full w-full object-contain" />
                    ) : (
                      <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
                    )}
                  </div>
                  <p className="truncate px-1 py-0.5 text-[9px] text-muted-foreground">{d.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
            Cancelar
          </Button>
          <Button
            onClick={confirm}
            disabled={!valid || busy}
            className="gap-1.5 bg-gradient-to-r from-violet to-cyan text-white border-0 hover:opacity-90"
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Megaphone className="size-4" />}
            {accounts.length > 1 ? `Criar ${accounts.length} campanhas` : "Criar campanha"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
