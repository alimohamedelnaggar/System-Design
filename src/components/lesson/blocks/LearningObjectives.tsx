import { Check, Target } from 'lucide-react'
import type { LearningObjective } from '../../../types/curriculum.ts'
import { LessonSectionFrame } from './LessonSectionFrame'

interface LearningObjectivesProps {
  objectives: readonly LearningObjective[]
}

export function LearningObjectives({ objectives }: LearningObjectivesProps) {
  if (objectives.length === 0) return null

  return (
    <LessonSectionFrame id="lesson-objectives" title="Learning objectives" icon={Target}>
      <ul className="grid min-w-0 gap-3 sm:grid-cols-2">
        {objectives.map((objective) => (
          <li
            key={objective.id}
            className="flex gap-2 rounded-xl border border-line-soft bg-surface/60 p-3.5 text-sm leading-snug text-ink-muted"
          >
            <Check className="mt-0.5 size-4 shrink-0 text-brand-bright" aria-hidden="true" />
            {objective.text}
          </li>
        ))}
      </ul>
    </LessonSectionFrame>
  )
}
