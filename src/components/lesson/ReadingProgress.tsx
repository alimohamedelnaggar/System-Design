import { BookOpenText } from 'lucide-react'
import { formatMinutes } from '../course/format'

interface ReadingProgressProps {
  value: number
  estimatedMinutes: number
}

export function ReadingProgress({ value, estimatedMinutes }: ReadingProgressProps) {
  return (
    <div className="sticky top-16 z-30 -mx-5 mb-6 border-b border-line-soft/70 bg-canvas/85 py-3 backdrop-blur sm:-mx-8 lg:-mx-12 lg:top-[72px]">
      <div className="flex items-center justify-between gap-4 text-xs text-ink-subtle">
        <span className="inline-flex items-center gap-1.5 font-medium text-ink-muted">
          <BookOpenText className="size-3.5 text-brand-bright" aria-hidden="true" />
          Reading progress
        </span>
        <span className="tabular-nums">
          {value}% · {formatMinutes(estimatedMinutes)} read
        </span>
      </div>
      <div
        className="mt-2 h-1 w-full overflow-hidden rounded-pill bg-line-soft"
        role="progressbar"
        aria-label="Reading progress"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-pill bg-brand transition-[width] duration-200"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}
