import { useState } from "react";
import { Check, ChevronsUpDown, Plus, Settings2 } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { PlatformBadge } from "@/components/platform-badge";
import { AddAccountDialog } from "@/components/add-account-dialog";
import { ManageAccountsDialog } from "@/components/manage-accounts-dialog";
import { useAccount } from "@/lib/account-context";
import { platformMeta, statusMeta, type AccountPlatform } from "@/lib/accounts";
import { cn } from "@/lib/utils";

const PLATFORM_ORDER: AccountPlatform[] = ["GOOGLE_ADS", "META_ADS"];

/**
 * Account switcher for mobile. The sidebar (where the desktop switcher lives)
 * is hidden on small screens, so this surfaces the active account in the header
 * and opens a bottom sheet (vaul Drawer) to pick / add / manage accounts.
 */
export function MobileAccountSwitcher() {
  const { accounts, activeAccount, setActiveAccount } = useAccount();
  const [open, setOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-border bg-white/70 px-2.5 py-1.5 text-left transition-transform active:scale-[0.98]"
        aria-label="Trocar de conta"
      >
        <PlatformBadge platform={activeAccount.platform} className="size-7 shrink-0 text-[11px]" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold leading-tight">{activeAccount.name}</p>
          <p className="truncate text-[10px] text-muted-foreground">
            {platformMeta[activeAccount.platform].label}
          </p>
        </div>
        <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground" />
      </button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-h-[85dvh]">
          <DrawerHeader className="text-left">
            <DrawerTitle className="font-display">Trocar de conta</DrawerTitle>
            <DrawerDescription>
              Selecione a conta de anúncios que deseja gerenciar.
            </DrawerDescription>
          </DrawerHeader>

          <div className="overflow-y-auto px-4 pb-2">
            {PLATFORM_ORDER.map((p) => {
              const group = accounts.filter((a) => a.platform === p);
              if (!group.length) return null;
              return (
                <div key={p} className="mb-4">
                  <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {platformMeta[p].label}
                  </p>
                  <div className="space-y-1.5">
                    {group.map((acc) => {
                      const active = acc.id === activeAccount.id;
                      return (
                        <button
                          key={acc.id}
                          onClick={() => {
                            setActiveAccount(acc.id);
                            setOpen(false);
                          }}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors",
                            active
                              ? "border-violet/40 bg-violet/5"
                              : "border-border bg-white hover:bg-accent",
                          )}
                        >
                          <PlatformBadge platform={acc.platform} className="size-9 shrink-0 text-xs" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{acc.name}</p>
                            <p className="truncate text-[11px] text-muted-foreground">{acc.accountId}</p>
                          </div>
                          <span
                            className={cn("size-1.5 shrink-0 rounded-full", statusMeta[acc.status].dot)}
                          />
                          {active && <Check className="size-4 shrink-0 text-violet" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-2 border-t border-border p-3">
            <button
              onClick={() => {
                setOpen(false);
                setAddOpen(true);
              }}
              className="flex items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-medium text-violet transition-colors hover:bg-accent"
            >
              <Plus className="size-4" /> Adicionar
            </button>
            <button
              onClick={() => {
                setOpen(false);
                setManageOpen(true);
              }}
              className="flex items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-medium transition-colors hover:bg-accent"
            >
              <Settings2 className="size-4" /> Gerenciar
            </button>
          </div>
        </DrawerContent>
      </Drawer>

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
