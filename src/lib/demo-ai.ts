/**
 * Local, offline "AI" generators. No network, no keys — deterministic
 * text composition so the app works immediately.
 */

export const AI_DISCLAIMER =
  "AI-generated content may contain errors. Review and verify important information before use.";

export type EmailTone = "Formal" | "Friendly" | "Persuasive";

export type EmailInput = {
  recipient: string;
  subject: string;
  purpose: string;
  keyPoints: string;
  tone: EmailTone;
  senderName: string;
};

const pick = <T,>(arr: T[], seed: number) => arr[Math.abs(seed) % arr.length]!;

const hash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
};

export function generateEmail(input: EmailInput, variant = 0): string {
  const seed = hash(input.purpose + input.subject + input.tone) + variant;
  const name = input.recipient.trim() || "there";
  const sender = input.senderName.trim() || "Your Name";
  const subject = input.subject.trim() || "Quick note";
  const purpose = input.purpose.trim() || "follow up on our recent conversation";
  const points = input.keyPoints
    .split("\n")
    .map((p) => p.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);

  const greeting = {
    Formal: pick([`Dear ${name},`, `Dear ${name},`, `Good day ${name},`], seed),
    Friendly: pick([`Hi ${name},`, `Hey ${name},`, `Hello ${name},`], seed),
    Persuasive: pick([`Hi ${name},`, `Hello ${name},`, `${name},`], seed),
  }[input.tone];

  const opener = {
    Formal: pick(
      [
        `I hope this message finds you well. I am writing to ${purpose}.`,
        `I trust you are well. I am reaching out regarding ${purpose}.`,
        `Thank you for your time. I am contacting you to ${purpose}.`,
      ],
      seed,
    ),
    Friendly: pick(
      [
        `Hope you're having a good week! I wanted to ${purpose}.`,
        `Quick one from me — I wanted to ${purpose}.`,
        `Hope all is well on your side. Just reaching out to ${purpose}.`,
      ],
      seed,
    ),
    Persuasive: pick(
      [
        `I'll keep this short because I think it matters: I'd like to ${purpose}.`,
        `There's a clear opportunity here, and I wanted to ${purpose}.`,
        `I believe this is worth five minutes of your time — I'd like to ${purpose}.`,
      ],
      seed,
    ),
  }[input.tone];

  const body = points.length
    ? `\n${points.map((p) => `• ${p}`).join("\n")}\n`
    : "\nHappy to share more detail wherever it would be useful.\n";

  const closer = {
    Formal: pick(
      [
        "Please let me know if you would like to discuss this further. I am happy to arrange a time that suits you.",
        "I would welcome your thoughts and am available at your convenience.",
      ],
      seed,
    ),
    Friendly: pick(
      [
        "Let me know what you think — happy to jump on a quick call whenever suits you.",
        "Give me a shout if you'd like to talk it through. No rush at all.",
      ],
      seed,
    ),
    Persuasive: pick(
      [
        "If this sounds right, reply with a time this week and I'll take care of the rest.",
        "Shall we lock in 15 minutes this week to make it happen?",
      ],
      seed,
    ),
  }[input.tone];

  const signOff = {
    Formal: "Kind regards,",
    Friendly: "Thanks so much,",
    Persuasive: "Looking forward,",
  }[input.tone];

  return `Subject: ${subject}

${greeting}

${opener}
${body}
${closer}

${signOff}
${sender}`;
}

export type Priority = "High" | "Medium" | "Low";

export type TaskItem = {
  id: string;
  title: string;
  deadline: string;
  priority: Priority;
};

const PRIORITY_ORDER: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 };

