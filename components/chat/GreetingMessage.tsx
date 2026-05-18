type Props = {
  content: string
}

export function GreetingMessage({ content }: Props) {
  return (
    <div
      className="flex gap-3 p-4 rounded-xl border"
      style={{ background: 'var(--accent-subtle)', borderColor: 'var(--accent)' }}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold"
        style={{ background: 'var(--accent)' }}
      >
        <svg
          width="16"
          height="16"
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
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
          Research Assistant
        </span>
        <p className="text-sm italic leading-relaxed" style={{ color: 'var(--foreground)' }}>
          {content}
        </p>
      </div>
    </div>
  )
}
