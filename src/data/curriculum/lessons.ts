import type { Lesson } from '../../types/curriculum.ts'

/**
 * Lesson metadata only. Published lessons reference content stored in
 * lessonContent.ts, quizzes.ts and diagrams.ts.
 */
function plannedLesson(
  moduleId: string,
  slug: string,
  title: string,
  description: string,
): Lesson {
  const lessonNumber = moduleId.replace('module-', '')

  return {
    id: `lesson-${lessonNumber}`,
    moduleId,
    slug,
    number: 1,
    title,
    description,
    estimatedMinutes: 20,
    order: 1,
    status: 'planned',
    learningObjectives: [],
    sectionIds: [],
    diagramIds: [],
    codeExampleIds: [],
    comparisonIds: [],
    quizId: null,
    practicalChallengeId: null,
    summaryId: null,
  }
}

const whatIsSystemDesign: Lesson = {
  id: 'lesson-1-1',
  moduleId: 'module-1-1',
  slug: 'what-is-system-design',
  number: 1,
  title: 'What is System Design?',
  description:
    'Learn what system design means, how software components work together, how to write requirements, and why every design choice involves trade-offs.',
  estimatedMinutes: 35,
  order: 1,
  status: 'published',
  learningObjectives: [
    {
      id: 'objective-1-1-1',
      text: 'Explain system design as defining components, responsibilities, communication, data flow, storage, infrastructure and trade-offs.',
    },
    {
      id: 'objective-1-1-2',
      text: 'Distinguish system design from coding by classifying statements as structure decisions or feature implementation.',
    },
    {
      id: 'objective-1-1-3',
      text: 'Explain why growth in users, traffic and data can make a simple architecture insufficient.',
    },
    {
      id: 'objective-1-1-4',
      text: 'Identify the client, server, API, database, cache, load balancer and message queue, and state the problem each solves.',
    },
    {
      id: 'objective-1-1-5',
      text: 'Trace a product-page request through client, server, optional cache and database, distinguishing request, response and data flow.',
    },
    {
      id: 'objective-1-1-6',
      text: 'Write clear functional requirements for a small online store and separate them from vague statements.',
    },
    {
      id: 'objective-1-1-7',
      text: 'Define performance, scalability, availability, reliability, security and maintainability with a practical example each.',
    },
    {
      id: 'objective-1-1-8',
      text: 'Distinguish availability from reliability using a concrete reachability or correctness example.',
    },
    {
      id: 'objective-1-1-9',
      text: 'Explain one trade-off for a caching, scaling or consistency decision by naming both the gain and the cost.',
    },
    {
      id: 'objective-1-1-10',
      text: 'Apply the ten-step design workflow to a small scenario and explain how the same reasoning is used in real projects and technical interviews.',
    },
  ],
  sectionIds: [
    'section-1-1-1',
    'section-1-1-2',
    'section-1-1-3',
    'section-1-1-4',
    'section-1-1-5',
    'section-1-1-6',
    'section-1-1-7',
    'section-1-1-8',
    'section-1-1-9',
    'section-1-1-10',
    'section-1-1-11',
    'section-1-1-12',
  ],
  diagramIds: [
    'diagram-1-1-basic-system',
    'diagram-1-1-request-path',
    'diagram-1-1-system-growth',
  ],
  codeExampleIds: ['code-1-1-http-request-response', 'code-1-1-api-endpoint'],
  comparisonIds: ['comparison-1-1-functional-vs-nonfunctional'],
  quizId: 'quiz-1-1',
  practicalChallengeId: 'challenge-1-1',
  summaryId: 'summary-1-1',
  metadata: {
    simulationSlug: 'client-server-request-flow',
  },
}

const clientServerArchitecture: Lesson = {
  id: 'lesson-1-2',
  moduleId: 'module-1-2',
  slug: 'requirements-and-constraints',
  number: 1,
  title: 'Client-Server Architecture',
  description:
    'Learn how clients and servers exchange requests and responses, how HTTP requests travel through an application, and how two-tier and three-tier designs distribute responsibilities.',
  estimatedMinutes: 45,
  order: 1,
  status: 'published',
  learningObjectives: [
    {
      id: 'objective-1-2-1',
      text: 'Define a client and identify at least two responsibilities it performs in a request.',
    },
    {
      id: 'objective-1-2-2',
      text: 'Define a server and identify at least two responsibilities it performs when handling a request.',
    },
    {
      id: 'objective-1-2-3',
      text: 'Describe client-server architecture by naming the separation of client and server responsibilities and the network boundary between them.',
    },
    {
      id: 'objective-1-2-4',
      text: 'Explain the request-response model by ordering the eight stages from user action to displayed result.',
    },
    {
      id: 'objective-1-2-5',
      text: 'Classify a listed action as a client responsibility or a server responsibility with a reason.',
    },
    {
      id: 'objective-1-2-6',
      text: 'Trace an HTTP product request through method, URL, headers, body, status code and client handling.',
    },
    {
      id: 'objective-1-2-7',
      text: 'Distinguish stateless communication from stateful communication using a concrete request example.',
    },
    {
      id: 'objective-1-2-8',
      text: 'Explain why separating presentation, application logic and data storage improves maintainability.',
    },
    {
      id: 'objective-1-2-9',
      text: 'Compare two-tier and three-tier architecture across responsibility distribution, database access and complexity.',
    },
    {
      id: 'objective-1-2-10',
      text: 'State one benefit and one limitation of adding an application tier to a product catalog.',
    },
    {
      id: 'objective-1-2-11',
      text: 'Follow a View Product request through browser, network, API, application logic, database and response, including one failure outcome.',
    },
    {
      id: 'objective-1-2-12',
      text: 'Identify a common client-server mistake and propose a better design reasoning for it.',
    },
  ],
  sectionIds: [
    'section-1-2-1',
    'section-1-2-2',
    'section-1-2-3',
    'section-1-2-4',
    'section-1-2-5',
    'section-1-2-6',
    'section-1-2-7',
    'section-1-2-8',
    'section-1-2-9',
    'section-1-2-10',
    'section-1-2-11',
    'section-1-2-12',
    'section-1-2-13',
  ],
  diagramIds: [
    'diagram-1-2-basic-client-server',
    'diagram-1-2-request-lifecycle',
    'diagram-1-2-two-tier',
    'diagram-1-2-three-tier',
  ],
  codeExampleIds: [
    'code-1-2-http-get-request',
    'code-1-2-csharp-api-endpoint',
    'code-1-2-fetch-client-request',
  ],
  comparisonIds: [
    'comparison-1-2-stateless-vs-stateful',
    'comparison-1-2-two-tier-vs-three-tier',
  ],
  quizId: 'quiz-1-2',
  practicalChallengeId: 'challenge-1-2',
  summaryId: 'summary-1-2',
  metadata: {
    simulationSlug: 'client-server-request-flow',
  },
}

