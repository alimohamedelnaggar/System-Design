import assert from 'node:assert/strict'
import test from 'node:test'
import {
  SimulationScheduler,
  createSimulation,
  intervalForSpeed,
  mergeConfig,
  validateConfig,
  validateDefinition,
  validateRegistry,
} from '../src/features/simulations/index.ts'
import type {
  SimulationAction,
  SimulationConfig,
  SimulationData,
  SimulationDefinition,
  SimulationState,
} from '../src/features/simulations/index.ts'
import { clientServerSimulation } from '../src/features/simulations/simulations/client-server/clientServerSimulation.ts'
import { loadBalancerSimulation } from '../src/features/simulations/simulations/load-balancer/loadBalancerSimulation.ts'
import { cacheStrategiesSimulation } from '../src/features/simulations/simulations/cache-strategies/cacheStrategiesSimulation.ts'
import {
  getSimulationBySlug,
  getSimulationById,
  listSimulationCategories,
  listSimulations,
  listSimulationsByCategory,
} from '../src/features/simulations/registry/simulationLookup.ts'
import { simulationRegistryValidation } from '../src/features/simulations/registry/simulationRegistry.ts'

function run(
  definition: SimulationDefinition,
  actions: readonly SimulationAction[],
  config?: SimulationConfig,
): SimulationState {
  const simulation = createSimulation(definition)
  const start = config ? simulation.transition(simulation.initialState(), { type: 'configure', config }) : simulation.initialState()
  const ready = config ? simulation.transition(start, { type: 'reset' }) : start
  return simulation.run(ready, actions)
}

function steps(count: number): SimulationAction[] {
  return Array.from({ length: count }, () => ({ type: 'step' as const }))
}

function dataOf(state: SimulationState): SimulationData {
  return state.data
}

test('core: initialization creates an idle state with declared metrics and no events', () => {
  const simulation = createSimulation(clientServerSimulation)
  const state = simulation.initialState()

  assert.equal(state.status, 'idle')
  assert.equal(state.step, 0)
  assert.deepEqual(state.events, [])
  assert.deepEqual(state.config, clientServerSimulation.initialConfig)
  assert.equal(state.metrics.total_requests, 0)
  assert.equal(state.visual.layout, 'linear')
  assert.equal(state.completedAtStep, null)
})

test('core: start, pause and resume follow the lifecycle', () => {
  const s = createSimulation(clientServerSimulation)
  let state = s.initialState()
  state = s.transition(state, { type: 'start' })
  assert.equal(state.status, 'running')
  state = s.transition(state, { type: 'pause' })
  assert.equal(state.status, 'paused')
  state = s.transition(state, { type: 'resume' })
  assert.equal(state.status, 'running')
  state = s.transition(state, { type: 'start' })
  assert.equal(state.status, 'running')
})

test('core: automatic ticking only works while running', () => {
  const s = createSimulation(clientServerSimulation)
  const initial = s.initialState()
  assert.deepEqual(s.transition(initial, { type: 'tick' }), initial)

  const running = s.transition(initial, { type: 'start' })
  const ticked = s.transition(running, { type: 'tick' })
  assert.equal(ticked.step, 1)
  assert.equal(ticked.events.length, 1)
})

test('core: manual stepping works independently of automatic execution', () => {
  const s = createSimulation(clientServerSimulation)
  const state = s.initialState()
  const stepped = s.transition(state, { type: 'step' })
  assert.equal(stepped.step, 1)
  assert.equal(stepped.status, 'idle')
  assert.equal(stepped.events.length, 1)
  assert.equal(stepped.events[0]?.type, 'request_sent')
})

test('core: reset restores the initial state for the current configuration', () => {
  const s = createSimulation(clientServerSimulation)
  const initial = s.initialState()
  const advanced = s.run(initial, [
    { type: 'start' },
    { type: 'tick' },
    { type: 'pause' },
    { type: 'configure', config: { latencyMs: 200 } },
  ])
  const reset = s.transition(advanced, { type: 'reset' })

  assert.equal(reset.step, 0)
  assert.equal(reset.status, 'idle')
  assert.deepEqual(reset.events, [])
  assert.equal(reset.config.latencyMs, 200)
  assert.equal(reset.configDirty, false)
  assert.deepEqual(reset.metrics, initial.metrics)
})

