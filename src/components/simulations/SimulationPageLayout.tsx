import type { ReactNode } from 'react'
import { ProgressBar } from '../ui/ProgressBar.tsx'
import type {
  SimulationDefinition,
  SimulationState,
} from '../../features/simulations/types.ts'
import { getRunProgress } from '../../features/simulations/utils/simulationMetrics.ts'
import { SimulationHeader } from './SimulationHeader.tsx'

interface SimulationPageLayoutProps {
  definition: SimulationDefinition
  state: SimulationState
  children: ReactNode
}

export function SimulationPageLayout({
  definition,
  state,
  children,
}: SimulationPageLayoutProps) {
  const progress = getRunProgress(definition, state)

  return (
    <div className="mx-auto w-full max-w-7xl min-w-0 px-4 py-10 sm:px-6 lg:px-8" data-simulation-page>
      <SimulationHeader definition={definition} />

      <div className="mt-8 rounded-xl border border-line-soft bg-surface-card/60 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-ink-subtle">
          <span>Run progress</span>
          <span className="font-mono">
            {progress.current} / {progress.total} steps
          </span>
        </div>
        <ProgressBar className="mt-3" value={progress.percent} label="Simulation run progress" />
      </div>

      <div className="mt-6">{children}</div>
    </div>
  )
}