const webFundamentals: Lesson = {
  id: 'lesson-1-3',
  moduleId: 'module-1-3',
  slug: 'core-building-blocks',
  number: 1,
  title: 'Web Fundamentals',
  description:
    'Follow a browser request from URL parsing and DNS resolution through TCP, TLS and HTTP to the server response, and understand the performance and security implications of each stage.',
  estimatedMinutes: 50,
  order: 1,
  status: 'published',
  learningObjectives: [
    {
      id: 'objective-1-3-1',
      text: 'Explain how a browser and a web server communicate using a request and a response.',
    },
    {
      id: 'objective-1-3-2',
      text: 'State the purpose of HTTP and identify it as a stateless, application-layer request-response protocol.',
    },
    {
      id: 'objective-1-3-3',
      text: 'Identify the request line, method, request target, HTTP version, headers and optional body in a sample HTTP request.',
    },
    {
      id: 'objective-1-3-4',
      text: 'Identify the status line, HTTP version, status code, headers and body in a sample HTTP response.',
    },
    {
      id: 'objective-1-3-5',
      text: 'Explain what HTTPS adds to HTTP and name the confidentiality, integrity and authentication benefits it provides.',
    },
    {
      id: 'objective-1-3-6',
      text: 'Explain what DNS does and why a domain name must be resolved before a connection can be made.',
    },
    {
      id: 'objective-1-3-7',
      text: 'Describe how a domain name is resolved through caches, a recursive resolver, root, TLD and authoritative servers, including the effect of caching.',
    },
    {
      id: 'objective-1-3-8',
      text: 'Explain the purpose of TLS and describe a high-level TLS handshake without relying on version-specific steps.',
    },
    {
      id: 'objective-1-3-9',
      text: 'Describe the TCP three-way handshake and state what a transport connection provides.',
    },
    {
      id: 'objective-1-3-10',
      text: 'Order the stages of a complete browser-to-server HTTPS request from URL entry to rendered response.',
    },
    {
      id: 'objective-1-3-11',
      text: 'Explain at least two performance implications of DNS lookup, connection setup, TLS negotiation and caching in a web request.',
    },
    {
      id: 'objective-1-3-12',
      text: 'Correct at least two common misconceptions about DNS, HTTPS, TCP or TLS with an accurate mental model.',
    },
  ],
  sectionIds: [
    'section-1-3-1',
    'section-1-3-2',
    'section-1-3-3',
    'section-1-3-4',
    'section-1-3-5',
    'section-1-3-6',
    'section-1-3-7',
    'section-1-3-8',
    'section-1-3-9',
    'section-1-3-10',
    'section-1-3-11',
    'section-1-3-12',
    'section-1-3-13',
    'section-1-3-14',
  ],
  diagramIds: [
    'diagram-1-3-url-anatomy',
    'diagram-1-3-dns-resolution',
    'diagram-1-3-tcp-handshake',
    'diagram-1-3-https-lifecycle',
  ],
  codeExampleIds: [
    'code-1-3-raw-http',
    'code-1-3-fetch-request',
    'code-1-3-aspnet-endpoint',
  ],
  comparisonIds: [
    'comparison-1-3-http-vs-https',
    'comparison-1-3-domain-vs-ip',
  ],
  quizId: 'quiz-1-3',
  practicalChallengeId: 'challenge-1-3',
  summaryId: 'summary-1-3',
}

const apis: Lesson = {
  id: 'lesson-1-4',
  moduleId: 'module-1-4',
  slug: 'trade-offs-and-design-decisions',
  number: 1,
  title: 'APIs',
  description:
    'Learn how components expose functionality through API contracts, and design predictable resource-oriented HTTP interfaces using methods, JSON, status codes and consistent error responses.',
  estimatedMinutes: 55,
  order: 1,
  status: 'published',
  learningObjectives: [
    {
      id: 'objective-1-4-1',
      text: 'Explain what an API is and give one reason applications expose APIs instead of direct implementation access.',
    },
    {
      id: 'objective-1-4-2',
      text: 'Describe the role of an API as the boundary between an API consumer and an API provider in client-server communication.',
    },
    {
      id: 'objective-1-4-3',
      text: 'Distinguish an API contract from its implementation, the user interface and the underlying database.',
    },
    {
      id: 'objective-1-4-4',
      text: 'List the elements of an API contract, including endpoint, method, parameters, headers, body, response structure, status codes and error behaviour.',
    },
    {
      id: 'objective-1-4-5',
      text: 'Describe a REST API using resources, identifiers, representations, stateless communication and a uniform interface.',
    },
    {
      id: 'objective-1-4-6',
      text: 'Match GET, POST, PUT, PATCH and DELETE to their intended semantics with a realistic product API example for each.',
    },
    {
      id: 'objective-1-4-7',
      text: 'Classify HTTP methods as safe or idempotent and explain why PUT, DELETE and PATCH differ in these properties.',
    },
    {
      id: 'objective-1-4-8',
      text: 'Interpret the five HTTP status-code categories and distinguish common 4xx responses from common 5xx responses.',
    },
    {
      id: 'objective-1-4-9',
      text: 'Explain how JSON represents objects, arrays and scalar values, and why a representation format is not itself an API.',
    },
    {
      id: 'objective-1-4-10',
      text: 'Design predictable resource-oriented endpoints for a product collection and individual product resources.',
    },
    {
      id: 'objective-1-4-11',
      text: 'Correct at least two common API design misconceptions with an accurate mental model.',
    },
    {
      id: 'objective-1-4-12',
      text: 'Explain why consistent contracts and backward-compatible changes matter when clients and servers deploy independently.',
    },
  ],
  sectionIds: [
    'section-1-4-1',
    'section-1-4-2',
    'section-1-4-3',
    'section-1-4-4',
    'section-1-4-5',
    'section-1-4-6',
    'section-1-4-7',
    'section-1-4-8',
    'section-1-4-9',
    'section-1-4-10',
    'section-1-4-11',
    'section-1-4-12',
    'section-1-4-13',
    'section-1-4-14',
  ],
  diagramIds: [
    'diagram-1-4-api-boundary',
    'diagram-1-4-request-anatomy',
    'diagram-1-4-rest-resource-model',
    'diagram-1-4-request-lifecycle',
  ],
  codeExampleIds: [
    'code-1-4-http-request-response',
    'code-1-4-fetch-product',
    'code-1-4-aspnet-product-endpoint',
  ],
  comparisonIds: [
    'comparison-1-4-put-vs-patch',
    'comparison-1-4-401-vs-403',
    'comparison-1-4-post-vs-put',
  ],
  quizId: 'quiz-1-4',
  practicalChallengeId: 'challenge-1-4',
  summaryId: 'summary-1-4',
}

const performanceBasics: Lesson = {
  id: 'lesson-1-5',
  moduleId: 'module-1-5',
  slug: 'sketching-your-first-design',
  number: 1,
  title: 'Performance Basics',
  description:
    'Reason about system performance with latency, throughput, bandwidth and response time, interpret percentiles, identify bottlenecks and make measurement-driven optimization decisions.',
  estimatedMinutes: 50,
  order: 1,
  status: 'published',
  learningObjectives: [
    {
      id: 'objective-1-5-1',
      text: 'Define latency and explain how added delay affects user experience with a concrete request example.',
    },
    {
      id: 'objective-1-5-2',
      text: 'Define throughput as completed work per unit of time and interpret requests per second as a capacity and workload measure.',
    },
    {
      id: 'objective-1-5-3',
      text: 'Distinguish bandwidth from achieved throughput using bits per second and a file-transfer example.',
    },
    {
      id: 'objective-1-5-4',
      text: 'Distinguish client-observed response time from server-side request duration and time to first byte by stating measurement boundaries.',
    },
    {
      id: 'objective-1-5-5',
      text: 'Explain how network travel, queueing and processing contribute to a complete request timeline.',
    },
    {
      id: 'objective-1-5-6',
      text: 'Explain why throughput can plateau while latency rises as a system approaches saturation.',
    },
    {
      id: 'objective-1-5-7',
      text: 'Explain why an average latency alone can hide slow requests for a significant group of users.',
    },
    {
      id: 'objective-1-5-8',
      text: 'Interpret p50, p90, p95 and p99 values for a stated observation window and request population.',
    },
    {
      id: 'objective-1-5-9',
      text: 'Identify likely bottlenecks such as CPU saturation, database load, I/O, connection limits and queue buildup from described symptoms.',
    },
    {
      id: 'objective-1-5-10',
      text: 'Distinguish load, stress, spike and endurance testing by the question each approach answers.',
    },
    {
      id: 'objective-1-5-11',
      text: 'Analyze a simple overload scenario using offered load, completed throughput, response time percentiles and resource utilization.',
    },
    {
      id: 'objective-1-5-12',
      text: 'Explain why performance optimization must be measurement-driven and describe a trade-off created by a proposed optimization.',
    },
  ],
  sectionIds: [
    'section-1-5-1',
    'section-1-5-2',
    'section-1-5-3',
    'section-1-5-4',
    'section-1-5-5',
    'section-1-5-6',
    'section-1-5-7',
    'section-1-5-8',
    'section-1-5-9',
    'section-1-5-10',
    'section-1-5-11',
    'section-1-5-12',
    'section-1-5-13',
    'section-1-5-14',
  ],
  diagramIds: [
    'diagram-1-5-request-timeline',
    'diagram-1-5-latency-throughput',
    'diagram-1-5-latency-percentiles',
    'diagram-1-5-bottleneck',
  ],
  codeExampleIds: [
    'code-1-5-client-response-time',
    'code-1-5-aspnet-request-duration',
    'code-1-5-throughput-calculation',
  ],
  comparisonIds: [
    'comparison-1-5-latency-vs-throughput',
    'comparison-1-5-bandwidth-vs-throughput',
    'comparison-1-5-average-vs-percentile',
  ],
  quizId: 'quiz-1-5',
  practicalChallengeId: 'challenge-1-5',
  summaryId: 'summary-1-5',
}

