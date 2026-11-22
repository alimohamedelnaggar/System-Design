import { ArrowLeft, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { SimulationDefinition } from '../../features/simulations/types.ts'

export function SimulationHeader({ definition }: { definition: SimulationDefinition }) {
  return (
    <header className="min-w-0" data-simulation-header>
      <Link
        to="/simulations"
        className="inline-flex items-center gap-2 text-sm font-medium text-brand-bright transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        All simulations
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-pill border border-brand/30 bg-brand/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-brand-bright">
          {definition.category}
        </span>
        <span className="rounded-pill border border-line bg-surface/70 px-3 py-1 font-mono text-[11px] text-ink-subtle">
          {definition.difficulty}
        </span>
        <span className="rounded-pill border border-line bg-surface/70 px-3 py-1 font-mono text-[11px] text-ink-subtle">
          Interactive demo
        </span>
      </div>

      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {definition.title}
      </h1>
      <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink-muted">
        {definition.description}
      </p>

      <div className="mt-5 rounded-xl border border-line-soft bg-surface-card/70 p-4">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-subtle">
          <Target className="size-4 text-brand-bright" aria-hidden="true" />
          Learning objectives
        </p>
        <ul className="mt-2 grid gap-1.5 text-sm text-ink-muted sm:grid-cols-2">
          {definition.learningObjectives.map((objective) => (
            <li key={objective} className="flex gap-2">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-bright" aria-hidden="true" />
              {objective}
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
