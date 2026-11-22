import { ArrowUpRight, LockKeyhole } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Lesson } from '../../types/curriculum.ts'
import { formatMinutes } from './format'
import {
  getLessonViewStatus,
  isLessonAvailable,
  type LessonProgressInput,
  type LessonViewStatus,
} from './status'
import { LessonStatusBadge } from './LessonStatusBadge'

interface LessonListItemProps {
  lesson: Lesson
  status?: LessonViewStatus
  progress?: LessonProgressInput
  className?: string
}

export function LessonListItem({
  lesson,
  status,
  progress,
  className = '',
}: LessonListItemProps) {
  const finalStatus: LessonViewStatus = status ?? getLessonViewStatus(lesson, progress)
  const available = isLessonAvailable(finalStatus)

  const content = (
    <>
      <span className="flex min-w-0 flex-1 items-center gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-line-soft bg-surface/70 font-mono text-xs font-medium tabular-nums text-ink-subtle">
          {lesson.number}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-ink">{lesson.title}</span>
          <span className="mt-0.5 block text-xs text-ink-subtle">
            {formatMinutes(lesson.estimatedMinutes)}
            {available ? '' : ' · Not available yet'}
          </span>
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-2">
        <LessonStatusBadge status={finalStatus} />
        {available ? (
          <ArrowUpRight
            className="size-4 text-brand-bright transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={2}
            aria-hidden="true"
          />
        ) : (
          <LockKeyhole className="size-4 text-ink-subtle" strokeWidth={1.8} aria-hidden="true" />
        )}
      </span>
    </>
  )

  const sharedClass = `group flex min-w-0 items-center justify-between gap-3 rounded-xl border px-3 py-2.5 transition-colors duration-200 ${
    available
      ? 'border-line-soft bg-surface/60 hover:border-brand/30 hover:bg-surface-hover/60'
      : 'border-line-soft/60 bg-surface/30'
  } ${className}`

  if (available) {
    return (
      <Link to={`/lesson/${lesson.slug}`} className={sharedClass}>
        {content}
      </Link>
    )
  }

  return (
    <div className={sharedClass} aria-disabled="true">
      {content}
    </div>
  )
}
