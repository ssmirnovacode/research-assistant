export type ToolName = "webSearch" | "summarizeURL" | "saveNote";

export type ToolCall = {
  tool: ToolName;
  input: string;
  status: "running" | "done";
};

export type ThinkingStep = {
  kind: "thought" | "action" | "observation";
  content: string;
  toolCall?: ToolCall;
};

export type Source = {
  title: string;
  url: string;
};

export type Message =
  | { id: string; role: "user"; content: string; timestamp: string }
  | {
      id: string;
      role: "agent";
      content: string;
      timestamp: string;
      sources?: Source[];
      thinkingSteps?: ThinkingStep[];
    }
  | { id: string; role: "guardrail"; content: string; timestamp: string }
  | { id: string; role: "greeting"; content: string; timestamp: string };

export type Note = {
  id: string;
  content: string;
  savedAt: string;
};
