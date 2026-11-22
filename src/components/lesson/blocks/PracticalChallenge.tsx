import { Lightbulb, NotebookPen } from 'lucide-react'
import type { PracticalChallenge as PracticalChallengeData } from '../../../types/curriculum.ts'
import { LessonSectionFrame } from './LessonSectionFrame'

export function PracticalChallenge({ challenge }: { challenge: PracticalChallengeData }) {
  return (
    <LessonSectionFrame
      id="lesson-challenge"
      title={challenge.title}
      eyebrow="Practical challenge"
      icon={NotebookPen}
    >
      <p className="text-sm leading-relaxed text-ink-muted">{challenge.scenario}</p>
      <div className="mt-5 grid min-w-0 gap-5 sm:grid-cols-2">
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-bright">
            Requirements
          </p>
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-ink-muted">
            {challenge.requirements.map((item) => (
              <li key={item}>· {item}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-bright">
            Deliverables
          </p>
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-ink-muted">
            {challenge.deliverables.map((item) => (
              <li key={item}>· {item}</li>
            ))}
          </ul>
        </div>
      </div>
      {challenge.constraints.length > 0 ? (
        <p className="mt-5 border-t border-line-soft pt-4 text-xs leading-relaxed text-ink-subtle">
          Constraints: {challenge.constraints.join(' · ')}
        </p>
      ) : null}
      {challenge.hints && challenge.hints.length > 0 ? (
        <ul className="mt-3 space-y-1 text-xs leading-relaxed text-ink-subtle">
          {challenge.hints.map((hint) => (
            <li key={hint} className="flex gap-2">
              <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-warning" aria-hidden="true" />
              {hint}
            </li>
          ))}
        </ul>
      ) : null}
    </LessonSectionFrame>
  )
}
