import { tool } from "langchain";
import { z } from "zod";
import { tavily } from "@tavily/core";
import { ChatAnthropic } from "@langchain/anthropic";

const MAX_CONTENT_CHARS = 1500;
const MIN_RELEVANCE_SCORE = 0.4;
const MAX_RESULTS = 5;

const extractionModel = new ChatAnthropic({
  model: "claude-haiku-4-5-20251001",
  maxTokens: 512,
});

async function extractFacts(query: string, url: string, content: string): Promise<string> {
  const truncated = content.slice(0, MAX_CONTENT_CHARS);
  const response = await extractionModel.invoke([
    {
      role: "user",
      content: `Extract only verifiable facts relevant to: "${query}"
Source: ${url}
Content: ${truncated}

Return a bullet list of facts. Each bullet must end with (source: ${url}).
Do not infer, generalize, or add context beyond what is written.
If nothing relevant is found, return "No relevant facts."`,
    },
  ]);
  return response.content as string;
}

export const webSearch = tool(
  async ({ query }) => {
    const client = tavily({ apiKey: process.env.TAVILY_API_KEY });
    const searchResult = await client.search(query);

    const filtered = searchResult.results
      .filter((r) => (r.score ?? 1) >= MIN_RELEVANCE_SCORE)
      .slice(0, MAX_RESULTS);

    if (filtered.length === 0) {
      return "No relevant results found.";
    }

    const extractions = await Promise.all(
      filtered.map((r) => extractFacts(query, r.url, r.content ?? ""))
    );

    const factLines = extractions
      .map((e, i) => `[from result ${i + 1}]\n${e}`)
      .join("\n\n");

    const sourceList = filtered
      .map((r, i) => `[${i + 1}] ${r.title} — ${r.url}`)
      .join("\n");

    const output = `=== Extracted Facts ===\n${factLines}\n\n=== Sources Available ===\n${sourceList}`;

    console.log({ webSearch: output });
    return output;
  },
  {
    name: "web_search",
    description: "Search the internet for information required by user",
    schema: z.object({
      query: z.string(),
    }),
  },
);
