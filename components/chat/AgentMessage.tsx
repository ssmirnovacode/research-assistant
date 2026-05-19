import { useRef } from "react";
import type { Source, ThinkingStep } from "@/lib/types";
import ReactMarkdown from "react-markdown";
import { ThinkingSteps } from "./ThinkingSteps";
import { SelectionPopover } from "./SelectionPopover";
import { fixTableRowsMd, formatTime } from "@/lib/helpers";

type Props = {
  content: string;
  timestamp: string;
  sources?: Source[];
  thinkingSteps?: ThinkingStep[];
  onSaveSelection: (text: string) => void;
};

export function AgentMessage({
  content,
  timestamp,
  thinkingSteps,
  onSaveSelection,
}: Props) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex gap-3 max-w-2xl">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white"
        style={{ background: "var(--accent)" }}
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </div>
      <div className="flex flex-col gap-1 flex-1">
        <ThinkingSteps steps={thinkingSteps ?? []} />
        <SelectionPopover containerRef={contentRef} onSaveSelection={onSaveSelection} />
        <div
          ref={contentRef}
          className="rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed"
          style={{ background: "var(--surface-1)" }}
        >
          <ReactMarkdown
            components={{
              h2: ({ children }) => (
                <h2 className="text-sm font-semibold mt-3 mb-1">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-sm font-medium mt-2 mb-0.5">{children}</h3>
              ),
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              ul: ({ children }) => (
                <ul className="list-disc pl-4 mb-2 flex flex-col gap-0.5">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-4 mb-2 flex flex-col gap-0.5">
                  {children}
                </ol>
              ),
              li: ({ children }) => <li>{children}</li>,
              strong: ({ children }) => (
                <strong className="font-semibold">{children}</strong>
              ),
              hr: () => (
                <hr
                  className="my-3 border-t"
                  style={{ borderColor: "var(--border)" }}
                />
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto mb-2">
                  <table className="text-xs border-collapse w-full">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th
                  className="px-2 py-1 text-left font-semibold border"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--surface-2)",
                  }}
                >
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td
                  className="px-2 py-1 border"
                  style={{ borderColor: "var(--border)" }}
                >
                  {children}
                </td>
              ),
              a: ({ href, children }) => {
                const isSafe =
                  typeof href === "string" &&
                  (href.startsWith("https://") || href.startsWith("/"));
                return isSafe ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:opacity-75 transition-opacity"
                    style={{ color: "var(--accent)" }}
                  >
                    {children}
                  </a>
                ) : (
                  <span>{children}</span>
                );
              },
              blockquote: ({ children }) => (
                <blockquote
                  className="border-l-2 pl-3 italic my-2 text-xs"
                  style={{
                    borderColor: "var(--accent)",
                    color: "var(--muted)",
                  }}
                >
                  {children}
                </blockquote>
              ),
            }}
          >
            {fixTableRowsMd(content)}
          </ReactMarkdown>
        </div>
        {/* {sources?.length > 0 && (
          <div className="flex flex-col gap-1 px-1 pt-1">
            <span
              className="text-xs font-medium"
              style={{ color: "var(--muted)" }}
            >
              Sources
            </span>
            <ul className="flex flex-col gap-1">
              {sources.map((source, i) => (
                <li key={i} className="flex items-center gap-1.5 text-xs">
                  <span style={{ color: "var(--muted)" }}>{i + 1}.</span>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:opacity-75 transition-opacity truncate"
                    style={{ color: "var(--accent)" }}
                  >
                    {source.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )} */}
        <span className="text-xs px-1" style={{ color: "var(--muted)" }}>
          {formatTime(timestamp)}
        </span>
      </div>
    </div>
  );
}
