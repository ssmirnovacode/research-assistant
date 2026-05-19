import type { ThinkingStep, ToolName } from "@/lib/types";

// LangChain tool names are snake_case; map them to the ToolName union expected by the UI
const TOOL_NAME_MAP: Record<string, ToolName> = {
  web_search: "webSearch",
  summarize_url: "summarizeURL",
  save_note: "saveNote",
};

function normalizeToolName(raw: string): ToolName {
  return TOOL_NAME_MAP[raw] ?? ("webSearch" as ToolName);
}

export function eventToThinkingStep(
  event: Record<string, unknown>
): ThinkingStep | null {
  if (event.event === "on_tool_start") {
    const toolName = normalizeToolName(event.name as string);
    return {
      kind: "action",
      content: `Using ${toolName}`,
      toolCall: {
        tool: toolName,
        input: JSON.stringify((event.data as Record<string, unknown>)?.input ?? {}),
        status: "running",
      },
    };
  }
  if (event.event === "on_tool_end") {
    return {
      kind: "observation",
      content: String((event.data as Record<string, unknown>)?.output ?? "").slice(0, 500),
    };
  }
  return null;
}

export function eventToTextDelta(event: Record<string, unknown>): string {
  if (event.event !== "on_chat_model_stream") return "";
  const chunk = (event.data as Record<string, unknown>)?.chunk as
    | Record<string, unknown>
    | undefined;
  const raw = chunk?.content;
  // Array form: blocks with explicit type — only pass through text blocks
  if (Array.isArray(raw)) {
    return raw
      .filter((c: Record<string, unknown>) => c?.type === "text")
      .map((c: Record<string, unknown>) => String(c.text ?? ""))
      .join("");
  }
  // String form: strip any inline <thinking>…</thinking> fragments that may
  // arrive when the model streams thinking and text in the same chunk
  if (typeof raw === "string") {
    return raw.replace(/<thinking>[\s\S]*?<\/thinking>/g, "");
  }
  return "";
}

// Safety-net: strip any <thinking> blocks that leaked into the accumulated answer
export function stripThinkingBlocks(content: string): string {
  return content.replace(/<thinking>[\s\S]*?<\/thinking>/g, "").trimStart();
}

export function encodeSSEFrame(payload: object, encoder: TextEncoder): Uint8Array {
  return encoder.encode(`data: ${JSON.stringify(payload)}\n\n`);
}
