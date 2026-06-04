import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { AiToolPage } from "@/components/AiToolPage";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [{ title: "Smart Email Generator — Workplace AI" }],
  }),
  component: () => (
    <AiToolPage
      icon={<Mail className="h-6 w-6" />}
      title="Smart Email Generator"
      description="Describe what you need to say — get a polished, professional email draft."
      tool="email"
      inputLabel="What's the email about?"
      placeholder="e.g. Reply to a client politely declining a meeting next week and proposing two alternative times."
      examples={[
        "Follow up after an interview",
        "Request a deadline extension",
        "Introduce myself to a new team",
      ]}
    />
  ),
});
