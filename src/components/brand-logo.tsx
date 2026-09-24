import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("flex min-w-0 items-center gap-3", className)}>
      <span className="gold-chip grid h-10 w-10 shrink-0 place-items-center rounded-xl">
        <Sparkles className="h-5 w-5" strokeWidth={2.4} />
      </span>
      {!compact && (
        <span className="min-w-0 leading-tight">
          <span className="gold-text block truncate text-base font-extrabold tracking-tight">
            AI Workplace
          </span>
          <span className="block truncate text-xs font-medium text-muted-foreground">
            Productivity Assistant
          </span>
        </span>
      )}
    </div>
  );
}
