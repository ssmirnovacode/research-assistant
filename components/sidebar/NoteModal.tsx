"use client";

import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import type { Note } from "@/lib/types";
import { markdownComponents } from "@/lib/markdownComponents";
import { formatTime } from "@/lib/helpers";

type Props = {
  note: Note | null;
  onClose: () => void;
};

export function NoteModal({ note, onClose }: Props) {
  useEffect(() => {
    if (!note) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [note, onClose]);

  if (!note) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex  p-4"
      style={{ background: "rgba(0,0,0,0.4)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[80vh] flex flex-col rounded-xl border shadow-lg overflow-hidden"
        style={{ background: "var(--surface-1)", borderColor: "var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
          style={{ borderColor: "var(--border)" }}
        >
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            {formatTime(note.savedAt)}
          </span>
          <button
            onClick={onClose}
            className="text-lg leading-none transition-opacity hover:opacity-60"
            style={{ color: "var(--foreground)" }}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="overflow-y-auto scrollbar-dark px-4 py-3 text-sm leading-relaxed">
          <ReactMarkdown components={markdownComponents}>
            {note.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
