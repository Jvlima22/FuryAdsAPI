import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  Megaphone,
  DollarSign,
  Target,
  Percent,
  ChevronRight,
  Search,
  Plus,
  MoreHorizontal,
  Play,
  Pause,
  Pencil,
  Copy,
  Trash2,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { GlassCard } from "@/components/glass-card";
import { PlatformBadge } from "@/components/platform-badge";
import { CampaignFormDialog } from "@/components/campaign-form-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { formatMicros, formatNumber, formatCompact } from "@/lib/mock-data";
import { useAccount } from "@/lib/account-context";
import { platformMeta } from "@/lib/accounts";
import { useManage } from "@/lib/manage-store";
import { entityStatusMeta, segmentationCount, type Campaign, type EntityStatus } from "@/lib/manage-data";

export const Route = createFileRoute("/manage/")({
  head: () => ({
    meta: [
      { title: "Gestão de Campanhas · Fury Ads" },
      { name: "description", content: "Crie, pause, edite e exclua campanhas do Google Ads e Meta Ads." },
    ],
  }),
  component: ManageList,
});

type StatusFilter = EntityStatus | "ALL";

function ManageList() {
  const { activeAccount } = useAccount();
  const store = useManage();
  const navigate = useNavigate();
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Campaign | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Campaign | null>(null);

  const all = store.getCampaigns(activeAccount);
  const campaigns = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((c) => {
      if (status !== "ALL" && c.status !== status) return false;
      if (q && !c.name.toLowerCase().includes(q) && !c.channelType.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [all, status, query]);

  const summary = useMemo(() => {
    const cost = campaigns.reduce((a, c) => a + c.costMicros, 0);
    const conv = campaigns.reduce((a, c) => a + c.conversions, 0);
    const clicks = campaigns.reduce((a, c) => a + c.clicks, 0);
    const impr = campaigns.reduce((a, c) => a + c.impressions, 0);
    const active = campaigns.filter((c) => c.status === "ENABLED").length;
    return { cost, conv, ctr: impr ? clicks / impr : 0, active };
  }, [campaigns]);

  const childLabel = activeAccount.platform === "GOOGLE_ADS" ? "grupos" : "conjuntos";

  return (
    <AppShell>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight flex items-center gap-2">
              <Megaphone className="size-6 text-violet" />
              Gestão de Campanhas
            </h1>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5 flex-wrap">
              Conta ativa:
              <PlatformBadge platform={activeAccount.platform} className="size-4 text-[9px]" />
              <span className="font-medium text-foreground">{activeAccount.name}</span>
              <span className="text-muted-foreground">· {platformMeta[activeAccount.platform].label} · troque no menu lateral</span>
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)} className="gap-1.5 bg-gradient-to-r from-violet to-cyan text-white border-0 hover:opacity-90">
            <Plus className="size-4" />
            Nova campanha
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Kpi icon={Megaphone} label="Campanhas" value={String(campaigns.length)} sub={`${summary.active} ativas`} />
          <Kpi icon={DollarSign} label="Investimento (30d)" value={formatMicros(summary.cost)} />
          <Kpi icon={Target} label="Conversões" value={formatNumber(summary.conv)} />
          <Kpi icon={Percent} label="CTR médio" value={`${(summary.ctr * 100).toFixed(2)}%`} />
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-3">
          <Select value={status} onValueChange={(v) => setStatus(v as StatusFilter)}>
            <SelectTrigger className="w-40 h-9 bg-white/60">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos os status</SelectItem>
              <SelectItem value="ENABLED">Ativas</SelectItem>
              <SelectItem value="PAUSED">Pausadas</SelectItem>
              <SelectItem value="REMOVED">Removidas</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar campanha..." className="pl-9 h-9 bg-white/60" />
          </div>
        </div>

        {/* Tabela */}
        <GlassCard className="p-0 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Campanha</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Orçamento/dia</TableHead>
                <TableHead className="text-right">Custo (30d)</TableHead>
                <TableHead className="text-right">Conv.</TableHead>
                <TableHead className="text-right">CTR</TableHead>
                <TableHead className="text-right">{childLabel}</TableHead>
                <TableHead className="text-right">Segmentação</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((c) => {
                const st = entityStatusMeta[c.status];
                const children = c.platform === "GOOGLE_ADS" ? c.adGroups.length : c.adSets.length;
                return (
                  <TableRow key={c.id} className="group">
                    <TableCell className="p-0">
                      <Link to="/manage/$campaignId" params={{ campaignId: c.id }} className="flex items-center gap-3 px-4 py-3">
                        <PlatformBadge platform={c.platform} className="size-7 text-[11px]" />
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{c.name}</p>
                          <p className="text-[11px] text-muted-foreground">{c.channelType}</p>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={st.cls}>
                        <span className={cn("size-1.5 rounded-full mr-1.5", st.dot)} />
                        {st.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-sm">{formatMicros(c.budgetDailyMicros)}</TableCell>
                    <TableCell className="text-right tabular-nums text-sm">{formatMicros(c.costMicros)}</TableCell>
                    <TableCell className="text-right tabular-nums text-sm">{formatNumber(c.conversions)}</TableCell>
                    <TableCell className="text-right tabular-nums text-sm">{(c.ctr * 100).toFixed(2)}%</TableCell>
                    <TableCell className="text-right tabular-nums text-sm text-muted-foreground">{children}</TableCell>
                    <TableCell className="text-right tabular-nums text-sm text-muted-foreground">{formatCompact(segmentationCount(c))}</TableCell>
                    <TableCell>
                      <RowActions
                        c={c}
                        onPauseToggle={() => store.setCampaignStatus(activeAccount, c.id, c.status === "ENABLED" ? "PAUSED" : "ENABLED")}
                        onEdit={() => setEditTarget(c)}
                        onDuplicate={() => store.duplicateCampaign(activeAccount, c.id)}
                        onDelete={() => setDeleteTarget(c)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
              {campaigns.length === 0 && (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={9} className="text-center text-sm text-muted-foreground py-10">
                    Nenhuma campanha. Clique em <span className="font-medium text-foreground">Nova campanha</span> para criar.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </GlassCard>
      </motion.div>

      {/* Criar */}
      <CampaignFormDialog
        account={activeAccount}
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={(id) => navigate({ to: "/manage/$campaignId", params: { campaignId: id } })}
      />
      {/* Editar */}
      <CampaignFormDialog
        account={activeAccount}
        campaign={editTarget ?? undefined}
        open={!!editTarget}
        onOpenChange={(o) => !o && setEditTarget(null)}
      />
      {/* Excluir */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir campanha?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget && `"${deleteTarget.name}" e toda a sua estrutura (grupos/conjuntos, palavras-chave/públicos) serão removidos. Esta ação não pode ser desfeita.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 hover:bg-rose-700"
              onClick={() => {
                if (deleteTarget) store.deleteCampaign(activeAccount, deleteTarget.id);
                setDeleteTarget(null);
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}

function RowActions({
  c,
  onPauseToggle,
  onEdit,
  onDuplicate,
  onDelete,
}: {
  c: Campaign;
  onPauseToggle: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="size-8 rounded-md flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Ações">
          <MoreHorizontal className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={onPauseToggle}>
          {c.status === "ENABLED" ? <Pause className="size-4" /> : <Play className="size-4" />}
          {c.status === "ENABLED" ? "Pausar" : "Ativar"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}>
          <Pencil className="size-4" />
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDuplicate}>
          <Copy className="size-4" />
          Duplicar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onDelete} className="text-rose-600 focus:text-rose-600">
          <Trash2 className="size-4" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Kpi({ icon: Icon, label, value, sub }: { icon: typeof Megaphone; label: string; value: string; sub?: string }) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-2 text-muted-foreground text-xs">
        <Icon className="size-3.5" />
        <span>{label}</span>
      </div>
      <p className="text-xl font-display font-bold mt-2 tracking-tight tabular-nums">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </GlassCard>
  );
}
