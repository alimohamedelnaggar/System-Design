import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface LessonSectionFrameProps {
  id: string
  title: string
  eyebrow?: string
  icon?: LucideIcon
  children: ReactNode
}

export function LessonSectionFrame({
  id,
  title,
  eyebrow,
  icon: Icon,
  children,
}: LessonSectionFrameProps) {
  return (
    <section
      id={id}
      data-lesson-section
      className="card-shell min-w-0 scroll-mt-24 p-5 sm:p-7"
      aria-labelledby={`${id}-title`}
    >
      <div className="flex items-start gap-2.5">
        {Icon ? (
          <Icon className="mt-0.5 size-4 shrink-0 text-brand-bright" strokeWidth={1.8} aria-hidden="true" />
        ) : null}
        <div className="min-w-0">
          {eyebrow ? (
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-bright">
              {eyebrow}
            </p>
          ) : null}
          <h2
            id={`${id}-title`}
            className="mt-1 text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl"
          >
            {title}
          </h2>
        </div>
      </div>
      <div className="mt-4 min-w-0">{children}</div>
    </section>
  )
}