test('core: transitions are deterministic for the same actions', () => {
  const actions: SimulationAction[] = [
    { type: 'start' },
    { type: 'tick' },
    { type: 'tick' },
    { type: 'pause' },
    { type: 'step' },
  ]
  const first = run(clientServerSimulation, actions)
  const second = run(clientServerSimulation, actions)
  assert.deepEqual(first, second)
})

test('core: invalid actions and invalid configuration are rejected safely', () => {
  const s = createSimulation(clientServerSimulation)
  const initial = s.initialState()

  assert.deepEqual(s.transition(initial, { type: 'pause' }), initial)
  assert.deepEqual(s.transition(initial, { type: 'resume' }), initial)
  const unknownCommand = s.transition(initial, { type: 'command', command: 'unknown' })
  assert.match(String(unknownCommand.error), /no available actions/i)
  assert.equal(unknownCommand.step, 0)

  const badConfig = s.transition(initial, { type: 'configure', config: { latencyMs: 99999 } })
  assert.match(String(badConfig.error), /latencyMs/)
  assert.equal(badConfig.step, 0)

  const running = s.transition(initial, { type: 'start' })
  const blocked = s.transition(running, { type: 'configure', config: { latencyMs: 200 } })
  assert.match(String(blocked.error), /Pause/)
  assert.equal(blocked.config.latencyMs, 120)

  const dirty = s.transition(initial, { type: 'configure', config: { latencyMs: 200 } })
  assert.equal(dirty.configDirty, true)
  const dirtyStep = s.transition(dirty, { type: 'step' })
  assert.match(String(dirtyStep.error), /Reset/)
  assert.equal(dirtyStep.step, 0)
})

test('core: events carry deterministic ids, steps and descriptions', () => {
  const state = run(clientServerSimulation, steps(2))
  assert.deepEqual(state.events.map((event) => event.id), ['evt-001', 'evt-002'])
  assert.deepEqual(state.events.map((event) => event.step), [1, 2])
  assert.ok(state.events.every((event) => event.description.length > 0))
  assert.ok(state.events.every((event) => event.source.length > 0))
})

test('core: completion is detected and further stepping is rejected', () => {
  const state = run(clientServerSimulation, steps(5), { requestCount: 1 })
  assert.equal(state.status, 'completed')
  assert.equal(state.completedAtStep, 5)
  const s = createSimulation(clientServerSimulation)
  const blocked = s.transition(state, { type: 'step' })
  assert.match(String(blocked.error), /complete/i)
})

test('core: configuration validation enforces types and bounds', () => {
  const valid = validateConfig(clientServerSimulation, { requestCount: 2, latencyMs: 120 })
  assert.equal(valid.valid, true)

  const invalid = validateConfig(clientServerSimulation, {
    requestCount: 99,
    latencyMs: 130,
    mystery: 1,
  } as unknown as SimulationConfig)
  assert.equal(invalid.valid, false)
  assert.ok(invalid.issues.some((issue) => issue.entity === 'requestCount'))
  assert.ok(invalid.issues.some((issue) => issue.entity === 'mystery'))

  const merged = mergeConfig(clientServerSimulation, clientServerSimulation.initialConfig, {
    requestCount: 4,
    mystery: 2,
  } as unknown as SimulationConfig)
  assert.equal(merged.requestCount, 4)
  assert.equal('mystery' in merged, false)
})

test('core: scheduler speed changes scheduling only and cleans up resources', () => {
  const originalSetInterval = globalThis.setInterval
  const originalClearInterval = globalThis.clearInterval
  let starts = 0
  let clears = 0

  globalThis.setInterval = ((_callback: () => void) => {
    starts += 1
    return starts as unknown as ReturnType<typeof setInterval>
  }) as typeof setInterval
  globalThis.clearInterval = (() => {
    clears += 1
  }) as typeof clearInterval

  try {
    const scheduler = new SimulationScheduler()
    scheduler.start(() => undefined)
    assert.equal(scheduler.isRunning(), true)
    scheduler.setSpeed(2)
    assert.equal(scheduler.getSpeed(), 2)
    scheduler.stop()
    assert.equal(scheduler.isRunning(), false)
    scheduler.start(() => undefined)
    scheduler.dispose()
    assert.equal(scheduler.isRunning(), false)
    assert.equal(starts, 3)
    assert.equal(clears, 3)
  } finally {
    globalThis.setInterval = originalSetInterval
    globalThis.clearInterval = originalClearInterval
  }

  assert.equal(intervalForSpeed(0.5), 1800)
  assert.equal(intervalForSpeed(4), 225)
})

