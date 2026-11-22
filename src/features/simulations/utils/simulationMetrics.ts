import type {
  SimulationDefinition,
  SimulationMetricDefinition,
  SimulationState,
} from '../types.ts'
import { formatMetricValue } from './simulationFormatting.ts'

export interface MetricRow {
  key: string
  label: string
  display: string
  description?: string
}

export function roundTo(value: number, digits = 1): number {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

export function average(values: readonly number[]): number {
  if (values.length === 0) return 0
  return roundTo(values.reduce((sum, value) => sum + value, 0) / values.length, 1)
}

export function hitRate(hits: number, total: number): number {
  return total === 0 ? 0 : roundTo((hits / total) * 100, 1)
}

export function getMetricRows(
  definition: SimulationDefinition,
  state: SimulationState,
): MetricRow[] {
  return definition.metrics.map((metric: SimulationMetricDefinition) => ({
    key: metric.key,
    label: metric.label,
    display: formatMetricValue(state.metrics[metric.key], metric),
    description: metric.description,
  }))
}

export function getRunProgress(
  definition: SimulationDefinition,
  state: SimulationState,
): { current: number; total: number; percent: number } {
  const total = definition.completionTarget?.(state.config) ?? 0
  const current = Math.min(state.step, total)
  return {
    current,
    total,
    percent: total === 0 ? 0 : roundTo(Math.min(100, (current / total) * 100), 0),
  }
}
