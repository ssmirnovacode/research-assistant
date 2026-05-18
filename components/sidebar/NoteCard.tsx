import type { Note } from '@/lib/types'

type Props = {
  note: Note
}

function formatTime(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function NoteCard({ note }: Props) {
  return (
    <li
      className="rounded-lg p-3 border text-sm"
      style={{
        background: 'var(--surface-2)',
        borderColor: 'var(--border)',
      }}
    >
      <p className="leading-relaxed line-clamp-4" style={{ color: 'var(--foreground)' }}>
        {note.content}
      </p>
      <p className="mt-2 text-xs" style={{ color: 'var(--muted)' }}>
        {formatTime(note.savedAt)}
      </p>
    </li>
  )
}
