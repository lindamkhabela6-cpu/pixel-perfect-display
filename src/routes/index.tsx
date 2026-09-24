import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Gamepad2, ListChecks, Mail, Search, Sparkles } from "lucide-react";

import { AiDisclaimer } from "@/components/ai-disclaimer";
import { useSettings } from "@/lib/settings";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Your daily workspace: smart emails, AI task planning, research summaries and a quick brain break.",
      },
      { property: "og:title", content: "Dashboard | AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Your daily workspace: smart emails, AI task planning, research summaries and a quick brain break.",
      },
    ],
  }),
  component: Dashboard,
});

const FEATURES = [
  {
    to: "/email",
    label: "Smart Email Generator",
    text: "Draft a professional email in seconds — formal, friendly or persuasive.",
    icon: Mail,
  },
  {
    to: "/planner",
    label: "AI Task Planner",
    text: "Turn a messy task list into a clear daily or weekly schedule.",
    icon: ListChecks,
  },
  {
    to: "/research",
    label: "AI Research Assistant",
    text: "Summarise a topic or article into insights and next steps.",
    icon: Search,
  },
  {
    to: "/gaming",
    label: "Gaming",
    text: "Take a two-minute break with Tic Tac Toe against the computer.",
    icon: Gamepad2,
  },
] as const;

function Dashboard() {
  const { settings } = useSettings();

  return (
    <div className="space-y-8">
      <section className="hero-gradient relative overflow-hidden rounded-3xl p-6 text-primary-foreground shadow-lift sm:p-10">
        <span className="gold-chip mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold">
          <Sparkles className="h-3.5 w-3.5" /> Works offline — no sign-up
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-4xl">
          Good to see you, {settings.userName || "there"}.
        </h1>
        <p className="mt-3 max-w-xl text-sm/6 opacity-90 sm:text-base">
          Four tools to clear your workday faster: write it, plan it, understand it — then take a
          short break.
        </p>
        <Link
          to="/email"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-card px-4 py-2.5 text-sm font-semibold text-primary shadow-soft transition-transform hover:-translate-y-0.5"
        >
          Start with an email <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold tracking-tight">Quick access</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURES.map(({ to, label, text, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="surface-card group grid grid-cols-[auto_minmax(0,1fr)] gap-4 p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block truncate font-semibold">{label}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{text}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { k: "Tools ready", v: "4" },
          { k: "Setup needed", v: "None" },
          { k: "Motivation boost", v: `Every ${settings.intervalMinutes} min` },
        ].map((s) => (
          <div key={s.k} className="surface-card p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {s.k}
            </p>
            <p className="mt-1 text-2xl font-extrabold text-primary">{s.v}</p>
          </div>
        ))}
      </section>

      <AiDisclaimer />
    </div>
  );
}
