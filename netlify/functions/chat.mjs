import Anthropic from "@anthropic-ai/sdk";

const MODELS = new Set(["claude-sonnet-4-5", "claude-opus-4-5", "claude-haiku-4-5"]);
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

export default async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request body" }, 400);
  }

  const { message, model, web_search, attachment } = body || {};
  if (!message || typeof message !== "string") return json({ error: "Message is required" }, 400);

  const content = [];
  if (attachment?.kind === "image") {
    content.push({ type: "image", source: { type: "base64", media_type: attachment.mime, data: attachment.data } });
  } else if (attachment?.kind === "pdf") {
    content.push({ type: "document", source: { type: "base64", media_type: "application/pdf", data: attachment.data } });
  } else if (attachment?.kind === "text") {
    content.push({ type: "text", text: `Attached file "${attachment.name}":\n\n${attachment.text}` });
  }
  content.push({ type: "text", text: message });

  const request = {
    model: MODELS.has(model) ? model : "claude-sonnet-4-5",
    max_tokens: 4096,
    messages: [{ role: "user", content }],
  };
  if (web_search) request.tools = [{ type: "web_search_20250305", name: "web_search", max_uses: 5 }];

  try {
    const anthropic = new Anthropic();
    const result = await anthropic.messages.create(request);
    const answer = result.content.filter((b) => b.type === "text").map((b) => b.text).join("").trim();
    return json({ answer: answer || "(No text response)", usage: result.usage });
  } catch (err) {
    console.error("Claude request failed:", err);
    return json({ error: err?.message || "Claude request failed" }, err?.status || 500);
  }
};
