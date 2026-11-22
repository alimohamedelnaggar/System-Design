import { ArrowUpRight, Boxes, CircleCheck, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageIntro } from '../components/layout/PageIntro.tsx'
import { Container } from '../components/ui/Container.tsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.ts'
import {
  listSimulationCategories,
  listSimulations,
} from '../features/simulations/registry/simulationLookup.ts'

export function SimulationsPage() {
  useDocumentTitle('Interactive simulations')
  const simulations = listSimulations()
  const categories = listSimulationCategories()

  return (
    <div>
      <PageIntro
        eyebrow="Interactive simulations"
        title={
          <>
            Watch design decisions <span className="text-brand-bright">play out.</span>
          </>
        }
        description="Change configuration, step through deterministic models, and read the resulting events and metrics. These are engine demonstrations, not curriculum lessons."
      >
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <span
              key={category}
              className="rounded-pill border border-line bg-surface/70 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-subtle"
            >
              {category}
            </span>
          ))}
        </div>
      </PageIntro>

      <Container className="py-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-ink">Available simulations</h2>
            <p className="mt-2 text-sm text-ink-muted">
              {simulations.length} runnable demonstrations using one shared engine.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-pill border border-success/30 bg-success/10 px-3 py-1 font-mono text-[11px] text-success">
            <CircleCheck className="size-3.5" aria-hidden="true" />
            Available now
          </span>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {simulations.map((simulation) => (
            <article
              key={simulation.id}
              className="card-shell flex min-w-0 flex-col p-6 transition-colors hover:border-brand/40"
              data-simulation-card={simulation.slug}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-pill border border-brand/30 bg-brand/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-brand-bright">
                  {simulation.category}
                </span>
                <span className="rounded-pill border border-line bg-surface/70 px-2.5 py-1 font-mono text-[10px] text-ink-subtle">
                  {simulation.difficulty}
                </span>
              </div>

              <h3 className="mt-4 text-xl font-semibold leading-snug text-ink">{simulation.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{simulation.description}</p>

              <div className="mt-5 border-t border-line-soft pt-4">
                <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-subtle">
                  <Target className="size-3.5 text-brand-bright" aria-hidden="true" />
                  Learning objectives
                </p>
                <ul className="mt-2 space-y-1.5 text-sm text-ink-muted">
                  {simulation.learningObjectives.map((objective) => (
                    <li key={objective} className="flex gap-2">
                      <Boxes className="mt-0.5 size-3.5 shrink-0 text-brand-bright" aria-hidden="true" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to={`/simulations/${simulation.slug}`}
                className="mt-6 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-brand bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
              >
                Open simulation
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </Container>
    </div>
  )
}