const architectureStyles: Lesson = {
  id: 'lesson-1-6',
  moduleId: 'module-1-6',
  slug: 'back-of-the-envelope-scale-estimation',
  number: 1,
  title: 'Architecture Styles',
  description:
    'Compare monolithic, layered and modular monolith architectures by boundaries, request flow, quality attributes and deployment scope, then choose a style from requirements and constraints.',
  estimatedMinutes: 55,
  order: 1,
  status: 'published',
  learningObjectives: [
    {
      id: 'objective-1-6-1',
      text: 'Define software architecture by naming components, responsibilities, relationships and boundaries in a described system.',
    },
    {
      id: 'objective-1-6-2',
      text: 'Distinguish architecture from application design, design patterns, frameworks and programming languages using concrete examples.',
    },
    {
      id: 'objective-1-6-3',
      text: 'Describe a monolithic application as one deployable unit with shared runtime resources and multiple internal capabilities.',
    },
    {
      id: 'objective-1-6-4',
      text: 'Explain two advantages and two challenges of monolithic architecture without treating them as universal properties.',
    },
    {
      id: 'objective-1-6-5',
      text: 'Explain how layered architecture separates presentation, business and data-access responsibilities.',
    },
    {
      id: 'objective-1-6-6',
      text: 'State the responsibilities of the presentation, business logic and data-access layers for a product-details request.',
    },
    {
      id: 'objective-1-6-7',
      text: 'Trace the dependency and return direction between layers and explain why incorrect dependency direction weakens a design.',
    },
    {
      id: 'objective-1-6-8',
      text: 'Describe a modular monolith as one deployable application with strong internal boundaries and controlled module interfaces.',
    },
    {
      id: 'objective-1-6-9',
      text: 'Distinguish a modular monolith from a tightly coupled monolith by comparing encapsulation, ownership and dependency discipline.',
    },
    {
      id: 'objective-1-6-10',
      text: 'Compare monolithic, layered and modular monolith approaches using deployment, boundaries, testing, maintainability and complexity.',
    },
    {
      id: 'objective-1-6-11',
      text: 'Select a defensible architecture for a stated business scenario by relating requirements and constraints to trade-offs.',
    },
    {
      id: 'objective-1-6-12',
      text: 'Explain when added architectural complexity is justified and when a simpler structure better satisfies current requirements.',
    },
  ],
  sectionIds: [
    'section-1-6-1',
    'section-1-6-2',
    'section-1-6-3',
    'section-1-6-4',
    'section-1-6-5',
    'section-1-6-6',
    'section-1-6-7',
    'section-1-6-8',
    'section-1-6-9',
    'section-1-6-10',
    'section-1-6-11',
    'section-1-6-12',
    'section-1-6-13',
    'section-1-6-14',
    'section-1-6-15',
    'section-1-6-16',
  ],
  diagramIds: [
    'diagram-1-6-monolith',
    'diagram-1-6-layered-architecture',
    'diagram-1-6-modular-monolith',
    'diagram-1-6-monolith-vs-modular',
    'diagram-1-6-layered-request-flow',
  ],
  codeExampleIds: [
    'code-1-6-monolith-structure',
    'code-1-6-layered-flow',
    'code-1-6-module-boundaries',
  ],
  comparisonIds: [
    'comparison-1-6-monolith-vs-modular-monolith',
    'comparison-1-6-layered-vs-modular-architecture',
    'comparison-1-6-monolith-vs-microservices',
  ],
  quizId: 'quiz-1-6',
  practicalChallengeId: 'challenge-1-6',
  summaryId: 'summary-1-6',
}

const networkFoundations: Lesson = {
  id: 'lesson-2-1',
  moduleId: 'module-2-1',
  slug: 'the-request-lifecycle',
  number: 1,
  title: 'Network Foundations',
  description:
    'Build a practical mental model of networks, IP addresses, IPv4 and IPv6, public and private addressing, ports, TCP, UDP and sockets, and apply it to browser, backend and distributed-service communication.',
  estimatedMinutes: 55,
  order: 1,
  status: 'published',
  learningObjectives: [
    {
      id: 'objective-2-1-1',
      text: 'Explain what a computer network is and why applications on separate devices need networking to exchange data.',
    },
    {
      id: 'objective-2-1-2',
      text: 'Explain the role of an IP address in identifying a network interface or endpoint context and in guiding packets toward a destination.',
    },
    {
      id: 'objective-2-1-3',
      text: 'Distinguish IPv4 from IPv6 by address size, representation, address space and deployment considerations.',
    },
    {
      id: 'objective-2-1-4',
      text: 'Distinguish public IP addresses from private IPv4 addresses and explain the high-level role of NAT in sharing one public address.',
    },
    {
      id: 'objective-2-1-5',
      text: 'Explain how a port number identifies an application endpoint on a host and why an IP address alone is insufficient.',
    },
    {
      id: 'objective-2-1-6',
      text: 'Distinguish an IP address from a port number by naming what each identifies in a source or destination endpoint.',
    },
    {
      id: 'objective-2-1-7',
      text: 'Explain how IP address, transport protocol and port work together to identify a network application endpoint and a TCP flow.',
    },
    {
      id: 'objective-2-1-8',
      text: 'Describe TCP as a connection-oriented, reliable ordered byte-stream service and name two guarantees it provides.',
    },
    {
      id: 'objective-2-1-9',
      text: 'Walk through the TCP three-way handshake and explain how SYN, SYN-ACK and ACK establish connection state.',
    },
    {
      id: 'objective-2-1-10',
      text: 'Describe UDP as a connectionless datagram service and explain which guarantees it does not provide by itself.',
    },
    {
      id: 'objective-2-1-11',
      text: 'Compare TCP and UDP using file transfer, real-time media, DNS and QUIC scenarios, including application-level responsibilities.',
    },
    {
      id: 'objective-2-1-12',
      text: 'Explain how sockets let applications bind addresses and ports, listen, accept connections and send or receive transport data.',
    },
  ],
  sectionIds: [
    'section-2-1-1',
    'section-2-1-2',
    'section-2-1-3',
    'section-2-1-4',
    'section-2-1-5',
    'section-2-1-6',
    'section-2-1-7',
    'section-2-1-8',
    'section-2-1-9',
    'section-2-1-10',
    'section-2-1-11',
    'section-2-1-12',
    'section-2-1-13',
    'section-2-1-14',
    'section-2-1-15',
    'section-2-1-16',
  ],
  diagramIds: [
    'diagram-2-1-basic-network',
    'diagram-2-1-ip-and-port',
    'diagram-2-1-tcp-handshake',
    'diagram-2-1-tcp-vs-udp',
    'diagram-2-1-end-to-end-flow',
  ],
  codeExampleIds: [
    'code-2-1-inspect-endpoint',
    'code-2-1-tcp-listener',
    'code-2-1-udp-datagram',
  ],
  comparisonIds: [
    'comparison-2-1-ipv4-vs-ipv6',
    'comparison-2-1-public-vs-private-ip',
    'comparison-2-1-tcp-vs-udp',
  ],
  quizId: 'quiz-2-1',
  practicalChallengeId: 'challenge-2-1',
  summaryId: 'summary-2-1',
}

