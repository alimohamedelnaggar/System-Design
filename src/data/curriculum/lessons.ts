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

/** One lesson per approved module topic; only Domain 01 / Module 1.1 has content yet. */
export const lessons: Lesson[] = [
  whatIsSystemDesign,

  // Domain 01 — System Design Fundamentals
  plannedLesson('module-1-2', 'requirements-and-constraints', 'Requirements and Constraints', 'Turn a vague request into explicit functional and non-functional requirements.'),
  plannedLesson('module-1-3', 'core-building-blocks', 'Core Building Blocks', 'Recognise the clients, services, caches, queues and stores that make up most systems.'),
  plannedLesson('module-1-4', 'trade-offs-and-design-decisions', 'Trade-offs and Design Decisions', 'Explain why every design choice gives up something in exchange for something else.'),
  plannedLesson('module-1-5', 'sketching-your-first-design', 'Sketching Your First Design', 'Turn requirements and building blocks into a first, defensible architecture sketch.'),
  plannedLesson('module-1-6', 'back-of-the-envelope-scale-estimation', 'Back-of-the-Envelope Scale Estimation', 'Use rough numbers for users, traffic and storage to size a design before committing to it.'),
  plannedLesson('module-1-7', 'reviewing-and-iterating-on-designs', 'Reviewing and Iterating on Designs', 'Check a sketch against requirements, expose weak points and improve it deliberately.'),

  // Domain 02 — Networking & Communication
  plannedLesson('module-2-1', 'the-request-lifecycle', 'The Request Lifecycle', 'Follow a request from DNS lookup through the network and back to the client.'),
  plannedLesson('module-2-2', 'tcp-http-and-tls-fundamentals', 'TCP, HTTP, and TLS Fundamentals', 'Understand the protocols that carry and secure requests.'),
  plannedLesson('module-2-3', 'routing-and-the-public-internet', 'Routing and the Public Internet', 'See how packets find their way across networks and where routing matters.'),
  plannedLesson('module-2-4', 'latency-bandwidth-and-failure-modes', 'Latency, Bandwidth, and Failure Modes', 'Locate where time is spent and how networks fail in practice.'),
  plannedLesson('module-2-5', 'choosing-the-right-protocol', 'Choosing the Right Protocol', 'Match protocol choices to the needs of the interaction.'),
  plannedLesson('module-2-6', 'dns-and-name-resolution', 'DNS and Name Resolution', 'Resolve human-readable names into addresses and understand where resolution adds latency and failure risk.'),
  plannedLesson('module-2-7', 'streaming-and-long-lived-connections', 'Streaming and Long-Lived Connections', 'Compare WebSockets, server-sent events and streaming HTTP for interactions that outlive a single request.'),

  // Domain 03 — Database Design & Data Management
  plannedLesson('module-3-1', 'relational-vs-nosql-models', 'Relational vs NoSQL Models', 'Compare storage models and choose one that fits the access pattern.'),
  plannedLesson('module-3-2', 'schema-design-for-access-patterns', 'Schema Design for Access Patterns', 'Design schemas around the queries the system actually runs.'),
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
