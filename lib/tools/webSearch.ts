import { tool } from "langchain";
import { z } from "zod";
import { tavily } from "@tavily/core";

export const webSearch = tool(
  async ({ query }) => {
    const client = tavily({ apiKey: process.env.TAVILY_API_KEY });
    console.log(process.env.TAVILY_API_KEY);
    const searchResult = await client.search(query);
    console.log({ searchResult });
    return searchResult;
  },
  {
    name: "web_search",
    description: "Search the internet for information required by user",
    schema: z.object({
      query: z.string(),
    }),
  },
);
