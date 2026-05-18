import type { ReactNode } from 'react'

type Props = {
  sidebar: ReactNode
  header: ReactNode
  children: ReactNode
}

export function AppShell({ sidebar, header, children }: Props) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--background)' }}>
      <aside
        className="hidden lg:flex flex-col w-72 flex-shrink-0 border-r overflow-hidden"
        style={{ borderColor: 'var(--border)', background: 'var(--surface-1)' }}
      >
        {sidebar}
      </aside>
      <div className="flex flex-col flex-1 overflow-hidden">
        <header
          className="flex-shrink-0 border-b px-4 py-3 flex items-center justify-between"
          style={{ borderColor: 'var(--border)', background: 'var(--surface-1)' }}
        >
          {header}
        </header>
        <main className="flex flex-col flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  )
}
