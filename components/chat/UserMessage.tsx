type Props = {
  content: string
  timestamp: string
}

function formatTime(iso: string): string {
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date(iso))
}

export function UserMessage({ content, timestamp }: Props) {
  return (
    <div className="flex flex-col items-end gap-1">
      <div
        className="max-w-lg rounded-3xl px-4 py-2.5 text-sm leading-relaxed text-white"
        style={{ background: 'var(--accent)' }}
      >
        {content}
      </div>
      <span className="text-xs px-1" style={{ color: 'var(--muted)' }}>
        {formatTime(timestamp)}
      </span>
    </div>
  )
}
