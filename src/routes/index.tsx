import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  FileText,
  ListChecks,
  Search,
  MessageSquare,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ResponsibleAi } from "@/components/ResponsibleAi";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Workplace AI" },
      {
        name: "description",
        content:
          "Your AI workplace productivity dashboard: emails, summaries, plans, research, and chat in one place.",
      },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    title: "Smart Email Generator",
    desc: "Draft polished workplace emails in seconds.",
    url: "/email",
    icon: Mail,
  },
  {
    title: "Meeting Notes Summarizer",
    desc: "Turn raw notes into clear summaries and action items.",
    url: "/notes",
    icon: FileText,
  },
  {
    title: "AI Task Planner",
    desc: "Break goals into prioritized, scheduled tasks.",
    url: "/planner",
    icon: ListChecks,
  },
  {
    title: "AI Research Assistant",
    desc: "Get briefings on any topic with structured insights.",
    url: "/research",
    icon: Search,
  },
  {
    title: "AI Chatbot",
    desc: "Conversational assistant for any quick workplace question.",
    url: "/chat",
    icon: MessageSquare,
  },
] as const;

function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4 md:p-8">
      <section
        className="relative overflow-hidden rounded-2xl p-8 text-primary-foreground md:p-12"
        style={{
          background: "var(--gradient-primary)",
          boxShadow: "var(--shadow-elegant)",
        }}
      >
        <div className="relative z-10 max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Powered by Lovable AI
          </div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Your AI workplace, all in one place.
          </h1>
          <p className="mt-3 text-base text-primary-foreground/90 md:text-lg">
            Generate emails, summarize meetings, plan tasks, research topics, and
            chat with AI — built for busy professionals.
          </p>
        </div>
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight">
          AI Tools
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <Link key={t.url} to={t.url} className="group">
              <Card className="h-full transition hover:border-primary/50 hover:shadow-lg">
                <CardContent className="space-y-3 p-6">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-primary-foreground"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    <t.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold tracking-tight">{t.title}</h3>
                  <p className="text-sm text-muted-foreground">{t.desc}</p>
                  <div className="flex items-center gap-1 pt-1 text-sm font-medium text-primary">
                    Open
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <ResponsibleAi />
    </div>
  );
}