const httpDeepDive: Lesson = {
  id: 'lesson-2-2',
  moduleId: 'module-2-2',
  slug: 'tcp-http-and-tls-fundamentals',
  number: 1,
  title: 'HTTP Deep Dive',
  description:
    'Follow HTTP from text-based HTTP/1.1 messages through binary HTTP/2 streams and QUIC-based HTTP/3, and learn how headers, compression, connection reuse and protocol negotiation shape real system design.',
  estimatedMinutes: 60,
  order: 1,
  status: 'published',
  learningObjectives: [
    {
      id: 'objective-2-2-1',
      text: 'Explain HTTP as a stateless application-layer request-response protocol and separate its message semantics from the transport that carries it.',
    },
    {
      id: 'objective-2-2-2',
      text: 'Identify the method, request target, protocol version, headers and optional body in a request, and the status line, headers and body in a response.',
    },
    {
      id: 'objective-2-2-3',
      text: 'Describe the defining characteristics of HTTP/1.1, including text messages, the Host header and persistent connections, and explain its historical importance.',
    },
    {
      id: 'objective-2-2-4',
      text: 'Explain how persistent connections reuse one TCP connection for multiple exchanges and identify when a connection is closed.',
    },
    {
      id: 'objective-2-2-5',
      text: 'Explain what HTTP Keep-Alive controls, what overhead connection reuse removes and why it does not make requests concurrent on one HTTP/1.1 connection.',
    },
    {
      id: 'objective-2-2-6',
      text: 'Distinguish HTTP persistent connections from TCP keepalive probes by layer, purpose, mechanism and configuration.',
    },
    {
      id: 'objective-2-2-7',
      text: 'Explain HTTP/2 binary framing, streams, stream IDs and multiplexing, and describe how multiple exchanges share one connection.',
    },
    {
      id: 'objective-2-2-8',
      text: 'Describe how HPACK compresses HTTP/2 headers conceptually using static and dynamic tables, and distinguish it from response-body compression.',
    },
    {
      id: 'objective-2-2-9',
      text: 'Explain why packet loss on the underlying TCP connection can still delay unrelated HTTP/2 streams and identify this as transport-level head-of-line blocking.',
    },
    {
      id: 'objective-2-2-10',
      text: 'Describe how HTTP/3 uses QUIC over UDP with independent streams, integrated TLS 1.3 and connection migration without claiming UDP is inherently faster.',
    },
    {
      id: 'objective-2-2-11',
      text: 'Compare HTTP/1.1, HTTP/2 and HTTP/3 using technical trade-offs in framing, transport, multiplexing, header compression, loss behavior and deployment.',
    },
    {
      id: 'objective-2-2-12',
      text: 'Explain how protocol negotiation, connection behavior and infrastructure compatibility affect browser, API, CDN and load-balancer design decisions.',
    },
  ],
  sectionIds: [
    'section-2-2-1',
    'section-2-2-2',
    'section-2-2-3',
    'section-2-2-4',
    'section-2-2-5',
    'section-2-2-6',
    'section-2-2-7',
    'section-2-2-8',
    'section-2-2-9',
    'section-2-2-10',
    'section-2-2-11',
    'section-2-2-12',
    'section-2-2-13',
    'section-2-2-14',
    'section-2-2-15',
  ],
  diagramIds: [
    'diagram-2-2-http11-request-flow',
    'diagram-2-2-http2-multiplexing',
    'diagram-2-2-http3-quic-streams',
    'diagram-2-2-keepalive-lifecycle',
    'diagram-2-2-version-comparison',
  ],
  codeExampleIds: [
    'code-2-2-curl-versions',
    'code-2-2-headers-example',
    'code-2-2-aspnet-response-headers',
  ],
  comparisonIds: [
    'comparison-2-2-http11-vs-http2',
    'comparison-2-2-http2-vs-http3',
    'comparison-2-2-persistent-vs-tcp-keepalive',
  ],
  quizId: 'quiz-2-2',
  practicalChallengeId: 'challenge-2-2',
  summaryId: 'summary-2-2',
}

const communicationPatterns: Lesson = {
  id: 'lesson-2-3',
  moduleId: 'module-2-3',
  slug: 'routing-and-the-public-internet',
  number: 1,
  title: 'Communication Patterns',
  description:
    'Compare synchronous request-response and asynchronous deferred processing, learn how queues and status APIs fit into hybrid workflows, and choose communication patterns using latency, coupling, reliability and failure trade-offs.',
  estimatedMinutes: 60,
  order: 1,
  status: 'published',
  learningObjectives: [
    {
      id: 'objective-2-3-1',
      text: 'Define a communication pattern in software architecture and explain why component interactions shape coupling, latency and reliability.',
    },
    {
      id: 'objective-2-3-2',
      text: 'Describe synchronous request-response communication and identify the caller, receiver, request, response and control flow in a realistic API example.',
    },
    {
      id: 'objective-2-3-3',
      text: 'Explain why a synchronous caller waits for a response and why waiting does not require a single-threaded server.',
    },
    {
      id: 'objective-2-3-4',
      text: 'Describe asynchronous communication as deferred processing in which work acceptance and final completion can happen at different times.',
    },
    {
      id: 'objective-2-3-5',
      text: 'Distinguish asynchronous execution inside one process from asynchronous communication between independent components.',
    },
    {
      id: 'objective-2-3-6',
      text: 'Explain the roles of producer, message, consumer, broker, acknowledgment and status observation in an asynchronous workflow.',
    },
    {
      id: 'objective-2-3-7',
      text: 'Compare synchronous and asynchronous patterns using latency, throughput, coupling, failure propagation, consistency and complexity.',
    },
    {
      id: 'objective-2-3-8',
      text: 'Identify synchronous failure scenarios such as timeouts, downstream outages and cascading failures across dependent calls.',
    },
    {
      id: 'objective-2-3-9',
      text: 'Explain eventual completion and describe how a client can observe status after asynchronous acceptance.',
    },
    {
      id: 'objective-2-3-10',
      text: 'Identify complexity introduced by asynchronous processing, including duplication, retries, ordering, poison messages and observability.',
    },
    {
      id: 'objective-2-3-11',
      text: 'Select a synchronous, asynchronous or hybrid pattern for a business requirement and justify the choice with explicit trade-offs.',
    },
    {
      id: 'objective-2-3-12',
      text: 'Explain how communication patterns affect reliability and scalability under workload growth and partial failures.',
    },
  ],
  sectionIds: [
    'section-2-3-1',
    'section-2-3-2',
    'section-2-3-3',
    'section-2-3-4',
    'section-2-3-5',
    'section-2-3-6',
    'section-2-3-7',
    'section-2-3-8',
    'section-2-3-9',
    'section-2-3-10',
    'section-2-3-11',
    'section-2-3-12',
    'section-2-3-13',
    'section-2-3-14',
    'section-2-3-15',
    'section-2-3-16',
  ],
  diagramIds: [
    'diagram-2-3-sync-request-response',
    'diagram-2-3-async-queue',
    'diagram-2-3-sync-critical-path',
    'diagram-2-3-hybrid-order-workflow',
    'diagram-2-3-pattern-decision-flow',
  ],
  codeExampleIds: [
    'code-2-3-sync-service-call',
    'code-2-3-accepted-background-job',
    'code-2-3-awaited-vs-deferred-work',
  ],
  comparisonIds: [
    'comparison-2-3-sync-vs-async',
    'comparison-2-3-request-response-vs-fire-and-forget',
    'comparison-2-3-sync-async-hybrid',
  ],
  quizId: 'quiz-2-3',
  practicalChallengeId: 'challenge-2-3',
  summaryId: 'summary-2-3',
}

