import type { SimulationDefinition } from '../types.ts'
import { simulationDefinitions, simulationRegistry } from './simulationRegistry.ts'

export function listSimulations(): readonly SimulationDefinition[] {
  return simulationRegistry.list()
}

export function getSimulationById(id: string | undefined): SimulationDefinition | undefined {
  return simulationRegistry.getById(id)
}

export function getSimulationBySlug(slug: string | undefined): SimulationDefinition | undefined {
  return simulationRegistry.getBySlug(slug)
}

export function listSimulationsByCategory(category: string): readonly SimulationDefinition[] {
  return simulationRegistry.byCategory(category)
}

export function listSimulationCategories(): string[] {
  return [...new Set(simulationDefinitions.map((definition) => definition.category))]
}

export function getRelatedSimulations(
  definition: SimulationDefinition,
): readonly SimulationDefinition[] {
  return simulationDefinitions.filter(
    (candidate) => candidate.id !== definition.id && candidate.category === definition.category,
  )
}
