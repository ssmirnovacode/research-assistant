'use client'

import { useVerboseMode } from '@/components/chat/VerboseModeContext'

type Props = {
  onToggleVerbose: () => void
}

export function AppHeader({ onToggleVerbose }: Props) {
  const verboseMode = useVerboseMode()

  return (
    <>
      <div className="flex items-center gap-2">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: 'var(--accent)' }}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <span className="font-semibold text-sm">Research Assistant</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs" style={{ color: 'var(--muted)' }}>
          Verbose mode
        </span>
        <button
          onClick={onToggleVerbose}
          role="switch"
          aria-checked={verboseMode}
          className="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus-visible:ring-2"
          style={{
            background: verboseMode ? 'var(--accent)' : 'var(--surface-2)',
          }}
        >
          <span
            className="pointer-events-none inline-block h-4 w-4 rounded-full shadow-sm transition-transform"
            style={{
              background: 'white',
              transform: verboseMode ? 'translateX(16px)' : 'translateX(0)',
            }}
          />
        </button>
      </div>
    </>
  )
}