const apiCommunication: Lesson = {
  id: 'lesson-2-4',
  moduleId: 'module-2-4',
  slug: 'latency-bandwidth-and-failure-modes',
  number: 1,
  title: 'API Communication',
  description:
    'Compare REST resource APIs, GraphQL typed queries and gRPC service contracts, and choose an API style from client needs, compatibility, performance, streaming and operational constraints.',
  estimatedMinutes: 65,
  order: 1,
  status: 'published',
  learningObjectives: [
    {
      id: 'objective-2-4-1',
      text: 'Explain how APIs mediate communication between software components and how API contracts shape system architecture.',
    },
    {
      id: 'objective-2-4-2',
      text: 'Describe REST as an architectural style using resources, identifiers, representations, statelessness and a uniform interface.',
    },
    {
      id: 'objective-2-4-3',
      text: 'Explain how HTTP methods, status codes and representations express REST resource operations with realistic endpoints.',
    },
    {
      id: 'objective-2-4-4',
      text: 'Identify REST benefits and limitations, including over-fetching, under-fetching, round trips and contract evolution.',
    },
    {
      id: 'objective-2-4-5',
      text: 'Explain GraphQL schema-driven contracts, object and scalar types, queries, mutations, arguments and resolvers.',
    },
    {
      id: 'objective-2-4-6',
      text: 'Describe how GraphQL clients select specific fields and why field selection does not automatically improve backend performance.',
    },
    {
      id: 'objective-2-4-7',
      text: 'Identify GraphQL benefits and operational challenges, including N+1 resolvers, query complexity, authorization, caching and schema evolution.',
    },
    {
      id: 'objective-2-4-8',
      text: 'Explain gRPC service definitions, Protocol Buffers messages, binary serialization and generated client/server contracts.',
    },
    {
      id: 'objective-2-4-9',
      text: 'Distinguish unary, server-streaming, client-streaming and bidirectional-streaming RPCs with realistic use cases.',
    },
    {
      id: 'objective-2-4-10',
      text: 'Compare REST, GraphQL and gRPC across API model, serialization, transport, caching, browser support, streaming and complexity.',
    },
    {
      id: 'objective-2-4-11',
      text: 'Select an appropriate API communication style for a scenario and defend the choice with explicit trade-offs.',
    },
    {
      id: 'objective-2-4-12',
      text: 'Explain how security, team skills, operational maturity and measurements influence API architecture decisions.',
    },
  ],
  sectionIds: [
    'section-2-4-1',
    'section-2-4-2',
    'section-2-4-3',
    'section-2-4-4',
    'section-2-4-5',
    'section-2-4-6',
    'section-2-4-7',
    'section-2-4-8',
    'section-2-4-9',
    'section-2-4-10',
    'section-2-4-11',
    'section-2-4-12',
    'section-2-4-13',
    'section-2-4-14',
    'section-2-4-15',
    'section-2-4-16',
  ],
  diagramIds: [
    'diagram-2-4-rest-resource-communication',
    'diagram-2-4-graphql-query-execution',
    'diagram-2-4-grpc-service-communication',
    'diagram-2-4-grpc-streaming-types',
    'diagram-2-4-multi-style-architecture',
  ],
  codeExampleIds: [
    'code-2-4-rest-product-endpoint',
    'code-2-4-graphql-schema-query',
    'code-2-4-grpc-service-contract',
  ],
  comparisonIds: [
    'comparison-2-4-rest-vs-graphql',
    'comparison-2-4-rest-vs-grpc',
    'comparison-2-4-graphql-vs-grpc',
  ],
  quizId: 'quiz-2-4',
  practicalChallengeId: 'challenge-2-4',
  summaryId: 'summary-2-4',
}

const realTimeCommunication: Lesson = {
  id: 'lesson-2-5',
  moduleId: 'module-2-5',
  slug: 'choosing-the-right-protocol',
  number: 1,
  title: 'Real-Time Communication',
  description:
    'Compare long polling, WebSockets and Server-Sent Events, understand persistent connections and failure handling, and choose a real-time approach from communication direction, lifecycle, scale and operational constraints.',
  estimatedMinutes: 70,
  order: 1,
  status: 'published',
  learningObjectives: [
    {
      id: 'objective-2-5-1',
      text: 'Explain why request-response communication forces clients to ask repeatedly and why some applications need updates without a new user action.',
    },
    {
      id: 'objective-2-5-2',
      text: 'Describe regular polling with a timeline and explain the trade-off between polling frequency, discovery delay and request overhead.',
    },
    {
      id: 'objective-2-5-3',
      text: 'Explain the five-step long polling lifecycle and distinguish it from regular polling and a permanent full-duplex connection.',
    },
    {
      id: 'objective-2-5-4',
      text: 'Describe the HTTP/1.1 WebSocket opening handshake, including Upgrade, Connection, Sec-WebSocket-Key and the 101 Switching Protocols response.',
    },
    {
      id: 'objective-2-5-5',
      text: 'Explain bidirectional message-based communication over a persistent WebSocket connection and recognise that HTTP/2 and HTTP/3 bootstrap WebSockets differently.',
    },
    {
      id: 'objective-2-5-6',
      text: 'Describe Server-Sent Events as a one-way server-to-client text stream using EventSource and text/event-stream.',
    },
    {
      id: 'objective-2-5-7',
      text: 'Interpret an SSE event stream using id, event, data, retry and blank-line separators, and explain why reconnection does not guarantee replay.',
    },
    {
      id: 'objective-2-5-8',
      text: 'Compare WebSockets, SSE and Long Polling across communication direction, connection lifecycle, reconnection, overhead and scaling.',
    },
    {
      id: 'objective-2-5-9',
      text: 'Explain heartbeats, ping/pong control frames, exponential backoff, sequence IDs and why reconnecting does not automatically recover missed messages.',
    },
    {
      id: 'objective-2-5-10',
      text: 'Identify scaling concerns for persistent connections, including connection count, memory, file descriptors, load balancers, sticky sessions, pub/sub fan-out and slow consumers.',
    },
    {
      id: 'objective-2-5-11',
      text: 'Select WebSockets, SSE, Long Polling or regular polling for a scenario and justify the choice from direction, immediacy and constraints.',
    },
    {
      id: 'objective-2-5-12',
      text: 'Identify security and operational considerations, including TLS, authentication, per-message authorization, origin validation, rate limits, monitoring and graceful shutdown.',
    },
  ],
  sectionIds: [
    'section-2-5-1',
    'section-2-5-2',
    'section-2-5-3',
    'section-2-5-4',
    'section-2-5-5',
    'section-2-5-6',
    'section-2-5-7',
    'section-2-5-8',
    'section-2-5-9',
    'section-2-5-10',
    'section-2-5-11',
    'section-2-5-12',
    'section-2-5-13',
    'section-2-5-14',
    'section-2-5-15',
    'section-2-5-16',
  ],
  diagramIds: [
    'diagram-2-5-polling-vs-long-polling',
    'diagram-2-5-websocket-handshake-and-full-duplex',
    'diagram-2-5-sse-event-stream',
    'diagram-2-5-websocket-horizontal-scaling',
    'diagram-2-5-realtime-decision-flow',
  ],
  codeExampleIds: [
    'code-2-5-browser-websocket-client',
    'code-2-5-eventsource-client',
    'code-2-5-aspnetcore-sse-endpoint',
  ],
  comparisonIds: [
    'comparison-2-5-websockets-vs-sse',
    'comparison-2-5-sse-vs-long-polling',
    'comparison-2-5-websockets-vs-long-polling',
  ],
  quizId: 'quiz-2-5',
  practicalChallengeId: 'challenge-2-5',
  summaryId: 'summary-2-5',
}

