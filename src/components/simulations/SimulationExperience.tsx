import type { SimulationDefinition } from '../../features/simulations/types.ts'
import { useSimulation } from '../../features/simulations/hooks/useSimulation.ts'
import { SimulationCanvas } from './SimulationCanvas.tsx'
import { SimulationConfigurationPanel } from './SimulationConfigurationPanel.tsx'
import { SimulationControls } from './SimulationControls.tsx'
import { SimulationEventLog } from './SimulationEventLog.tsx'
import { SimulationLegend } from './SimulationLegend.tsx'
import { SimulationMetrics } from './SimulationMetrics.tsx'
import { SimulationPageLayout } from './SimulationPageLayout.tsx'
import { SimulationStatus } from './SimulationStatus.tsx'

export function SimulationExperience({ definition }: { definition: SimulationDefinition }) {
  const controller = useSimulation(definition)
  const { state } = controller

  return (
    <SimulationPageLayout definition={definition} state={state}>
      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-6">
          <SimulationStatus status={state.status} step={state.step} />
          <SimulationCanvas visual={state.visual} />
          <div className="card-shell min-w-0 px-5 py-4">
            <SimulationLegend />
          </div>
          <SimulationEventLog events={state.events} />
        </div>

        <aside className="min-w-0 space-y-6" aria-label="Simulation controls and details">
          <SimulationControls controller={controller} />
          <SimulationConfigurationPanel controller={controller} />
          <div className="card-shell min-w-0 p-5">
            <SimulationMetrics definition={definition} state={state} />
          </div>
        </aside>
      </div>
    </SimulationPageLayout>
  )
}
