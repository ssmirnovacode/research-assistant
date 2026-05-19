import { tool } from "langchain";
import { z } from "zod";
import { tavily } from "@tavily/core";

export const webSearch = tool(
  async ({ query }) => {
    const client = tavily({ apiKey: process.env.TAVILY_API_KEY });

    const searchResult = await client.search(query);
    // Format results into a clean string the agent can reason over
    const formatted = searchResult.results
      .map((r, i) => `[${i + 1}] ${r.title}\nURL: ${r.url}\n${r.content}`)
      .join("\n\n---\n\n");

    console.log({ tavily: formatted });
    return formatted || "No results found.";
  },
  {
    name: "web_search",
    description: "Search the internet for information required by user",
    schema: z.object({
      query: z.string(),
    }),
  },
);
