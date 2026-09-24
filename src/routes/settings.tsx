import { createFileRoute } from "@tanstack/react-router";
import { Bell, RotateCcw, Settings as SettingsIcon, Volume2 } from "lucide-react";
import { toast } from "sonner";

import { AiDisclaimer } from "@/components/ai-disclaimer";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/lib/settings";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content: "Control motivational pop-ups, notification sounds and your display name.",
      },
      { property: "og:title", content: "Settings" },
      {
        property: "og:description",
        content: "Control motivational pop-ups, notification sounds and your display name.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { settings, update, reset, playDing } = useSettings();

  return (
    <div className="space-y-6">
      <PageHeader
        icon={SettingsIcon}
        title="Settings"
        description="Everything is stored on this device only."
      />

      <div className="surface-card divide-y divide-border p-2">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-4">
          <div className="min-w-0">
            <p className="flex items-center gap-2 font-medium">
              <Bell className="h-4 w-4 text-primary" /> Motivational pop-ups
            </p>
            <p className="text-sm text-muted-foreground">
              A short quote appears now and then to keep momentum up.
            </p>
          </div>
          <Switch
            checked={settings.motivationEnabled}
            onCheckedChange={(v) => update({ motivationEnabled: v })}
            aria-label="Toggle motivational pop-ups"
          />
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-4">
          <div className="min-w-0">
            <p className="flex items-center gap-2 font-medium">
              <Volume2 className="h-4 w-4 text-primary" /> Notification sound
            </p>
            <p className="text-sm text-muted-foreground">
              A soft ding when a quote appears or a game ends.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Button variant="outline" size="sm" onClick={playDing}>
              Test
            </Button>
            <Switch
              checked={settings.soundEnabled}
              onCheckedChange={(v) => update({ soundEnabled: v })}
              aria-label="Toggle notification sound"
            />
          </div>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-4">
          <div className="min-w-0">
            <p className="font-medium">Pop-up frequency</p>
            <p className="text-sm text-muted-foreground">How often a quote appears.</p>
          </div>
          <Select
            value={String(settings.intervalMinutes)}
            onValueChange={(v) => update({ intervalMinutes: Number(v) })}
          >
            <SelectTrigger className="w-36 shrink-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 15, 30, 60].map((m) => (
                <SelectItem key={m} value={String(m)}>
                  Every {m} minutes
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 p-4">
          <Label htmlFor="name">Display name</Label>
          <Input
            id="name"
            value={settings.userName}
            onChange={(e) => update({ userName: e.target.value })}
            placeholder="Your name"
            className="max-w-sm"
          />
          <p className="text-sm text-muted-foreground">Used in the dashboard greeting.</p>
        </div>

        <div className="p-4">
          <Button
            variant="outline"
            onClick={() => {
              reset();
              toast.success("Settings restored to defaults");
            }}
          >
            <RotateCcw className="h-4 w-4" /> Restore defaults
          </Button>
        </div>
      </div>

      <AiDisclaimer />
    </div>
  );
}
