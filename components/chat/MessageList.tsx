'use client'

import { useEffect, useRef } from 'react'
import type { Message } from '@/lib/types'
import { MessageItem } from './MessageItem'

type Props = {
  messages: Message[]
  isThinking: boolean
}

export function MessageList({ messages, isThinking }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-3xl mx-auto flex flex-col gap-5">
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
        {isThinking && (
          <div className="flex gap-3 max-w-2xl">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white"
              style={{ background: 'var(--accent)' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <div
              className="rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1"
              style={{ background: 'var(--surface-1)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--muted)', animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--muted)', animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--muted)', animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
