import { createFileRoute } from "@tanstack/react-router";
import { ListChecks } from "lucide-react";
import { AiToolPage } from "@/components/AiToolPage";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [{ title: "AI Task Planner — Workplace AI" }],
  }),
  component: () => (
    <AiToolPage
      icon={<ListChecks className="h-6 w-6" />}
      title="AI Task Planner"
      description="Describe a goal or project. Get a structured plan with milestones, prioritized tasks, and a schedule."
      tool="tasks"
      inputLabel="What do you want to plan?"
      placeholder="e.g. Launch a new internal onboarding program for engineering hires within 6 weeks."
      examples={[
        "Plan a product launch",
        "Organize a team offsite",
        "Migrate to a new CRM",
      ]}
    />
  ),
});
