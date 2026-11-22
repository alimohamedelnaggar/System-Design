import type {
  SimulationConfig,
  SimulationConfigValue,
  SimulationData,
  SimulationDefinition,
  SimulationState,
  SimulationVisualState,
} from '../../types.ts'
import { average, roundTo } from '../../utils/simulationMetrics.ts'
import {
  createInitialState,
  makeConnection,
  makeNode,
  makeVisual,
  withEvent,
} from '../../models/shared.ts'

export type LoadBalancerAlgorithm = 'round-robin' | 'least-connections'

export interface LoadBalancerServer {
  id: string
  label: string
  available: boolean
  connections: number
  assigned: number
}

interface LoadBalancerData extends SimulationData {
  servers: LoadBalancerServer[]
  nextIndex: number
  lastServerId: string | null
  totalRequests: number
  successful: number
  failed: number
  latencies: number[]
  lastLatency: number
}

function asData(data: SimulationData): LoadBalancerData {
  return data as unknown as LoadBalancerData
}

function configNumber(state: SimulationState, key: string): number {
  return Number(state.config[key] ?? 0)
}

function configText(config: SimulationConfig, key: string): string {
  const value = config[key]
  return typeof value === 'string' ? value : ''
}

export function parseUnavailableServers(value: string): number[] {
  return value
    .split(',')
    .map((part) => Number(part.trim()))
    .filter((number) => Number.isInteger(number) && number > 0)
}

function applyAvailability(
  servers: readonly LoadBalancerServer[],
  unavailable: readonly number[],
): LoadBalancerServer[] {
  const blocked = new Set(unavailable)
  return servers.map((server, index) => ({
    ...server,
    available: !blocked.has(index + 1),
  }))
}

function createServers(config: SimulationConfig): LoadBalancerServer[] {
  const count = Number(config.serverCount ?? 3)
  const unavailable = parseUnavailableServers(configText(config, 'unavailableServers'))
  return applyAvailability(
    Array.from({ length: count }, (_, index) => ({
      id: `server-${index + 1}`,
      label: `Server ${index + 1}`,
      available: true,
      connections: 0,
      assigned: 0,
    })),
    unavailable,
  )
}

function visual(
  data: LoadBalancerData,
  algorithm: LoadBalancerAlgorithm,
): SimulationVisualState {
  const nodes = [
    makeNode('client', 'Client', 'client', 'idle', 'Sends requests'),
    makeNode(
      'load-balancer',
      'Load Balancer',
      'load-balancer',
      data.lastServerId ? 'active' : 'idle',
      algorithm === 'round-robin' ? 'Round Robin' : 'Least Connections',
      `${data.totalRequests} routed`,
    ),
    ...data.servers.map((server) =>
      makeNode(
        server.id,
        server.label,
        'server',
        !server.available
          ? 'error'
          : server.id === data.lastServerId
            ? 'active'
            : 'idle',
        !server.available ? 'Unavailable' : 'Available',
        `${server.assigned} assigned · ${server.connections} active`,
      ),
    ),
  ]

  const connections = [
    makeConnection(
      'client-lb',
      'client',
      'load-balancer',
      data.lastServerId ? 'active' : 'idle',
      'request',
    ),
    ...data.servers.map((server) =>
      makeConnection(
        `lb-${server.id}`,
        'load-balancer',
        server.id,
        !server.available ? 'error' : server.id === data.lastServerId ? 'active' : 'idle',
      ),
    ),
  ]

  const algorithmLabel = algorithm === 'round-robin' ? 'Round Robin' : 'Least Connections'
  return makeVisual(
    'hub',
    nodes,
    connections,
    data.lastServerId
      ? `${algorithmLabel} selected ${data.lastServerId} for request ${data.totalRequests}.`
      : `Waiting for requests · ${algorithmLabel}`,
  )
}

function refreshMetrics(state: SimulationState, data: LoadBalancerData): SimulationState {
  return {
    ...state,
    metrics: {
      ...state.metrics,
      total_requests: data.totalRequests,
      successful_requests: data.successful,
      failed_requests: data.failed,
      active_connections: data.servers.reduce((sum, server) => sum + server.connections, 0),
      average_latency: average(data.latencies),
    },
  }
}

