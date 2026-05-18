type Props = {
  content: string
}

export function GuardrailMessage({ content }: Props) {
  return (
    <div
      className="flex gap-3 p-4 rounded-xl border-l-4"
      style={{
        background: 'var(--warning-bg)',
        borderLeftColor: '#f59e0b',
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="flex-shrink-0 mt-0.5"
        style={{ color: 'var(--warning-text)' }}
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-semibold" style={{ color: 'var(--warning-text)' }}>
          Guardrail triggered
        </span>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--warning-text)' }}>
          {content}
        </p>
      </div>
    </div>
  )
}
