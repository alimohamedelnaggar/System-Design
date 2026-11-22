import type { LessonSection } from '../../../types/curriculum.ts'
import { LessonSectionFrame } from './LessonSectionFrame'
import { ProseBody } from './ProseBody'

export function ProcessSection({ section }: { section: LessonSection }) {
  const steps = section.steps ?? []

  return (
    <LessonSectionFrame
      id={`section-${section.id}`}
      title={section.title}
      eyebrow="Step-by-step process"
    >
      {steps.length > 0 ? (
        <ol className="space-y-3">
          {steps.map((step, index) => (
            <li
              key={step.id}
              className="flex min-w-0 gap-3 rounded-xl border border-line-soft bg-surface/60 p-4"
            >
              <span className="grid size-7 shrink-0 place-items-center rounded-lg border border-brand/25 bg-brand/10 font-mono text-xs font-semibold text-brand-bright">
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      ) : null}

      {section.paragraphs.length > 0 ? (
        <div className={steps.length > 0 ? 'mt-5' : undefined}>
          <ProseBody paragraphs={section.paragraphs} keyPoints={section.keyPoints} />
        </div>
      ) : null}
    </LessonSectionFrame>
  )
}
