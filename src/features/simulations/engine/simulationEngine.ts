import type {
  SimulationAction,
  SimulationDefinition,
  SimulationSpeed,
  SimulationState,
} from '../types.ts'
import { createSimulationReducer } from './simulationReducer.ts'
import { SimulationScheduler } from './simulationScheduler.ts'
import { validateDefinition } from './simulationValidation.ts'

export interface SimulationInstance {
  definition: SimulationDefinition
  reducer: (state: SimulationState, action: SimulationAction) => SimulationState
  initialState(): SimulationState
  transition(state: SimulationState, action: SimulationAction): SimulationState
  run(state: SimulationState, actions: readonly SimulationAction[]): SimulationState
  createScheduler(speed?: SimulationSpeed): SimulationScheduler
}

/** Framework-agnostic facade over a definition's pure runtime. */
export function createSimulation(definition: SimulationDefinition): SimulationInstance {
  const validation = validateDefinition(definition)
  if (!validation.valid) {
    throw new Error(`Invalid simulation "${definition.id}": ${validation.issues[0]?.message}`)
  }

  const reducer = createSimulationReducer(definition)
  const initialState = (): SimulationState =>
    definition.runtime.initial({ ...definition.initialConfig })

  return {
    definition,
    reducer,
    initialState,
    transition: reducer,
    run: (state, actions) => actions.reduce(reducer, state),
    createScheduler: (speed = 1) => {
      const scheduler = new SimulationScheduler()
      scheduler.setSpeed(speed)
      return scheduler
    },
  }
}

export { createSimulationReducer } from './simulationReducer.ts'
