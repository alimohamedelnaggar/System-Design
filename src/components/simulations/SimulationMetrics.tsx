import { getMetricRows } from '../../features/simulations/utils/simulationMetrics.ts'
import type {
  SimulationDefinition,
  SimulationState,
} from '../../features/simulations/types.ts'

interface SimulationMetricsProps {
  definition: SimulationDefinition
  state: SimulationState
}

export function SimulationMetrics({ definition, state }: SimulationMetricsProps) {
  const rows = getMetricRows(definition, state)

  return (
    <section aria-labelledby="simulation-metrics-heading" data-simulation-metrics>
      <h2 id="simulation-metrics-heading" className="text-sm font-semibold text-ink">
        Metrics
      </h2>
      <p className="mt-1 text-xs text-ink-subtle">Derived from the current simulation state.</p>
      <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-2">
        {rows.map((row) => (
          <div key={row.key} className="min-w-0 rounded-xl border border-line-soft bg-surface-card/70 p-3">
            <dt className="truncate text-[11px] uppercase tracking-[0.08em] text-ink-subtle">
              {row.label}
            </dt>
            <dd className="mt-1 font-mono text-xl font-semibold tabular-nums text-ink">
              {row.display}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
