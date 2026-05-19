import type { Components } from 'react-markdown'

export const markdownComponents: Components = {
  h2: ({ children }) => (
    <h2 className="text-sm font-semibold mt-3 mb-1">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-sm font-medium mt-2 mb-0.5">{children}</h3>
  ),
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }) => (
    <ul className="list-disc pl-4 mb-2 flex flex-col gap-0.5">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-4 mb-2 flex flex-col gap-0.5">{children}</ol>
  ),
  li: ({ children }) => <li>{children}</li>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  hr: () => (
    <hr className="my-3 border-t" style={{ borderColor: 'var(--border)' }} />
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto mb-2">
      <table className="text-xs border-collapse w-full">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th
      className="px-2 py-1 text-left font-semibold border"
      style={{ borderColor: 'var(--border)', background: 'var(--surface-2)' }}
    >
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-2 py-1 border" style={{ borderColor: 'var(--border)' }}>
      {children}
    </td>
  ),
  a: ({ href, children }) => {
    const isSafe =
      typeof href === 'string' &&
      (href.startsWith('https://') || href.startsWith('/'))
    return isSafe ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:opacity-75 transition-opacity"
        style={{ color: 'var(--accent)' }}
      >
        {children}
      </a>
    ) : (
      <span>{children}</span>
    )
  },
  blockquote: ({ children }) => (
    <blockquote
      className="border-l-2 pl-3 italic my-2 text-xs"
      style={{ borderColor: 'var(--accent)', color: 'var(--muted)' }}
    >
      {children}
    </blockquote>
  ),
}
