import ReactMarkdown from 'react-markdown'
import type { Note } from '@/lib/types'
import { markdownComponents } from '@/lib/markdownComponents'

type Props = {
  note: Note
  onClick: () => void
}

function formatTime(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function NoteCard({ note, onClick }: Props) {
  return (
    <li
      className="rounded-lg p-3 border text-sm cursor-pointer transition-opacity hover:opacity-80"
      style={{
        background: 'var(--surface-2)',
        borderColor: 'var(--border)',
      }}
      onClick={onClick}
    >
      <div className="line-clamp-4 leading-relaxed" style={{ color: 'var(--foreground)' }}>
        <ReactMarkdown components={markdownComponents}>
          {note.content}
        </ReactMarkdown>
      </div>
      <p className="mt-2 text-xs" style={{ color: 'var(--muted)' }}>
        {formatTime(note.savedAt)}
      </p>
    </li>
  )
}
