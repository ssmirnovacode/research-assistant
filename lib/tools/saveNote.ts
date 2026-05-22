import { tool } from "langchain";
import { z } from "zod";

export const saveNote = tool(
  async ({ content }) => {
    return JSON.stringify({ saved: true, content });
  },
  {
    name: "saveNote",
    description:
      "Save a note or finding to the user's personal notes. Call this when the user asks to save, note down, or remember something from the conversation. Summarize the content concisely before saving if it is long.",
    schema: z.object({
      content: z.string().describe("The note content to save"),
    }),
  },
);
