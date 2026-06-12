import { Check, Link2, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PlatformBadge } from "@/components/platform-badge";
import { useAccount } from "@/lib/account-context";
import { platformMeta, statusMeta } from "@/lib/accounts";
import { cn } from "@/lib/utils";

/**
 * Account manager: switch the active account, edit its linked Figma file,
 * review status, or remove it. Each account points to its own Figma file —
 * that's where its creatives gallery reads from.
 */
export function ManageAccountsDialog({
  open,
  onOpenChange,
  onAddAccount,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onAddAccount: () => void;
}) {
  const { accounts, activeAccount, setActiveAccount, updateAccount, removeAccount } = useAccount();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">Gerenciar contas</DialogTitle>
          <DialogDescription>
            Troque a conta ativa, vincule o arquivo Figma de cada conta ou remova contas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 max-h-[55vh] overflow-y-auto -mx-1 px-1">
          {accounts.map((acc) => {
            const active = acc.id === activeAccount.id;
            const st = statusMeta[acc.status];
            return (
              <div
                key={acc.id}
                className={cn(
                  "rounded-xl border p-3 space-y-2.5",
                  active ? "border-violet/40 bg-violet/5" : "border-border",
                )}
              >
                <div className="flex items-center gap-3">
                  <PlatformBadge platform={acc.platform} className="size-9 text-sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{acc.name}</p>
                      {active && (
                        <span className="text-[9px] uppercase tracking-wider font-bold text-violet bg-violet/10 px-1.5 py-0.5 rounded">
                          Ativa
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {platformMeta[acc.platform].label} · {acc.accountId}
                    </p>
                  </div>

                  <Badge variant="outline" className={cn("shrink-0 hidden sm:inline-flex", st.cls)}>
                    {st.label}
                  </Badge>

                  {!active && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 shrink-0"
                      onClick={() => setActiveAccount(acc.id)}
                    >
                      <Check className="size-3.5" /> Usar
                    </Button>
                  )}

                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8 shrink-0 text-muted-foreground hover:text-rose-600"
                    disabled={accounts.length <= 1}
                    onClick={() => removeAccount(acc.id)}
                    aria-label={`Remover ${acc.name}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>

                {/* Figma file binding */}
                <div className="flex items-center gap-2">
                  <Link2
                    className={cn("size-3.5 shrink-0", acc.figmaFileKey ? "text-violet" : "text-muted-foreground")}
                  />
                  <Input
                    defaultValue={acc.figmaFileKey ?? ""}
                    onBlur={(e) => updateAccount(acc.id, { figmaFileKey: e.target.value })}
                    placeholder="Arquivo Figma desta conta (link)…"
                    className="h-8 text-xs bg-white"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onAddAccount}>
            <Plus className="size-4" /> Adicionar conta
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
