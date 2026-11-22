import { Clock3, Layers3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Lesson } from '../../types/curriculum.ts'
import { LessonStatusBadge } from '../course/LessonStatusBadge'
import type { LessonViewStatus } from '../course/status'

interface LessonAvailabilityNoticeProps {
  lesson: Lesson
  status: LessonViewStatus
  backToModule: string
  moduleNumber: string
}

export function LessonAvailabilityNotice({
  lesson,
  status,
  backToModule,
  moduleNumber,
}: LessonAvailabilityNoticeProps) {
  return (
    <section
      id="lesson-introduction"
      data-lesson-section
      className="card-shell min-w-0 scroll-mt-24 p-6 sm:p-9"
      aria-labelledby="lesson-unavailable"
    >
      <div className="flex flex-wrap items-center gap-3">
        <LessonStatusBadge status={status} />
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-brand-bright">
          Lesson {lesson.number}
        </span>
      </div>
      <h1
        id="lesson-unavailable"
        className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.03em] text-ink sm:text-4xl"
      >
        {lesson.title}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">
        {lesson.description}
      </p>
      <div className="mt-7 rounded-xl border border-line-soft bg-surface/60 p-5">
        <p className="flex items-center gap-2 text-sm font-semibold text-ink">
          <Clock3 className="size-4 text-brand-bright" aria-hidden="true" />
          {status === 'planned'
            ? 'This lesson is planned, not published.'
            : 'Study content is not available yet.'}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          No learning content has been written for this lesson yet. You can review the module
          outline or return to the course overview while it is being prepared.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to={backToModule}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-deep px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
          >
            <Layers3 className="size-4" aria-hidden="true" />
            Back to module {moduleNumber}
          </Link>
          <Link
            to="/course"
            className="inline-flex min-h-11 items-center rounded-xl border border-line px-5 text-sm font-semibold text-ink transition-colors hover:border-brand/50 hover:bg-surface-hover"
          >
            Course overview
          </Link>
        </div>
      </div>
    </section>
  )
}