test('client-server: a request is created, processed and completed in order', () => {
  const state = run(clientServerSimulation, steps(5), { requestCount: 1 })
  assert.deepEqual(
    state.events.map((event) => event.type),
    ['request_sent', 'request_received', 'request_processing', 'response_sent', 'request_completed'],
  )
  assert.equal(state.metrics.total_requests, 1)
  assert.equal(state.metrics.successful_requests, 1)
  assert.equal(dataOf(state).phase, 'idle')
})

test('client-server: latency is calculated deterministically and averaged', () => {
  const state = run(clientServerSimulation, steps(15))
  assert.equal(state.metrics.total_requests, 3)
  assert.equal(state.metrics.average_latency, 140)
  const completed = state.events.filter((event) => event.type === 'request_completed')
  assert.deepEqual(
    completed.map((event) => event.metadata?.latency_ms),
    [120, 140, 160],
  )
})

test('client-server: reset returns the request lifecycle to idle', () => {
  const simulation = createSimulation(clientServerSimulation)
  const advanced = simulation.run(simulation.initialState(), steps(3))
  const reset = simulation.transition(advanced, { type: 'reset' })
  assert.equal(dataOf(reset).phase, 'idle')
  assert.equal(reset.step, 0)
  assert.equal(reset.metrics.total_requests, 0)
  assert.deepEqual(reset.events, [])
})

test('load balancer: round robin distributes across available servers', () => {
  const state = run(loadBalancerSimulation, steps(3))
  const servers = dataOf(state).servers as Array<{ id: string; assigned: number }>
  assert.deepEqual(
    servers.map((server) => server.assigned),
    [1, 1, 1],
  )
  assert.deepEqual(
    state.events.filter((event) => event.type === 'request_forwarded').map((event) => event.target),
    ['server-1', 'server-2', 'server-3'],
  )
})

test('load balancer: least connections uses real connection counts', () => {
  const state = run(loadBalancerSimulation, steps(4), {
    ...loadBalancerSimulation.initialConfig,
    algorithm: 'least-connections',
  })
  const assigned = (dataOf(state).servers as Array<{ assigned: number }>).map(
    (server) => server.assigned,
  )
  assert.deepEqual(assigned, [2, 1, 1])
})

test('load balancer: unavailable servers never receive new requests', () => {
  const state = run(loadBalancerSimulation, steps(6), {
    ...loadBalancerSimulation.initialConfig,
    unavailableServers: '2',
    requestCount: 6,
  })
  const servers = dataOf(state).servers as Array<{ id: string; assigned: number; available: boolean }>
  assert.equal(servers[1]?.available, false)
  assert.equal(servers[1]?.assigned, 0)
  assert.ok(Object.values(state.visual.nodes).length > 0)
  assert.equal(state.metrics.successful_requests, 6)
})

test('load balancer: failed requests are counted when no backend is available', () => {
  const state = run(loadBalancerSimulation, steps(3), {
    ...loadBalancerSimulation.initialConfig,
    unavailableServers: '1,2,3',
    requestCount: 3,
  })
  assert.equal(state.metrics.failed_requests, 3)
  assert.equal(state.metrics.successful_requests, 0)
  assert.equal(state.metrics.active_connections, 0)
  assert.equal(
    state.events.filter((event) => event.type === 'no_available_server').length,
    3,
  )
})

test('load balancer: actions and reset work without mutating previous state', () => {
  const simulation = createSimulation(loadBalancerSimulation)
  const first = simulation.transition(simulation.initialState(), { type: 'step' })
  const toggled = simulation.transition(first, {
    type: 'command',
    command: 'toggle-server',
    payload: 'server-1',
  })
  assert.notDeepEqual(first.data, toggled.data)

  const reset = simulation.transition(toggled, { type: 'reset' })
  assert.equal(reset.step, 0)
  assert.equal(reset.metrics.total_requests, 0)
  assert.deepEqual(reset.events, [])
})

