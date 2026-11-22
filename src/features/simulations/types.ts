export type SimulationStatus = 'idle' | 'running' | 'paused' | 'completed'

export type SimulationConfigValue = string | number | boolean
export type SimulationConfig = Record<string, SimulationConfigValue>

export type SimulationMetricFormat = 'number' | 'percent' | 'duration' | 'decimal'

export interface SimulationMetricDefinition {
  key: string
  label: string
  format?: SimulationMetricFormat
  unit?: string
  description?: string
}

export type SimulationControlType = 'number' | 'range' | 'select' | 'toggle' | 'text'

export interface SimulationControlOption {
  label: string
  value: string
}

export interface SimulationControlDefinition {
  key: string
  label: string
  type: SimulationControlType
  description?: string
  min?: number
  max?: number
  step?: number
  options?: readonly SimulationControlOption[]
  /** Live controls may be changed while the simulation is running. */
  live?: boolean
  /** Non-live changes require an explicit reset before starting again. */
  requiresReset?: boolean
}

export interface SimulationCommandDefinition {
  id: string
  label: string
  description?: string
  payloadLabel?: string
}

export type SimulationNodeKind =
  | 'client'
  | 'load-balancer'
  | 'server'
  | 'cache'
  | 'database'
  | 'service'
  | 'queue'

export type SimulationNodeStatus = 'idle' | 'active' | 'success' | 'error' | 'disabled'

export interface SimulationNodeView {
  id: string
  label: string
  kind: SimulationNodeKind
  status: SimulationNodeStatus
  detail?: string
  value?: string
}

export type SimulationConnectionStatus = 'idle' | 'active' | 'error'

export interface SimulationConnectionView {
  id: string
  source: string
  target: string
  label?: string
  status: SimulationConnectionStatus
}

export type SimulationVisualLayout = 'linear' | 'hub' | 'triangle'

export interface SimulationVisualState {
  layout: SimulationVisualLayout
  nodes: SimulationNodeView[]
  connections: SimulationConnectionView[]
  summary: string
}

export interface SimulationEventMetadata {
  [key: string]: string | number | boolean | null
}

export interface SimulationEvent {
  id: string
  type: string
  step: number
  source: string
  target?: string
  description: string
  metadata?: SimulationEventMetadata
}

export type SimulationMetrics = Record<string, number | null>

export type SimulationData = Record<string, unknown>

export interface SimulationState {
  status: SimulationStatus
  step: number
  config: SimulationConfig
  data: SimulationData
  events: SimulationEvent[]
  metrics: SimulationMetrics
  visual: SimulationVisualState
  configDirty: boolean
  completedAtStep: number | null
  error: string | null
}

export type SimulationAction =
  | { type: 'init' }
  | { type: 'start' }
  | { type: 'pause' }
  | { type: 'resume' }
  | { type: 'tick' }
  | { type: 'step' }
  | { type: 'reset' }
  | { type: 'configure'; config: Partial<SimulationConfig> }
  | { type: 'command'; command: string; payload?: SimulationConfigValue }
  | { type: 'complete' }

export interface SimulationValidationIssue {
  entity: string
  message: string
}

export interface SimulationValidationResult {
  valid: boolean
  issues: SimulationValidationIssue[]
}

export interface SimulationRuntime {
  initial(config: SimulationConfig): SimulationState
  step(state: SimulationState): SimulationState
  isComplete(state: SimulationState): boolean
  applyLiveConfig?(state: SimulationState, config: SimulationConfig): SimulationState
  handleCommand?(
    state: SimulationState,
    command: string,
    payload?: SimulationConfigValue,
  ): SimulationState
}

export interface SimulationDefinition {
  id: string
  slug: string
  title: string
  description: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  learningObjectives: string[]
  initialConfig: SimulationConfig
  controls: SimulationControlDefinition[]
  metrics: SimulationMetricDefinition[]
  commands?: SimulationCommandDefinition[]
  visualLayout: SimulationVisualLayout
  /** Optional target used by the UI to show generic run progress. */
  completionTarget?: (config: SimulationConfig) => number
  runtime: SimulationRuntime
}

export interface SimulationRegistry {
  definitions: readonly SimulationDefinition[]
  getById(id: string | undefined): SimulationDefinition | undefined
  getBySlug(slug: string | undefined): SimulationDefinition | undefined
  list(): readonly SimulationDefinition[]
  byCategory(category: string): readonly SimulationDefinition[]
}

export type SimulationSpeed = 0.5 | 1 | 2 | 4
