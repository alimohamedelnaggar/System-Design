import type { LearningFeature } from '../types/curriculum'

export const learningFeatures: LearningFeature[] = [
  {
    id: 1,
    title: 'Map the request path',
    description: 'Follow a request from client to storage and see why each hop exists.',
    icon: 'map',
  },
  {
    id: 2,
    title: 'Compare the trade-offs',
    description: 'Change constraints and watch consistency, latency, and cost shift.',
    icon: 'compare',
  },
  {
    id: 3,
    title: 'Rehearse the explanation',
    description: 'Practice defending design choices the way interview panels expect.',
    icon: 'rehearse',
  },
]
