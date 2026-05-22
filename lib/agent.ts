import { createAgent } from "langchain";
import { MemorySaver } from "@langchain/langgraph";
import { webSearch } from "./tools/webSearch";
import { saveNote } from "./tools/saveNote";
import { systemPrompt } from "./prompts";
import { HAIKU } from "./constants";

const checkpointer = new MemorySaver();

export const agent = createAgent({
  model: HAIKU,
  tools: [webSearch, saveNote],
  checkpointer,
  systemPrompt,
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
