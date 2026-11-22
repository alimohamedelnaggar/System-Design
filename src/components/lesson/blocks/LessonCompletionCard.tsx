import { CheckCircle2, Circle, RotateCcw } from 'lucide-react'
import { useProgress } from '../../../features/progress'

interface LessonCompletionCardProps {
  lessonId: string
}

function formatDate(value: string | null): string {
  if (!value) return 'just now'
  const timestamp = Date.parse(value)
  if (Number.isNaN(timestamp)) return 'just now'
  return new Date(timestamp).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function LessonCompletionCard({ lessonId }: LessonCompletionCardProps) {
  const progress = useProgress()
  const record = progress.getLessonProgress(lessonId)
  const completed = record?.status === 'completed'

  const handleReopen = () => {
    const confirmed = window.confirm(
      'Reopen this lesson? Your completion state will be reset; quiz results stay saved.',
    )
    if (confirmed) progress.resetLessonProgress(lessonId)
  }

  return (
    <section
      className="card-shell min-w-0 p-5 sm:p-6"
      aria-labelledby="lesson-completion-title"
      data-lesson-completion
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0" aria-live="polite">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-bright">
            Lesson progress
          </p>
          <h2 id="lesson-completion-title" className="mt-1.5 text-base font-semibold text-ink">
            {completed ? 'Lesson completed' : 'Ready to continue'}
          </h2>
          <p className="mt-1 flex items-center gap-2 text-xs leading-relaxed text-ink-subtle">
            {completed ? (
              <CheckCircle2 className="size-4 shrink-0 text-success" aria-hidden="true" />
            ) : (
              <Circle className="size-4 shrink-0 text-ink-subtle" aria-hidden="true" />
            )}
            {completed
              ? `Marked complete on ${formatDate(record?.completedAt ?? null)}`
              : 'Mark this lesson complete when you have finished reviewing it.'}
          </p>
        </div>

        {completed ? (
          <button
            type="button"
            onClick={handleReopen}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-4 text-sm font-semibold text-ink-muted transition-colors hover:border-brand/40 hover:text-ink"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Reopen lesson
          </button>
        ) : (
          <button
            type="button"
            onClick={() => progress.completeLesson(lessonId)}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-deep px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
          >
            <CheckCircle2 className="size-4" aria-hidden="true" />
            Mark as complete
          </button>
        )}
      </div>
    </section>
  )
}
