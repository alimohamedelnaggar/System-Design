import { ListTree } from 'lucide-react'
import type { SimulationEvent } from '../../features/simulations/types.ts'

function labelForType(type: string): string {
  return type
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function SimulationEventLog({ events }: { events: readonly SimulationEvent[] }) {
  return (
    <section
      aria-labelledby="simulation-log-heading"
      className="card-shell min-w-0 p-5"
      data-simulation-event-log
    >
      <p className="sr-only" aria-live="polite">
        {events.length > 0
          ? `Latest event: ${events[events.length - 1]?.description ?? ''}`
          : 'No simulation events yet.'}
      </p>

      <div className="flex items-center justify-between gap-3">
        <h2 id="simulation-log-heading" className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
          <ListTree className="size-4 text-brand-bright" aria-hidden="true" />
          Event log
        </h2>
        <span className="font-mono text-xs text-ink-subtle">{events.length} event{events.length === 1 ? '' : 's'}</span>
      </div>

      {events.length === 0 ? (
        <p className="mt-4 rounded-lg border border-dashed border-line bg-surface/40 px-4 py-6 text-center text-sm text-ink-subtle" data-simulation-log-empty>
          No events yet. Start or step the simulation to see what happens.
        </p>
      ) : (
        <ol
          className="mt-4 max-h-[22rem] space-y-2 overflow-y-auto pr-1"
          tabIndex={0}
          aria-label="Simulation events"
          data-simulation-log-list
        >
          {events.map((event) => (
            <li
              key={event.id}
              className="rounded-lg border border-line-soft bg-surface/60 px-3 py-2.5 text-sm"
            >
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-mono uppercase tracking-[0.08em] text-ink-subtle">
                <span className="text-brand-bright">Step {event.step}</span>
                <span aria-hidden="true">·</span>
                <span>{labelForType(event.type)}</span>
                {event.target ? (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="normal-case tracking-normal">
                      {event.source} → {event.target}
                    </span>
                  </>
                ) : (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="normal-case tracking-normal">{event.source}</span>
                  </>
                )}
              </div>
              <p className="mt-1 text-ink-muted">{event.description}</p>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
