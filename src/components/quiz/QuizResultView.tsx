import { CheckCircle2, ClipboardList, RotateCcw, Timer, XCircle } from 'lucide-react'
import type { Quiz } from '../../types/curriculum.ts'
import type { QuizResult } from '../../features/quiz'

interface QuizResultViewProps {
  quiz: Quiz
  result: QuizResult
  onReview(): void
  onRetake(): void
}

function formatDuration(seconds: number | null): string {
  if (seconds === null) return 'Not recorded'
  const minutes = Math.floor(seconds / 60)
  const remaining = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`
}

export function QuizResultView({ quiz, result, onReview, onRetake }: QuizResultViewProps) {
  const stats = [
    { label: 'Total questions', value: String(result.totalQuestions) },
    { label: 'Correct', value: String(result.correctAnswers) },
    { label: 'Incorrect', value: String(result.incorrectAnswers) },
    { label: 'Unanswered', value: String(result.unansweredQuestions) },
  ]

  return (
    <div className="min-w-0" data-quiz-result>
      <div
        role="status"
        className={`rounded-xl border p-5 ${
          result.passed
            ? 'border-success/30 bg-success/10'
            : 'border-warning/30 bg-warning/10'
        }`}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
              {result.passed ? (
                <CheckCircle2 className="size-5 text-success" aria-hidden="true" />
              ) : (
                <XCircle className="size-5 text-warning" aria-hidden="true" />
              )}
              {result.passed ? 'Passed' : 'Not passed'}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              You scored {result.score}% on {quiz.title}. The pass mark for this quiz is{' '}
              {Math.round(result.passThreshold * 100)}%.
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-3xl font-semibold tabular-nums text-ink">{result.score}%</p>
            <p className="text-xs text-ink-subtle">score</p>
          </div>
        </div>
      </div>

      <dl className="mt-4 grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-line-soft bg-surface/60 p-3.5">
            <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
              {stat.label}
            </dt>
            <dd className="mt-1 text-xl font-semibold tabular-nums text-ink">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-3 inline-flex items-center gap-2 text-xs text-ink-subtle">
        <Timer className="size-3.5" aria-hidden="true" />
        Time taken: {formatDuration(result.durationSeconds)}
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onReview}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-deep px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
        >
          <ClipboardList className="size-4" aria-hidden="true" />
          Review answers
        </button>
        <button
          type="button"
          onClick={onRetake}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-5 text-sm font-semibold text-ink transition-colors hover:border-brand/50 hover:bg-surface-hover"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Retake quiz
        </button>
      </div>
    </div>
  )
}
