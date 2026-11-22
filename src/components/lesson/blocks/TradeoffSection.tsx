import { Scale } from 'lucide-react'
import type { LessonSection } from '../../../types/curriculum.ts'
import { LessonSectionFrame } from './LessonSectionFrame'
import { ProseBody } from './ProseBody'

export function TradeoffSection({ section }: { section: LessonSection }) {
  const tradeoffs = section.tradeoffs ?? []

  return (
    <LessonSectionFrame
      id={`section-${section.id}`}
      title={section.title}
      eyebrow="Trade-offs"
      icon={Scale}
    >
      {tradeoffs.length > 0 ? (
        <ul className="grid min-w-0 gap-3 sm:grid-cols-2">
          {tradeoffs.map((tradeoff) => (
            <li key={tradeoff.id} className="rounded-xl border border-line-soft bg-surface/60 p-4">
              <p className="text-sm font-semibold text-ink">{tradeoff.choice}</p>
              <p className="mt-2 text-xs leading-relaxed text-success">
                Gain: {tradeoff.benefit}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-warning">Cost: {tradeoff.cost}</p>
            </li>
          ))}
        </ul>
      ) : null}

      {section.paragraphs.length > 0 ? (
        <div className={tradeoffs.length > 0 ? 'mt-5' : undefined}>
          <ProseBody paragraphs={section.paragraphs} keyPoints={section.keyPoints} />
        </div>
      ) : null}
    </LessonSectionFrame>
  )
}
