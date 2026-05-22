import { Message } from "./types";

export const HAIKU = "claude-haiku-4-5-20251001";
export const SONNET = "claude-sonnet-4-6";

export const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "greeting",
    content:
      "Hello! I'm your AI research assistant. I can search the web, summarize sources, and help you build a research dossier. Ask me anything about science, history, technology, or literature — and I'll find the latest findings for you.",
    timestamp: "",
  },
];
