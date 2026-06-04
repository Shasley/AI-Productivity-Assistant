import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { AiToolPage } from "@/components/AiToolPage";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [{ title: "AI Research Assistant — Workplace AI" }],
  }),
  component: () => (
    <AiToolPage
      icon={<Search className="h-6 w-6" />}
      title="AI Research Assistant"
      description="Ask any workplace research question. Get a structured briefing with key points and considerations."
      tool="research"
      inputLabel="What do you want to research?"
      placeholder="e.g. Compare async vs sync standups for distributed engineering teams."
      examples={[
        "Best practices for OKRs",
        "Trends in B2B SaaS pricing",
        "Hybrid work policies overview",
      ]}
    />
  ),
});
