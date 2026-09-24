import { Quote, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { QUOTES } from "@/lib/demo-ai";
import { useSettings } from "@/lib/settings";

export function MotivationPopup() {
  const { settings, playDing } = useSettings();
  const [quote, setQuote] = useState<(typeof QUOTES)[number] | null>(null);
  const indexRef = useRef(0);

  useEffect(() => {
    if (!settings.motivationEnabled) {
      setQuote(null);
      return;
    }
    const ms = Math.max(1, settings.intervalMinutes) * 60_000;
    const id = window.setInterval(() => {
      indexRef.current = (indexRef.current + 1 + Math.floor(Math.random() * 3)) % QUOTES.length;
      setQuote(QUOTES[indexRef.current]!);
      if (settings.soundEnabled) playDing();
      window.setTimeout(() => setQuote(null), 12_000);
    }, ms);
    return () => window.clearInterval(id);
  }, [settings.motivationEnabled, settings.intervalMinutes, settings.soundEnabled, playDing]);

  if (!quote) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 sm:inset-x-auto sm:right-6 sm:justify-end">
      <div className="pointer-events-auto w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 surface-card p-4">
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
          <span className="gold-chip grid h-8 w-8 shrink-0 place-items-center rounded-lg">
            <Quote className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium leading-snug">{quote.text}</p>
            <p className="mt-1 text-xs text-muted-foreground">— {quote.author}</p>
          </div>
          <button
            onClick={() => setQuote(null)}
            aria-label="Dismiss"
            className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
