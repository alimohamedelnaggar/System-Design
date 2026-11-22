import type {
  SimulationConfig,
  SimulationConfigValue,
  SimulationData,
  SimulationDefinition,
  SimulationState,
  SimulationVisualState,
} from '../../types.ts'
import { average, hitRate, roundTo } from '../../utils/simulationMetrics.ts'
import {
  createInitialState,
  makeConnection,
  makeNode,
  makeVisual,
  withEvent,
} from '../../models/shared.ts'

interface CacheEntry {
  key: string
  insertedAt: number
}

interface CacheData extends SimulationData {
  entries: CacheEntry[]
  cursor: number
  hits: number
  misses: number
  databaseQueries: number
  latencies: number[]
  lastKey: string | null
  lastResult: 'hit' | 'miss' | null
  invalidations: number
}

function asData(data: SimulationData): CacheData {
  return data as unknown as CacheData
}

function configNumber(state: SimulationState, key: string): number {
  return Number(state.config[key] ?? 0)
}

function configText(config: SimulationConfig, key: string): string {
  const value = config[key]
  return typeof value === 'string' ? value : ''
}

export function parseList(value: string): string[] {
  return value
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
}

function visual(
  data: CacheData,
  keys: readonly string[],
  cacheEnabled: boolean,
): SimulationVisualState {
  const currentKey = keys[data.cursor % Math.max(1, keys.length)] ?? '—'
  const connections = [
    makeConnection(
      'client-cache',
      'client',
      'cache',
      data.lastResult ? 'active' : 'idle',
      'get(key)',
    ),
    makeConnection(
      'cache-database',
      'cache',
      'database',
      data.lastResult === 'miss' ? 'active' : 'idle',
      'fallback',
    ),
  ]

  return makeVisual(
    'triangle',
    [
      makeNode('client', 'Client', 'client', 'idle', `Requesting ${currentKey}`),
      makeNode(
        'cache',
        'Cache',
        'cache',
        !cacheEnabled ? 'disabled' : data.lastResult === 'hit' ? 'success' : data.lastResult === 'miss' ? 'error' : 'idle',
        cacheEnabled ? `${data.entries.length} cached key(s)` : 'Disabled',
        data.entries.length > 0 ? data.entries.map((entry) => entry.key).join(', ') : undefined,
      ),
      makeNode(
        'database',
        'Database',
        'database',
        data.lastResult === 'miss' ? 'active' : 'idle',
        `${data.databaseQueries} quer${data.databaseQueries === 1 ? 'y' : 'ies'}`,
      ),
    ],
    connections,
    data.lastResult
      ? `${currentKey}: cache ${data.lastResult}${data.lastResult === 'miss' ? ' with database fallback' : ''}.`
      : `Ready · ${keys.length} request${keys.length === 1 ? '' : 's'} in this workload`,
  )
}

function initial(config: SimulationState['config']): SimulationState {
  const base = createInitialState(cacheStrategiesSimulation, config)
  const entries = parseList(configText(config, 'initialEntries')).map((key) => ({
    key,
    insertedAt: 0,
  }))
  const data: CacheData = {
    entries,
    cursor: 0,
    hits: 0,
    misses: 0,
    databaseQueries: 0,
    latencies: [],
    lastKey: null,
    lastResult: null,
    invalidations: 0,
  }
  return {
    ...base,
    data,
    visual: visual(
      data,
      parseList(configText(config, 'requestKeys')),
      config.cacheEnabled !== false,
    ),
  }
}

function refreshMetrics(state: SimulationState, data: CacheData): SimulationState {
  const total = data.hits + data.misses
  return {
    ...state,
    metrics: {
      ...state.metrics,
      cache_hits: data.hits,
      cache_misses: data.misses,
      database_queries: data.databaseQueries,
      cache_hit_rate: hitRate(data.hits, total),
      average_latency: average(data.latencies),
    },
  }
}

