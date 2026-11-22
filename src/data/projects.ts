import type { Project } from '../types/curriculum'

export const projects: Project[] = [
  {
    id: 1,
    slug: 'chat-service',
    title: 'Realtime chat service',
    description: 'Design presence, message delivery, and fan-out for a million concurrent users.',
    difficulty: 'Advanced',
    tags: ['WebSockets', 'Fan-out', 'Sharding'],
    icon: 'chat',
  },
  {
    id: 2,
    slug: 'commerce-checkout',
    title: 'Commerce checkout',
    description: 'Balance inventory consistency, payment retries, and a fast customer experience.',
    difficulty: 'Advanced',
    tags: ['Consistency', 'Idempotency', 'Queues'],
    icon: 'commerce',
  },
  {
    id: 3,
    slug: 'social-feed',
    title: 'Social feed ranking',
    description: 'Combine timelines, caching, and ranking into a feed that stays responsive.',
    difficulty: 'Intermediate',
    tags: ['Feed', 'Caching', 'Ranking'],
    icon: 'feed',
  },
  {
    id: 4,
    slug: 'video-platform',
    title: 'Video streaming platform',
    description: 'Plan upload pipelines, transcoding, storage tiers, and global delivery.',
    difficulty: 'Advanced',
    tags: ['Media', 'CDN', 'Storage'],
    icon: 'video',
  },
  {
    id: 5,
    slug: 'payments-ledger',
    title: 'Payments ledger',
    description: 'Model double-entry records and reconcile failures without losing money.',
    difficulty: 'Advanced',
    tags: ['Ledger', 'Audit', 'Reliability'],
    icon: 'payments',
  },
  {
    id: 6,
    slug: 'search-index',
    title: 'Search index',
    description: 'Keep an index fresh, relevant, and available while the corpus keeps growing.',
    difficulty: 'Intermediate',
    tags: ['Indexing', 'Relevance', 'Freshness'],
    icon: 'search',
  },
]

export const featuredProjects = projects.slice(0, 3)

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}
