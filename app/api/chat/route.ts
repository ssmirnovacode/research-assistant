import { streamAgent } from "@/lib/agent";
import { encodeSSEFrame, eventToTextDelta, eventToThinkingStep } from "@/lib/helpers";

export async function POST(request: Request) {
  const body = await request.json();
  const { message, threadId } = body;

  if (!message) return new Response("No message provided", { status: 400 });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Suppress model stream tokens while a tool call is in flight.
        // This prevents intermediate "planning" tokens (the model deciding which
        // tool to call) from leaking into the answer stream. Once all tools are
        // done, or if no tools are used at all, tokens flow through normally.
        let activeToolCalls = 0;

        for await (const event of streamAgent(message, threadId)) {
          if (event.event === "on_tool_start") activeToolCalls++;
          else if (event.event === "on_tool_end") activeToolCalls = Math.max(0, activeToolCalls - 1);

          const step = eventToThinkingStep(event);
          if (step) {
            controller.enqueue(encodeSSEFrame({ type: "step", step }, encoder));
            continue;
          }

          if (activeToolCalls === 0) {
            const delta = eventToTextDelta(event);
            if (delta) controller.enqueue(encodeSSEFrame({ type: "delta", delta }, encoder));
          }
        }
        controller.enqueue(encodeSSEFrame({ type: "done" }, encoder));
      } catch (err) {
        console.error(err);
        controller.enqueue(encodeSSEFrame({ type: "error" }, encoder));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