const FOCUS_SLOTS = [
  "08:30 – 10:00",
  "10:15 – 11:30",
  "11:45 – 13:00",
  "13:45 – 15:00",
  "15:15 – 16:30",
  "16:45 – 17:30",
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export function generateSchedule(tasks: TaskItem[], mode: "Daily" | "Weekly"): string {
  if (!tasks.length) return "";
  const sorted = [...tasks].sort((a, b) => {
    const p = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (p !== 0) return p;
    return (a.deadline || "9999-12-31").localeCompare(b.deadline || "9999-12-31");
  });

  if (mode === "Daily") {
    const lines = sorted.map((t, i) => {
      const slot = FOCUS_SLOTS[i % FOCUS_SLOTS.length]!;
      const due = t.deadline ? ` (due ${t.deadline})` : "";
      return `${slot}  —  [${t.priority}] ${t.title}${due}`;
    });
    return `DAILY FOCUS PLAN

${lines.join("\n")}

Breaks: 10 minutes after each block, 45 minutes for lunch at 13:00.
Tip: protect the first block for your highest-priority task — it is when focus is strongest.`;
  }

  const buckets: string[][] = DAYS.map(() => []);
  sorted.forEach((t, i) => {
    buckets[i % DAYS.length]!.push(
      `   • [${t.priority}] ${t.title}${t.deadline ? ` — due ${t.deadline}` : ""}`,
    );
  });

  const body = DAYS.map((day, i) => {
    const items = buckets[i]!.length ? buckets[i]!.join("\n") : "   • Buffer / catch-up time";
    return `${day}\n${items}`;
  }).join("\n\n");

  return `WEEKLY SCHEDULE

${body}

Review: block 30 minutes Friday afternoon to review progress and roll unfinished work forward.`;
}

export type ResearchResult = {
  summary: string;
  insights: string[];
  recommendations: string[];
};

function sentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 25);
}

function keywords(text: string): string[] {
  const stop = new Set(
    "the a an and or but of to in on for with is are was were be been being this that these those it its as by from at we you they he she i our your their has have had will would can could should not more most than then so such about into over under also which who whom what when where how".split(
      " ",
    ),
  );
  const counts = new Map<string, number>();
  for (const w of text.toLowerCase().match(/[a-z][a-z'-]{3,}/g) ?? []) {
    if (stop.has(w)) continue;
    counts.set(w, (counts.get(w) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([w]) => w);
}

export function generateResearch(topic: string, article: string): ResearchResult {
  const source = article.trim();
  const subject = topic.trim() || "this topic";
  const keys = keywords(source || subject);
  const keyList = keys.length ? keys.join(", ") : subject;

  if (source.length > 200) {
    const sents = sentences(source);
    const summary =
      sents.slice(0, 3).join(" ") ||
      `The provided text discusses ${subject} with a focus on ${keyList}.`;
    const insights = [
      `The material centres on ${keys.slice(0, 3).join(", ") || subject}, which appear repeatedly and carry the main argument.`,
      sents[Math.min(3, sents.length - 1)] ??
        `Supporting detail is concentrated in the middle of the text.`,
      sents[sents.length - 1] ?? `The closing position reinforces the opening claim.`,
      `Roughly ${source.split(/\s+/).length} words were analysed, so treat this as a condensed view rather than a full reading.`,
    ];
    const recommendations = [
      `Verify the claims about ${keys[0] ?? subject} against a second, independent source.`,
      "Pull the three strongest sentences into your own notes before sharing with the team.",
      "Flag any statistics or dates for manual confirmation — they are the most error-prone details.",
      "Turn the main conclusion into one action item with an owner and a deadline.",
    ];
    return { summary, insights, recommendations };
  }

  return {
    summary: `${subject} is best understood in three layers: what it is, why it matters right now, and what it changes for the people involved. At its core, ${subject} brings together ${keyList} into a single area of attention. Interest in it has grown because the underlying costs have dropped while expectations have risen, which pushes teams to act sooner rather than later. The practical picture is mixed: early adopters report real gains in speed and consistency, while slower movers cite unclear ownership and patchy data as the main blockers.`,
    insights: [
      `Momentum around ${subject} is driven more by changing expectations than by any single breakthrough.`,
      `The biggest differences between strong and weak outcomes come from process and ownership, not tooling.`,
      `Small, well-scoped pilots consistently outperform large programmes in the first six months.`,
      `Measurement is the common gap — most teams start without a baseline to compare against.`,
    ],
    recommendations: [
      `Define one measurable outcome for ${subject} before doing any further work.`,
      "Run a two-week pilot with a single team and a named owner.",
      "Capture a baseline now so improvements can be proven later.",
      "Schedule a review at the end of the pilot and decide explicitly to scale, adjust or stop.",
      "Cross-check anything you plan to present externally against a primary source.",
    ],
  };
}

export const QUOTES: { text: string; author: string }[] = [
  { text: "Small daily improvements are the key to staggering long-term results.", author: "Unknown" },
  { text: "Focus is saying no to a hundred good ideas.", author: "Steve Jobs" },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "Energy and persistence conquer all things.", author: "Benjamin Franklin" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "What gets measured gets managed.", author: "Peter Drucker" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "Your calm is a competitive advantage.", author: "Unknown" },
];
