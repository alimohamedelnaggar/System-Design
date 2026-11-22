import type { SimulationStatus as Status } from '../../features/simulations/types.ts'

const labels: Record<Status, string> = {
  idle: 'Ready',
  running: 'Running',
  paused: 'Paused',
  completed: 'Completed',
}

const styles: Record<Status, string> = {
  idle: 'border-line bg-surface/70 text-ink-subtle',
  running: 'border-brand/40 bg-brand/10 text-brand-bright',
  paused: 'border-warning/40 bg-warning/10 text-warning',
  completed: 'border-success/40 bg-success/10 text-success',
}

export function SimulationStatus({
  status,
  step,
}: {
  status: Status
  step: number
}) {
  return (
    <div className="flex flex-wrap items-center gap-3" data-simulation-status>
      <span
        className={`inline-flex items-center gap-2 rounded-pill border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] ${styles[status]}`}
      >
        <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
        {labels[status]}
      </span>
      <span className="font-mono text-xs text-ink-subtle">Step {step}</span>
    </div>
  )
}
