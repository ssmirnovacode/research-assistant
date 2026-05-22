'use client'

import { useState } from 'react'
import type { Note } from '@/lib/types'
import { NoteCard } from './NoteCard'
import { NoteModal } from './NoteModal'
import { CreateNoteModal } from './CreateNoteModal'

type Props = {
  notes: Note[]
  onAddNote: (content: string) => void
}

export function NotesSidebar({ notes, onAddNote }: Props) {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  return (
    <div className="flex flex-col h-full">
      <div
        className="px-4 py-3 border-b flex items-center justify-between flex-shrink-0"
        style={{ borderColor: 'var(--border)' }}
      >
        <span className="font-semibold text-sm">Saved Notes</span>
        {notes.length > 0 && (
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}
          >
            {notes.length}
          </span>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        {notes.length === 0 ? (
          <p className="text-xs text-center mt-6" style={{ color: 'var(--muted)' }}>
            No notes yet. Ask the agent to save a finding.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} onClick={() => setSelectedNote(note)} />
            ))}
          </ul>
        )}
      </div>
      <div className="p-3 border-t flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={() => setIsCreating(true)}
          className="w-full text-sm py-1.5 rounded-lg border transition-opacity hover:opacity-80"
          style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
        >
          + Create note
        </button>
      </div>
      <NoteModal note={selectedNote} onClose={() => setSelectedNote(null)} />
      <CreateNoteModal
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        onSave={onAddNote}
      />
    </div>
  )
}
