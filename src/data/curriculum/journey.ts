import type { JourneyPhase } from '../../types/curriculum.ts'

/** UI-facing grouping used by the existing roadmap and landing page. */
export const journeyPhases: JourneyPhase[] = [
  {
    id: 'foundations',
    label: 'Phase 01',
    title: 'Foundations',
    description: 'Build the mental model and the language used throughout the course.',
    domainIds: [1, 2],
  },
  {
    id: 'core-systems',
    label: 'Phase 02',
    title: 'Core systems',
    description: 'Learn how data is stored, accelerated, and coordinated across machines.',
    domainIds: [3, 4, 5],
  },
  {
    id: 'scale-and-practice',
    label: 'Phase 03',
    title: 'Scale & practice',
    description: 'Design for failure at scale, then rehearse the decisions out loud.',
    domainIds: [6, 7, 8],
  },
]
