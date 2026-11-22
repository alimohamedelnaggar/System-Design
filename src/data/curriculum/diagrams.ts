import type { Diagram } from '../../types/curriculum.ts'

/** Diagram configurations are kept separate from lesson metadata and prose. */
export const diagrams: Diagram[] = [
  {
    id: 'diagram-1-1-basic-system',
    title: 'Basic software system',
    description:
      'A client sends a request to a server, the server reads or writes durable data in a database, and the response travels back to the client. The two arrows between client and server show the request and response directions.',
    layout: 'flow',
    nodes: [
      {
        id: 'd1-client',
        label: 'Client',
        kind: 'client',
        description: 'Browser or mobile app that starts the request',
      },
      {
        id: 'd1-server',
        label: 'Application server',
        kind: 'service',
        description: 'Applies business rules and prepares the response',
      },
      {
        id: 'd1-database',
        label: 'Database',
        kind: 'database',
        description: 'Stores data that must survive restarts',
      },
    ],
    edges: [
      { id: 'd1-client-request', source: 'd1-client', target: 'd1-server', label: 'request' },
      { id: 'd1-server-response', source: 'd1-server', target: 'd1-client', label: 'response' },
      { id: 'd1-server-query', source: 'd1-server', target: 'd1-database', label: 'read / write' },
      { id: 'd1-database-result', source: 'd1-database', target: 'd1-server', label: 'result' },
    ],
  },
  {
    id: 'diagram-1-1-request-path',
    title: 'Online store request flow',
    description:
      'A product page request reaches the application server. The server checks the cache first: a cache hit returns product data without a database read, while a cache miss leads to a database query. Not every request uses every path.',
    layout: 'flow',
    nodes: [
      {
        id: 'd2-client',
        label: 'Browser',
        kind: 'client',
        description: 'Requests the product page',
      },
      {
        id: 'd2-server',
        label: 'Application server',
        kind: 'service',
        description: 'Applies rules and builds the response',
      },
      {
        id: 'd2-cache',
        label: 'Cache',
        kind: 'cache',
        description: 'Optional fast copy of recent product data',
      },
      {
        id: 'd2-database',
        label: 'Database',
        kind: 'database',
        description: 'Durable product catalogue',
      },
    ],
    edges: [
      { id: 'd2-client-request', source: 'd2-client', target: 'd2-server', label: 'request product' },
      { id: 'd2-server-check', source: 'd2-server', target: 'd2-cache', label: 'check cache' },
      { id: 'd2-cache-hit', source: 'd2-cache', target: 'd2-server', label: 'hit: data' },
      { id: 'd2-server-miss', source: 'd2-server', target: 'd2-database', label: 'miss: query' },
      { id: 'd2-database-row', source: 'd2-database', target: 'd2-server', label: 'product row' },
      { id: 'd2-server-response', source: 'd2-server', target: 'd2-client', label: 'response' },
    ],
  },
  {
    id: 'diagram-1-1-system-growth',
    title: 'System growth',
    description:
      'An illustrative evolution from one application server and one database to a design with a load balancer, two application servers and a cache. This is one possible response to growth, not a mandatory architecture.',
    layout: 'comparison',
    nodes: [
      {
        id: 'd3-initial-client',
        label: 'Initial: client',
        kind: 'client',
        description: 'One user path in the small system',
      },
      {
        id: 'd3-growing-client',
        label: 'Growing: client',
        kind: 'client',
        description: 'Many concurrent users in the growing system',
      },
      {
        id: 'd3-initial-server',
        label: 'Initial: one server',
        kind: 'service',
        description: 'Single application server at launch',
      },
      {
        id: 'd3-growing-balancer',
        label: 'Growing: load balancer',
        kind: 'gateway',
        description: 'Distributes traffic across instances',
      },
      {
        id: 'd3-initial-database',
        label: 'Initial: database',
        kind: 'database',
        description: 'Single durable store at launch',
      },
      {
        id: 'd3-growing-server-a',
        label: 'Growing: server A',
        kind: 'service',
        description: 'First application instance',
      },
      {
        id: 'd3-growing-cache',
        label: 'Growing: cache',
        kind: 'cache',
        description: 'Reduces repeated catalogue reads',
      },
      {
        id: 'd3-growing-database',
        label: 'Growing: database',
        kind: 'database',
        description: 'Durable store in the growing system',
      },
      {
        id: 'd3-growing-server-b',
        label: 'Growing: server B',
        kind: 'service',
        description: 'Second application instance',
      },
    ],
    edges: [
      {
        id: 'd3-initial-request',
        source: 'd3-initial-client',
        target: 'd3-initial-server',
        label: 'request',
      },
      {
        id: 'd3-initial-query',
        source: 'd3-initial-server',
        target: 'd3-initial-database',
        label: 'query',
      },
      {
        id: 'd3-growing-traffic',
        source: 'd3-growing-client',
        target: 'd3-growing-balancer',
        label: 'traffic',
      },
      {
        id: 'd3-growing-route-a',
        source: 'd3-growing-balancer',
        target: 'd3-growing-server-a',
        label: 'route',
      },
      {
        id: 'd3-growing-route-b',
        source: 'd3-growing-balancer',
        target: 'd3-growing-server-b',
        label: 'route',
      },
      {
        id: 'd3-growing-cache-check',
        source: 'd3-growing-server-a',
        target: 'd3-growing-cache',
        label: 'read',
      },
      {
        id: 'd3-growing-cache-hit',
        source: 'd3-growing-cache',
        target: 'd3-growing-server-a',
        label: 'hit',
      },
      {
        id: 'd3-growing-miss',
        source: 'd3-growing-server-a',
        target: 'd3-growing-database',
        label: 'miss: query',
      },
      {
        id: 'd3-growing-server-b-read',
        source: 'd3-growing-server-b',
        target: 'd3-growing-database',
        label: 'read',
      },
    ],
  },
]
