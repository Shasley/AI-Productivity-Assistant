import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Send, MessageSquare, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { runAi } from "@/lib/ai.functions";
import { ResponsibleAi } from "@/components/ResponsibleAi";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [{ title: "AI Chat — Workplace AI" }],
  }),
  component: ChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

function ChatPage() {
  const callAi = useServerFn(runAi);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your workplace AI assistant. Ask me anything — drafting messages, summarizing ideas, planning your day, or quick research.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Msg = { role: "user", content: input.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await callAi({
        data: { tool: "chat", messages: next },
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.content },
      ]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to reply.");
      setMessages((prev) => prev.slice(0, -1));
      setInput(userMsg.content);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-3.5rem)] max-w-4xl flex-col p-4 md:p-8">
      <header className="mb-4 flex items-center gap-3">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl text-primary-foreground"
          style={{ background: "var(--gradient-primary)" }}
        >
          <MessageSquare className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">AI Chat</h1>
          <p className="text-sm text-muted-foreground">
            Conversational workplace assistant
          </p>
        </div>
      </header>

      <Card className="flex flex-1 flex-col overflow-hidden p-0">
        <div className="flex-1 space-y-4 overflow-y-auto p-4 md:p-6">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  m.role === "user"
                    ? "bg-secondary text-secondary-foreground"
                    : "text-primary-foreground"
                }`}
                style={
                  m.role === "assistant"
                    ? { background: "var(--gradient-primary)" }
                    : undefined
                }
              >
                {m.role === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
              </div>
              <div
                className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-primary-foreground"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
        <div className="border-t border-border bg-background/60 p-3 md:p-4">
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Ask anything... (Shift+Enter for new line)"
              className="max-h-40 min-h-[44px] resize-none"
              rows={1}
            />
            <Button onClick={send} disabled={loading || !input.trim()} size="lg">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <div className="mt-4">
        <ResponsibleAi />
      </div>
    </div>
  );
}
