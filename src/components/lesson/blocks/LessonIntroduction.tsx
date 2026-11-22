import { Clock3, Layers3 } from 'lucide-react'
import type { LessonContent } from '../../../types/curriculum.ts'
import { LessonStatusBadge } from '../../course/LessonStatusBadge'
import { formatMinutes } from '../../course/format'

interface LessonIntroductionProps {
  content: LessonContent
  moduleLabel?: string
}

export function LessonIntroduction({ content, moduleLabel }: LessonIntroductionProps) {
  const { lesson } = content

  return (
    <section
      id="lesson-introduction"
      data-lesson-section
      className="card-shell min-w-0 scroll-mt-24 p-5 sm:p-7"
      aria-labelledby="lesson-introduction-title"
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-brand-bright">
          Lesson {lesson.number}
        </span>
        <LessonStatusBadge status={lesson.status} />
        <span className="inline-flex items-center gap-1.5 text-xs text-ink-subtle">
          <Clock3 className="size-3.5" aria-hidden="true" />
          {formatMinutes(lesson.estimatedMinutes)} read
        </span>
        {moduleLabel ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-ink-subtle">
            <Layers3 className="size-3.5" aria-hidden="true" />
            Module {moduleLabel}
          </span>
        ) : null}
      </div>
      <h1
        id="lesson-introduction-title"
        className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.03em] text-ink sm:text-4xl"
      >
        {lesson.title}
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-muted">{lesson.description}</p>
    </section>
  )
}
