import { callAgent } from "@/lib/agent";
import { extractSources, stripSourcesSection } from "@/lib/helpers";
import { NextResponse } from "next/server";
import type { BaseMessage } from "@langchain/core/messages";

export async function POST(request: Request) {
  const res = await request.json();

  if (!res) return; // @todo handle

  const { message, threadId } = res;

  if (!message) {
    console.error("no message provided!");
    return new Response("No message provided", { status: 400 });
  }

  let response;
  try {
    response = await callAgent(message, threadId);
  } catch {
    return new Response("Agent error", { status: 500 });
  }

  if (!response?.messages) {
    console.error("an error occured in agent call");
    return new Response("Agent doesnt respond", { status: 400 });
  }

  const lastMessage = response.messages[response.messages.length - 1];
  const content = lastMessage.content as string;

  const sources = extractSources(content);
  const answer = sources.length > 0 ? stripSourcesSection(content) : content;

  // Extract saved note content if the agent called saveNote in THIS turn only.
  // response.messages contains the full thread history (MemorySaver), so we
  // scope the search to messages added after the last human message.
  const allMsgs: BaseMessage[] = response.messages;
  const lastHumanIdx = allMsgs.reduce(
    (acc: number, m: BaseMessage, i: number) =>
      m.type === "human" ? i : acc,
    -1
  );
  const currentTurnMsgs = lastHumanIdx >= 0 ? allMsgs.slice(lastHumanIdx + 1) : allMsgs;
  const saveNoteMsg = currentTurnMsgs.findLast((m: BaseMessage) => (m as BaseMessage & { name?: string }).name === "saveNote");
  let savedNote: string | null = null;
  if (saveNoteMsg) {
    try {
      const parsed = JSON.parse(saveNoteMsg.content as string);
      if (parsed?.saved && typeof parsed.content === "string") {
        savedNote = parsed.content;
      }
    } catch {
      // malformed tool output — skip
    }
  }

  return NextResponse.json({ answer, sources, savedNote });
}
