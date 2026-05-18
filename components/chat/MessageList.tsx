'use client'

import { useEffect, useRef } from 'react'
import type { Message } from '@/lib/types'
import { MessageItem } from './MessageItem'

type Props = {
  messages: Message[]
}

export function MessageList({ messages }: Props) {
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
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
