import { Source } from "../types";

export function extractSources(content: string): Source[] {
  const sourcesMatch = content.match(
    /^##\s+Sources\s*\n([\s\S]*?)(?=\n##\s|\n---\s*$|$)/m,
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

export function stripSourcesSection(content: string): string {
  return content
    .replace(/\n?---\n##\s+Sources[\s\S]*$/, "")
    .replace(/\n?##\s+Sources[\s\S]*$/, "")
    .trimEnd();
}
