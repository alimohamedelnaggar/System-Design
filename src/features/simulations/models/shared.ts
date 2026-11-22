import type {
  SimulationConfig,
  SimulationConnectionStatus,
  SimulationConnectionView,
  SimulationDefinition,
  SimulationEvent,
  SimulationMetrics,
  SimulationNodeKind,
  SimulationNodeStatus,
  SimulationNodeView,
  SimulationState,
  SimulationVisualLayout,
} from '../types.ts'

export type SimulationEventInput = Omit<SimulationEvent, 'id'>

export function createEvent(
  events: readonly SimulationEvent[],
  input: SimulationEventInput,
): SimulationEvent {
  const sequence = String(events.length + 1).padStart(3, '0')
  return { id: `evt-${sequence}`, ...input }
}

export function withEvent(
  state: SimulationState,
  input: SimulationEventInput,
): Pick<SimulationState, 'events'> {
  return { events: [...state.events, createEvent(state.events, input)] }
}

export function makeNode(
  id: string,
  label: string,
  kind: SimulationNodeKind,
  status: SimulationNodeStatus,
  detail?: string,
  value?: string,
): SimulationNodeView {
  return {
    id,
    label,
    kind,
    status,
    ...(detail ? { detail } : {}),
    ...(value ? { value } : {}),
  }
}

export function makeConnection(
  id: string,
  source: string,
  target: string,
  status: SimulationConnectionStatus,
  label?: string,
): SimulationConnectionView {
  return { id, source, target, status, ...(label ? { label } : {}) }
}

export function zeroMetrics(definition: SimulationDefinition): SimulationMetrics {
  const metrics: SimulationMetrics = {}
  for (const metric of definition.metrics) metrics[metric.key] = 0
  return metrics
}

export function createInitialState(
  definition: SimulationDefinition,
  config: SimulationConfig = definition.initialConfig,
): SimulationState {
  return {
    status: 'idle',
    step: 0,
    config: { ...config },
    data: {},
    events: [],
    metrics: zeroMetrics(definition),
    visual: {
      layout: definition.visualLayout,
      nodes: [],
      connections: [],
      summary: 'Ready to start.',
    },
    configDirty: false,
    completedAtStep: null,
    error: null,
  }
}

export function makeVisual(
  layout: SimulationVisualLayout,
  nodes: SimulationNodeView[],
  connections: SimulationConnectionView[],
  summary: string,
): SimulationState['visual'] {
  return { layout, nodes, connections, summary }
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
