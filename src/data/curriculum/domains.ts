import type { Difficulty, Domain, DomainIconKey, DomainStage } from '../../types/curriculum.ts'
import { modules } from './modules.ts'

interface DomainSeed {
  number: number
  slug: string
  title: string
  summary: string
  description: string
  outcomes: string[]
  difficulty: Difficulty
  stage: DomainStage
  icon: DomainIconKey
}

/** Titles, descriptions and outcomes are the approved Phase 1 domain metadata. */
const domainSeeds: DomainSeed[] = [
  {
    number: 1,
    slug: 'system-design-fundamentals',
    title: 'System Design Fundamentals',
    summary: 'Learn the vocabulary, constraints, and thinking model behind every design decision.',
    description:
      'Start with the questions that frame any system: who uses it, what must it guarantee, and what can fail? Build a repeatable design process before adding complexity.',
    outcomes: ['Frame requirements and constraints', 'Reason about trade-offs', 'Sketch a first design'],
    difficulty: 'beginner',
    stage: 'foundation',
    icon: 'fundamentals',
  },
  {
    number: 2,
    slug: 'networking-communication',
    title: 'Networking & Communication',
    summary: 'Understand how requests travel, where latency hides, and how protocols shape design.',
    description:
      'Follow a request across DNS, TCP, HTTP, and the public internet. Learn how routing, bandwidth, and failure modes influence the systems you build.',
    outcomes: ['Explain the request lifecycle', 'Diagnose latency sources', 'Choose the right protocol'],
    difficulty: 'beginner',
    stage: 'foundation',
    icon: 'network',
  },
  {
    number: 3,
    slug: 'database-design-data-management',
    title: 'Database Design & Data Management',
    summary: 'Model data that stays correct as queries, volume, and teams grow.',
    description:
      'Compare relational and NoSQL models, design schemas for real access patterns, and understand indexes, transactions, and replication before they become bottlenecks.',
    outcomes: ['Design for access patterns', 'Choose a storage model', 'Apply transaction boundaries'],
    difficulty: 'intermediate',
    stage: 'core',
    icon: 'database',
  },
  {
    number: 4,
    slug: 'caching-storage-systems',
    title: 'Caching & Storage Systems',
    summary: 'Use speed tiers, invalidation, and storage layout to keep data close to compute.',
    description:
      'Explore cache strategies, eviction, consistency, and the storage machinery underneath them. Learn when a cache solves a problem and when it creates a new one.',
    outcomes: ['Select a cache strategy', 'Handle stale data', 'Match storage to workload'],
    difficulty: 'intermediate',
    stage: 'core',
    icon: 'caching',
  },
  {
    number: 5,
    slug: 'distributed-systems',
    title: 'Distributed Systems',
    summary: 'Work with consensus, coordination, and partial failure across many machines.',
    description:
      'Confront the realities of distributed computing: clocks, consensus, leader election, and the CAP trade-off. Build intuition for coordination without a single source of truth.',
    outcomes: ['Explain CAP in practice', 'Reason about consensus', 'Design for partial failure'],
    difficulty: 'advanced',
    stage: 'core',
    icon: 'distributed',
  },
  {
    number: 6,
    slug: 'scalability-availability-reliability',
    title: 'Scalability, Availability & Reliability',
    summary: 'Keep systems responsive, available, and recoverable under real pressure.',
    description:
      'Study load shedding, replication, failover, observability, and reliability targets. Learn to turn vague goals such as "fast" and "always on" into measurable designs.',
    outcomes: ['Define SLOs and budgets', 'Plan for failover', 'Design graceful degradation'],
    difficulty: 'advanced',
    stage: 'advanced',
    icon: 'scalability',
  },
  {
    number: 7,
    slug: 'messaging-microservices-advanced-architecture',
    title: 'Messaging, Microservices & Advanced Architecture',
    summary: 'Decouple services with events, queues, and boundaries that hold up over time.',
    description:
      'Compare synchronous and asynchronous communication, event-driven design, and service decomposition. Learn the operational cost that comes with every boundary you add.',
    outcomes: ['Choose sync or async', 'Model event flows', 'Set service boundaries'],
    difficulty: 'advanced',
    stage: 'advanced',
    icon: 'messaging',
  },
  {
    number: 8,
    slug: 'real-world-system-design-interviews',
    title: 'Real-World System Design & Interviews',
    summary: 'Bring the full toolkit together on realistic problems and explain it clearly.',
    description:
      'Practice complete designs under interview conditions, from clarifying questions to capacity estimates and final architecture. Learn to communicate decisions with confidence.',
    outcomes: ['Run a design interview', 'Estimate capacity', 'Defend design decisions'],
    difficulty: 'advanced',
    stage: 'advanced',
    icon: 'interviews',
  },
]

function toDomain(seed: DomainSeed): Domain {
  const id = `domain-${String(seed.number).padStart(2, '0')}`
  const domainModules = modules.filter((module) => module.domainId === id)
  const moduleLessonCounts: Record<string, number> = {}

  for (const module of domainModules) {
    moduleLessonCounts[module.id] = module.lessonIds.length
  }

  return {
    id,
    slug: seed.slug,
    number: seed.number,
    title: seed.title,
    summary: seed.summary,
    description: seed.description,
    learningObjectives: seed.outcomes.map((text, index) => ({
      id: `objective-domain-${seed.number}-${index + 1}`,
      text,
    })),
    estimatedHours: domainModules.reduce((total, module) => total + module.estimatedHours, 0),
    difficulty: seed.difficulty,
    stage: seed.stage,
    icon: seed.icon,
    modules: domainModules,
    moduleLessonCounts,
  }
}

export const domains: Domain[] = domainSeeds.map(toDomain)