function step(state: SimulationState): SimulationState {
  const data = asData(state.data)
  const keys = parseList(configText(state.config, 'requestKeys'))
  const key = keys[data.cursor % Math.max(1, keys.length)] ?? ''
  const now = state.step + 1
  const ttl = configNumber(state, 'ttlSteps')
  const cacheEnabled = state.config.cacheEnabled !== false
  const existing = data.entries.find((entry) => entry.key === key)
  const expired = existing !== undefined && now - existing.insertedAt > ttl
  const events = [...state.events]
  const addEvent = (
    type: string,
    source: string,
    description: string,
    target?: string,
    metadata?: Record<string, string | number | boolean>,
  ) => {
    events.push({
      id: `evt-${String(events.length + 1).padStart(3, '0')}`,
      type,
      step: now,
      source,
      ...(target ? { target } : {}),
      description,
      ...(metadata ? { metadata } : {}),
    })
  }

  let entries = data.entries
  let hits = data.hits
  let misses = data.misses
  let databaseQueries = data.databaseQueries
  let latencies = data.latencies
  let lastResult: 'hit' | 'miss'

  if (cacheEnabled && existing && !expired) {
    hits += 1
    const latency = 5
    latencies = [...latencies, latency]
    lastResult = 'hit'
    addEvent('cache_hit', 'cache', `Cache hit for "${key}" — no database query needed.`, 'client', {
      key,
      latency_ms: latency,
    })
  } else {
    misses += 1
    databaseQueries += 1
    const latency = roundTo(80 + (data.cursor % 3) * 10, 0)
    latencies = [...latencies, latency]
    lastResult = 'miss'

    if (!cacheEnabled) {
      addEvent('cache_disabled', 'cache', `Cache is disabled, so "${key}" goes straight to the database.`, 'database', { key })
    } else if (expired) {
      entries = entries.filter((entry) => entry.key !== key)
      addEvent('cache_expiration', 'cache', `Cached entry "${key}" expired after ${ttl} steps.`, undefined, { key, ttl })
    } else {
      addEvent('cache_miss', 'cache', `Cache miss for "${key}".`, 'client', { key })
    }

    addEvent('database_query', 'database', `Database queried for "${key}" (${latency} ms).`, 'cache', {
      key,
      latency_ms: latency,
    })

    if (cacheEnabled) {
      entries = [...entries.filter((entry) => entry.key !== key), { key, insertedAt: now }]
      addEvent('cache_population', 'database', `Cache populated with "${key}" at step ${now}.`, 'cache', { key, inserted_at: now })
    }
  }

  const nextData: CacheData = {
    ...data,
    entries,
    cursor: data.cursor + 1,
    hits,
    misses,
    databaseQueries,
    latencies,
    lastKey: key,
    lastResult,
  }
  const next = refreshMetrics({ ...state, data: nextData }, nextData)
  next.events = events
  next.visual = visual(nextData, keys, cacheEnabled)
  return next
}

function applyLiveConfig(
  state: SimulationState,
  config: SimulationConfig,
): SimulationState {
  const data = asData(state.data)
  const cacheEnabled = config.cacheEnabled !== false
  const entries = cacheEnabled ? data.entries : []
  const nextData: CacheData = { ...data, entries }
  const next = refreshMetrics({ ...state, data: nextData }, nextData)
  next.visual = visual(
    nextData,
    parseList(configText(config, 'requestKeys')),
    cacheEnabled,
  )
  next.events = withEvent(state, {
    type: 'configuration_applied',
    step: state.step,
    source: 'cache',
    description: cacheEnabled ? 'Cache enabled with the current TTL.' : 'Cache disabled; entries cleared.',
  }).events
  return next
}

