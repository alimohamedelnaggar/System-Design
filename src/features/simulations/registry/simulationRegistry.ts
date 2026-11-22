import type { SimulationDefinition, SimulationRegistry } from '../types.ts'
import { validateRegistry } from '../engine/simulationValidation.ts'
import { clientServerSimulation } from '../simulations/client-server/clientServerSimulation.ts'
import { loadBalancerSimulation } from '../simulations/load-balancer/loadBalancerSimulation.ts'
import { cacheStrategiesSimulation } from '../simulations/cache-strategies/cacheStrategiesSimulation.ts'

/** Each simulation is registered exactly once; add future simulations here only. */
export const simulationDefinitions: readonly SimulationDefinition[] = [
  clientServerSimulation,
  loadBalancerSimulation,
  cacheStrategiesSimulation,
]

export const simulationRegistryValidation = validateRegistry(simulationDefinitions)

if (!simulationRegistryValidation.valid) {
  throw new Error(
    `Invalid simulation registry: ${simulationRegistryValidation.issues
      .map((issue) => `${issue.entity} ${issue.message}`)
      .join('; ')}`,
  )
}

export const simulationRegistry: SimulationRegistry = {
  definitions: simulationDefinitions,
  getById: (id) => simulationDefinitions.find((definition) => definition.id === id),
  getBySlug: (slug) => simulationDefinitions.find((definition) => definition.slug === slug),
  list: () => simulationDefinitions,
  byCategory: (category) =>
    simulationDefinitions.filter((definition) => definition.category === category),
}
