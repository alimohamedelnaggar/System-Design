import type {
  SimulationAction,
  SimulationDefinition,
  SimulationState,
} from '../types.ts'
import { firstIssueMessage, mergeConfig, validateConfig } from './simulationValidation.ts'

function finalize(
  next: SimulationState,
  definition: SimulationDefinition,
): SimulationState {
  if (definition.runtime.isComplete(next)) {
    return {
      ...next,
      status: 'completed',
      completedAtStep: next.completedAtStep ?? next.step,
      error: null,
    }
  }
  return { ...next, error: null }
}

function advance(
  state: SimulationState,
  definition: SimulationDefinition,
): SimulationState {
  const stepped = definition.runtime.step(state)
  return finalize({ ...stepped, step: state.step + 1 }, definition)
}

function start(state: SimulationState): SimulationState {
  if (state.status === 'running' || state.status === 'completed') return state
  if (state.configDirty) {
    return { ...state, error: 'Reset the simulation to apply the changed settings.' }
  }
  return { ...state, status: 'running', error: null }
}

function resume(state: SimulationState): SimulationState {
  if (state.status !== 'paused') return state
  if (state.configDirty) {
    return { ...state, error: 'Reset the simulation to apply the changed settings.' }
  }
  return { ...state, status: 'running', error: null }
}

function configure(
  state: SimulationState,
  definition: SimulationDefinition,
  update: Partial<SimulationState['config']>,
): SimulationState {
  const candidate = mergeConfig(definition, state.config, update)
  const validation = validateConfig(definition, candidate)
  if (!validation.valid) {
    return { ...state, error: firstIssueMessage(validation) }
  }

  const changedKeys = definition.controls
    .filter((control) => state.config[control.key] !== candidate[control.key])
    .map((control) => control.key)
  if (changedKeys.length === 0) return { ...state, error: null }

  const controls = new Map(definition.controls.map((control) => [control.key, control]))
  const hasLockedChange = changedKeys.some((key) => controls.get(key)?.live !== true)

  if (state.status === 'running' && hasLockedChange) {
    return { ...state, error: 'Pause the simulation before changing this setting.' }
  }

  if (!hasLockedChange && definition.runtime.applyLiveConfig) {
    const live = definition.runtime.applyLiveConfig({ ...state, config: candidate }, candidate)
    return { ...live, config: candidate, error: null }
  }

  return { ...state, config: candidate, configDirty: true, error: null }
}

/**
 * Creates a pure reducer for one registered simulation. All business rules live
 * in the definition's runtime; this reducer owns lifecycle and validation only.
 */
export function createSimulationReducer(definition: SimulationDefinition) {
  return function simulationReducer(
    state: SimulationState,
    action: SimulationAction,
  ): SimulationState {
    switch (action.type) {
      case 'init':
        return definition.runtime.initial({ ...definition.initialConfig })

      case 'reset': {
        const fresh = definition.runtime.initial({ ...state.config })
        return { ...fresh, config: { ...state.config }, configDirty: false, error: null }
      }

      case 'start':
        return start(state)

      case 'pause':
        return state.status === 'running' ? { ...state, status: 'paused' } : state

      case 'resume':
        return resume(state)

      case 'tick':
        return state.status === 'running' ? advance(state, definition) : state

      case 'step':
        if (state.status === 'completed') {
          return { ...state, error: 'Simulation is complete. Reset it to run again.' }
        }
        if (state.configDirty) {
          return { ...state, error: 'Reset the simulation to apply the changed settings.' }
        }
        return advance(state, definition)

      case 'configure':
        return configure(state, definition, action.config)

      case 'command': {
        if (!definition.runtime.handleCommand) {
          return { ...state, error: 'This simulation has no available actions.' }
        }
        const next = definition.runtime.handleCommand(state, action.command, action.payload)
        return finalize({ ...next, error: null }, definition)
      }

      case 'complete':
        if (state.status === 'completed') return state
        return {
          ...state,
          status: 'completed',
          completedAtStep: state.completedAtStep ?? state.step,
          error: null,
        }

      default:
        return state
    }
  }
}
