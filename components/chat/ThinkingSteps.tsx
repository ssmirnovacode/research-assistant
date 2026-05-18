"use client";

import { useState } from "react";
import type { ThinkingStep as ThinkingStepType } from "@/lib/types";
import { ThinkingStep } from "./ThinkingStep";
import { useVerboseMode } from "./VerboseModeContext";

type Props = {
  steps: ThinkingStepType[];
};

export function ThinkingSteps({ steps }: Props) {
  const verboseMode = useVerboseMode();
  const [isOpen, setIsOpen] = useState(false);

  if (!verboseMode || !steps?.length) return null;

  return (
    <div
      className="rounded-lg border mb-3 overflow-hidden text-sm"
      style={{ borderColor: "var(--border)", background: "var(--surface-2)" }}
    >
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity"
        style={{ color: "var(--muted)" }}
      >
        <div className="flex items-center gap-2">
          <span>Agent thinking</span>
          <span
            className="px-1.5 py-0.5 rounded text-xs font-medium"
            style={{
              background: "var(--accent-subtle)",
              color: "var(--accent)",
            }}
          >
            {steps.length} steps
          </span>
        </div>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {isOpen && (
        <div
          className="px-3 pb-3 flex flex-col gap-3 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="pt-2" />
          {steps.map((step, i) => (
            <ThinkingStep key={i} step={step} />
          ))}
        </div>
      )}
    </div>
  );
}
