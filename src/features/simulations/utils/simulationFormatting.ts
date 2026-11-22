import type { SimulationMetricDefinition } from '../types.ts'

function displayNumber(value: number, digits: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

/** Consistent, non-fabricated formatting for every simulation metric. */
export function formatMetricValue(
  value: number | null | undefined,
  metric: SimulationMetricDefinition,
): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return '—'

  switch (metric.format) {
    case 'percent':
      return `${displayNumber(value, 1)}%`
    case 'duration':
      return `${displayNumber(value, 0)} ms`
    case 'decimal':
      return displayNumber(value, 2)
    case 'number':
    default:
      return displayNumber(value, 0)
  }
}

export function formatSimulatedStep(step: number): string {
  return `Step ${step}`
}
