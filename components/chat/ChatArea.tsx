"use client";

import { useState } from "react";
import type { Message, Note } from "@/lib/types";
import { useThreadId } from "@/hooks/use-thread-id";
import { extractSources, stripSourcesSection, stripThinkingBlocks, parseAgentStream } from "@/lib/helpers";
import { VerboseModeContext } from "./VerboseModeContext";
import { AppShell } from "@/components/layout/AppShell";
import { AppHeader } from "@/components/layout/AppHeader";
import { NotesSidebar } from "@/components/sidebar/NotesSidebar";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";

type Props = {
  initialMessages: Message[];
  initialNotes: Note[];
};

export function ChatArea({ initialMessages, initialNotes }: Props) {
  const threadId = useThreadId();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [notes] = useState<Note[]>(initialNotes);
  const [verboseMode, setVerboseMode] = useState(true);
  const [isThinking, setIsThinking] = useState(false);

  async function handleSend(content: string) {
    const userMessage: Message = {
      id: String(Date.now()),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    const placeholderId = String(Date.now() + 1);
    const placeholderMessage: Message = {
      id: placeholderId,
      role: "agent",
      content: "",
      timestamp: new Date().toISOString(),
      thinkingSteps: [],
      sources: [],
    };

    setMessages((prev) => [...prev, userMessage, placeholderMessage]);
    setIsThinking(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, threadId }),
      });

      if (!res.ok) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === placeholderId ? { ...m, content: "ERROR" } : m
          )
        );
        return;
      }

      await parseAgentStream(res, {
        onStep: (step) => {
          setIsThinking(false);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === placeholderId && m.role === "agent"
                ? { ...m, thinkingSteps: [...(m.thinkingSteps ?? []), step] }
                : m
            )
          );
        },
        onDelta: (delta) => {
          setIsThinking(false);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === placeholderId && m.role === "agent"
                ? { ...m, content: m.content + delta }
                : m
            )
          );
        },
        onDone: (fullAnswer) => {
          const cleaned = stripThinkingBlocks(fullAnswer);
          const sources = extractSources(cleaned);
          const answer = sources.length ? stripSourcesSection(cleaned) : cleaned;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === placeholderId && m.role === "agent"
                ? { ...m, content: answer, sources }
                : m
            )
          );
        },
        onError: () => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === placeholderId && m.role === "agent"
                ? { ...m, content: "ERROR" }
                : m
            )
          );
        },
      });
    } catch (err) {
      console.error(err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === placeholderId && m.role === "agent"
            ? { ...m, content: "ERROR" }
            : m
        )
      );
    } finally {
      setIsThinking(false);
    }
  }

  return (
    <VerboseModeContext.Provider value={verboseMode}>
      <AppShell
        sidebar={<NotesSidebar notes={notes} />}
        header={<AppHeader onToggleVerbose={() => setVerboseMode((v) => !v)} />}
      >
        <MessageList messages={messages} isThinking={isThinking} />
        <ChatInput onSend={handleSend} disabled={isThinking} />
      </AppShell>
    </VerboseModeContext.Provider>
  );
}
