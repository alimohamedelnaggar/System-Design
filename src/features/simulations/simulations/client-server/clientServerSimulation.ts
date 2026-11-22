import type {
  SimulationData,
  SimulationDefinition,
  SimulationState,
  SimulationVisualState,
} from '../../types.ts'
import {
  average,
  roundTo,
} from '../../utils/simulationMetrics.ts'
import {
  createInitialState,
  makeConnection,
  makeNode,
  makeVisual,
  withEvent,
} from '../../models/shared.ts'

type RequestPhase = 'idle' | 'request-sent' | 'server-received' | 'processing' | 'response-sent'

interface ClientServerData extends SimulationData {
  phase: RequestPhase
  currentRequest: number
  completedRequests: number
  latencies: number[]
  lastLatency: number
}

function asData(data: SimulationData): ClientServerData {
  return data as unknown as ClientServerData
}

function configNumber(state: SimulationState, key: string): number {
  return Number(state.config[key] ?? 0)
}

function visual(phase: RequestPhase, request: number, total: number): SimulationVisualState {
  const connections = [
    makeConnection(
      'client-server',
      'client',
      'server',
      phase === 'request-sent' || phase === 'server-received' ? 'active' : 'idle',
      'request',
    ),
    makeConnection(
      'server-client',
      'server',
      'client',
      phase === 'response-sent' ? 'active' : 'idle',
      'response',
    ),
  ]

  return makeVisual(
    'linear',
    [
      makeNode(
        'client',
        'Client',
        'client',
        phase === 'request-sent' || phase === 'response-sent' ? 'active' : 'idle',
        phase === 'response-sent' ? 'Response received' : 'Sends requests',
        `Request ${Math.min(request, total)}`,
      ),
      makeNode(
        'server',
        'Server',
        'service',
        phase === 'response-sent' ? 'success' : phase === 'server-received' || phase === 'processing' ? 'active' : 'idle',
        phase === 'processing' ? 'Executing business logic' : 'Waits for requests',
      ),
    ],
    connections,
    phase === 'idle'
      ? `Ready · ${total} request${total === 1 ? '' : 's'} in this run`
      : `Request ${Math.min(request, total)} of ${total} · ${phase.replace('-', ' ')}`,
  )
}

function initial(config: SimulationState['config']): SimulationState {
  const base = createInitialState(clientServerSimulation, config)
  const requestCount = Number(config.requestCount ?? 3)
  return {
    ...base,
    data: {
      phase: 'idle',
      currentRequest: 0,
      completedRequests: 0,
      latencies: [],
      lastLatency: 0,
    } satisfies ClientServerData,
    visual: visual('idle', 0, requestCount),
  }
}

function step(state: SimulationState): SimulationState {
  const data = asData(state.data)
  const requestCount = configNumber(state, 'requestCount')
  const baseLatency = configNumber(state, 'latencyMs')
  const request = data.completedRequests + 1
  const requestId = `req-${request}`
  const next: SimulationState = { ...state, data: { ...data } }
  const nextData = asData(next.data)

  switch (data.phase) {
    case 'idle': {
      nextData.phase = 'request-sent'
      nextData.currentRequest = request
      next.events = withEvent(state, {
        type: 'request_sent',
        step: state.step + 1,
        source: 'client',
        target: 'server',
        description: `Client sent ${requestId} to the server.`,
        metadata: { request: requestId },
      }).events
      break
    }
    case 'request-sent': {
      nextData.phase = 'server-received'
      next.events = withEvent(state, {
        type: 'request_received',
        step: state.step + 1,
        source: 'server',
        description: `Server received ${requestId}.`,
        metadata: { request: requestId },
      }).events
      break
    }
    case 'server-received': {
      nextData.phase = 'processing'
      next.events = withEvent(state, {
        type: 'request_processing',
        step: state.step + 1,
        source: 'server',
        description: `Server is processing ${requestId}.`,
        metadata: { request: requestId, latency_ms: baseLatency },
      }).events
      break
    }
    case 'processing': {
      nextData.phase = 'response-sent'
      next.events = withEvent(state, {
        type: 'response_sent',
        step: state.step + 1,
        source: 'server',
        target: 'client',
        description: `Server sent the response for ${requestId}.`,
        metadata: { request: requestId },
      }).events
      break
    }
    case 'response-sent': {
      const latency = roundTo(baseLatency + ((request - 1) % 3) * 20, 0)
      nextData.phase = 'idle'
      nextData.completedRequests = data.completedRequests + 1
      nextData.latencies = [...data.latencies, latency]
      nextData.lastLatency = latency
      next.metrics = {
        ...state.metrics,
        total_requests: nextData.completedRequests,
        successful_requests: nextData.completedRequests,
        average_latency: average(nextData.latencies),
      }
      next.events = withEvent(state, {
        type: 'request_completed',
        step: state.step + 1,
        source: 'client',
        target: 'server',
        description: `Client received the response for ${requestId} in ${latency} ms.`,
        metadata: { request: requestId, latency_ms: latency },
      }).events
      break
    }
  }

  next.visual = visual(nextData.phase, nextData.currentRequest, requestCount)
  return next
}

export const clientServerSimulation: SimulationDefinition = {
  id: 'sim-client-server',
  slug: 'client-server-request-flow',
  title: 'Client–Server Request Flow',
  description:
    'Follow one request from client to server and back. Step through each stage to see how latency accumulates.',
  category: 'Fundamentals',
  difficulty: 'Beginner',
  learningObjectives: [
    'Identify each stage of a request lifecycle',
    'Distinguish request and response paths',
    'Observe how simulated latency is measured',
  ],
  initialConfig: {
    requestCount: 3,
    latencyMs: 120,
  },
  controls: [
    {
      key: 'requestCount',
      label: 'Requests in run',
      type: 'range',
      min: 1,
      max: 6,
      step: 1,
      description: 'How many requests to complete before the run ends.',
      requiresReset: true,
    },
    {
      key: 'latencyMs',
      label: 'Base server latency',
      type: 'range',
      min: 40,
      max: 400,
      step: 20,
      description: 'Processing time in milliseconds; small deterministic variation is added per request.',
      requiresReset: true,
    },
  ],
  metrics: [
    { key: 'total_requests', label: 'Total requests', format: 'number' },
    { key: 'successful_requests', label: 'Successful requests', format: 'number' },
    {
      key: 'average_latency',
      label: 'Average latency',
      format: 'duration',
      description: 'Mean latency across completed requests.',
    },
  ],
  visualLayout: 'linear',
  completionTarget: (config) => Number(config.requestCount ?? 3),
  runtime: {
    initial,
    step,
    isComplete: (state) => asData(state.data).completedRequests >= configNumber(state, 'requestCount'),
  },
}
