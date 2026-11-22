import { Check, CircleHelp, X } from 'lucide-react'
import type { Quiz } from '../../types/curriculum.ts'
import type { QuizResult } from '../../features/quiz'

interface QuizReviewListProps {
  quiz: Quiz
  result: QuizResult
}

export function QuizReviewList({ quiz, result }: QuizReviewListProps) {
  return (
    <div className="min-w-0 space-y-3" aria-label="Review answers">
      {result.questionResults.map((item, index) => {
        const question = quiz.questions[index]
        const statusLabel = item.isCorrect
          ? 'Correct'
          : item.selectedOptionId === null
            ? 'Unanswered'
            : 'Incorrect'
        const StatusIcon = item.isCorrect ? Check : item.selectedOptionId === null ? CircleHelp : X

        return (
          <section
            key={item.questionId}
            className="min-w-0 rounded-xl border border-line-soft bg-surface/60 p-4 sm:p-5"
            aria-labelledby={`review-${item.questionId}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <p id={`review-${item.questionId}`} className="min-w-0 text-sm font-semibold leading-snug text-ink">
                {index + 1}. {item.prompt}
              </p>
              <span
                className={`inline-flex min-h-7 shrink-0 items-center gap-1.5 rounded-pill border px-2.5 text-xs font-semibold ${
                  item.isCorrect
                    ? 'border-success/30 bg-success/10 text-success'
                    : item.selectedOptionId === null
                      ? 'border-line bg-surface-raised/70 text-ink-subtle'
                      : 'border-warning/30 bg-warning/10 text-warning'
                }`}
              >
                <StatusIcon className="size-3.5" aria-hidden="true" />
                {statusLabel}
              </span>
            </div>

            <dl className="mt-4 grid min-w-0 gap-3 text-sm sm:grid-cols-2">
              <div className="min-w-0">
                <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                  Your answer
                </dt>
                <dd className="mt-1 leading-snug text-ink-muted">
                  {item.selectedLabel ?? 'Not answered'}
                </dd>
              </div>
              <div className="min-w-0">
                <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                  Correct answer
                </dt>
                <dd className="mt-1 leading-snug text-ink">{item.correctLabel ?? 'Unavailable'}</dd>
              </div>
            </dl>

            {item.explanation ? (
              <p className="mt-4 border-t border-line-soft pt-3 text-xs leading-relaxed text-ink-muted">
                {item.explanation}
              </p>
            ) : null}
            {item.selectedExplanation ? (
              <p className="mt-2 text-xs leading-relaxed text-ink-subtle">
                Selected option: {item.selectedExplanation}
              </p>
            ) : null}
            {!item.explanation && !item.selectedExplanation && question?.explanation ? (
              <p className="mt-4 border-t border-line-soft pt-3 text-xs leading-relaxed text-ink-muted">
                {question.explanation}
              </p>
            ) : null}
          </section>
        )
      })}
    </div>
  )
}
