interface ProgressBarProps {
  value: number
  label: string
  className?: string
}

export function ProgressBar({ value, label, className = '' }: ProgressBarProps) {
  const boundedValue = Math.min(100, Math.max(0, value))

  return (
    <div
      className={`h-1.5 w-full overflow-hidden rounded-pill bg-line-soft ${className}`}
      role="progressbar"
      aria-label={label}
      aria-valuenow={boundedValue}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-pill bg-brand transition-[width] duration-500"
        style={{ width: `${boundedValue}%` }}
      />
    </div>
  )
}