function handleCommand(
  state: SimulationState,
  command: string,
  payload?: SimulationConfigValue,
): SimulationState {
  const data = asData(state.data)
  const key = typeof payload === 'string' && payload.trim() ? payload.trim() : null

  if (command !== 'invalidate' && command !== 'prime') {
    return {
      ...state,
      events: withEvent(state, {
        type: 'action_rejected',
        step: state.step,
        source: 'cache',
        description: `Unknown cache action "${command}".`,
      }).events,
    }
  }

  let entries = data.entries
  let description: string
  let type: string

  if (command === 'invalidate') {
    if (key) {
      entries = entries.filter((entry) => entry.key !== key)
      description = `Invalidated cache entry "${key}".`
    } else {
      entries = []
      description = 'Invalidated all cache entries.'
    }
    type = 'cache_invalidation'
  } else {
    if (!key) {
      return {
        ...state,
        events: withEvent(state, {
          type: 'action_rejected',
          step: state.step,
          source: 'cache',
          description: 'Prime requires a cache key.',
        }).events,
      }
    }
    entries = [...entries.filter((entry) => entry.key !== key), { key, insertedAt: state.step }]
    description = `Primed cache entry "${key}" at step ${state.step}.`
    type = 'cache_population'
  }

  const nextData: CacheData = {
    ...data,
    entries,
    invalidations: command === 'invalidate' ? data.invalidations + 1 : data.invalidations,
  }
  const next = refreshMetrics({ ...state, data: nextData }, nextData)
  next.events = withEvent(state, {
    type,
    step: state.step,
    source: 'cache',
    description,
    ...(key ? { metadata: { key } } : {}),
  }).events
  next.visual = visual(
    nextData,
    parseList(configText(state.config, 'requestKeys')),
    state.config.cacheEnabled !== false,
  )
  return next
}

export const cacheStrategiesSimulation: SimulationDefinition = {
  id: 'sim-cache-strategies',
  slug: 'cache-strategies',
  title: 'Cache Strategies',
  description:
    'Run a fixed workload to compare cache hits, misses, database fallback, TTL expiry, and invalidation.',
  category: 'Data & storage',
  difficulty: 'Intermediate',
  learningObjectives: [
    'Explain cache hits and misses using deterministic requests',
    'Observe database fallback and cache population',
    'Reason about TTL expiration and explicit invalidation',
  ],
  initialConfig: {
    cacheEnabled: true,
    initialEntries: 'user:1',
    ttlSteps: 3,
    requestKeys: 'user:1,user:2,user:1,user:3,user:2,user:1',
  },
  controls: [
    {
      key: 'cacheEnabled',
      label: 'Cache enabled',
      type: 'toggle',
      description: 'Disable to send every request to the database.',
      live: true,
    },
    {
      key: 'initialEntries',
      label: 'Initial cache entries',
      type: 'text',
      description: 'Comma separated keys present at step 0.',
      requiresReset: true,
    },
    {
      key: 'ttlSteps',
      label: 'TTL (logical steps)',
      type: 'range',
      min: 1,
      max: 10,
      step: 1,
      description: 'An entry expires when its age exceeds this value.',
      live: true,
    },
    {
      key: 'requestKeys',
      label: 'Workload keys',
      type: 'text',
      description: 'Comma separated request sequence, for example user:1,user:2,user:1.',
      requiresReset: true,
    },
  ],
  metrics: [
    { key: 'cache_hits', label: 'Cache hits', format: 'number' },
    { key: 'cache_misses', label: 'Cache misses', format: 'number' },
    { key: 'database_queries', label: 'Database queries', format: 'number' },
    {
      key: 'cache_hit_rate',
      label: 'Cache hit rate',
      format: 'percent',
      description: 'Hits divided by all cache lookups.',
    },
    {
      key: 'average_latency',
      label: 'Average latency',
      format: 'duration',
    },
  ],
  commands: [
    {
      id: 'invalidate',
      label: 'Invalidate entry',
      payloadLabel: 'Key (blank clears the cache)',
    },
    {
      id: 'prime',
      label: 'Prime entry',
      payloadLabel: 'Key to add',
    },
  ],
  visualLayout: 'triangle',
  completionTarget: (config) => parseList(configText(config, 'requestKeys')).length,
  runtime: {
    initial,
    step,
    isComplete: (state) =>
      asData(state.data).cursor >= parseList(configText(state.config, 'requestKeys')).length,
    applyLiveConfig,
    handleCommand,
  },
}
