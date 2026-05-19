import { callAgent } from "@/lib/agent";
import { extractSources, stripSourcesSection, extractSavedNote } from "@/lib/helpers";
import { NextResponse } from "next/server";

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
  const savedNote = extractSavedNote(response.messages);

  return NextResponse.json({ answer, sources, savedNote });
}
