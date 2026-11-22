import type {
  SimulationConfig,
  SimulationConfigValue,
  SimulationDefinition,
  SimulationValidationIssue,
  SimulationValidationResult,
} from '../types.ts'

function result(issues: SimulationValidationIssue[]): SimulationValidationResult {
  return { valid: issues.length === 0, issues }
}

function isKebabSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
}

function numberIssue(
  entity: string,
  value: SimulationConfigValue,
  control: SimulationDefinition['controls'][number],
): SimulationValidationIssue | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return { entity, message: 'must be a finite number' }
  }

  if (control.min !== undefined && value < control.min) {
    return { entity, message: `must be at least ${control.min}` }
  }
  if (control.max !== undefined && value > control.max) {
    return { entity, message: `must be at most ${control.max}` }
  }
  if (control.step !== undefined && control.step > 0) {
    const origin = control.min ?? 0
    const remainder = Math.abs(((value - origin) / control.step) % 1)
    if (remainder > 1e-6 && remainder < 1 - 1e-6) {
      return { entity, message: `must follow a step of ${control.step}` }
    }
  }
  return null
}

/** Validates a complete configuration against a simulation definition. */
export function validateConfig(
  definition: SimulationDefinition,
  config: SimulationConfig,
): SimulationValidationResult {
  const issues: SimulationValidationIssue[] = []
  const controls = new Map(definition.controls.map((control) => [control.key, control]))

  for (const control of definition.controls) {
    const value = config[control.key]
    if (value === undefined) {
      issues.push({ entity: control.key, message: 'is required' })
      continue
    }

    if (control.type === 'number' || control.type === 'range') {
      const issue = numberIssue(control.key, value, control)
      if (issue) issues.push(issue)
      continue
    }

    if (control.type === 'toggle') {
      if (typeof value !== 'boolean') {
        issues.push({ entity: control.key, message: 'must be true or false' })
      }
      continue
    }

    if (typeof value !== 'string') {
      issues.push({ entity: control.key, message: 'must be text' })
      continue
    }

    if (control.type === 'select') {
      const allowed = new Set((control.options ?? []).map((option) => option.value))
      if (!allowed.has(value)) {
        issues.push({ entity: control.key, message: 'is not an available option' })
      }
    }
  }

  for (const key of Object.keys(config)) {
    if (!controls.has(key)) issues.push({ entity: key, message: 'is not a supported setting' })
  }

  return result(issues)
}

/** Merges a partial update without inventing unknown configuration keys. */
export function mergeConfig(
  definition: SimulationDefinition,
  config: SimulationConfig,
  update: Partial<SimulationConfig>,
): SimulationConfig {
  const allowed = new Set(definition.controls.map((control) => control.key))
  const next: SimulationConfig = { ...config }
  for (const [key, value] of Object.entries(update)) {
    if (allowed.has(key) && value !== undefined) next[key] = value
  }
  return next
}

/** Validates that a definition is structurally safe to register. */
export function validateDefinition(definition: SimulationDefinition): SimulationValidationResult {
  const issues: SimulationValidationIssue[] = []

  if (!definition.id.trim()) issues.push({ entity: 'id', message: 'is required' })
  if (!definition.slug.trim() || !isKebabSlug(definition.slug)) {
    issues.push({ entity: 'slug', message: 'must be a lowercase kebab-case slug' })
  }
  if (!definition.title.trim()) issues.push({ entity: 'title', message: 'is required' })
  if (!definition.description.trim()) {
    issues.push({ entity: 'description', message: 'is required' })
  }
  if (!definition.category.trim()) issues.push({ entity: 'category', message: 'is required' })
  if (definition.learningObjectives.length === 0) {
    issues.push({ entity: 'learningObjectives', message: 'must contain at least one objective' })
  }

  const controlKeys = new Set<string>()
  for (const control of definition.controls) {
    if (!control.key.trim()) issues.push({ entity: 'controls', message: 'contains an empty key' })
    if (controlKeys.has(control.key)) {
      issues.push({ entity: control.key, message: 'is declared more than once' })
    }
    controlKeys.add(control.key)
    if (control.type === 'select' && (control.options ?? []).length === 0) {
      issues.push({ entity: control.key, message: 'needs at least one option' })
    }
  }

  const metricKeys = new Set<string>()
  for (const metric of definition.metrics) {
    if (!metric.key.trim()) issues.push({ entity: 'metrics', message: 'contains an empty key' })
    if (metricKeys.has(metric.key)) {
      issues.push({ entity: metric.key, message: 'is declared more than once' })
    }
    metricKeys.add(metric.key)
  }

  const commandIds = new Set<string>()
  for (const command of definition.commands ?? []) {
    if (commandIds.has(command.id)) {
      issues.push({ entity: command.id, message: 'is declared more than once' })
    }
    commandIds.add(command.id)
  }

  if (typeof definition.runtime.initial !== 'function') {
    issues.push({ entity: 'runtime.initial', message: 'is required' })
  }
  if (typeof definition.runtime.step !== 'function') {
    issues.push({ entity: 'runtime.step', message: 'is required' })
  }
  if (typeof definition.runtime.isComplete !== 'function') {
    issues.push({ entity: 'runtime.isComplete', message: 'is required' })
  }

  for (const issue of validateConfig(definition, definition.initialConfig).issues) {
    issues.push(issue)
  }

  if (issues.length === 0) issues.push(...validateInitialState(definition))

  return result(issues)
}

function validateInitialState(definition: SimulationDefinition): SimulationValidationIssue[] {
  const issues: SimulationValidationIssue[] = []
  try {
    const state = definition.runtime.initial({ ...definition.initialConfig })
    if (!Number.isFinite(state.step)) {
      issues.push({ entity: 'initial state', message: 'has an invalid step' })
    }
    if (state.visual.layout !== definition.visualLayout) {
      issues.push({ entity: 'initial state', message: 'uses an unexpected visual layout' })
    }
    for (const metric of definition.metrics) {
      if (state.metrics[metric.key] === undefined) {
        issues.push({ entity: metric.key, message: 'is missing from the initial state' })
      }
    }
  } catch {
    issues.push({ entity: 'initial state', message: 'could not be created' })
  }
  return issues
}

/** Validates uniqueness across a set of definitions. */
export function validateRegistry(
  definitions: readonly SimulationDefinition[],
): SimulationValidationResult {
  const issues: SimulationValidationIssue[] = []
  const ids = new Set<string>()
  const slugs = new Set<string>()

  for (const definition of definitions) {
    if (ids.has(definition.id)) {
      issues.push({ entity: definition.id, message: 'duplicate simulation id' })
    }
    if (slugs.has(definition.slug)) {
      issues.push({ entity: definition.slug, message: 'duplicate simulation slug' })
    }
    ids.add(definition.id)
    slugs.add(definition.slug)
    issues.push(...validateDefinition(definition).issues)
  }

  return result(issues)
}

export function firstIssueMessage(validation: SimulationValidationResult): string {
  const first = validation.issues[0]
  return first ? `${first.entity} ${first.message}` : 'Invalid configuration.'
}
