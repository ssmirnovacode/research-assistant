import type { Source, ThinkingStep } from '@/lib/types'
import { ThinkingSteps } from './ThinkingSteps'

type Props = {
  content: string
  timestamp: string
  sources: Source[]
  thinkingSteps: ThinkingStep[]
}

function formatTime(iso: string): string {
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date(iso))
}

export function AgentMessage({ content, timestamp, sources, thinkingSteps }: Props) {
  return (
    <div className="flex gap-3 max-w-2xl">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white"
        style={{ background: 'var(--accent)' }}
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
        <ThinkingSteps steps={thinkingSteps} />
        <div
          className="rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed"
          style={{ background: 'var(--surface-1)' }}
        >
          {content}
        </div>
        {sources.length > 0 && (
          <div className="flex flex-col gap-1 px-1 pt-1">
            <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>
              Sources
            </span>
            <ul className="flex flex-col gap-1">
              {sources.map((source, i) => (
                <li key={i} className="flex items-center gap-1.5 text-xs">
                  <span style={{ color: 'var(--muted)' }}>{i + 1}.</span>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:opacity-75 transition-opacity truncate"
                    style={{ color: 'var(--accent)' }}
                  >
                    {source.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        <span className="text-xs px-1" style={{ color: 'var(--muted)' }}>
          {formatTime(timestamp)}
        </span>
      </div>
    </div>
  )
}
