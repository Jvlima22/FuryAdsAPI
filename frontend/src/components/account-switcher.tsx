import { useState } from "react";
import { Check, ChevronsUpDown, Plus, Settings2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { PlatformBadge } from "@/components/platform-badge";
import { AddAccountDialog } from "@/components/add-account-dialog";
import { ManageAccountsDialog } from "@/components/manage-accounts-dialog";
import { useAccount } from "@/lib/account-context";
import { platformMeta, statusMeta, type AccountPlatform } from "@/lib/accounts";
import { cn } from "@/lib/utils";

const PLATFORM_ORDER: AccountPlatform[] = ["GOOGLE_ADS", "META_ADS"];

/**
 * Account switcher shown under the Metrik logo in the sidebar. Lists the
 * connected accounts grouped by platform, plus shortcuts to add / manage.
 * Collapses to just the platform badge when the sidebar is collapsed.
 */
export function AccountSwitcher({ collapsed }: { collapsed: boolean }) {
  const { accounts, activeAccount, setActiveAccount } = useAccount();
  const [addOpen, setAddOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "flex items-center rounded-xl border border-border bg-white/70 hover:bg-accent transition-colors text-left w-full",
              collapsed ? "justify-center p-1.5" : "gap-2.5 px-2.5 py-2",
            )}
            aria-label="Trocar de conta"
          >
            <PlatformBadge platform={activeAccount.platform} className="size-8 text-xs" />
            {!collapsed && (
              <>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold leading-tight truncate">{activeAccount.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {platformMeta[activeAccount.platform].label} · {activeAccount.accountId}
                  </p>
                </div>
                <ChevronsUpDown className="size-3.5 text-muted-foreground shrink-0" />
              </>
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" sideOffset={6} className="w-64">
          {PLATFORM_ORDER.map((p) => {
            const group = accounts.filter((a) => a.platform === p);
            if (!group.length) return null;
            return (
              <DropdownMenuGroup key={p}>
                <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {platformMeta[p].label}
                </DropdownMenuLabel>
                {group.map((acc) => (
                  <DropdownMenuItem
                    key={acc.id}
                    onSelect={() => setActiveAccount(acc.id)}
                    className="gap-2.5"
                  >
                    <PlatformBadge platform={acc.platform} className="size-7 text-[11px]" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium truncate">{acc.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{acc.accountId}</p>
                    </div>
                    <span className={cn("size-1.5 rounded-full shrink-0", statusMeta[acc.status].dot)} />
                    {acc.id === activeAccount.id && <Check className="size-3.5 text-violet shrink-0" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            );
          })}

          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setAddOpen(true)} className="gap-2.5 text-violet font-medium">
            <Plus className="size-4" /> Adicionar conta
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setManageOpen(true)} className="gap-2.5">
            <Settings2 className="size-4" /> Gerenciar contas
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AddAccountDialog open={addOpen} onOpenChange={setAddOpen} />
      <ManageAccountsDialog
        open={manageOpen}
        onOpenChange={setManageOpen}
        onAddAccount={() => {
          setManageOpen(false);
          setAddOpen(true);
        }}
      />
    </>
  );
}
