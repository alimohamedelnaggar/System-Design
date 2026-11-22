import { ArrowDown } from 'lucide-react'
import { getDomainsForPhase, journeyPhases } from '../../data/curriculum'
import { Badge } from '../ui/Badge'
import { DomainCard } from './DomainCard'

export function RoadmapPath() {
  return (
    <div className="space-y-14 sm:space-y-16">
      {journeyPhases.map((phase, phaseIndex) => {
        const phaseDomains = getDomainsForPhase(phase)
        const phaseHours = phaseDomains.reduce((total, domain) => total + domain.estimatedHours, 0)

        return (
          <section key={phase.id} aria-labelledby={`phase-${phase.id}`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-brand-bright">
                    {phase.label}
                  </span>
                  <span className="h-px w-8 bg-brand/40" aria-hidden="true" />
                </div>
                <h2
                  id={`phase-${phase.id}`}
                  className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-ink sm:text-3xl"
                >
                  {phase.title}
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-muted sm:text-base">
                  {phase.description}
                </p>
              </div>
              <Badge variant="neutral" className="self-start sm:self-auto">
                {phaseDomains.length} domains · ~{phaseHours} hours
              </Badge>
            </div>

            <div className="relative mt-8 sm:mt-10">
              <span
                className="absolute bottom-6 left-[13px] top-6 w-px bg-gradient-to-b from-brand/60 via-line to-transparent sm:left-[19px]"
                aria-hidden="true"
              />
              <ol className="relative space-y-5 pl-10 sm:space-y-6 sm:pl-14">
                {phaseDomains.map((domain) => (
                  <li key={domain.id} className="relative min-w-0">
                    <span
                      className="absolute -left-10 top-6 grid size-7 place-items-center rounded-full border border-brand/40 bg-surface font-mono text-[10px] font-semibold text-brand-bright shadow-[0_0_0_5px_var(--color-canvas)] sm:-left-14 sm:top-7 sm:size-9 sm:text-xs"
                      aria-hidden="true"
                    >
                      {String(domain.id).padStart(2, '0')}
                    </span>
                    <DomainCard domain={domain} />
                  </li>
                ))}

                {phaseIndex < journeyPhases.length - 1 ? (
                  <li className="relative flex justify-center pt-2" aria-hidden="true">
                    <span className="grid size-8 place-items-center rounded-full border border-line bg-surface text-ink-subtle">
                      <ArrowDown className="size-4" />
                    </span>
                  </li>
                ) : null}
              </ol>
            </div>
          </section>
        )
      })}
    </div>
  )
}
