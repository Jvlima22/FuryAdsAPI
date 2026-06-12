import { platformMeta, type AccountPlatform } from "@/lib/accounts";
import { cn } from "@/lib/utils";

/**
 * Colored platform monogram (Google "G" / Meta "M"). Shared by the switcher
 * and the manage dialog — kept standalone to avoid a circular import between
 * those two components.
 */
export function PlatformBadge({
  platform,
  className,
}: {
  platform: AccountPlatform;
  className?: string;
}) {
  const m = platformMeta[platform];
  return (
    <span
      className={cn(
        "flex items-center justify-center rounded-lg text-white font-bold shrink-0 leading-none",
        className,
      )}
      style={{ background: m.gradient }}
      aria-hidden
    >
      {m.short}
    </span>
  );
}
