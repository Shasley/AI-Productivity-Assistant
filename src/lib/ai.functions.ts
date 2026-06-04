import { createServerFn } from "@tanstack/react-start";

type ToolKey = "email" | "summarize" | "tasks" | "research" | "chat";

const SYSTEM_PROMPTS: Record<ToolKey, string> = {
  email:
    "You are a professional email writing assistant. Generate clear, concise, well-structured workplace emails. Use a subject line on the first line as 'Subject: ...' then a blank line, then the body. Match tone to the user's request (formal, friendly, persuasive). Keep it under 200 words unless asked.",
  summarize:
    "You summarize meeting notes for busy professionals. Output exactly these sections in markdown: ## Summary (3-5 bullets), ## Key Decisions, ## Action Items (each as '- [ ] Owner: Task — Due'), ## Open Questions. Be faithful to the source; do not invent facts.",
  tasks:
    "You are an AI task planner. Given a goal or project, produce a structured plan in markdown with: ## Objective, ## Milestones (numbered), ## Tasks (each with priority [P1/P2/P3] and estimated effort), ## Suggested Schedule (week-by-week), ## Risks. Be concrete and actionable.",
  research:
    "You are a research assistant for professionals. Provide a structured briefing in markdown: ## Overview, ## Key Points (bulleted), ## Considerations / Tradeoffs, ## Recommended Next Steps, ## Sources to Verify (note: you cannot browse — flag claims the user should double-check). Be neutral and analytical.",
  chat:
    "You are a helpful, professional workplace productivity assistant. Be concise, friendly, and practical. Use markdown when helpful.",
};

type Msg = { role: "user" | "assistant"; content: string };

export const runAi = createServerFn({ method: "POST" })
  .inputValidator(
    (input: { tool: ToolKey; prompt?: string; messages?: Msg[] }) => input,
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      throw new Error("AI is not configured. Missing LOVABLE_API_KEY.");
    }

    const system = SYSTEM_PROMPTS[data.tool];
    const messages =
      data.messages && data.messages.length > 0
        ? data.messages
        : [{ role: "user" as const, content: data.prompt ?? "" }];

    const resp = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [{ role: "system", content: system }, ...messages],
        }),
      },
    );

    if (!resp.ok) {
      if (resp.status === 429) {
        throw new Error("Rate limit reached. Please try again in a moment.");
      }
      if (resp.status === 402) {
        throw new Error(
          "AI credits exhausted. Please add credits in your workspace settings.",
        );
      }
      const t = await resp.text();
      console.error("AI gateway error", resp.status, t);
      throw new Error("AI request failed. Please try again.");
    }

    const json = await resp.json();
    const content: string =
      json.choices?.[0]?.message?.content ?? "(no response)";
    return { content };
  });
