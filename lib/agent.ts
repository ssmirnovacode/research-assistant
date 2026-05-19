import { createAgent } from "langchain";
import { MemorySaver } from "@langchain/langgraph";
import { webSearch } from "./tools/webSearch";

const checkpointer = new MemorySaver();

export const agent = createAgent({
  model: "claude-sonnet-4-6",
  tools: [webSearch],
  checkpointer,
  systemPrompt: `
You are a precise research assistant.

When the user asks a factual question, call web_search to retrieve information.
The tool returns pre-extracted facts with inline source citations — use them directly.

When writing your response:
- Write a direct, concise answer (2–5 paragraphs max)
- Cite sources inline using the numbered references from the tool output, e.g. [1], [2]
- If sources conflict or coverage is thin, say so explicitly — do not paper over gaps
- Never add information that is not present in the extracted facts
- End every search-based response with a ## Sources section listing the numbered URLs exactly as provided by the tool

For conversational messages that do not require new information, answer directly without calling the tool.
  `,
});

export async function callAgent(message: string, threadId: string) {
  try {
    return await agent.invoke(
      { messages: [{ role: "user", content: message }] },
      { configurable: { thread_id: threadId } },
    );
  } catch (err) {
    console.error("agent.invoke failed", err);
    throw err;
  }
}
