import { agent } from "@/lib/agent";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const res = await request.json();

  if (!res) return; // @todo handle

  const { message } = res;

  if (!message) {
    console.error("no message provided!");
    return new Response("No message provided", { status: 400 });
  }

  const response = await agent.invoke({
    messages: [{ role: "user", content: message }],
  });

  if (!response?.messages) {
    console.error("an error occured in agent call");
    return new Response("Agent doesnt respond", { status: 400 });
  }

  const lastMessage = response.messages[response.messages.length - 1];

  return NextResponse.json({ answer: lastMessage.content });
}
