import type { BaseMessage } from "@langchain/core/messages";

export function extractSavedNote(messages: BaseMessage[]): string | null {
  const lastHumanIdx = messages.reduce(
    (acc: number, m: BaseMessage, i: number) =>
      m.type === "human" ? i : acc,
    -1,
  );
  const currentTurnMsgs =
    lastHumanIdx >= 0 ? messages.slice(lastHumanIdx + 1) : messages;
  const saveNoteMsg = currentTurnMsgs.findLast(
    (m: BaseMessage) =>
      (m as BaseMessage & { name?: string }).name === "saveNote",
  );
  if (!saveNoteMsg) return null;
  try {
    const parsed = JSON.parse(saveNoteMsg.content as string);
    if (parsed?.saved && typeof parsed.content === "string") {
      return parsed.content;
    }
  } catch {
    // malformed tool output
  }
  return null;
}