const loadBalancing: Lesson = {
  id: 'lesson-2-6',
  moduleId: 'module-2-6',
  slug: 'dns-and-name-resolution',
  number: 1,
  title: 'Load Balancing',
  description:
    'Explain how load balancers distribute traffic across application instances, compare Layer 4 and Layer 7 decisions, evaluate distribution algorithms and design health checks and high availability for changing backend capacity.',
  estimatedMinutes: 75,
  order: 1,
  status: 'published',
  learningObjectives: [
    {
      id: 'objective-2-6-1',
      text: 'Explain why load balancing is needed in distributed applications and why adding servers alone does not distribute traffic.',
    },
    {
      id: 'objective-2-6-2',
      text: 'Describe the request flow through a load balancer, distinguishing the client-to-load-balancer connection from load-balancer-to-backend connections.',
    },
    {
      id: 'objective-2-6-3',
      text: 'Distinguish Layer 4 transport forwarding from Layer 7 application-aware routing using protocol awareness and TLS behaviour.',
    },
    {
      id: 'objective-2-6-4',
      text: 'Explain how Round Robin selects backends sequentially and why equal request counts do not imply equal workload.',
    },
    {
      id: 'objective-2-6-5',
      text: 'Explain how Weighted Round Robin expresses different backend capacities and when weights are useful.',
    },
    {
      id: 'objective-2-6-6',
      text: 'Explain how Least Connections selects a backend with the fewest active connections and identify its limitations as a load proxy.',
    },
    {
      id: 'objective-2-6-7',
      text: 'Describe IP hashing and session affinity, including uneven distribution, NAT effects and remapping when a backend is removed.',
    },
    {
      id: 'objective-2-6-8',
      text: 'Explain active health checks, health endpoints, intervals, timeouts, failure thresholds and recovery thresholds.',
    },
    {
      id: 'objective-2-6-9',
      text: 'Distinguish active health checks from passive health monitoring and describe what each can detect.',
    },
    {
      id: 'objective-2-6-10',
      text: 'Describe the lifecycle of an unhealthy backend and explain how removal can overload the remaining pool.',
    },
    {
      id: 'objective-2-6-11',
      text: 'Identify load balancer availability risks, redundancy options, failover, capacity planning and connection draining.',
    },
    {
      id: 'objective-2-6-12',
      text: 'Select a load-balancing layer, algorithm and health-check strategy for a workload and justify the trade-offs.',
    },
  ],
  sectionIds: [
    'section-2-6-1',
    'section-2-6-2',
    'section-2-6-3',
    'section-2-6-4',
    'section-2-6-5',
    'section-2-6-6',
    'section-2-6-7',
    'section-2-6-8',
    'section-2-6-9',
    'section-2-6-10',
    'section-2-6-11',
    'section-2-6-12',
    'section-2-6-13',
    'section-2-6-14',
    'section-2-6-15',
    'section-2-6-16',
  ],
  diagramIds: [
    'diagram-2-6-basic-load-balancing-architecture',
    'diagram-2-6-l4-vs-l7-routing',
    'diagram-2-6-algorithm-comparison',
    'diagram-2-6-health-check-recovery',
    'diagram-2-6-high-availability-architecture',
  ],
  codeExampleIds: [
    'code-2-6-round-robin-rotation',
    'code-2-6-weighted-round-robin',
    'code-2-6-aspnetcore-health-checks',
  ],
  comparisonIds: [
    'comparison-2-6-l4-vs-l7',
    'comparison-2-6-algorithms',
    'comparison-2-6-active-vs-passive-health-checks',
  ],
  quizId: 'quiz-2-6',
  practicalChallengeId: 'challenge-2-6',
  summaryId: 'summary-2-6',
}

const reverseProxy: Lesson = {
  id: 'lesson-2-7',
  moduleId: 'module-2-7',
  slug: 'streaming-and-long-lived-connections',
  number: 1,
  title: 'Reverse Proxy',
  description:
    'Explain forward and reverse proxies, follow a request through an Nginx-style reverse proxy, compare TLS termination with passthrough, and distinguish reverse proxies from API gateways when designing a production entry point.',
  estimatedMinutes: 80,
  order: 1,
  status: 'published',
  learningObjectives: [
    {
      id: 'objective-2-7-1',
      text: 'Explain what a proxy server is and how an intermediary changes request and response flow.',
    },
    {
      id: 'objective-2-7-2',
      text: 'Distinguish forward proxies from reverse proxies by who configures them and whose side they represent.',
    },
    {
      id: 'objective-2-7-3',
      text: 'Trace an incoming request through DNS, a reverse proxy, routing rules, an upstream backend and the response path.',
    },
    {
      id: 'objective-2-7-4',
      text: 'Compare TLS termination with TLS passthrough and state the security and visibility consequences of each.',
    },
    {
      id: 'objective-2-7-5',
      text: 'Describe how Nginx uses listeners, server blocks, location matching, proxy_pass and upstream groups to forward requests.',
    },
    {
      id: 'objective-2-7-6',
      text: 'Explain why original host, scheme and client IP information can be lost and how forwarded headers preserve it.',
    },
    {
      id: 'objective-2-7-7',
      text: 'Apply trust boundaries to forwarded headers so arbitrary clients cannot spoof client identity or scheme.',
    },
    {
      id: 'objective-2-7-8',
      text: 'Explain how path and host routing select backend pools without repeating detailed load-balancing algorithms.',
    },
    {
      id: 'objective-2-7-9',
      text: 'Distinguish a basic reverse proxy from an API gateway by responsibilities rather than product names.',
    },
    {
      id: 'objective-2-7-10',
      text: 'Identify common API gateway responsibilities such as policy enforcement, rate limiting, transformation and observability.',
    },
    {
      id: 'objective-2-7-11',
      text: 'Evaluate security, performance and availability considerations when placing a proxy in the request path.',
    },
    {
      id: 'objective-2-7-12',
      text: 'Design and justify a basic proxy architecture for a production web application with explicit assumptions and alternatives.',
    },
  ],
  sectionIds: [
    'section-2-7-1',
    'section-2-7-2',
    'section-2-7-3',
    'section-2-7-4',
    'section-2-7-5',
    'section-2-7-6',
    'section-2-7-7',
    'section-2-7-8',
    'section-2-7-9',
    'section-2-7-10',
    'section-2-7-11',
    'section-2-7-12',
    'section-2-7-13',
    'section-2-7-14',
    'section-2-7-15',
    'section-2-7-16',
  ],
  diagramIds: [
    'diagram-2-7-forward-vs-reverse-proxy',
    'diagram-2-7-reverse-proxy-request-lifecycle',
    'diagram-2-7-tls-termination-vs-passthrough',
    'diagram-2-7-api-gateway-vs-reverse-proxy',
    'diagram-2-7-production-request-path',
  ],
  codeExampleIds: [
    'code-2-7-nginx-reverse-proxy',
    'code-2-7-aspnetcore-forwarded-headers',
    'code-2-7-yarp-route-concept',
  ],
  comparisonIds: [
    'comparison-2-7-forward-vs-reverse-proxy',
    'comparison-2-7-reverse-proxy-vs-api-gateway',
    'comparison-2-7-tls-termination-vs-passthrough',
  ],
  quizId: 'quiz-2-7',
  practicalChallengeId: 'challenge-2-7',
  summaryId: 'summary-2-7',
}

