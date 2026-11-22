import { RotateCcw } from 'lucide-react'
import type { QuizQuestion } from '../../types/curriculum.ts'

interface QuizQuestionCardProps {
  quizId: string
  question: QuizQuestion
  index: number
  total: number
  selectedOptionId: string | null
  onSelect(optionId: string): void
  onClear(): void
}

export function QuizQuestionCard({
  quizId,
  question,
  index,
  total,
  selectedOptionId,
  onSelect,
  onClear,
}: QuizQuestionCardProps) {
  return (
    <fieldset className="min-w-0 rounded-xl border border-line-soft bg-surface/60 p-4 sm:p-5">
      <legend className="sr-only">
        Question {index + 1} of {total}
      </legend>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-bright">
            Question {index + 1} of {total}
          </p>
          <p className="mt-2 text-base font-semibold leading-snug text-ink">{question.prompt}</p>
        </div>
        {selectedOptionId ? (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex min-h-8 shrink-0 items-center gap-1.5 rounded-lg border border-line-soft px-2.5 text-xs font-medium text-ink-muted transition-colors hover:border-brand/40 hover:text-ink"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Clear answer
          </button>
        ) : null}
      </div>

      <div className="mt-5 min-w-0 space-y-2.5">
        {question.options.map((option) => {
          const inputId = `${quizId}-${question.id}-${option.id}`
          const selected = selectedOptionId === option.id
          return (
            <label
              key={option.id}
              htmlFor={inputId}
              className={`flex min-w-0 cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors sm:p-4 ${
                selected
                  ? 'border-brand/60 bg-brand/10'
                  : 'border-line-soft bg-canvas/30 hover:border-brand/30 hover:bg-surface-hover/40'
              }`}
            >
              <input
                id={inputId}
                type="radio"
                name={`${quizId}-${question.id}`}
                value={option.id}
                checked={selected}
                onChange={() => onSelect(option.id)}
                className="mt-0.5 size-4 shrink-0 accent-brand"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-sm leading-relaxed text-ink">{option.label}</span>
                {selected ? (
                  <span className="mt-1.5 block font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-bright">
                    Selected
                  </span>
                ) : null}
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
