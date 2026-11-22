import { Settings2 } from 'lucide-react'
import type { SimulationConfigValue } from '../../features/simulations/types.ts'
import type { SimulationController } from '../../features/simulations/hooks/useSimulation.ts'

function textValue(value: SimulationConfigValue | undefined): string {
  return typeof value === 'string' ? value : String(value ?? '')
}

function numericValue(value: SimulationConfigValue | undefined): number {
  return typeof value === 'number' ? value : Number(value ?? 0)
}

export function SimulationConfigurationPanel({ controller }: { controller: SimulationController }) {
  const { definition, state, config } = controller
  const runningLocked = state.status === 'running'

  return (
    <section className="card-shell min-w-0 p-5" aria-labelledby="simulation-config-heading" data-simulation-config>
      <h2 id="simulation-config-heading" className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
        <Settings2 className="size-4 text-brand-bright" aria-hidden="true" />
        Configuration
      </h2>

      {state.configDirty ? (
        <p className="mt-3 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-xs leading-relaxed text-ink" data-simulation-config-dirty>
          Settings changed. Reset the simulation to apply them.
        </p>
      ) : null}

      <div className="mt-4 space-y-4">
        {definition.controls.map((control) => {
          const value = config[control.key]
          const locked = runningLocked && control.live !== true
          const inputId = `simulation-control-${control.key}`

          return (
            <div key={control.key} className="min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label htmlFor={inputId} className="text-xs font-medium text-ink-muted">
                  {control.label}
                </label>
                {control.type === 'range' ? (
                  <output htmlFor={inputId} className="font-mono text-xs text-brand-bright">
                    {textValue(value)}
                  </output>
                ) : null}
              </div>

              {control.type === 'select' ? (
                <select
                  id={inputId}
                  value={textValue(value)}
                  disabled={locked}
                  onChange={(event) => controller.updateConfig({ [control.key]: event.target.value })}
                  className="mt-2 min-h-10 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink disabled:opacity-50"
                >
                  {(control.options ?? []).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : null}

              {control.type === 'toggle' ? (
                <label className="mt-2 inline-flex cursor-pointer items-center gap-3 text-sm text-ink">
                  <input
                    id={inputId}
                    type="checkbox"
                    checked={value === true}
                    disabled={locked}
                    onChange={(event) => controller.updateConfig({ [control.key]: event.target.checked })}
                    className="size-4 rounded border-line bg-surface accent-brand"
                  />
                  {value === true ? 'Enabled' : 'Disabled'}
                </label>
              ) : null}

              {control.type === 'range' ? (
                <input
                  id={inputId}
                  type="range"
                  min={control.min}
                  max={control.max}
                  step={control.step}
                  value={numericValue(value)}
                  disabled={locked}
                  onChange={(event) =>
                    controller.updateConfig({ [control.key]: Number(event.target.value) })
                  }
                  className="mt-3 w-full accent-brand disabled:opacity-50"
                />
              ) : null}

              {control.type === 'number' ? (
                <input
                  id={inputId}
                  type="number"
                  min={control.min}
                  max={control.max}
                  step={control.step}
                  value={numericValue(value)}
                  disabled={locked}
                  onChange={(event) =>
                    controller.updateConfig({ [control.key]: Number(event.target.value) })
                  }
                  className="mt-2 min-h-10 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink disabled:opacity-50"
                />
              ) : null}

              {control.type === 'text' ? (
                <input
                  id={inputId}
                  type="text"
                  value={textValue(value)}
                  disabled={locked}
                  onChange={(event) => controller.updateConfig({ [control.key]: event.target.value })}
                  className="mt-2 min-h-10 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-subtle disabled:opacity-50"
                />
              ) : null}

              {control.description ? (
                <p className="mt-1.5 text-xs leading-relaxed text-ink-subtle">{control.description}</p>
              ) : null}
              {control.live ? (
                <p className="mt-1 text-[11px] font-medium text-success">Can be changed while running.</p>
              ) : null}
            </div>
          )
        })}
      </div>
    </section>
  )
}
