import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlatformBadge } from "@/components/platform-badge";
import type { AdAccount } from "@/lib/accounts";
import { useManage } from "@/lib/manage-store";
import {
  googleChannelMeta,
  googleBidMeta,
  metaObjectiveMeta,
  metaBidMeta,
  type Campaign,
  type GoogleChannelType,
  type GoogleBidStrategy,
  type MetaObjective,
  type MetaBudgetMode,
  type MetaBidStrategy,
} from "@/lib/manage-data";

/**
 * Formulário NATIVO de campanha — campos do Google Ads (tipo de campanha +
 * estratégia de lance) ou do Meta Ads (objetivo ODAX + CBO/ABO), conforme a
 * plataforma da conta. Serve criação e edição (passe `campaign`).
 */
export function CampaignFormDialog({
  account,
  campaign,
  open,
  onOpenChange,
  onCreated,
}: {
  account: AdAccount;
  campaign?: Campaign;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (id: string) => void;
}) {
  const store = useManage();
  const isGoogle = account.platform === "GOOGLE_ADS";
  const editing = !!campaign;

  const [name, setName] = useState("");
  const [budget, setBudget] = useState("100");
  // Google
  const [googleType, setGoogleType] = useState<GoogleChannelType>("SEARCH");
  const [googleBid, setGoogleBid] = useState<GoogleBidStrategy>("MAXIMIZE_CONVERSIONS");
  // Meta
  const [objective, setObjective] = useState<MetaObjective>("OUTCOME_SALES");
  const [budgetMode, setBudgetMode] = useState<MetaBudgetMode>("CBO");
  const [metaBid, setMetaBid] = useState<MetaBidStrategy>("LOWEST_COST");

  // (Re)inicializa o form ao abrir.
  useEffect(() => {
    if (!open) return;
    setName(campaign?.name ?? "");
    setBudget(String(Math.round((campaign?.budgetDailyMicros ?? 100_000_000) / 1_000_000)));
    setGoogleType(campaign?.googleType ?? "SEARCH");
    setGoogleBid(campaign?.googleBidStrategy ?? "MAXIMIZE_CONVERSIONS");
    setObjective(campaign?.objective ?? "OUTCOME_SALES");
    setBudgetMode(campaign?.budgetMode ?? "CBO");
    setMetaBid(campaign?.metaBidStrategy ?? "LOWEST_COST");
  }, [open, campaign]);

  function submit() {
    const budgetMicros = Math.max(0, Math.round(Number(budget.replace(",", ".")) * 1_000_000));
    if (editing && campaign) {
      store.updateCampaign(account, campaign.id, isGoogle
        ? { name, budgetDailyMicros: budgetMicros, googleType, googleBidStrategy: googleBid, channelType: googleChannelMeta[googleType] }
        : { name, budgetDailyMicros: budgetMicros, objective, budgetMode, metaBidStrategy: metaBid, channelType: metaObjectiveMeta[objective] });
      onOpenChange(false);
      return;
    }
    const id = isGoogle
      ? store.createGoogleCampaign(account, { name, googleType, googleBidStrategy: googleBid, budgetDailyMicros: budgetMicros })
      : store.createMetaCampaign(account, { name, objective, budgetMode, metaBidStrategy: metaBid, budgetDailyMicros: budgetMicros });
    onOpenChange(false);
    onCreated?.(id);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <PlatformBadge platform={account.platform} className="size-6 text-[11px]" />
            {editing ? "Editar campanha" : "Nova campanha"} · {isGoogle ? "Google Ads" : "Meta Ads"}
          </DialogTitle>
          <DialogDescription>
            {editing ? "Ajuste os parâmetros da campanha." : `Criada como pausada — ative quando quiser. Conta: ${account.name}.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Nome da campanha</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Black Friday — Search BR" autoFocus />
          </div>

          {isGoogle ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Tipo de campanha</Label>
                  <Select value={googleType} onValueChange={(v) => setGoogleType(v as GoogleChannelType)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(Object.keys(googleChannelMeta) as GoogleChannelType[]).map((t) => (
                        <SelectItem key={t} value={t}>{googleChannelMeta[t]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Estratégia de lance</Label>
                  <Select value={googleBid} onValueChange={(v) => setGoogleBid(v as GoogleBidStrategy)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(Object.keys(googleBidMeta) as GoogleBidStrategy[]).map((b) => (
                        <SelectItem key={b} value={b}>{googleBidMeta[b]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1.5">
                <Label>Objetivo (ODAX)</Label>
                <Select value={objective} onValueChange={(v) => setObjective(v as MetaObjective)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.keys(metaObjectiveMeta) as MetaObjective[]).map((o) => (
                      <SelectItem key={o} value={o}>{metaObjectiveMeta[o]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Orçamento</Label>
                  <Select value={budgetMode} onValueChange={(v) => setBudgetMode(v as MetaBudgetMode)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CBO">CBO (na campanha)</SelectItem>
                      <SelectItem value="ABO">ABO (no conjunto)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Estratégia de lance</Label>
                  <Select value={metaBid} onValueChange={(v) => setMetaBid(v as MetaBidStrategy)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(Object.keys(metaBidMeta) as MetaBidStrategy[]).map((b) => (
                        <SelectItem key={b} value={b}>{metaBidMeta[b]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <Label>Orçamento diário (R$)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">R$</span>
              <Input type="number" min={0} value={budget} onChange={(e) => setBudget(e.target.value)} className="pl-9" />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={submit} disabled={!name.trim()} className="bg-gradient-to-r from-violet to-cyan text-white border-0 hover:opacity-90">
            {editing ? "Salvar" : "Criar campanha"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
