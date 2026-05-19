import { createAgent } from "langchain";

export const agent = createAgent({
  model: "claude-sonnet-4-6",
  tools: [],
  systemPrompt:
    "You are a helpful research assistant. Be concise and accurate. Search the web to gather data from user's query, add sources list to your answers if applies. If you see that there is not enough data or data is ambiguous or not trustwirthy, mention this to the user. Do not invent anything",
});
