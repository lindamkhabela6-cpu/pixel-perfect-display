import { ShieldAlert } from "lucide-react";
import { AI_DISCLAIMER } from "@/lib/demo-ai";
import { cn } from "@/lib/utils";

export function AiDisclaimer({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "flex items-start gap-2 rounded-lg bg-accent-soft px-3 py-2 text-xs text-accent",
        className,
      )}
    >
      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{AI_DISCLAIMER}</span>
    </p>
  );
}
