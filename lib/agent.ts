import { createAgent } from "langchain";
import { MemorySaver } from "@langchain/langgraph";
//import { webSearch } from "./tools/webSearch";

const checkpointer = new MemorySaver();

export const agent = createAgent({
  model: "claude-sonnet-4-6",
  // tools: [webSearch],
  checkpointer,
  systemPrompt: `
    You are a helpful research assistant.
    Be concise and accurate. 
    If user is asking for information, search the web to gather data from user's query , always add sources list to your answers. 
    If you see that there is not enough data or data is ambiguous or not trustworthy, mention this to the user. 
    Do not invent anything.
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
