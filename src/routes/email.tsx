import { createFileRoute } from "@tanstack/react-router";
import { Copy, Mail, RefreshCw, Wand2 } from "lucide-react";
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
import { generateEmail, type EmailTone } from "@/lib/demo-ai";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content: "Draft formal, friendly or persuasive work emails and edit them before sending.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "Draft formal, friendly or persuasive work emails and edit them before sending.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [purpose, setPurpose] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [senderName, setSenderName] = useState("");
  const [tone, setTone] = useState<EmailTone>("Formal");
  const [output, setOutput] = useState("");
  const [variant, setVariant] = useState(0);

  const build = (v: number) => {
    if (!purpose.trim() && !subject.trim()) {
      toast.error("Add a subject or purpose first.");
      return;
    }
    setOutput(generateEmail({ recipient, subject, purpose, keyPoints, tone, senderName }, v));
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    toast.success("Email copied to clipboard");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Fill in the details, pick a tone, then edit the draft freely."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="surface-card space-y-4 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient name</Label>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Thandi"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sender">Your name</Label>
              <Input
                id="sender"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Linda"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Project update and next steps"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose of the email</Label>
            <Input
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="request feedback on the draft proposal"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="points">Key points (one per line)</Label>
            <Textarea
              id="points"
              rows={5}
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
              placeholder={"Draft is attached\nFeedback needed by Friday\nHappy to meet Tuesday"}
            />
          </div>

          <div className="space-y-2">
            <Label>Tone</Label>
            <Select value={tone} onValueChange={(v) => setTone(v as EmailTone)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(["Formal", "Friendly", "Persuasive"] as EmailTone[]).map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full"
            onClick={() => {
              setVariant(0);
              build(0);
            }}
          >
            <Wand2 className="h-4 w-4" /> Generate email
          </Button>
        </div>

        <div className="surface-card flex flex-col gap-4 p-5">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <h2 className="truncate font-semibold">Draft (editable)</h2>
            <div className="flex shrink-0 gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!output}
                onClick={() => {
                  const next = variant + 1;
                  setVariant(next);
                  build(next);
                }}
              >
                <RefreshCw className="h-4 w-4" /> Regenerate
              </Button>
              <Button variant="outline" size="sm" disabled={!output} onClick={copy}>
                <Copy className="h-4 w-4" /> Copy
              </Button>
            </div>
          </div>

          <Textarea
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            rows={20}
            placeholder="Your generated email will appear here — and you can edit every word."
            className="min-h-80 flex-1 font-mono text-sm"
          />
          <AiDisclaimer />
        </div>
      </div>
    </div>
  );
}
