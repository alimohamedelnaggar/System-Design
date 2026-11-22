import { ArrowLeft, ArrowRight, Layers3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { LessonStatusBadge } from '../course/LessonStatusBadge'
import { getLessonViewStatus, isLessonAvailable } from '../course/status'
import type { Lesson } from '../../types/curriculum.ts'
import { findLessonLocation } from './location'

interface LessonNavigationProps {
  previous?: Lesson
  next?: Lesson
  backToModule: string
  moduleNumber: string
  domainSlug: string
  domainTitle: string
}

function NavigationCard({ lesson, direction }: { lesson: Lesson; direction: 'previous' | 'next' }) {
  const Icon = direction === 'previous' ? ArrowLeft : ArrowRight
  const status = getLessonViewStatus(lesson)
  const available = isLessonAvailable(status)
  const location = findLessonLocation(lesson)
  const className = `card-shell group flex min-w-0 flex-col gap-2 p-4 transition-colors duration-200 ${
    available
      ? 'hover:border-brand/40 hover:bg-surface-hover/50'
      : 'border-line-soft/60 bg-surface/30'
  }`

  const content = (
    <>
      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-brand-bright">
        {direction === 'previous' ? <Icon className="size-3.5" aria-hidden="true" /> : null}
        {direction === 'previous' ? 'Previous lesson' : 'Next lesson'}
        {direction === 'next' ? <Icon className="size-3.5" aria-hidden="true" /> : null}
      </span>
      <span className="min-w-0 text-sm font-semibold text-ink">{lesson.title}</span>
      {location ? (
        <span className="min-w-0 truncate text-xs text-ink-subtle">
          {location.moduleNumber} · {location.moduleTitle}
        </span>
      ) : null}
      <LessonStatusBadge status={status} className="self-start" />
      {available ? null : (
        <span className="text-xs text-ink-subtle">Content is not published yet.</span>
      )}
    </>
  )

  if (available) {
    return (
      <Link to={`/lesson/${lesson.slug}`} className={className}>
        {content}
      </Link>
    )
  }

  return (
    <div className={className} aria-disabled="true">
      {content}
    </div>
  )
}

export function LessonNavigation({
  previous,
  next,
  backToModule,
  moduleNumber,
  domainSlug,
  domainTitle,
}: LessonNavigationProps) {
  return (
    <div className="mt-8 min-w-0">
      <nav aria-label="Lesson navigation" className="grid min-w-0 gap-3 sm:grid-cols-2">
        {previous ? (
          <NavigationCard lesson={previous} direction="previous" />
        ) : (
          <div className="rounded-xl border border-line-soft/60 bg-surface/30 p-4 text-xs text-ink-subtle">
            First lesson in the course
          </div>
        )}
        {next ? (
          <NavigationCard lesson={next} direction="next" />
        ) : (
          <div className="rounded-xl border border-line-soft/60 bg-surface/30 p-4 text-xs text-ink-subtle">
            Last lesson in the course
          </div>
        )}
      </nav>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line-soft pt-5">
        <Link
          to={backToModule}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-medium text-ink-muted transition-colors hover:text-brand-bright"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to module {moduleNumber}
        </Link>
        <Link
          to={`/domain/${domainSlug}`}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-medium text-ink-muted transition-colors hover:text-brand-bright"
        >
          <Layers3 className="size-4" aria-hidden="true" />
          {domainTitle}
        </Link>
      </div>
    </div>
  )
}
