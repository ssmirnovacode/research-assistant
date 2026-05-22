"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import type { Note } from "@/lib/types";
import { markdownComponents } from "@/lib/markdownComponents";

type Props = {
  note: Note;
  onClick: () => void;
  onDelete: () => void;
};

function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  );
}

export function NoteCard({ note, onClick, onDelete }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  function handleDeleteClick(e: React.MouseEvent) {
    e.stopPropagation();
    setIsConfirming(true);
  }

  function handleConfirm(e: React.MouseEvent) {
    e.stopPropagation();
    onDelete();
  }

  function handleCancel(e: React.MouseEvent) {
    e.stopPropagation();
    setIsConfirming(false);
  }

  return (
    <>
      <li
        className="relative rounded-lg p-3 border text-sm cursor-pointer transition-opacity hover:opacity-80"
        style={{ background: "var(--surface-2)", borderColor: "var(--border)" }}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isHovered && (
          <button
            onClick={handleDeleteClick}
            className="absolute bottom-2 right-2 p-1 rounded transition-colors cursor-pointer hover:bg-red-500/40"
            style={{ color: "#ef4444" }}
            title="Delete note"
          >
            <TrashIcon />
          </button>
        )}
        <div
          className="line-clamp-4 leading-relaxed pr-5"
          style={{ color: "var(--foreground)" }}
        >
          <ReactMarkdown components={markdownComponents}>
            {note.content}
          </ReactMarkdown>
        </div>
        <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
          {formatTime(note.savedAt)}
        </p>
      </li>

      {isConfirming && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.4)" }}
          onClick={handleCancel}
        >
          <div
            className="rounded-xl p-6 shadow-xl max-w-sm w-full mx-4 flex flex-col gap-4"
            style={{
              background: "var(--surface-1)",
              border: "1px solid var(--border)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p
              className="text-sm font-medium"
              style={{ color: "var(--foreground)" }}
            >
              Delete this note?
            </p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 text-sm rounded-lg border transition-opacity hover:opacity-80"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-3 py-1.5 text-sm rounded-lg transition-opacity hover:opacity-80"
                style={{ background: "#ef4444", color: "#fff" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
