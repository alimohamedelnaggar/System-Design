import { useState } from 'react'
import { Pause, Play, RotateCcw, StepForward, TriangleAlert, Zap } from 'lucide-react'
import type { SimulationController } from '../../features/simulations/hooks/useSimulation.ts'
import { SIMULATION_SPEED_OPTIONS } from '../../features/simulations/engine/simulationScheduler.ts'
import type { SimulationSpeed } from '../../features/simulations/types.ts'

const buttonClass =
  'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40'
const primaryButton = `${buttonClass} border-brand bg-brand text-white hover:bg-brand-hover`
const secondaryButton = `${buttonClass} border-line bg-surface/70 text-ink-muted hover:border-brand/50 hover:text-ink`

export function SimulationControls({ controller }: { controller: SimulationController }) {
  const { definition, state } = controller
  const [payloads, setPayloads] = useState<Record<string, string>>({})
  const isRunning = state.status === 'running'
  const isPaused = state.status === 'paused'
  const isComplete = state.status === 'completed'

  return (
    <section className="card-shell min-w-0 p-5" aria-label="Simulation controls" data-simulation-controls>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className={primaryButton}
          onClick={controller.start}
          disabled={isRunning || isComplete || state.configDirty}
        >
          <Play className="size-4" aria-hidden="true" />
          Start
        </button>
        <button type="button" className={secondaryButton} onClick={controller.pause} disabled={!isRunning}>
          <Pause className="size-4" aria-hidden="true" />
          Pause
        </button>
        <button
          type="button"
          className={secondaryButton}
          onClick={controller.resume}
          disabled={!isPaused || state.configDirty}
        >
          <Play className="size-4" aria-hidden="true" />
          Resume
        </button>
        <button type="button" className={secondaryButton} onClick={controller.step} disabled={isComplete || state.configDirty}>
          <StepForward className="size-4" aria-hidden="true" />
          Step
        </button>
        <button type="button" className={secondaryButton} onClick={controller.reset}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Reset
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-line-soft pt-4">
        <label htmlFor="simulation-speed" className="text-xs font-medium text-ink-muted">
          Simulation speed
        </label>
        <select
          id="simulation-speed"
          value={controller.speed}
          onChange={(event) => controller.setSpeed(Number(event.target.value) as SimulationSpeed)}
          className="min-h-10 rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink"
        >
          {SIMULATION_SPEED_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}x
            </option>
          ))}
        </select>
        <span className="text-xs text-ink-subtle">Speed changes scheduling only, never the calculations.</span>
      </div>

      {definition.commands && definition.commands.length > 0 ? (
        <div className="mt-4 border-t border-line-soft pt-4">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink-subtle">
            <Zap className="size-4 text-brand-bright" aria-hidden="true" />
            Actions
          </p>
          <div className="mt-3 space-y-3">
            {definition.commands.map((command) => (
              <div key={command.id} className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className={secondaryButton}
                  onClick={() => controller.runCommand(command.id, payloads[command.id] || undefined)}
                >
                  {command.label}
                </button>
                {command.payloadLabel ? (
                  <input
                    type="text"
                    value={payloads[command.id] ?? ''}
                    onChange={(event) =>
                      setPayloads((current) => ({ ...current, [command.id]: event.target.value }))
                    }
                    placeholder={command.payloadLabel}
                    aria-label={command.payloadLabel}
                    className="min-h-10 min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-subtle"
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {state.error ? (
        <p
          role="alert"
          className="mt-4 inline-flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-sm text-ink"
          data-simulation-error
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden="true" />
          {state.error}
        </p>
      ) : null}
    </section>
  )
}
