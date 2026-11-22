import { TriangleAlert } from 'lucide-react'
import type { LessonSection } from '../../../types/curriculum.ts'
import { LessonSectionFrame } from './LessonSectionFrame'
import { ProseBody } from './ProseBody'

export function CommonMistakesSection({ section }: { section: LessonSection }) {
  const mistakes = section.commonMistakes ?? []

  return (
    <LessonSectionFrame
      id={`section-${section.id}`}
      title={section.title}
      eyebrow="Common mistakes"
      icon={TriangleAlert}
    >
      {mistakes.length > 0 ? (
        <ul className="space-y-2">
          {mistakes.map((mistake) => (
            <li key={mistake} className="flex gap-2 text-sm leading-relaxed text-ink-muted">
              <TriangleAlert
                className="mt-0.5 size-4 shrink-0 text-warning"
                strokeWidth={1.8}
                aria-hidden="true"
              />
              {mistake}
            </li>
          ))}
        </ul>
      ) : null}

      {section.paragraphs.length > 0 ? (
        <div className={mistakes.length > 0 ? 'mt-5' : undefined}>
          <ProseBody paragraphs={section.paragraphs} keyPoints={section.keyPoints} />
        </div>
      ) : null}
    </LessonSectionFrame>
  )
}
