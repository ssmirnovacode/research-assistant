import type { ToolCall } from '@/lib/types'

type Props = {
  toolCall: ToolCall
}

const TOOL_LABELS: Record<ToolCall['tool'], string> = {
  webSearch: 'Searching web',
  summarizeURL: 'Reading URL',
  saveNote: 'Saving note',
}

const TOOL_COLORS: Record<ToolCall['tool'], { bg: string; text: string }> = {
  webSearch: { bg: 'var(--tool-bg)', text: 'var(--tool-text)' },
  summarizeURL: { bg: 'var(--accent-subtle)', text: 'var(--accent)' },
  saveNote: { bg: '#fdf4ff', text: '#7e22ce' },
}

export function ToolCallBadge({ toolCall }: Props) {
  const { bg, text } = TOOL_COLORS[toolCall.tool]
  const label = TOOL_LABELS[toolCall.tool]

  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full"
      style={{ background: bg, color: text }}
    >
      {toolCall.status === 'running' ? (
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: text }} />
      ) : (
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: text }} />
      )}
      {label}: <span className="font-normal truncate max-w-48">{toolCall.input}</span>
    </span>
  )
}