const databaseFundamentals: Lesson = {
  id: 'lesson-3-1',
  moduleId: 'module-3-1',
  slug: 'relational-vs-nosql-models',
  number: 1,
  title: 'Database Fundamentals',
  description:
    'Explain how databases persist and organize application data, distinguish relational tables, keys and relationships from major non-relational models, and choose a storage approach from data shape, access patterns, consistency and scalability requirements.',
  estimatedMinutes: 80,
  order: 1,
  status: 'published',
  learningObjectives: [
    {
      id: 'objective-3-1-1',
      text: 'Explain what a database is and why applications need persistent data storage beyond temporary application memory.',
    },
    {
      id: 'objective-3-1-2',
      text: 'Distinguish a database, a database management system and a data model using a concrete application example.',
    },
    {
      id: 'objective-3-1-3',
      text: 'Describe the relational model by naming tables, rows, columns, schemas and data types in an e-commerce example.',
    },
    {
      id: 'objective-3-1-4',
      text: 'Identify primary keys, candidate keys, natural keys, surrogate keys and foreign keys, and explain the role of each.',
    },
    {
      id: 'objective-3-1-5',
      text: 'Explain one-to-one, one-to-many and many-to-many relationships, including how a junction table represents the last one.',
    },
    {
      id: 'objective-3-1-6',
      text: 'Describe non-relational databases as a diverse family with flexible or model-specific structures and access patterns.',
    },
    {
      id: 'objective-3-1-7',
      text: 'Identify document, key-value, wide-column and graph databases and state how each represents and queries data.',
    },
    {
      id: 'objective-3-1-8',
      text: 'Compare structured, semi-structured and flexible data representations without equating flexibility with absence of design.',
    },
    {
      id: 'objective-3-1-9',
      text: 'Explain how access patterns, relationships, transactions and consistency expectations influence database selection.',
    },
    {
      id: 'objective-3-1-10',
      text: 'State one strength and one trade-off for relational and non-relational approaches without absolute performance claims.',
    },
    {
      id: 'objective-3-1-11',
      text: 'Evaluate a database choice for a scenario by considering data shape, query requirements, consistency, scaling and operations.',
    },
    {
      id: 'objective-3-1-12',
      text: 'Justify an initial database architecture for an application and name a defensible alternative with its trade-offs.',
    },
  ],
  sectionIds: [
    'section-3-1-1',
    'section-3-1-2',
    'section-3-1-3',
    'section-3-1-4',
    'section-3-1-5',
    'section-3-1-6',
    'section-3-1-7',
    'section-3-1-8',
    'section-3-1-9',
    'section-3-1-10',
    'section-3-1-11',
    'section-3-1-12',
    'section-3-1-13',
    'section-3-1-14',
    'section-3-1-15',
    'section-3-1-16',
  ],
  diagramIds: [
    'diagram-3-1-database-management-fundamentals',
    'diagram-3-1-relational-database-structure',
    'diagram-3-1-relational-vs-document-models',
    'diagram-3-1-major-non-relational-models',
    'diagram-3-1-database-selection-decision-flow',
  ],
  codeExampleIds: [
    'code-3-1-relational-tables-and-keys',
    'code-3-1-querying-related-data',
    'code-3-1-document-product-representation',
  ],
  comparisonIds: [
    'comparison-3-1-relational-vs-non-relational',
    'comparison-3-1-structured-vs-semi-structured',
    'comparison-3-1-relational-vs-document',
  ],
  quizId: 'quiz-3-1',
  practicalChallengeId: 'challenge-3-1',
  summaryId: 'summary-3-1',
}

const sqlDatabases: Lesson = {
  id: 'lesson-3-2',
  moduleId: 'module-3-2',
  slug: 'schema-design-for-access-patterns',
  number: 1,
  title: 'SQL Databases',
  description:
    'Design relational schemas with appropriate tables, data types, keys, relationships and constraints, then use functional dependencies and normalization to reduce redundancy while understanding deliberate denormalization trade-offs.',
  estimatedMinutes: 90,
  order: 1,
  status: 'published',
  learningObjectives: [
    {
      id: 'objective-3-2-1',
      text: 'Explain how relational database tables represent entities and their attributes.',
    },
    {
      id: 'objective-3-2-2',
      text: 'Design tables with appropriate columns and SQL Server-compatible data types for a stated business requirement.',
    },
    {
      id: 'objective-3-2-3',
      text: 'Identify candidate keys and select a stable primary key while distinguishing natural, surrogate and composite keys.',
    },
    {
      id: 'objective-3-2-4',
      text: 'Explain foreign keys and referential integrity, including the roles of referenced parent and referencing child records.',
    },
    {
      id: 'objective-3-2-5',
      text: 'Model one-to-one, one-to-many and many-to-many relationships with correct foreign key or junction table placement.',
    },
    {
      id: 'objective-3-2-6',
      text: 'Select appropriate constraints, including NOT NULL, UNIQUE, CHECK, DEFAULT and foreign keys, to protect important domain invariants.',
    },
    {
      id: 'objective-3-2-7',
      text: 'Explain the behavior of NOT NULL, UNIQUE, CHECK, DEFAULT and foreign key constraints using realistic SQL Server examples.',
    },
    {
      id: 'objective-3-2-8',
      text: 'Identify data redundancy and explain how accidental duplication can produce inconsistent information.',
    },
    {
      id: 'objective-3-2-9',
      text: 'Describe insertion, update and deletion anomalies using one poorly designed relational table.',
    },
    {
      id: 'objective-3-2-10',
      text: 'Explain the purpose of First, Second and Third Normal Forms and the kind of dependency each form addresses.',
    },
    {
      id: 'objective-3-2-11',
      text: 'Normalize a simple relational schema by identifying functional dependencies and decomposing tables into 1NF, 2NF and 3NF.',
    },
    {
      id: 'objective-3-2-12',
      text: 'Evaluate normalization and denormalization trade-offs using data integrity, access patterns and operational complexity.',
    },
  ],
  sectionIds: [
    'section-3-2-1',
    'section-3-2-2',
    'section-3-2-3',
    'section-3-2-4',
    'section-3-2-5',
    'section-3-2-6',
    'section-3-2-7',
    'section-3-2-8',
    'section-3-2-9',
    'section-3-2-10',
    'section-3-2-11',
    'section-3-2-12',
    'section-3-2-13',
    'section-3-2-14',
    'section-3-2-15',
    'section-3-2-16',
  ],
  diagramIds: [
    'diagram-3-2-relational-building-blocks',
    'diagram-3-2-relationship-types',
    'diagram-3-2-constraints-referential-integrity',
    'diagram-3-2-normalization-before-after',
    'diagram-3-2-1nf-2nf-3nf-progression',
  ],
  codeExampleIds: [
    'code-3-2-creating-tables-and-relationships',
    'code-3-2-many-to-many-and-referential-integrity',
    'code-3-2-normalization-in-practice',
  ],
  comparisonIds: [
    'comparison-3-2-primary-key-vs-foreign-key',
    'comparison-3-2-1nf-vs-2nf-vs-3nf',
    'comparison-3-2-normalization-vs-denormalization',
  ],
  quizId: 'quiz-3-2',
  practicalChallengeId: 'challenge-3-2',
  summaryId: 'summary-3-2',
}

