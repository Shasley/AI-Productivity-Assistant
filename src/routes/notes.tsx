import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { AiToolPage } from "@/components/AiToolPage";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [{ title: "Meeting Notes Summarizer — Workplace AI" }],
  }),
  component: () => (
    <AiToolPage
      icon={<FileText className="h-6 w-6" />}
      title="Meeting Notes Summarizer"
      description="Paste raw meeting notes or a transcript. Get a clear summary, decisions, and action items."
      tool="summarize"
      inputLabel="Paste your meeting notes"
      placeholder="Paste meeting notes or transcript here..."
    />
  ),
});
