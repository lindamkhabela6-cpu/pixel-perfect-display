import { createFileRoute } from "@tanstack/react-router";
import { CalendarRange, Copy, ListChecks, Plus, Trash2, Wand2 } from "lucide-react";
import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { generateSchedule, type Priority, type TaskItem } from "@/lib/demo-ai";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content: "Add tasks, deadlines and priorities, then generate a daily or weekly schedule.",
      },
      { property: "og:title", content: "AI Task Planner" },
      {
        property: "og:description",
        content: "Add tasks, deadlines and priorities, then generate a daily or weekly schedule.",
      },
    ],
  }),
  component: PlannerPage,
});

const PRIORITY_STYLES: Record<Priority, string> = {
  High: "bg-accent-soft text-accent",
  Medium: "bg-primary-soft text-primary",
  Low: "bg-muted text-muted-foreground",
};

function PlannerPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState<Priority>("High");
  const [mode, setMode] = useState<"Daily" | "Weekly">("Daily");
  const [plan, setPlan] = useState("");

  const addTask = () => {
    if (!title.trim()) {
      toast.error("Give the task a name first.");
      return;
    }
    setTasks((t) => [
      ...t,
      { id: crypto.randomUUID(), title: title.trim(), deadline, priority },
    ]);
    setTitle("");
    setDeadline("");
  };

  const generate = () => {
    if (!tasks.length) {
      toast.error("Add at least one task.");
      return;
    }
    setPlan(generateSchedule(tasks, mode));
  };

  const copy = async () => {
    await navigator.clipboard.writeText(plan);
    toast.success("Schedule copied to clipboard");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ListChecks}
        title="AI Task Planner"
        description="Capture your tasks, then turn them into a realistic schedule."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="surface-card space-y-4 p-5">
          <div className="space-y-2">
            <Label htmlFor="task">Task</Label>
            <Input
              id="task"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              placeholder="Finish quarterly report"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["High", "Medium", "Low"] as Priority[]).map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={addTask}>
            <Plus className="h-4 w-4" /> Add task
          </Button>

          <div className="space-y-2">
            {tasks.length === 0 && (
              <p className="rounded-lg bg-muted px-3 py-6 text-center text-sm text-muted-foreground">
                No tasks yet. Add your first one above.
              </p>
            )}
            {tasks.map((t) => (
              <div
                key={t.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{t.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.deadline ? `Due ${t.deadline}` : "No deadline"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-semibold",
                      PRIORITY_STYLES[t.priority],
                    )}
                  >
                    {t.priority}
                  </span>
                  <button
                    aria-label="Remove task"
                    onClick={() => setTasks((all) => all.filter((x) => x.id !== t.id))}
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-accent"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
            <Select value={mode} onValueChange={(v) => setMode(v as "Daily" | "Weekly")}>
              <SelectTrigger>
                <CalendarRange className="h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Daily">Daily schedule</SelectItem>
                <SelectItem value="Weekly">Weekly schedule</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={generate}>
              <Wand2 className="h-4 w-4" /> Generate
            </Button>
          </div>
        </div>

        <div className="surface-card flex flex-col gap-4 p-5">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <h2 className="truncate font-semibold">Your schedule (editable)</h2>
            <Button variant="outline" size="sm" disabled={!plan} onClick={copy}>
              <Copy className="h-4 w-4" /> Copy
            </Button>
          </div>
          <Textarea
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            rows={20}
            placeholder="Your generated schedule will appear here, ready to tweak."
            className="min-h-80 flex-1 font-mono text-sm"
          />
          <AiDisclaimer />
        </div>
      </div>
    </div>
  );
}
