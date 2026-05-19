"use client";

import { useState } from "react";
import type { Message, Note } from "@/lib/types";
import { useThreadId } from "@/hooks/use-thread-id";
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

  async function handleSend(content: string) {
    const userMessage: Message = {
      id: String(Date.now()),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userMessage.content, threadId }),
    });
    const data = await res?.json();
    const llmMessage: Message = {
      id: String(Date.now()),
      role: "agent",
      content: "",
      timestamp: new Date().toISOString(),
    };

    if (!data?.answer) {
      setMessages((prev) => [
        ...prev,
        {
          ...llmMessage,
          content: "ERROR",
        },
      ]); // @todo handle better
    } else {
      setMessages((prev) => [
        ...prev,
        {
          ...llmMessage,
          content: data.answer,
          sources: data.sources ?? [],
        },
      ]);
    }
  }

  return (
    <VerboseModeContext.Provider value={verboseMode}>
      <AppShell
        sidebar={<NotesSidebar notes={notes} />}
        header={<AppHeader onToggleVerbose={() => setVerboseMode((v) => !v)} />}
      >
        <MessageList messages={messages} />
        <ChatInput onSend={handleSend} />
      </AppShell>
    </VerboseModeContext.Provider>
  );
}
