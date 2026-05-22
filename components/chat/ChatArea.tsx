"use client";

import { useState } from "react";
import type { Message } from "@/lib/types";
import { useThreadId } from "@/hooks/use-thread-id";
import { useNotes } from "@/hooks/use-notes";
import { VerboseModeContext } from "./VerboseModeContext";
import { AppShell } from "@/components/layout/AppShell";
import { AppHeader } from "@/components/layout/AppHeader";
import { NotesSidebar } from "@/components/sidebar/NotesSidebar";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";

type Props = {
  initialMessages: Message[];
};

export function ChatArea({ initialMessages }: Props) {
  const threadId = useThreadId();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const { notes, addNote, deleteNote } = useNotes();
  const [verboseMode, setVerboseMode] = useState(true);
  const [isThinking, setIsThinking] = useState(false);

  async function handleSend(content: string) {
    const userMessage: Message = {
      id: String(Date.now()),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
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
    <VerboseModeContext.Provider value={verboseMode}>
      <AppShell
        sidebar={<NotesSidebar notes={notes} onAddNote={addNote} onDeleteNote={deleteNote} />}
        header={<AppHeader onToggleVerbose={() => setVerboseMode((v) => !v)} />}
      >
        <MessageList
          messages={messages}
          isThinking={isThinking}
          onSaveSelection={handleSaveSelection}
        />
        <ChatInput onSend={handleSend} disabled={isThinking} />
      </AppShell>
    </VerboseModeContext.Provider>
  );
}