/** One lesson per approved module topic; Domain 01 through 1.6, Domain 02 through 2.7 and Domain 03 through 3.2 have content. */
export const lessons: Lesson[] = [
  whatIsSystemDesign,
  clientServerArchitecture,
  webFundamentals,
  apis,
  performanceBasics,
  architectureStyles,
  networkFoundations,
  httpDeepDive,
  communicationPatterns,
  apiCommunication,
  realTimeCommunication,
  loadBalancing,
  reverseProxy,
  databaseFundamentals,
  sqlDatabases,

  // Domain 01 — System Design Fundamentals

  plannedLesson('module-1-7', 'reviewing-and-iterating-on-designs', 'Reviewing and Iterating on Designs', 'Check a sketch against requirements, expose weak points and improve it deliberately.'),

  // Domain 02 — Networking & Communication

  // Domain 03 — Database Design & Data Management
  plannedLesson('module-3-3', 'indexes-and-query-performance', 'Indexes and Query Performance', 'Use indexes deliberately and understand their cost.'),
  plannedLesson('module-3-4', 'transactions-and-consistency-boundaries', 'Transactions and Consistency Boundaries', 'Place transaction boundaries where correctness requires them.'),
  plannedLesson('module-3-5', 'replication-and-read-paths', 'Replication and Read Paths', 'Use replicas to serve reads without losing correctness guarantees.'),
  plannedLesson('module-3-6', 'data-growth-and-partitioning', 'Data Growth and Partitioning', 'Partition data as volume and query load grow.'),
  plannedLesson('module-3-7', 'sharding-strategies-and-rebalancing', 'Sharding Strategies and Rebalancing', 'Split data across shards, choose shard keys and rebalance as the cluster grows.'),
  plannedLesson('module-3-8', 'schema-evolution-and-data-migration', 'Schema Evolution and Data Migration', 'Change schemas safely while existing data and queries keep working.'),

  // Domain 04 — Caching & Storage Systems
  plannedLesson('module-4-1', 'cache-strategies-and-placement', 'Cache Strategies and Placement', 'Choose where to cache and which strategy to use.'),
  plannedLesson('module-4-2', 'eviction-policies-and-capacity', 'Eviction Policies and Capacity', 'Control a bounded cache with a deliberate eviction policy.'),
  plannedLesson('module-4-3', 'cache-consistency-and-stale-data', 'Cache Consistency and Stale Data', 'Handle stale reads and invalidation without adding unnecessary complexity.'),
  plannedLesson('module-4-4', 'storage-engines-and-file-layout', 'Storage Engines and File Layout', 'Understand the storage machinery underneath a database or cache.'),
  plannedLesson('module-4-5', 'matching-storage-to-workload', 'Matching Storage to Workload', 'Match storage choices to read, write and durability needs.'),
  plannedLesson('module-4-6', 'cdn-and-edge-caching', 'CDN and Edge Caching', 'Move content closer to users and control freshness at the network edge.'),
  plannedLesson('module-4-7', 'object-block-and-file-storage', 'Object, Block, and File Storage', 'Distinguish the three storage abstractions and match each to the data it holds.'),

  // Domain 05 — Distributed Systems
  plannedLesson('module-5-1', 'failure-modes-in-distributed-systems', 'Failure Modes in Distributed Systems', 'Accept that machines, networks and clocks fail independently.'),
  plannedLesson('module-5-2', 'time-clocks-and-ordering', 'Time, Clocks, and Ordering', 'Reason about event ordering without a single shared clock.'),
  plannedLesson('module-5-3', 'cap-in-practice', 'CAP in Practice', 'Apply the CAP trade-off to real design decisions.'),
  plannedLesson('module-5-4', 'consensus-and-agreement', 'Consensus and Agreement', 'Understand how independent nodes reach agreement.'),
  plannedLesson('module-5-5', 'leader-election-and-coordination', 'Leader Election and Coordination', 'Coordinate work when any node can disappear.'),
  plannedLesson('module-5-6', 'distributed-transactions-and-sagas', 'Distributed Transactions and Sagas', 'Keep multi-service workflows correct without a single transaction.'),
  plannedLesson('module-5-7', 'designing-for-partial-failure', 'Designing for Partial Failure', 'Build systems that keep working when only part of them has failed.'),
  plannedLesson('module-5-8', 'idempotency-and-message-delivery-guarantees', 'Idempotency and Message Delivery Guarantees', 'Make repeated requests and retries safe when delivery is at least once.'),

  // Domain 06 — Scalability, Availability & Reliability
  plannedLesson('module-6-1', 'scaling-patterns-and-bottlenecks', 'Scaling Patterns and Bottlenecks', 'Find the bottleneck before adding capacity.'),
  plannedLesson('module-6-2', 'load-balancing-and-load-shedding', 'Load Balancing and Load Shedding', 'Spread traffic and protect a system when demand exceeds capacity.'),
  plannedLesson('module-6-3', 'replication-and-failover', 'Replication and Failover', 'Plan how traffic moves when a component fails.'),
  plannedLesson('module-6-4', 'observability-and-alerting', 'Observability and Alerting', 'Make system behaviour visible with signals that matter.'),
  plannedLesson('module-6-5', 'slos-and-error-budgets', 'SLOs and Error Budgets', 'Turn vague availability goals into measurable targets.'),
  plannedLesson('module-6-6', 'graceful-degradation-and-recovery', 'Graceful Degradation and Recovery', 'Keep a useful service running while recovering from failure.'),
  plannedLesson('module-6-7', 'capacity-planning-and-load-testing', 'Capacity Planning and Load Testing', 'Forecast demand and verify that a design meets its targets under realistic load.'),
  plannedLesson('module-6-8', 'backup-and-disaster-recovery', 'Backup and Disaster Recovery', 'Plan restore points, recovery objectives and exercises for large-scale failures.'),

  // Domain 07 — Messaging, Microservices & Advanced Architecture
  plannedLesson('module-7-1', 'synchronous-vs-asynchronous-communication', 'Synchronous vs Asynchronous Communication', 'Choose between waiting for a result and reacting to one later.'),
  plannedLesson('module-7-2', 'queues-and-message-brokers', 'Queues and Message Brokers', 'Use queues to decouple producers from consumers.'),
  plannedLesson('module-7-3', 'event-driven-architecture', 'Event-Driven Architecture', 'Model flows as events and reactions.'),
  plannedLesson('module-7-4', 'service-boundaries-and-decomposition', 'Service Boundaries and Decomposition', 'Draw service boundaries around cohesive responsibilities.'),
  plannedLesson('module-7-5', 'data-ownership-across-services', 'Data Ownership Across Services', 'Keep data ownership clear when services are split.'),
  plannedLesson('module-7-6', 'operational-cost-of-boundaries', 'Operational Cost of Boundaries', 'Account for the operational price of each additional boundary.'),
  plannedLesson('module-7-7', 'api-design-and-versioning', 'API Design and Versioning', 'Define stable contracts between services and evolve them without breaking consumers.'),
  plannedLesson('module-7-8', 'api-gateway-and-service-discovery', 'API Gateway and Service Discovery', 'Route ingress traffic and let services find each other as instances change.'),
  plannedLesson('module-7-9', 'cqrs-and-event-sourcing', 'CQRS and Event Sourcing', 'Separate read and write models and persist state as a sequence of events.'),

  // Domain 08 — Real-World System Design & Interviews
  plannedLesson('module-8-1', 'the-design-interview-framework', 'The Design Interview Framework', 'Use a repeatable structure for a design conversation.'),
  plannedLesson('module-8-2', 'clarifying-questions-and-requirements', 'Clarifying Questions and Requirements', 'Ask the questions that turn a prompt into a design problem.'),
  plannedLesson('module-8-3', 'capacity-estimation', 'Capacity Estimation', 'Make quick, useful back-of-the-envelope estimates.'),
  plannedLesson('module-8-4', 'building-the-architecture', 'Building the Architecture', 'Assemble components into a coherent end-to-end design.'),
  plannedLesson('module-8-5', 'handling-follow-ups-and-constraints', 'Handling Follow-ups and Constraints', 'Adapt a design when the interviewer changes the constraints.'),
  plannedLesson('module-8-6', 'communicating-and-defending-decisions', 'Communicating and Defending Decisions', 'Explain trade-offs clearly and defend your choices.'),
  plannedLesson('module-8-7', 'designing-a-url-shortener', 'Designing a URL Shortener', 'Apply the full design framework to a high-read, small-write redirect service.'),
  plannedLesson('module-8-8', 'designing-a-news-feed', 'Designing a News Feed', 'Build a feed that balances freshness, ranking cost and read amplification.'),
  plannedLesson('module-8-9', 'designing-a-chat-system', 'Designing a Chat System', 'Design presence, message delivery and fan-out for real-time conversations.'),
  plannedLesson('module-8-10', 'designing-a-video-streaming-platform', 'Designing a Video Streaming Platform', 'Handle upload, transcoding, storage and adaptive delivery of large media files.'),
  plannedLesson('module-8-11', 'designing-a-ride-hailing-service', 'Designing a Ride-Hailing Service', 'Match riders and drivers with location-aware, stateful workflows.'),
  plannedLesson('module-8-12', 'designing-a-payment-system', 'Designing a Payment System', 'Design money movement with idempotency, reconciliation and strong correctness.'),
  plannedLesson('module-8-13', 'designing-a-rate-limiter', 'Designing a Rate Limiter', 'Enforce fair usage with distributed counters, windows and override policies.'),
]
