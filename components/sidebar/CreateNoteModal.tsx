'use client'

import { useState, useEffect } from 'react'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSave: (content: string) => void
}

export function CreateNoteModal({ isOpen, onClose, onSave }: Props) {
  const [text, setText] = useState('')

  useEffect(() => {
    if (isOpen) setText('')
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  function handleSave() {
    onSave(text.trim())
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.4)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg flex flex-col rounded-xl border shadow-lg overflow-hidden"
        style={{ background: 'var(--surface-1)', borderColor: 'var(--border)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
          style={{ borderColor: 'var(--border)' }}
        >
          <span className="text-sm font-semibold">New note</span>
          <button
            onClick={onClose}
            className="text-lg leading-none transition-opacity hover:opacity-60"
            style={{ color: 'var(--foreground)' }}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="px-4 py-3">
          <textarea
            autoFocus
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your note…"
            className="w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none focus:ring-1"
            style={{
              background: 'var(--surface-2)',
              borderColor: 'var(--border)',
              color: 'var(--foreground)',
            }}
          />
        </div>
        <div
          className="flex justify-end px-4 py-3 border-t flex-shrink-0"
          style={{ borderColor: 'var(--border)' }}
        >
          <button
            onClick={handleSave}
            disabled={!text.trim()}
            className="text-sm px-4 py-1.5 rounded-lg font-medium transition-opacity hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'var(--accent)', color: '#fff' }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
