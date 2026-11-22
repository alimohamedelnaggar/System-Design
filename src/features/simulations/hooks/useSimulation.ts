import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import type {
  SimulationConfig,
  SimulationConfigValue,
  SimulationDefinition,
  SimulationSpeed,
  SimulationState,
} from '../types.ts'
import { createSimulation } from '../engine/simulationEngine.ts'
import { SimulationScheduler } from '../engine/simulationScheduler.ts'

export interface SimulationController {
  definition: SimulationDefinition
  state: SimulationState
  config: SimulationConfig
  speed: SimulationSpeed
  isRunning: boolean
  isComplete: boolean
  start(): void
  pause(): void
  resume(): void
  step(): void
  reset(): void
  setSpeed(speed: SimulationSpeed): void
  updateConfig(update: Partial<SimulationConfig>): void
  runCommand(command: string, payload?: SimulationConfigValue): void
}

export function useSimulation(definition: SimulationDefinition): SimulationController {
  const instance = useMemo(() => createSimulation(definition), [definition])
  const [state, dispatch] = useReducer(instance.reducer, definition, (_definition) =>
    instance.initialState(),
  )
  const schedulerRef = useRef<SimulationScheduler | null>(null)
  const [speed, setSpeedState] = useState<SimulationSpeed>(1)
  const speedRef = useRef<SimulationSpeed>(1)

  useEffect(() => {
    const scheduler = new SimulationScheduler()
    scheduler.setSpeed(speedRef.current)
    schedulerRef.current = scheduler
    return () => {
      scheduler.dispose()
      schedulerRef.current = null
    }
  }, [])

  useEffect(() => {
    const scheduler = schedulerRef.current
    if (!scheduler) return
    if (state.status !== 'running') {
      scheduler.stop()
      return
    }
    scheduler.start(() => dispatch({ type: 'tick' }))
    return () => scheduler.stop()
  }, [state.status])

  const start = useCallback(() => dispatch({ type: 'start' }), [])
  const pause = useCallback(() => dispatch({ type: 'pause' }), [])
  const resume = useCallback(() => dispatch({ type: 'resume' }), [])
  const step = useCallback(() => dispatch({ type: 'step' }), [])
  const reset = useCallback(() => dispatch({ type: 'reset' }), [])
  const updateConfig = useCallback(
    (update: Partial<SimulationConfig>) => dispatch({ type: 'configure', config: update }),
    [],
  )
  const runCommand = useCallback(
    (command: string, payload?: SimulationConfigValue) =>
      dispatch({ type: 'command', command, payload }),
    [],
  )
  const setSpeed = useCallback((next: SimulationSpeed) => {
    speedRef.current = next
    setSpeedState(next)
    schedulerRef.current?.setSpeed(next)
  }, [])

  return {
    definition,
    state,
    config: state.config,
    speed,
    isRunning: state.status === 'running',
    isComplete: state.status === 'completed',
    start,
    pause,
    resume,
    step,
    reset,
    setSpeed,
    updateConfig,
    runCommand,
  }
}
