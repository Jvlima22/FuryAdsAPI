import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SurfaceCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "soft";
}

export const GlassCard = forwardRef<HTMLDivElement, SurfaceCardProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        variant === "soft" ? "surface-soft" : "surface",
        "rounded-2xl",
        className,
      )}
      {...props}
    />
  ),
);
GlassCard.displayName = "GlassCard";
