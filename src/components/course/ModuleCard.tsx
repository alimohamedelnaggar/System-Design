import { ChevronDown, Clock3 } from 'lucide-react'
import type { Lesson, Module } from '../../types/curriculum.ts'
import { formatHours } from './format'
import { LessonListItem } from './LessonListItem'
import type { LessonProgressInput } from './status'

interface ModuleCardProps {
  module: Module
  lessons: readonly Lesson[]
  defaultOpen?: boolean
  progress?: LessonProgressInput
}

export function ModuleCard({
  module,
  lessons,
  defaultOpen = false,
  progress,
}: ModuleCardProps) {
  const publishedCount = lessons.filter((lesson) => lesson.status === 'published').length
  const plannedCount = lessons.length - publishedCount
  const bodyId = `module-body-${module.id}`

  return (
    <details
      id={`module-${module.id}`}
      open={defaultOpen}
      className="card-shell group scroll-mt-28 overflow-hidden"
    >
      <summary className="flex cursor-pointer list-none flex-col gap-3 p-4 transition-colors duration-200 hover:bg-surface-hover/40 sm:flex-row sm:items-start sm:justify-between sm:p-5 [&::-webkit-details-marker]:hidden">
        <div className="flex min-w-0 gap-3">
          <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg border border-brand/20 bg-brand/10 font-mono text-xs font-semibold text-brand-bright">
            {module.number}
          </span>
          <div className="min-w-0">
            <h3 className="text-base font-semibold leading-snug tracking-[-0.01em] text-ink sm:text-lg">
              {module.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{module.description}</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-subtle">
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="size-3.5 text-brand-bright" aria-hidden="true" />
                {formatHours(module.estimatedHours)}
              </span>
              <span className="tabular-nums">{lessons.length} lesson{lessons.length === 1 ? '' : 's'}</span>
              {publishedCount > 0 ? (
                <span className="text-brand-bright">{publishedCount} published</span>
              ) : null}
              {plannedCount > 0 ? <span>{plannedCount} planned</span> : null}
            </div>
          </div>
        </div>
        <ChevronDown
          className="size-5 shrink-0 self-start text-ink-subtle transition-transform duration-200 group-open:rotate-180"
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </summary>

      <div id={bodyId} className="border-t border-line-soft bg-canvas/30 p-3 sm:p-4">
        <p className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-subtle">
          Lessons in order
        </p>
        <ol className="space-y-2">
          {lessons.map((lesson) => (
            <li key={lesson.id} className="min-w-0">
              <LessonListItem lesson={lesson} progress={progress} />
            </li>
          ))}
        </ol>
      </div>
    </details>
  )
}
