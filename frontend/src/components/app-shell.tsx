import { Link, useRouterState, type LinkProps } from "@tanstack/react-router";
import {
  BarChart3,
  ShieldAlert,
  Activity,
  Megaphone,
  Images,
  Flame,
  Search,
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ActivityFeedPanel } from "@/components/activity-feed-panel";
import { AccountSwitcher } from "@/components/account-switcher";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { activityFeed } from "@/lib/activity";

type NavItem = { to: LinkProps["to"]; label: string; icon: LucideIcon };

const navSections: { group: string; items: NavItem[] }[] = [
  {
    group: "Workspace",
    items: [
      { to: "/dashboard", label: "Métricas", icon: BarChart3 },
      { to: "/violations", label: "Violações", icon: ShieldAlert },
      { to: "/jobs", label: "Jobs", icon: Activity },
    ],
  },
  {
    group: "Gestão",
    items: [
      { to: "/manage", label: "Campanhas", icon: Megaphone },
      { to: "/creatives", label: "Criativos", icon: Images },
    ],
  },
];

const navItems: NavItem[] = navSections.flatMap((s) => s.items);

const SIDEBAR_KEY = "fury:sidebar";

function NavLink({ item, active, collapsed }: { item: NavItem; active: boolean; collapsed: boolean }) {
  const link = (
    <Link
      to={item.to}
      className={cn(
        "flex items-center rounded-lg text-sm transition-colors",
        collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2",
        active
          ? "bg-foreground text-background"
          : "text-foreground/70 hover:bg-accent hover:text-foreground",
      )}
      aria-label={item.label}
    >
      <item.icon className="size-4 shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );

  if (!collapsed) return link;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [feedOpen, setFeedOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const unread = activityFeed.filter((e) => e.kind === "violation" || e.kind === "auto_pause").length;

  // Restore the persisted collapse state after mount (SSR-safe).
  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(SIDEBAR_KEY) === "1");
    } catch {
      /* ignore */
    }
  }, []);

  function toggleCollapsed() {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem(SIDEBAR_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  return (
    <div className="min-h-screen flex w-full">
      <aside
        className={cn(
          "hidden md:flex flex-col border-r border-border bg-white/60 backdrop-blur-sm transition-[width] duration-200 ease-out",
          "sticky top-0 h-screen self-start shrink-0 overflow-y-auto",
          collapsed ? "w-16" : "w-60",
        )}
      >
        {/* Brand */}
        <div className={cn("flex items-center gap-3 p-5", collapsed && "justify-center px-0")}>
          <div
            className="size-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, #6d28d9, #2563eb)" }}
          >
            <Flame className="size-4.5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <p className="font-display font-bold leading-none">Fury Ads</p>
              <p className="text-[11px] text-muted-foreground mt-1">Control Center</p>
            </div>
          )}
        </div>

        {/* Account switcher */}
        <div className={cn("px-3", collapsed && "px-2")}>
          <AccountSwitcher collapsed={collapsed} />
        </div>

        {/* Nav */}
        <nav className="p-3 flex-1 space-y-4">
          {navSections.map((section) => (
            <div key={section.group}>
              {!collapsed && (
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-3 mb-2">
                  {section.group}
                </p>
              )}
              <ul className="flex flex-col gap-0.5">
                {section.items.map((item) => (
                  <li key={item.to}>
                    <NavLink item={item} active={pathname.startsWith(item.to ?? "")} collapsed={collapsed} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Status */}
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="mx-auto mb-2 flex size-9 items-center justify-center rounded-xl bg-accent/60">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">API Operacional · v1.2.0</TooltipContent>
          </Tooltip>
        ) : (
          <div className="m-3 p-4 rounded-xl bg-accent/60 text-xs">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <span className="text-foreground font-medium">API Operacional</span>
            </div>
            <p className="text-muted-foreground">v1.2.0 · 312ms p95</p>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={toggleCollapsed}
          className={cn(
            "m-3 mt-0 flex h-9 items-center rounded-lg border border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors",
            collapsed ? "justify-center" : "justify-start px-3 gap-2",
          )}
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          {collapsed ? (
            <PanelLeftOpen className="size-4" />
          ) : (
            <>
              <PanelLeftClose className="size-4" />
              <span className="text-xs">Recolher</span>
            </>
          )}
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border bg-white/70 backdrop-blur-md flex items-center px-4 md:px-6 gap-3 sticky top-0 z-30">
          <div className="md:hidden flex items-center gap-2">
            <div
              className="size-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6d28d9, #2563eb)" }}
            >
              <Flame className="size-3.5 text-white" />
            </div>
            <span className="font-display font-bold text-sm">Fury Ads</span>
          </div>
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <input
                placeholder="Buscar campanhas, anúncios, jobs..."
                className="w-full h-9 pl-9 pr-3 rounded-lg bg-accent/60 border border-transparent focus:border-border focus:bg-white text-sm outline-none transition-colors"
              />
            </div>
          </div>
          <div className="flex-1 md:hidden" />
          <button
            onClick={() => setFeedOpen(true)}
            className="relative size-9 rounded-lg hover:bg-accent flex items-center justify-center text-foreground/70"
            aria-label="Abrir feed de atividade"
          >
            <Bell className="size-4" />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
            )}
          </button>
          <div className="size-8 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-semibold">
            FA
          </div>
        </header>

        {/* Mobile nav */}
        <div className="md:hidden border-b border-border bg-white px-3 py-2 flex gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.to ?? "");
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap",
                  active ? "bg-foreground text-background" : "text-foreground/70 hover:bg-accent",
                )}
              >
                <item.icon className="size-3.5" />
                {item.label}
              </Link>
            );
          })}
        </div>

        <main className="flex-1 p-4 md:p-8 max-w-[1500px] mx-auto w-full">{children}</main>
      </div>
      <ActivityFeedPanel open={feedOpen} onClose={() => setFeedOpen(false)} />
    </div>
  );
}
