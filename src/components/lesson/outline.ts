import { getSimulationBySlug } from '../../features/simulations/registry/simulationLookup.ts'
import type { LessonContent } from '../../types/curriculum.ts'

export type LessonOutlineKind =
  | 'introduction'
  | 'objectives'
  | 'section'
  | 'diagram'
  | 'code'
  | 'comparison'
  | 'simulation'
  | 'quiz'
  | 'challenge'
  | 'takeaways'

export interface LessonOutlineItem {
  id: string
  label: string
  kind: LessonOutlineKind
}

/**
 * Builds the table of contents from resolved lesson content. No headings are
 * hardcoded here, so future authored lessons get a matching outline for free.
 */
export function buildLessonOutline(content: LessonContent): LessonOutlineItem[] {
  const items: LessonOutlineItem[] = [
    { id: 'lesson-introduction', label: 'Introduction', kind: 'introduction' },
  ]

  if (content.learningObjectives.length > 0) {
    items.push({ id: 'lesson-objectives', label: 'Learning objectives', kind: 'objectives' })
  }

  for (const section of content.sections) {
    items.push({ id: `section-${section.id}`, label: section.title, kind: 'section' })
  }

  for (const diagram of content.diagrams) {
    items.push({ id: `diagram-${diagram.id}`, label: diagram.title, kind: 'diagram' })
  }

  for (const example of content.codeExamples) {
    items.push({ id: `code-${example.id}`, label: example.title, kind: 'code' })
  }

  for (const comparison of content.comparisons) {
    items.push({ id: `comparison-${comparison.id}`, label: comparison.title, kind: 'comparison' })
  }

  const simulation = getSimulationBySlug(content.lesson.metadata?.simulationSlug)
  if (simulation) {
    items.push({ id: 'lesson-simulation', label: 'Interactive simulation', kind: 'simulation' })
  }

  if (content.quiz) {
    items.push({ id: 'lesson-quiz', label: 'Knowledge check', kind: 'quiz' })
  }

  if (content.practicalChallenge) {
    items.push({
      id: 'lesson-challenge',
      label: content.practicalChallenge.title,
      kind: 'challenge',
    })
  }

  if (content.summary) {
    items.push({ id: 'lesson-summary', label: 'Key takeaways', kind: 'takeaways' })
  }

  return items
}
