import type { Module } from '../../types/curriculum.ts'
import { BLUEPRINT_MODULE_COUNTS, matchesBlueprint } from './blueprint.ts'
import { lessons } from './lessons.ts'

interface ModuleSeed {
  domain: number
  order: number
  title: string
  slug: string
  description: string
  estimatedHours: number
}

/**
 * Approved curriculum module seeds.
 *
 * Titles and topic definitions come from the approved blueprint. Existing
 * modules keep their original numbers, slugs and titles; restored modules are
 * appended in their approved domain order. The count guard below makes any
 * future drift from the blueprint fail immediately.
 */
const moduleSeeds: ModuleSeed[] = [
  // Domain 01 — System Design Fundamentals (7)
  { domain: 1, order: 1, title: 'What is System Design?', slug: 'what-is-system-design', description: 'Define system design and the questions it answers before any code is written.', estimatedHours: 2 },
  { domain: 1, order: 2, title: 'Requirements and Constraints', slug: 'requirements-and-constraints', description: 'Turn functional and non-functional needs into explicit design constraints.', estimatedHours: 2 },
  { domain: 1, order: 3, title: 'Core Building Blocks', slug: 'core-building-blocks', description: 'Learn the clients, services, caches, queues and stores used throughout the course.', estimatedHours: 2 },
  { domain: 1, order: 4, title: 'Trade-offs and Design Decisions', slug: 'trade-offs-and-design-decisions', description: 'Reason about what every design decision gains and gives up.', estimatedHours: 2 },
  { domain: 1, order: 5, title: 'Sketching Your First Design', slug: 'sketching-your-first-design', description: 'Produce a first architecture sketch and explain its decisions.', estimatedHours: 2 },
  { domain: 1, order: 6, title: 'Back-of-the-Envelope Scale Estimation', slug: 'back-of-the-envelope-scale-estimation', description: 'Use rough numbers for users, traffic and storage to size a design before committing to it.', estimatedHours: 2 },
  { domain: 1, order: 7, title: 'Reviewing and Iterating on Designs', slug: 'reviewing-and-iterating-on-designs', description: 'Check a sketch against requirements, expose weak points and improve it deliberately.', estimatedHours: 2 },

  // Domain 02 — Networking & Communication (7)
  { domain: 2, order: 1, title: 'The Request Lifecycle', slug: 'the-request-lifecycle', description: 'Follow a request from DNS lookup through the network and back.', estimatedHours: 3 },
  { domain: 2, order: 2, title: 'TCP, HTTP, and TLS Fundamentals', slug: 'tcp-http-and-tls-fundamentals', description: 'Understand the protocols that carry and secure requests.', estimatedHours: 2 },
  { domain: 2, order: 3, title: 'Routing and the Public Internet', slug: 'routing-and-the-public-internet', description: 'See how packets travel across networks and where routing matters.', estimatedHours: 2 },
  { domain: 2, order: 4, title: 'Latency, Bandwidth, and Failure Modes', slug: 'latency-bandwidth-and-failure-modes', description: 'Diagnose where time is spent and how networks fail.', estimatedHours: 3 },
  { domain: 2, order: 5, title: 'Choosing the Right Protocol', slug: 'choosing-the-right-protocol', description: 'Match protocol choices to the needs of the interaction.', estimatedHours: 2 },
  { domain: 2, order: 6, title: 'DNS and Name Resolution', slug: 'dns-and-name-resolution', description: 'Resolve human-readable names into addresses and understand where resolution adds latency and failure risk.', estimatedHours: 2 },
  { domain: 2, order: 7, title: 'Streaming and Long-Lived Connections', slug: 'streaming-and-long-lived-connections', description: 'Compare WebSockets, server-sent events and streaming HTTP for interactions that outlive a single request.', estimatedHours: 3 },

  // Domain 03 — Database Design & Data Management (8)
  { domain: 3, order: 1, title: 'Relational vs NoSQL Models', slug: 'relational-vs-nosql-models', description: 'Compare storage models and choose one that fits the access pattern.', estimatedHours: 3 },
  { domain: 3, order: 2, title: 'Schema Design for Access Patterns', slug: 'schema-design-for-access-patterns', description: 'Design schemas around the queries the system actually runs.', estimatedHours: 3 },
  { domain: 3, order: 3, title: 'Indexes and Query Performance', slug: 'indexes-and-query-performance', description: 'Use indexes deliberately and understand their write cost.', estimatedHours: 2 },
  { domain: 3, order: 4, title: 'Transactions and Consistency Boundaries', slug: 'transactions-and-consistency-boundaries', description: 'Place transaction boundaries where correctness requires them.', estimatedHours: 3 },
  { domain: 3, order: 5, title: 'Replication and Read Paths', slug: 'replication-and-read-paths', description: 'Use replicas to serve reads without losing correctness guarantees.', estimatedHours: 3 },
  { domain: 3, order: 6, title: 'Data Growth and Partitioning', slug: 'data-growth-and-partitioning', description: 'Partition data as volume and query load grow.', estimatedHours: 2 },
  { domain: 3, order: 7, title: 'Sharding Strategies and Rebalancing', slug: 'sharding-strategies-and-rebalancing', description: 'Split data across shards, choose shard keys and rebalance as the cluster grows.', estimatedHours: 3 },
  { domain: 3, order: 8, title: 'Schema Evolution and Data Migration', slug: 'schema-evolution-and-data-migration', description: 'Change schemas safely while existing data and queries keep working.', estimatedHours: 3 },

  // Domain 04 — Caching & Storage Systems (7)
  { domain: 4, order: 1, title: 'Cache Strategies and Placement', slug: 'cache-strategies-and-placement', description: 'Choose where to cache and which strategy to use.', estimatedHours: 2 },
  { domain: 4, order: 2, title: 'Eviction Policies and Capacity', slug: 'eviction-policies-and-capacity', description: 'Control a bounded cache with a deliberate eviction policy.', estimatedHours: 2 },
  { domain: 4, order: 3, title: 'Cache Consistency and Stale Data', slug: 'cache-consistency-and-stale-data', description: 'Handle stale reads and invalidation without unnecessary complexity.', estimatedHours: 3 },
  { domain: 4, order: 4, title: 'Storage Engines and File Layout', slug: 'storage-engines-and-file-layout', description: 'Understand the storage machinery underneath a database or cache.', estimatedHours: 3 },
  { domain: 4, order: 5, title: 'Matching Storage to Workload', slug: 'matching-storage-to-workload', description: 'Match storage choices to read, write and durability needs.', estimatedHours: 2 },
  { domain: 4, order: 6, title: 'CDN and Edge Caching', slug: 'cdn-and-edge-caching', description: 'Move content closer to users and control freshness at the network edge.', estimatedHours: 3 },
  { domain: 4, order: 7, title: 'Object, Block, and File Storage', slug: 'object-block-and-file-storage', description: 'Distinguish the three storage abstractions and match each to the data it holds.', estimatedHours: 2 },

  // Domain 05 — Distributed Systems (8)
  { domain: 5, order: 1, title: 'Failure Modes in Distributed Systems', slug: 'failure-modes-in-distributed-systems', description: 'Accept that machines, networks and clocks fail independently.', estimatedHours: 3 },
  { domain: 5, order: 2, title: 'Time, Clocks, and Ordering', slug: 'time-clocks-and-ordering', description: 'Reason about event ordering without a single shared clock.', estimatedHours: 3 },
  { domain: 5, order: 3, title: 'CAP in Practice', slug: 'cap-in-practice', description: 'Apply the CAP trade-off to real design decisions.', estimatedHours: 3 },
  { domain: 5, order: 4, title: 'Consensus and Agreement', slug: 'consensus-and-agreement', description: 'Understand how independent nodes reach agreement.', estimatedHours: 3 },
  { domain: 5, order: 5, title: 'Leader Election and Coordination', slug: 'leader-election-and-coordination', description: 'Coordinate work when any node can disappear.', estimatedHours: 3 },
  { domain: 5, order: 6, title: 'Distributed Transactions and Sagas', slug: 'distributed-transactions-and-sagas', description: 'Keep multi-service workflows correct without one global transaction.', estimatedHours: 3 },
  { domain: 5, order: 7, title: 'Designing for Partial Failure', slug: 'designing-for-partial-failure', description: 'Build systems that keep working when part of them has failed.', estimatedHours: 2 },
  { domain: 5, order: 8, title: 'Idempotency and Message Delivery Guarantees', slug: 'idempotency-and-message-delivery-guarantees', description: 'Make repeated requests and retries safe when delivery is at least once.', estimatedHours: 3 },

  // Domain 06 — Scalability, Availability & Reliability (8)
  { domain: 6, order: 1, title: 'Scaling Patterns and Bottlenecks', slug: 'scaling-patterns-and-bottlenecks', description: 'Find the bottleneck before adding capacity.', estimatedHours: 3 },
  { domain: 6, order: 2, title: 'Load Balancing and Load Shedding', slug: 'load-balancing-and-load-shedding', description: 'Spread traffic and protect a system when demand exceeds capacity.', estimatedHours: 3 },
  { domain: 6, order: 3, title: 'Replication and Failover', slug: 'replication-and-failover', description: 'Plan how traffic moves when a component fails.', estimatedHours: 3 },
  { domain: 6, order: 4, title: 'Observability and Alerting', slug: 'observability-and-alerting', description: 'Make system behaviour visible with signals that matter.', estimatedHours: 3 },
  { domain: 6, order: 5, title: 'SLOs and Error Budgets', slug: 'slos-and-error-budgets', description: 'Turn vague availability goals into measurable targets.', estimatedHours: 3 },
  { domain: 6, order: 6, title: 'Graceful Degradation and Recovery', slug: 'graceful-degradation-and-recovery', description: 'Keep a useful service running while recovering from failure.', estimatedHours: 3 },
  { domain: 6, order: 7, title: 'Capacity Planning and Load Testing', slug: 'capacity-planning-and-load-testing', description: 'Forecast demand and verify that a design meets its targets under realistic load.', estimatedHours: 3 },
  { domain: 6, order: 8, title: 'Backup and Disaster Recovery', slug: 'backup-and-disaster-recovery', description: 'Plan restore points, recovery objectives and exercises for large-scale failures.', estimatedHours: 3 },

  // Domain 07 — Messaging, Microservices & Advanced Architecture (9)
  { domain: 7, order: 1, title: 'Synchronous vs Asynchronous Communication', slug: 'synchronous-vs-asynchronous-communication', description: 'Choose between waiting for a result and reacting to one later.', estimatedHours: 3 },
  { domain: 7, order: 2, title: 'Queues and Message Brokers', slug: 'queues-and-message-brokers', description: 'Use queues to decouple producers from consumers.', estimatedHours: 3 },
  { domain: 7, order: 3, title: 'Event-Driven Architecture', slug: 'event-driven-architecture', description: 'Model flows as events and reactions.', estimatedHours: 3 },
  { domain: 7, order: 4, title: 'Service Boundaries and Decomposition', slug: 'service-boundaries-and-decomposition', description: 'Draw service boundaries around cohesive responsibilities.', estimatedHours: 3 },
  { domain: 7, order: 5, title: 'Data Ownership Across Services', slug: 'data-ownership-across-services', description: 'Keep data ownership clear when services are split.', estimatedHours: 3 },
  { domain: 7, order: 6, title: 'Operational Cost of Boundaries', slug: 'operational-cost-of-boundaries', description: 'Account for the operational price of each additional boundary.', estimatedHours: 3 },
  { domain: 7, order: 7, title: 'API Design and Versioning', slug: 'api-design-and-versioning', description: 'Define stable contracts between services and evolve them without breaking consumers.', estimatedHours: 3 },
  { domain: 7, order: 8, title: 'API Gateway and Service Discovery', slug: 'api-gateway-and-service-discovery', description: 'Route ingress traffic and let services find each other as instances change.', estimatedHours: 3 },
  { domain: 7, order: 9, title: 'CQRS and Event Sourcing', slug: 'cqrs-and-event-sourcing', description: 'Separate read and write models and persist state as a sequence of events.', estimatedHours: 4 },

  // Domain 08 — Real-World System Design & Interviews (13)
  { domain: 8, order: 1, title: 'The Design Interview Framework', slug: 'the-design-interview-framework', description: 'Use a repeatable structure for a design conversation.', estimatedHours: 2 },
  { domain: 8, order: 2, title: 'Clarifying Questions and Requirements', slug: 'clarifying-questions-and-requirements', description: 'Ask the questions that turn a prompt into a design problem.', estimatedHours: 2 },
  { domain: 8, order: 3, title: 'Capacity Estimation', slug: 'capacity-estimation', description: 'Make quick, useful back-of-the-envelope estimates.', estimatedHours: 2 },
  { domain: 8, order: 4, title: 'Building the Architecture', slug: 'building-the-architecture', description: 'Assemble components into a coherent end-to-end design.', estimatedHours: 3 },
  { domain: 8, order: 5, title: 'Handling Follow-ups and Constraints', slug: 'handling-follow-ups-and-constraints', description: 'Adapt a design when the interviewer changes the constraints.', estimatedHours: 2 },
  { domain: 8, order: 6, title: 'Communicating and Defending Decisions', slug: 'communicating-and-defending-decisions', description: 'Explain trade-offs clearly and defend your choices.', estimatedHours: 3 },
  { domain: 8, order: 7, title: 'Designing a URL Shortener', slug: 'designing-a-url-shortener', description: 'Apply the full design framework to a high-read, small-write redirect service.', estimatedHours: 4 },
  { domain: 8, order: 8, title: 'Designing a News Feed', slug: 'designing-a-news-feed', description: 'Build a feed that balances freshness, ranking cost and read amplification.', estimatedHours: 4 },
  { domain: 8, order: 9, title: 'Designing a Chat System', slug: 'designing-a-chat-system', description: 'Design presence, message delivery and fan-out for real-time conversations.', estimatedHours: 4 },
  { domain: 8, order: 10, title: 'Designing a Video Streaming Platform', slug: 'designing-a-video-streaming-platform', description: 'Handle upload, transcoding, storage and adaptive delivery of large media files.', estimatedHours: 5 },
  { domain: 8, order: 11, title: 'Designing a Ride-Hailing Service', slug: 'designing-a-ride-hailing-service', description: 'Match riders and drivers with location-aware, stateful workflows.', estimatedHours: 4 },
  { domain: 8, order: 12, title: 'Designing a Payment System', slug: 'designing-a-payment-system', description: 'Design money movement with idempotency, reconciliation and strong correctness.', estimatedHours: 5 },
  { domain: 8, order: 13, title: 'Designing a Rate Limiter', slug: 'designing-a-rate-limiter', description: 'Enforce fair usage with distributed counters, windows and override policies.', estimatedHours: 4 },
]

const seedCountsByDomain = BLUEPRINT_MODULE_COUNTS.map((_, index) => {
  const domain = index + 1
  return moduleSeeds.filter((seed) => seed.domain === domain).length
})

if (!matchesBlueprint(seedCountsByDomain)) {
  throw new Error(
    `Module seeds do not match the approved blueprint: expected ${BLUEPRINT_MODULE_COUNTS.join(', ')}, received ${seedCountsByDomain.join(', ')}`,
  )
}

function toModule(seed: ModuleSeed): Module {
  const id = `module-${seed.domain}-${seed.order}`

  return {
    id,
    domainId: `domain-${String(seed.domain).padStart(2, '0')}`,
    number: `${seed.domain}.${seed.order}`,
    slug: `${id}-${seed.slug}`,
    title: seed.title,
    description: seed.description,
    estimatedHours: seed.estimatedHours,
    order: seed.order,
    lessonIds: lessons.filter((lesson) => lesson.moduleId === id).map((lesson) => lesson.id),
  }
}

export const modules: Module[] = moduleSeeds.map(toModule)
