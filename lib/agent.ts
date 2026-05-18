import { createAgent } from "langchain";

export const agent = createAgent({
  model: "claude-sonnet-4-6",
  tools: [],
});
