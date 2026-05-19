import { agent } from "@/lib/agent";
import type { Source } from "@/lib/types";
import { NextResponse } from "next/server";

function extractSources(content: string): Source[] {
  const sourcesMatch = content.match(
    /^##\s+Sources\s*\n([\s\S]*?)(?=\n##\s|\n---\s*$|$)/m
  );
  if (!sourcesMatch) return [];

  const block = sourcesMatch[1];
  const sources: Source[] = [];
  const linkRegex = /\[([^\]]+)\]\((https:\/\/[^)]+)\)/g;
  let match;
  while ((match = linkRegex.exec(block)) !== null) {
    sources.push({ title: match[1], url: match[2] });
  }
  return sources;
}

function stripSourcesSection(content: string): string {
  return content
    .replace(/\n?---\n##\s+Sources[\s\S]*$/, "")
    .replace(/\n?##\s+Sources[\s\S]*$/, "")
    .trimEnd();
}

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
  const content = lastMessage.content as string;

  const sources = extractSources(content);
  const answer = sources.length > 0 ? stripSourcesSection(content) : content;

  return NextResponse.json({ answer, sources });
}
