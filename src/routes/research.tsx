import { createFileRoute } from "@tanstack/react-router";
import { Copy, Search, Wand2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AiDisclaimer } from "@/components/ai-disclaimer";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateResearch } from "@/lib/demo-ai";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Turn a topic or pasted article into a summary, key insights and clear recommendations.",
      },
      { property: "og:title", content: "AI Research Assistant" },
      {
        property: "og:description",
        content:
          "Turn a topic or pasted article into a summary, key insights and clear recommendations.",
      },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [article, setArticle] = useState("");
  const [summary, setSummary] = useState("");
  const [insights, setInsights] = useState("");
  const [recommendations, setRecommendations] = useState("");

  const run = () => {
    if (!topic.trim() && article.trim().length < 40) {
      toast.error("Enter a topic or paste some text first.");
      return;
    }
    const r = generateResearch(topic, article);
    setSummary(r.summary);
    setInsights(r.insights.map((i) => `• ${i}`).join("\n"));
    setRecommendations(r.recommendations.map((i) => `• ${i}`).join("\n"));
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(
      `SUMMARY\n${summary}\n\nKEY INSIGHTS\n${insights}\n\nRECOMMENDATIONS\n${recommendations}`,
    );
    toast.success("Research copied to clipboard");
  };

  const hasResult = Boolean(summary || insights || recommendations);

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Search}
        title="AI Research Assistant"
        description="Enter a topic or paste an article, then edit the results as you like."
      />

      <div className="surface-card space-y-4 p-5">
        <div className="space-y-2">
          <Label htmlFor="topic">Topic</Label>
          <Input
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Hybrid work policies for small teams"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="article">Or paste article text (optional)</Label>
          <Textarea
            id="article"
            rows={7}
            value={article}
            onChange={(e) => setArticle(e.target.value)}
            placeholder="Paste the article or notes you want condensed…"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
          <Button onClick={run}>
            <Wand2 className="h-4 w-4" /> Generate research
          </Button>
          <Button variant="outline" disabled={!hasResult} onClick={copyAll}>
            <Copy className="h-4 w-4" /> Copy all
          </Button>
        </div>
        <AiDisclaimer />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {[
          { label: "Summary", value: summary, set: setSummary, rows: 10 },
          { label: "Key insights", value: insights, set: setInsights, rows: 10 },
          {
            label: "Recommendations",
            value: recommendations,
            set: setRecommendations,
            rows: 10,
          },
        ].map((block) => (
          <div key={block.label} className="surface-card space-y-3 p-5">
            <h2 className="font-semibold">{block.label}</h2>
            <Textarea
              value={block.value}
              onChange={(e) => block.set(e.target.value)}
              rows={block.rows}
              placeholder={`${block.label} will appear here.`}
              className="min-h-52 text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