function selectServer(
  servers: readonly LoadBalancerServer[],
  algorithm: LoadBalancerAlgorithm,
  nextIndex: number,
): { server: LoadBalancerServer; index: number; nextIndex: number } | null {
  const available = servers
    .map((server, index) => ({ server, index }))
    .filter((entry) => entry.server.available)
  if (available.length === 0) return null

  if (algorithm === 'least-connections') {
    const chosen = available.reduce((best, entry) =>
      entry.server.connections < best.server.connections ||
      (entry.server.connections === best.server.connections && entry.index < best.index)
        ? entry
        : best,
    )
    return { server: chosen.server, index: chosen.index, nextIndex }
  }

  const start = nextIndex % servers.length
  for (let offset = 0; offset < servers.length; offset += 1) {
    const index = (start + offset) % servers.length
    const candidate = servers[index]
    if (candidate?.available) {
      return {
        server: candidate,
        index,
        nextIndex: (index + 1) % servers.length,
      }
    }
  }
  return null
}

function initial(config: SimulationState['config']): SimulationState {
  const base = createInitialState(loadBalancerSimulation, config)
  const servers = createServers(config)
  const data: LoadBalancerData = {
    servers,
    nextIndex: 0,
    lastServerId: null,
    totalRequests: 0,
    successful: 0,
    failed: 0,
    latencies: [],
    lastLatency: 0,
  }
  const algorithm = config.algorithm === 'least-connections' ? 'least-connections' : 'round-robin'
  return {
    ...base,
    data,
    visual: visual(data, algorithm),
  }
}

function step(state: SimulationState): SimulationState {
  const data = asData(state.data)
  const algorithm: LoadBalancerAlgorithm =
    state.config.algorithm === 'least-connections' ? 'least-connections' : 'round-robin'
  const requestNumber = data.totalRequests + 1
  const servers = data.servers.map((server) => ({ ...server }))
  const nextData: LoadBalancerData = { ...data, servers }
  let next: SimulationState = { ...state, data: nextData }
  const events = [...state.events]

  events.push({
    id: `evt-${String(events.length + 1).padStart(3, '0')}`,
    type: 'request_received',
    step: state.step + 1,
    source: 'client',
    target: 'load-balancer',
    description: `Load balancer received request ${requestNumber}.`,
    metadata: { request: requestNumber, algorithm },
  })

  const selection = selectServer(servers, algorithm, data.nextIndex)
  if (!selection) {
    nextData.failed = data.failed + 1
    nextData.totalRequests = data.totalRequests + 1
    next = refreshMetrics(next, nextData)
    events.push({
      id: `evt-${String(events.length + 1).padStart(3, '0')}`,
      type: 'no_available_server',
      step: state.step + 1,
      source: 'load-balancer',
      description: 'No available backend server, so the request failed.',
    })
  } else {
    const selected = selection.server
    selected.connections += 1
    selected.assigned += 1
    nextData.nextIndex = selection.nextIndex
    nextData.lastServerId = selected.id
    nextData.totalRequests = data.totalRequests + 1
    nextData.successful = data.successful + 1
    const latency = roundTo(30 + selection.index * 10 + (requestNumber % 3) * 5, 0)
    nextData.latencies = [...data.latencies, latency]
    nextData.lastLatency = latency
    next = refreshMetrics(next, nextData)
    events.push({
      id: `evt-${String(events.length + 1).padStart(3, '0')}`,
      type: 'request_forwarded',
      step: state.step + 1,
      source: 'load-balancer',
      target: selected.id,
      description: `Request ${requestNumber} forwarded to ${selected.label} (${latency} ms).`,
      metadata: { request: requestNumber, server: selected.id, latency_ms: latency },
    })
  }

  next.events = events
  next.visual = visual(nextData, algorithm)
  return next
}

function applyLiveConfig(
  state: SimulationState,
  config: SimulationConfig,
): SimulationState {
  const data = asData(state.data)
  const servers = applyAvailability(
    data.servers.map((server) => ({ ...server })),
    parseUnavailableServers(configText(config, 'unavailableServers')),
  )
  const algorithm: LoadBalancerAlgorithm =
    config.algorithm === 'least-connections' ? 'least-connections' : 'round-robin'
  const nextData: LoadBalancerData = { ...data, servers }
  const next = refreshMetrics({ ...state, data: nextData }, nextData)
  next.visual = visual(nextData, algorithm)
  next.events = withEvent(state, {
    type: 'configuration_applied',
    step: state.step,
    source: 'load-balancer',
    description: 'Live configuration updated the load balancer.',
  }).events
  return next
}

