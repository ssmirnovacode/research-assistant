import { callAgent } from "@/lib/agent";
import { extractSavedNote } from "@/lib/helpers";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  const res = await request.json();

  const { text } = res ?? {};

  if (!text || typeof text !== "string") {
    return new Response("No text provided", { status: 400 });
  }

  let response;
  try {
    response = await callAgent(
      `Save the following as a note: "${text}"`,
      randomUUID(), // to isolate instruction for note
    );
  } catch {
    return new Response("Agent error", { status: 500 });
  }

  if (!response?.messages) {
    return new Response("Agent did not respond", { status: 400 });
  }

  const savedNote = extractSavedNote(response.messages);
  if (!savedNote) {
    return new Response("Agent did not save a note", { status: 422 });
  }

  return NextResponse.json({ savedNote });
}
