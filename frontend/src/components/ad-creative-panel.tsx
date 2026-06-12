import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Share2,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getCreative,
  formatCompact,
  type CampaignMetrics,
  type ComplianceStatus,
} from "@/lib/mock-data";

const complianceTheme: Record<
  ComplianceStatus,
  { label: string; cls: string; icon: typeof ShieldCheck }
> = {
  ok: { label: "Saudável", cls: "border-emerald-200 text-emerald-700 bg-emerald-50", icon: ShieldCheck },
  warning: { label: "Atenção", cls: "border-amber-200 text-amber-700 bg-amber-50", icon: AlertTriangle },
  critical: { label: "Crítico", cls: "border-rose-200 text-rose-700 bg-rose-50", icon: ShieldAlert },
};

/**
 * Slide-over that opens when a campaign row is clicked in the dashboard.
 * Surfaces the creative, social engagement, compliance state and the latest
 * (optionally toxic) comments — the "social inbox" view of an ad.
 */
export function AdCreativePanel({
  campaign,
  onClose,
}: {
  campaign: CampaignMetrics | null;
  onClose: () => void;
}) {
  const creative = campaign ? getCreative(campaign.campaignId) : null;

  return (
    <Sheet open={!!campaign} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg p-0 overflow-y-auto bg-white/95 backdrop-blur-xl"
      >
        {campaign && creative && (
          <>
            <div className="relative aspect-video overflow-hidden">
              <img src={creative.image} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <p className="text-[11px] uppercase tracking-wider opacity-80">{creative.brand}</p>
                <p className="font-display font-bold text-lg leading-tight">{creative.headline}</p>
              </div>
              <div className="absolute top-3 left-4">
                {(() => {
                  const t = complianceTheme[creative.compliance];
                  const Icon = t.icon;
                  return (
                    <Badge variant="outline" className={`${t.cls} backdrop-blur-sm`}>
                      <Icon className="size-3 mr-1" />
                      {t.label}
                    </Badge>
                  );
                })()}
              </div>
            </div>

            <SheetHeader className="px-5 pt-4 pb-2 text-left">
              <SheetTitle className="font-display text-base">{campaign.campaignName}</SheetTitle>
              <SheetDescription className="text-xs">
                {creative.body}
              </SheetDescription>
            </SheetHeader>

            <div className="px-5 pb-6 space-y-5">
              {/* Social engagement */}
              <div className="grid grid-cols-4 gap-2">
                <Metric icon={<Heart className="size-3.5 text-rose-500" />} label="Curtidas" value={formatCompact(creative.likes)} />
                <Metric icon={<MessageCircle className="size-3.5 text-cyan" />} label="Comentários" value={formatCompact(creative.comments)} />
                <Metric icon={<Share2 className="size-3.5 text-violet" />} label="Compart." value={formatCompact(creative.shares)} />
                <Metric icon={<Sparkles className="size-3.5 text-amber-500" />} label="Score" value={`${creative.engagementScore}`} />
              </div>

              {/* Violation banner */}
              {creative.violation && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-rose-200/70 bg-rose-50/70 p-3.5"
                >
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-rose-700 flex items-center gap-1.5">
                    <ShieldAlert className="size-3" /> {creative.violation.type.replace(/_/g, " ")} · {creative.violation.severity}
                  </p>
                  <p className="text-sm text-rose-900 mt-1.5 leading-snug">{creative.violation.message}</p>
                </motion.div>
              )}

              {/* CTA + open detail */}
              <div className="flex gap-2">
                <Button
                  asChild
                  className="flex-1 bg-gradient-to-r from-violet to-cyan text-white border-0 hover:opacity-90"
                >
                  <Link to="/campaigns/$campaignId" params={{ campaignId: campaign.campaignId }}>
                    Ver campanha <ExternalLink className="size-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="px-4">{creative.callToAction}</Button>
              </div>

              {/* Comment moderation inbox */}
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                  Comentários recentes
                </p>
                <div className="space-y-2">
                  {creative.recentComments.map((c) => (
                    <div
                      key={c.id}
                      className={`flex gap-2.5 rounded-xl p-3 border ${
                        c.toxic ? "border-rose-200/70 bg-rose-50/60" : "border-border/60 bg-muted/40"
                      }`}
                    >
                      <div className="size-7 rounded-full bg-foreground text-background flex items-center justify-center text-[10px] font-semibold shrink-0">
                        {c.avatar}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold">{c.author}</p>
                          {c.toxic && (
                            <span className="text-[9px] uppercase tracking-wider font-bold text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded">
                              Tóxico
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{c.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/50 border border-border/60 p-2.5 text-center">
      <div className="flex justify-center">{icon}</div>
      <p className="text-sm font-display font-bold mt-1 tabular-nums">{value}</p>
      <p className="text-[9px] uppercase tracking-wider text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}