function handleCommand(
  state: SimulationState,
  command: string,
  payload?: SimulationConfigValue,
): SimulationState {
  const data = asData(state.data)
  const servers = data.servers.map((server) => ({ ...server }))
  const nextData: LoadBalancerData = { ...data, servers }
  const next: SimulationState = { ...state, data: nextData }
  const serverId = typeof payload === 'string' ? payload : data.lastServerId
  const index = servers.findIndex((server) => server.id === serverId)

  if (command === 'toggle-server' && index >= 0) {
    const server = servers[index]
    server.available = !server.available
    const eventType = server.available ? 'server_available' : 'server_unavailable'
    next.events = withEvent(state, {
      type: eventType,
      step: state.step,
      source: server.id,
      description: `${server.label} is now ${server.available ? 'available' : 'unavailable'}.`,
    }).events
  } else if (command === 'release-connection' && index >= 0) {
    const server = servers[index]
    server.connections = Math.max(0, server.connections - 1)
    next.events = withEvent(state, {
      type: 'connection_released',
      step: state.step,
      source: server.id,
      description: `One active connection to ${server.label} finished.`,
    }).events
  } else {
    next.events = withEvent(state, {
      type: 'action_rejected',
      step: state.step,
      source: 'load-balancer',
      description: `Could not apply "${command}" to the selected server.`,
    }).events
  }

  const refreshed = refreshMetrics(next, nextData)
  refreshed.visual = visual(
    nextData,
    state.config.algorithm === 'least-connections' ? 'least-connections' : 'round-robin',
  )
  return refreshed
}

export const loadBalancerSimulation: SimulationDefinition = {
  id: 'sim-load-balancer',
  slug: 'load-balancer-algorithms',
  title: 'Load Balancer Algorithms',
  description:
    'Route requests with Round Robin or Least Connections, then remove a backend and watch traffic avoid it.',
  category: 'Traffic management',
  difficulty: 'Intermediate',
  learningObjectives: [
    'Compare deterministic load-balancing algorithms',
    'Read server distribution and active connection counts',
    'Understand how unavailable backends affect routing',
  ],
  initialConfig: {
    serverCount: 3,
    algorithm: 'round-robin',
    unavailableServers: '',
    requestCount: 8,
  },
  controls: [
    {
      key: 'serverCount',
      label: 'Backend servers',
      type: 'range',
      min: 2,
      max: 6,
      step: 1,
      description: 'Number of backend servers in the pool.',
      requiresReset: true,
    },
    {
      key: 'algorithm',
      label: 'Algorithm',
      type: 'select',
      options: [
        { label: 'Round Robin', value: 'round-robin' },
        { label: 'Least Connections', value: 'least-connections' },
      ],
      live: true,
    },
    {
      key: 'unavailableServers',
      label: 'Unavailable servers (1-based, comma separated)',
      type: 'text',
      description: 'For example, "2,3" removes servers 2 and 3 from the pool.',
      live: true,
    },
    {
      key: 'requestCount',
      label: 'Requests in run',
      type: 'range',
      min: 1,
      max: 20,
      step: 1,
      requiresReset: true,
    },
  ],
  metrics: [
    { key: 'total_requests', label: 'Total requests', format: 'number' },
    { key: 'successful_requests', label: 'Routed requests', format: 'number' },
    { key: 'failed_requests', label: 'Failed requests', format: 'number' },
    { key: 'active_connections', label: 'Active connections', format: 'number' },
    {
      key: 'average_latency',
      label: 'Average latency',
      format: 'duration',
      description: 'Mean latency of successfully routed requests.',
    },
  ],
  commands: [
    {
      id: 'toggle-server',
      label: 'Toggle server availability',
      payloadLabel: 'Server id (for example server-2)',
    },
    {
      id: 'release-connection',
      label: 'Release a connection',
      payloadLabel: 'Server id (blank uses last selected)',
    },
  ],
  visualLayout: 'hub',
  completionTarget: (config) => Number(config.requestCount ?? 8),
  runtime: {
    initial,
    step,
    isComplete: (state) => asData(state.data).totalRequests >= configNumber(state, 'requestCount'),
    applyLiveConfig,
    handleCommand,
  },
}
