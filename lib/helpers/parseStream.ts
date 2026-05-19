import type { ThinkingStep } from "@/lib/types";

type StreamCallbacks = {
  onStep: (step: ThinkingStep) => void;
  onDelta: (delta: string) => void;
  onDone: (fullAnswer: string) => void;
  onError: () => void;
};

export async function parseAgentStream(
  response: Response,
  callbacks: StreamCallbacks
): Promise<void> {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let answerBuffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const frames = buffer.split("\n\n");
    buffer = frames.pop()!;

    for (const frame of frames) {
      const line = frame.trim();
      if (!line.startsWith("data: ")) continue;

      let payload: { type: string; step?: ThinkingStep; delta?: string };
      try {
        payload = JSON.parse(line.slice(6));
      } catch {
        continue;
      }

      if (payload.type === "step" && payload.step) {
        callbacks.onStep(payload.step);
      } else if (payload.type === "delta" && payload.delta) {
        answerBuffer += payload.delta;
        callbacks.onDelta(payload.delta);
      } else if (payload.type === "done") {
        callbacks.onDone(answerBuffer);
      } else if (payload.type === "error") {
        callbacks.onError();
      }
    }
  }
}
