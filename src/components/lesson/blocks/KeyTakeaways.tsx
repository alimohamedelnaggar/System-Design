import { Check, Sparkles } from 'lucide-react'
import type { LessonSummary } from '../../../types/curriculum.ts'
import { LessonSectionFrame } from './LessonSectionFrame'

export function KeyTakeaways({ summary }: { summary: LessonSummary }) {
  return (
    <LessonSectionFrame id="lesson-summary" title="Key takeaways" eyebrow="Summary" icon={Sparkles}>
      <p className="text-sm leading-relaxed text-ink-muted">{summary.overview}</p>
      <ul className="mt-4 space-y-2">
        {summary.keyTakeaways.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-relaxed text-ink-muted">
            <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
      {summary.nextSteps && summary.nextSteps.length > 0 ? (
        <p className="mt-5 border-t border-line-soft pt-4 text-sm leading-relaxed text-ink-subtle">
          {summary.nextSteps.join(' ')}
        </p>
      ) : null}
    </LessonSectionFrame>
  )
}
