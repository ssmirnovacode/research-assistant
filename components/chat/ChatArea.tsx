"use client";

import { useState } from "react";
import type { Message } from "@/lib/types";
import { useThreadId } from "@/hooks/use-thread-id";
import { useNotes } from "@/hooks/use-notes";
import { AppShell } from "@/components/layout/AppShell";
import { AppHeader } from "@/components/layout/AppHeader";
import { NotesSidebar } from "@/components/sidebar/NotesSidebar";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { LimitBanner } from "./LimitBanner";
import { useSessionLimit } from "@/hooks/use-session-limit";

type Props = {
  initialMessages: Message[];
};

export function ChatArea({ initialMessages }: Props) {
  const threadId = useThreadId();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const { notes, addNote, deleteNote, editNote } = useNotes();
  const [isThinking, setIsThinking] = useState(false);
  const { canSend, resetAt, recordSend } = useSessionLimit();

  async function handleSend(content: string) {
    if (!canSend) return;

    const userMessage: Message = {
      id: String(Date.now()),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    recordSend();
    setIsThinking(true);
    try {
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

        if (data.savedNote) {
          addNote(data.savedNote);
        }

      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsThinking(false);
    }
  }

  async function handleSaveSelection(selectedText: string) {
    const userMessage: Message = {
      id: String(Date.now()),
      role: "user",
      content: `Save selected text as a note: "${selectedText}"`,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: selectedText, threadId }),
      });
      if (!res.ok) {
        console.error("Failed to save note", await res.text());
        return;
      }
      const data = await res.json();
      if (data.savedNote) {
        addNote(data.savedNote);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <AppShell
      sidebar={<NotesSidebar notes={notes} onAddNote={addNote} onDeleteNote={deleteNote} onEditNote={editNote} />}
      header={<AppHeader />}
    >
      <MessageList
        messages={messages}
        isThinking={isThinking}
        onSaveSelection={handleSaveSelection}
      />
      {!canSend && resetAt !== null && <LimitBanner resetAt={resetAt} />}
      <ChatInput onSend={handleSend} disabled={isThinking || !canSend} />
    </AppShell>
  );
}