test('cache: hits avoid database queries and misses fall back to the database', () => {
  const state = run(cacheStrategiesSimulation, steps(2))
  assert.equal(state.metrics.cache_hits, 1)
  assert.equal(state.metrics.cache_misses, 1)
  assert.equal(state.metrics.database_queries, 1)
  assert.deepEqual(
    state.events.slice(0, 3).map((event) => event.type),
    ['cache_hit', 'cache_miss', 'database_query'],
  )
  assert.equal(
    state.events.some((event) => event.type === 'cache_population'),
    true,
  )
})

test('cache: TTL expiration causes a miss and repopulates the cache', () => {
  const state = run(cacheStrategiesSimulation, steps(4), {
    ...cacheStrategiesSimulation.initialConfig,
    initialEntries: 'key-a',
    ttlSteps: 2,
    requestKeys: 'key-a,key-a,key-a,key-a',
  })
  assert.equal(state.metrics.cache_hits, 3)
  assert.equal(state.metrics.cache_misses, 1)
  assert.equal(
    state.events.filter((event) => event.type === 'cache_expiration').length,
    1,
  )
})

test('cache: invalidation removes an entry and forces a later miss', () => {
  const simulation = createSimulation(cacheStrategiesSimulation)
  const config = {
    ...cacheStrategiesSimulation.initialConfig,
    initialEntries: '',
    requestKeys: 'key-a,key-a',
  }
  let state = simulation.transition(simulation.initialState(), { type: 'configure', config })
  state = simulation.transition(state, { type: 'reset' })
  state = simulation.transition(state, { type: 'step' })
  state = simulation.transition(state, {
    type: 'command',
    command: 'invalidate',
    payload: 'key-a',
  })
  state = simulation.transition(state, { type: 'step' })

  assert.equal(state.metrics.database_queries, 2)
  assert.equal(state.metrics.cache_hits, 0)
  assert.equal(state.metrics.cache_misses, 2)
  assert.equal(
    state.events.some((event) => event.type === 'cache_invalidation'),
    true,
  )
})

test('cache: disabled cache sends every request to the database', () => {
  const state = run(cacheStrategiesSimulation, steps(3), {
    ...cacheStrategiesSimulation.initialConfig,
    cacheEnabled: false,
    requestKeys: 'a,b,c',
  })
  assert.equal(state.metrics.cache_hits, 0)
  assert.equal(state.metrics.cache_misses, 3)
  assert.equal(state.metrics.database_queries, 3)
  assert.equal(state.metrics.cache_hit_rate, 0)
})

test('cache: hit rate and reset behave correctly', () => {
  const state = run(cacheStrategiesSimulation, steps(6))
  assert.equal(state.metrics.cache_hit_rate, 50)

  const simulation = createSimulation(cacheStrategiesSimulation)
  const advanced = simulation.run(simulation.initialState(), steps(2))
  const reset = simulation.transition(advanced, { type: 'reset' })
  assert.equal(reset.metrics.cache_hits, 0)
  assert.equal(reset.step, 0)
  assert.deepEqual(reset.events, [])
})

test('registry: definitions register once with unique ids and slugs', () => {
  assert.equal(listSimulations().length, 3)
  assert.equal(simulationRegistryValidation.valid, true)
  const ids = new Set(listSimulations().map((simulation) => simulation.id))
  const slugs = new Set(listSimulations().map((simulation) => simulation.slug))
  assert.equal(ids.size, 3)
  assert.equal(slugs.size, 3)
})

test('registry: lookups, category filtering and invalid slugs work', () => {
  const definition = getSimulationBySlug('load-balancer-algorithms')
  assert.equal(definition?.id, 'sim-load-balancer')
  assert.equal(getSimulationById('sim-cache-strategies')?.slug, 'cache-strategies')
  assert.equal(getSimulationBySlug('missing-simulation'), undefined)
  assert.deepEqual(
    listSimulationsByCategory('Fundamentals').map((item) => item.id),
    ['sim-client-server'],
  )
  assert.equal(listSimulationCategories().length, 3)
})

test('registry: invalid definitions are rejected', () => {
  const invalidSlug = validateDefinition({ ...clientServerSimulation, slug: 'Invalid Slug' })
  assert.equal(invalidSlug.valid, false)

  const duplicate = validateRegistry([clientServerSimulation, clientServerSimulation])
  assert.equal(duplicate.valid, false)
  assert.ok(duplicate.issues.some((issue) => /duplicate/.test(issue.message)))
})
