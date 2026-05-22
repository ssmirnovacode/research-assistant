"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type Props = {
  containerRef: React.RefObject<HTMLElement | null>;
  onSaveSelection: (text: string) => void;
};

type PopoverPosition = { top: number; left: number };

export function SelectionPopover({ containerRef, onSaveSelection }: Props) {
  const [position, setPosition] = useState<PopoverPosition | null>(null);
  const pendingTextRef = useRef<string>("");

  const hide = useCallback(() => setPosition(null), []);

  useEffect(() => {
    function onMouseUp() {
      const selection = window.getSelection();
      const text = selection?.toString().trim() ?? "";

      if (!text || !selection || !containerRef.current) {
        hide();
        return;
      }

      const range = selection.getRangeAt(0);
      if (!containerRef.current.contains(range.commonAncestorContainer)) {
        hide();
        return;
      }

      const rect = range.getBoundingClientRect();
      pendingTextRef.current = text;
      setPosition({
        top: rect.bottom + window.scrollY + 6,
        left: rect.left + window.scrollX + rect.width / 2,
      });
    }

    function onMouseDown(e: MouseEvent) {
      // Hide if clicking outside the popover button itself
      const target = e.target as HTMLElement;
      if (!target.closest("[data-selection-popover]")) {
        hide();
      }
    }

    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousedown", onMouseDown);
    return () => {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, [containerRef, hide]);

  if (!position) return null;

  function handleClick() {
    const text = pendingTextRef.current;
    hide();
    window.getSelection()?.removeAllRanges();
    if (text) onSaveSelection(text);
  }

  return (
    <button
      data-selection-popover
      onClick={handleClick}
      className="fixed z-50 text-xs font-medium px-3 py-1.5 rounded-full shadow-md -translate-x-1/2 whitespace-nowrap transition-colors"
      style={{
        top: position.top,
        left: position.left,
        background: "var(--accent)",
        color: "#fff",
      }}
    >
      Summarize &amp; save note
    </button>
  );
}
