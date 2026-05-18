import type { ThinkingStep as ThinkingStepType } from '@/lib/types'
import { ToolCallBadge } from './ToolCallBadge'

type Props = {
  step: ThinkingStepType
}

const KIND_LABEL: Record<ThinkingStepType['kind'], string> = {
  thought: 'Thought',
  action: 'Action',
  observation: 'Observation',
}

export function ThinkingStep({ step }: Props) {
  if (step.kind === 'thought') {
    return (
      <div className="flex gap-2 text-xs">
        <span className="font-medium shrink-0" style={{ color: 'var(--muted)' }}>
          💭 {KIND_LABEL[step.kind]}
        </span>
        <span className="italic" style={{ color: 'var(--muted)' }}>
          {step.content}
        </span>
      </div>
    )
  }

  if (step.kind === 'action') {
    return (
      <div className="flex flex-col gap-1 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-medium shrink-0" style={{ color: 'var(--muted)' }}>
            ⚡ {KIND_LABEL[step.kind]}
          </span>
          <span style={{ color: 'var(--muted)' }}>{step.content}</span>
        </div>
        {step.toolCall && <ToolCallBadge toolCall={step.toolCall} />}
      </div>
    )
  }

  return (
    <div className="flex gap-2 text-xs pl-4 border-l-2" style={{ borderColor: 'var(--border)' }}>
      <span className="font-medium shrink-0" style={{ color: 'var(--muted)' }}>
        👁 {KIND_LABEL[step.kind]}
      </span>
      <span className="font-mono text-xs leading-relaxed" style={{ color: 'var(--foreground)' }}>
        {step.content}
      </span>
    </div>
  )
}
