"use client";

import { useState, useEffect } from "react";
import type { Note } from "@/lib/types";

const STORAGE_KEY = "research-assistant:notes";

function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Note[]) : [];
  } catch {
    return [];
  }
}

export function useNotes(): { notes: Note[]; addNote: (content: string) => void } {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    setNotes(loadNotes());
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch {
      // localStorage unavailable — silently skip persistence
    }
  }, [notes]);

  function addNote(content: string) {
    const note: Note = {
      id: crypto.randomUUID(),
      content,
      savedAt: new Date().toISOString(),
    };
    setNotes((prev) => [note, ...prev]);
  }

  return { notes, addNote };
}
