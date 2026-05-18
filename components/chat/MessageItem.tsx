import type { Message } from '@/lib/types'
import { GreetingMessage } from './GreetingMessage'
import { UserMessage } from './UserMessage'
import { AgentMessage } from './AgentMessage'
import { GuardrailMessage } from './GuardrailMessage'

type Props = {
  message: Message
}

export function MessageItem({ message }: Props) {
  if (message.role === 'greeting') {
    return <GreetingMessage content={message.content} />
  }

  if (message.role === 'user') {
    return <UserMessage content={message.content} timestamp={message.timestamp} />
  }

  if (message.role === 'agent') {
    return (
      <AgentMessage
        content={message.content}
        timestamp={message.timestamp}
        sources={message.sources}
        thinkingSteps={message.thinkingSteps}
      />
    )
  }

  if (message.role === 'guardrail') {
    return <GuardrailMessage content={message.content} />
  }

  return null
}
