"use client";

import { useState } from "react";
import type { KeyboardEvent } from "react";

type Props = {
  onSend: (value: string) => void;
  disabled?: boolean;
};

const CHAR_LIMIT = 2000;
const WARN_THRESHOLD = 1800;

export function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState("");

  const charCount = value.length;
  const remaining = CHAR_LIMIT - charCount;
  const isOverLimit = charCount >= CHAR_LIMIT;
  const isNearLimit = charCount >= WARN_THRESHOLD;

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || disabled || isOverLimit) return;
    onSend(trimmed);
    setValue("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div
      className="flex-shrink-0 border-t px-4 py-3"
      style={{ borderColor: "var(--border)", background: "var(--surface-1)" }}
    >
      <div className="max-w-3xl mx-auto">
        <div
          className="flex items-end gap-2 rounded-2xl border px-4 py-2"
          style={{
            borderColor: "var(--border)",
            background: "var(--background)",
          }}
        >
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? "Thinking…" : "Ask a research question…"}
            disabled={disabled}
            maxLength={CHAR_LIMIT}
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm outline-none leading-relaxed py-1.5 placeholder:opacity-50 disabled:cursor-not-allowed"
            style={
              {
                color: "var(--foreground)",
                fieldSizing: "content" as never,
                maxHeight: "160px",
              } as React.CSSProperties
            }
          />
          <button
            onClick={handleSend}
            disabled={!value.trim() || disabled || isOverLimit}
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-opacity mb-0.5"
            style={{
              background:
                value.trim() && !disabled
                  ? "var(--accent)"
                  : "var(--surface-2)",
              color: value.trim() && !disabled ? "white" : "var(--muted)",
              cursor: value.trim() && !disabled ? "pointer" : "default",
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 2 11 13" />
              <path d="M22 2 15 22 11 13 2 9l20-7z" />
            </svg>
          </button>
        </div>
        <div className="flex items-center justify-between mt-2 px-1">
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            Press Enter to send · Shift+Enter for new line
          </p>
          {isNearLimit && (
            <p
              className="text-xs tabular-nums"
              style={{ color: isOverLimit ? "#ef4444" : "#ef7a44" }}
            >
              {remaining} characters remaining
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
