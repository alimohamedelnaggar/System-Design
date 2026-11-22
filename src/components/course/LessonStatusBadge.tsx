import { CircleCheck, CircleDashed, LoaderCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { lessonStatusLabels, type LessonViewStatus } from './status'

interface LessonStatusBadgeProps {
  status: LessonViewStatus
  className?: string
}

const statusStyles: Record<LessonViewStatus, { className: string; icon: LucideIcon }> = {
  published: {
    className: 'border-brand/25 bg-brand/10 text-brand-bright',
    icon: CircleCheck,
  },
  planned: {
    className: 'border-line bg-surface-raised/70 text-ink-subtle',
    icon: CircleDashed,
  },
  in_progress: {
    className: 'border-warning/30 bg-warning/10 text-warning',
    icon: LoaderCircle,
  },
  completed: {
    className: 'border-success/25 bg-success/10 text-success',
    icon: CircleCheck,
  },
}

export function LessonStatusBadge({ status, className = '' }: LessonStatusBadgeProps) {
  const { className: variantClass, icon: Icon } = statusStyles[status]

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${variantClass} ${className}`}
    >
      <Icon className="size-3 shrink-0" strokeWidth={2} aria-hidden="true" />
      {lessonStatusLabels[status]}
    </span>
  )
}
