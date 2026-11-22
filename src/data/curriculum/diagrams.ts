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
  {
    id: 'diagram-1-2-basic-client-server',
    title: 'Basic client-server communication',
    description:
      'A client and a server cooperate across a network. The request travels left to right; the response travels right to left. The network is a path, not a place where business logic is executed.',
    layout: 'flow',
    nodes: [
      {
        id: 'd4-client',
        label: 'Client',
        kind: 'client',
        description: 'Collects input and starts the request',
      },
      {
        id: 'd4-network',
        label: 'Network',
        kind: 'gateway',
        description: 'Carries bytes between the two programs',
      },
      {
        id: 'd4-server',
        label: 'Server',
        kind: 'service',
        description: 'Processes the request and builds the response',
      },
    ],
    edges: [
      { id: 'd4-request-out', source: 'd4-client', target: 'd4-network', label: 'request' },
      { id: 'd4-request-in', source: 'd4-network', target: 'd4-server', label: 'request delivered' },
      { id: 'd4-response-out', source: 'd4-server', target: 'd4-network', label: 'response' },
      { id: 'd4-response-in', source: 'd4-network', target: 'd4-client', label: 'response returned' },
    ],
  },
  {
    id: 'diagram-1-2-request-lifecycle',
    title: 'Request-response lifecycle',
    description:
      'Five numbered stages connect a user action to a displayed result. The client prepares and sends the request, the server processes it and prepares a response, and the client handles that response before the interaction is complete.',
    layout: 'timeline',
    nodes: [
      {
        id: 'd5-user-action',
        label: '1. User action',
        kind: 'client',
        description: 'A shopper clicks View Product',
      },
      {
        id: 'd5-request',
        label: '2. Request',
        kind: 'generic',
        description: 'Method, URL, headers and optional body',
      },
      {
        id: 'd5-processing',
        label: '3. Server processing',
        kind: 'service',
        description: 'Validate, apply rules and read data',
      },
      {
        id: 'd5-response',
        label: '4. Response',
        kind: 'generic',
        description: 'Status code, headers and optional body',
      },
      {
        id: 'd5-client-result',
        label: '5. Client result',
        kind: 'client',
        description: 'Render the product or show an error',
      },
    ],
    edges: [
      { id: 'd5-prepares', source: 'd5-user-action', target: 'd5-request', label: 'prepares' },
      { id: 'd5-travels', source: 'd5-request', target: 'd5-processing', label: 'travels over network' },
      { id: 'd5-builds', source: 'd5-processing', target: 'd5-response', label: 'builds' },
      { id: 'd5-returns', source: 'd5-response', target: 'd5-client-result', label: 'returns and displays' },
    ],
  },
  {
    id: 'diagram-1-2-two-tier',
    title: 'Two-tier architecture',
    description:
      'A client application communicates directly with a database server across the network. This can suit a small internal tool, but business rules placed in the client must be repeated for every client type, and database access must be controlled carefully.',
    layout: 'flow',
    nodes: [
      {
        id: 'd6-client-app',
        label: 'Client application',
        kind: 'client',
        description: 'User interface plus client-side business rules',
      },
      {
        id: 'd6-network',
        label: 'Network',
        kind: 'gateway',
        description: 'Carries database protocol traffic',
      },
      {
        id: 'd6-database',
        label: 'Database server',
        kind: 'database',
        description: 'Stores data and answers database requests',
      },
    ],
    edges: [
      { id: 'd6-query', source: 'd6-client-app', target: 'd6-network', label: 'query' },
      { id: 'd6-query-delivered', source: 'd6-network', target: 'd6-database', label: 'query delivered' },
      { id: 'd6-rows', source: 'd6-database', target: 'd6-network', label: 'rows / result' },
      { id: 'd6-result', source: 'd6-network', target: 'd6-client-app', label: 'result' },
    ],
  },
  {
    id: 'diagram-1-2-three-tier',
    title: 'Three-tier architecture',
    description:
      'The presentation tier sends a request to the application tier, which applies business rules and queries the data tier. Results flow back through the application tier to the presentation tier. These are logical tiers and may share one physical host in a small deployment.',
    layout: 'layers',
    nodes: [
      {
        id: 'd7-presentation',
        label: 'Presentation tier',
        kind: 'client',
        description: 'Browser or mobile app that displays information',
      },
      {
        id: 'd7-application',
        label: 'Application tier',
        kind: 'service',
        description: 'API endpoint and business rules',
      },
      {
        id: 'd7-data',
        label: 'Data tier',
        kind: 'database',
        description: 'Database that stores durable product data',
      },
    ],
    edges: [
      { id: 'd7-request', source: 'd7-presentation', target: 'd7-application', label: 'request' },
      { id: 'd7-response', source: 'd7-application', target: 'd7-presentation', label: 'response' },
      { id: 'd7-query', source: 'd7-application', target: 'd7-data', label: 'query' },
      { id: 'd7-result', source: 'd7-data', target: 'd7-application', label: 'result' },
    ],
  },
  {
    id: 'diagram-1-3-url-anatomy',
    title: 'Anatomy of a URL',
    description:
      'The example https://shop.example.com/products?category=lamps#reviews is read from left to right. The scheme selects HTTP over TLS, the domain names the destination, the implicit port is 443, the path identifies the resource, the query narrows it, and the fragment is used by the browser after the response arrives.',
    layout: 'flow',
    nodes: [
      {
        id: 'd8-scheme',
        label: 'https',
        kind: 'generic',
        description: 'Scheme: use HTTP inside a TLS-protected connection',
      },
      {
        id: 'd8-domain',
        label: 'shop.example.com',
        kind: 'service',
        description: 'Domain name: human-readable destination to resolve',
      },
      {
        id: 'd8-port',
        label: ':443',
        kind: 'gateway',
        description: 'Implicit port for HTTPS; it can be written explicitly',
      },
      {
        id: 'd8-path',
        label: '/products',
        kind: 'generic',
        description: 'Path: identifies the requested resource',
      },
      {
        id: 'd8-query',
        label: '?category=lamps',
        kind: 'generic',
        description: 'Query parameters: extra input for the server',
      },
      {
        id: 'd8-fragment',
        label: '#reviews',
        kind: 'client',
        description: 'Fragment: a section inside the page, handled by the browser',
      },
    ],
    edges: [
      { id: 'd8-uses', source: 'd8-scheme', target: 'd8-domain', label: 'scheme applies to' },
      { id: 'd8-connects', source: 'd8-domain', target: 'd8-port', label: 'connect on port' },
      { id: 'd8-requests', source: 'd8-port', target: 'd8-path', label: 'request resource' },
      { id: 'd8-filters', source: 'd8-path', target: 'd8-query', label: 'narrowed by' },
      { id: 'd8-displays', source: 'd8-query', target: 'd8-fragment', label: 'then display' },
    ],
  },
  {
    id: 'diagram-1-3-dns-resolution',
    title: 'DNS resolution for shop.example.com',
    description:
      'The browser and operating system check caches first. On a miss, a recursive resolver walks the hierarchy: a root server refers to the .com TLD server, which refers to the authoritative server for example.com. That server returns the address, which is cached for its TTL. Cached answers can skip the later stages.',
    layout: 'flow',
    nodes: [
      {
        id: 'd9-cache',
        label: 'Browser / OS cache',
        kind: 'cache',
        description: 'Checked first; a valid answer ends the lookup here',
      },
      {
        id: 'd9-resolver',
        label: 'Recursive resolver',
        kind: 'gateway',
        description: 'Performs the lookup on behalf of the client',
      },
      {
        id: 'd9-root',
        label: 'Root DNS server',
        kind: 'service',
        description: 'Refers the resolver to the .com TLD servers',
      },
      {
        id: 'd9-tld',
        label: '.com TLD server',
        kind: 'service',
        description: 'Refers the resolver to the authoritative servers',
      },
      {
        id: 'd9-authoritative',
        label: 'Authoritative server',
        kind: 'service',
        description: 'Holds the records for the example.com zone',
      },
      {
        id: 'd9-ip',
        label: 'IP address',
        kind: 'generic',
        description: 'The address returned for shop.example.com',
      },
    ],
    edges: [
      { id: 'd9-miss', source: 'd9-cache', target: 'd9-resolver', label: 'cache miss' },
      { id: 'd9-ask-root', source: 'd9-resolver', target: 'd9-root', label: 'ask' },
      { id: 'd9-refer-tld', source: 'd9-root', target: 'd9-tld', label: 'refer to .com' },
      { id: 'd9-ask-tld', source: 'd9-resolver', target: 'd9-tld', label: 'ask' },
      { id: 'd9-refer-auth', source: 'd9-tld', target: 'd9-authoritative', label: 'refer to example.com' },
      { id: 'd9-ask-auth', source: 'd9-resolver', target: 'd9-authoritative', label: 'ask' },
      { id: 'd9-record', source: 'd9-authoritative', target: 'd9-ip', label: 'return record + TTL' },
      { id: 'd9-cache-answer', source: 'd9-ip', target: 'd9-cache', label: 'cache for TTL' },
    ],
  },
  {
    id: 'diagram-1-3-tcp-handshake',
    title: 'TCP three-way handshake',
    description:
      'Before HTTP bytes can flow over TCP, the client and server exchange three messages. SYN starts the exchange, SYN-ACK acknowledges it and starts the server side, and ACK completes it. Both endpoints then hold the state needed for a reliable, ordered byte stream.',
    layout: 'timeline',
    nodes: [
      {
        id: 'd10-client',
        label: 'Client',
        kind: 'client',
        description: 'Browser that wants to send an HTTP request',
      },
      {
        id: 'd10-server',
        label: 'Server',
        kind: 'service',
        description: 'Endpoint at the resolved IP address',
      },
      {
        id: 'd10-established',
        label: 'Established connection',
        kind: 'gateway',
        description: 'Reliable, ordered byte stream ready for TLS and HTTP',
      },
    ],
    edges: [
      { id: 'd10-syn', source: 'd10-client', target: 'd10-server', label: 'SYN' },
      { id: 'd10-syn-ack', source: 'd10-server', target: 'd10-client', label: 'SYN-ACK' },
      { id: 'd10-ack', source: 'd10-client', target: 'd10-server', label: 'ACK' },
      { id: 'd10-ready', source: 'd10-client', target: 'd10-established', label: 'connection ready' },
    ],
  },
  {
    id: 'diagram-1-3-https-lifecycle',
    title: 'Complete HTTPS request lifecycle',
    description:
      'A simplified journey for https://shop.example.com/products: the browser resolves the name, connects to the returned address using TCP or QUIC where applicable, negotiates TLS, sends an HTTP request, the server processes it, and an HTTP response returns for the browser to render. Real browsers may reuse connections or fetch assets in parallel.',
    layout: 'flow',
    nodes: [
      {
        id: 'd11-browser',
        label: 'Browser',
        kind: 'client',
        description: 'Parses the URL and starts the navigation',
      },
      {
        id: 'd11-dns',
        label: 'DNS resolution',
        kind: 'gateway',
        description: 'Resolves shop.example.com using caches or resolvers',
      },
      {
        id: 'd11-ip',
        label: 'Server IP',
        kind: 'generic',
        description: 'Address returned by DNS',
      },
      {
        id: 'd11-transport',
        label: 'TCP / QUIC connection',
        kind: 'gateway',
        description: 'Transport for HTTP/1.1 and HTTP/2, or QUIC for HTTP/3',
      },
      {
        id: 'd11-tls',
        label: 'TLS handshake',
        kind: 'gateway',
        description: 'Validates the certificate and establishes session keys',
      },
      {
        id: 'd11-request',
        label: 'HTTP request',
        kind: 'generic',
        description: 'GET /products with Host and other headers',
      },
      {
        id: 'd11-processing',
        label: 'Server processing',
        kind: 'service',
        description: 'Validates, applies rules and reads data',
      },
      {
        id: 'd11-response',
        label: 'HTTP response',
        kind: 'generic',
        description: 'Status line, headers and body returned to the browser',
      },
    ],
    edges: [
      { id: 'd11-resolve', source: 'd11-browser', target: 'd11-dns', label: 'resolve name' },
      { id: 'd11-address', source: 'd11-dns', target: 'd11-ip', label: 'return address' },
      { id: 'd11-connect', source: 'd11-ip', target: 'd11-transport', label: 'connect' },
      { id: 'd11-secure', source: 'd11-transport', target: 'd11-tls', label: 'negotiate TLS' },
      { id: 'd11-send', source: 'd11-tls', target: 'd11-request', label: 'send request' },
      { id: 'd11-handle', source: 'd11-request', target: 'd11-processing', label: 'process' },
      { id: 'd11-return', source: 'd11-processing', target: 'd11-response', label: 'build response' },
      { id: 'd11-render', source: 'd11-response', target: 'd11-browser', label: 'render' },
    ],
  },
]
