import { ListChecks, TriangleAlert } from 'lucide-react'
import type { Lesson } from '../../../types/curriculum.ts'
import { useProgress } from '../../../features/progress'
import { resolvePlayableQuiz } from '../../../features/quiz'
import { QuizExperience } from '../../quiz'
import { LessonSectionFrame } from './LessonSectionFrame'

interface KnowledgeCheckProps {
  lesson: Lesson
}

/** Integrates the reusable quiz engine with canonical lesson quiz data and progress. */
export function KnowledgeCheck({ lesson }: KnowledgeCheckProps) {
  const progress = useProgress()
  const resolved = resolvePlayableQuiz(lesson)

  if (!resolved) return null

  if (!resolved.valid) {
    return (
      <LessonSectionFrame id="lesson-quiz" title="Knowledge check" icon={ListChecks}>
        <div
          role="alert"
          className="rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm text-ink"
        >
          <p className="inline-flex items-center gap-2 font-semibold">
            <TriangleAlert className="size-4 text-warning" aria-hidden="true" />
            This knowledge check is unavailable.
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-ink-muted">
            {resolved.issues.map((issue) => (
              <li key={`${issue.entity}-${issue.message}`}>
                {issue.entity}: {issue.message}
              </li>
            ))}
          </ul>
        </div>
      </LessonSectionFrame>
    )
  }

  return (
    <LessonSectionFrame id="lesson-quiz" title="Knowledge check" icon={ListChecks}>
      <QuizExperience
        quiz={resolved.quiz}
        lessonId={resolved.lessonId}
        previousProgress={progress.getQuizProgress(resolved.quiz.id)}
        onAttempt={(input) => progress.saveQuizAttempt(input)}
      />
    </LessonSectionFrame>
  )
}
