import { useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Sparkles, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { runAi } from "@/lib/ai.functions";
import { ResponsibleAi } from "./ResponsibleAi";

type ToolKey = "email" | "summarize" | "tasks" | "research";

interface Props {
  icon: ReactNode;
  title: string;
  description: string;
  tool: ToolKey;
  placeholder: string;
  inputLabel: string;
  examples?: string[];
}

export function AiToolPage({
  icon,
  title,
  description,
  tool,
  placeholder,
  inputLabel,
  examples,
}: Props) {
  const callAi = useServerFn(runAi);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const run = async () => {
    if (!input.trim()) {
      toast.error("Please enter some details first.");
      return;
    }
    setLoading(true);
    try {
      const res = await callAi({ data: { tool, prompt: input } });
      setOutput(res.content);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
      <header className="flex items-start gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-primary-foreground"
          style={{ background: "var(--gradient-primary)" }}
        >
          {icon}
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            {description}
          </p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{inputLabel}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              className="min-h-[260px] resize-y"
            />
            {examples && examples.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {examples.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setInput(ex)}
                    className="rounded-full border border-border bg-secondary px-3 py-1 text-xs text-secondary-foreground transition hover:bg-accent"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            )}
            <Button
              onClick={run}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">AI Output (editable)</CardTitle>
            {output && (
              <Button variant="ghost" size="sm" onClick={copy}>
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <Textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              placeholder="Your AI-generated result will appear here. You can edit it freely before using it."
              className="min-h-[300px] resize-y font-mono text-sm"
            />
          </CardContent>
        </Card>
      </div>

      <ResponsibleAi />
    </div>
  );
}
