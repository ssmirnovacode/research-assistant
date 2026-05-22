"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import type { Note } from "@/lib/types";
import { markdownComponents } from "@/lib/markdownComponents";

type Props = {
  note: Note;
  onClick: () => void;
  onDelete: () => void;
  onEdit: (content: string) => void;
};

function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

function PenIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
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

export function NoteCard({ note, onClick, onDelete, onEdit }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(note.content);

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

  function handleEditClick(e: React.MouseEvent) {
    e.stopPropagation();
    setEditText(note.content);
    setIsEditing(true);
  }

  function handleEditSave(e: React.MouseEvent) {
    e.stopPropagation();
    if (editText.trim()) {
      onEdit(editText.trim());
    }
    setIsEditing(false);
  }

  function handleEditCancel(e: React.MouseEvent) {
    e.stopPropagation();
    setIsEditing(false);
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
          <>
            <button
              onClick={handleEditClick}
              className="absolute top-2 right-2 p-1 rounded transition-colors cursor-pointer hover:bg-black/10 dark:hover:bg-white/10"
              style={{ color: "var(--muted)" }}
              title="Edit note"
            >
              <PenIcon />
            </button>
            <button
              onClick={handleDeleteClick}
              className="absolute bottom-2 right-2 p-1 rounded transition-colors cursor-pointer hover:bg-red-500/40"
              style={{ color: "#ef4444" }}
              title="Delete note"
            >
              <TrashIcon />
            </button>
          </>
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

      {isEditing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.4)" }}
          onClick={handleEditCancel}
        >
          <div
            className="w-full max-w-lg flex flex-col rounded-xl border shadow-lg overflow-hidden"
            style={{ background: "var(--surface-1)", borderColor: "var(--border)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
              style={{ borderColor: "var(--border)" }}
            >
              <span className="text-sm font-semibold">Edit note</span>
              <button
                onClick={handleEditCancel}
                className="text-lg leading-none transition-opacity hover:opacity-60"
                style={{ color: "var(--foreground)" }}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="px-4 py-3">
              <textarea
                autoFocus
                rows={6}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1"
                style={{
                  background: "var(--surface-2)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              />
            </div>
            <div
              className="flex justify-end px-4 py-3 border-t flex-shrink-0"
              style={{ borderColor: "var(--border)" }}
            >
              <button
                onClick={handleEditSave}
                disabled={!editText.trim()}
                className="text-sm px-4 py-1.5 rounded-lg font-medium transition-opacity hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
