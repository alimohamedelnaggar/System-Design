import type { Lesson } from '../../types/curriculum.ts'

/**
 * Lesson statuses supported by the course UI. Canonical curriculum data only
 * stores `planned` and `published`; the progress states are reserved for the
 * future persistence layer and never fabricated here.
 */
export type LessonViewStatus = Lesson['status'] | 'in_progress' | 'completed'

export interface LessonProgressInput {
  completedLessonIds?: readonly string[]
  inProgressLessonIds?: readonly string[]
}

export function getLessonViewStatus(
  lesson: Lesson,
  progress: LessonProgressInput = {},
): LessonViewStatus {
  if (progress.completedLessonIds?.includes(lesson.id)) return 'completed'
  if (progress.inProgressLessonIds?.includes(lesson.id)) return 'in_progress'
  return lesson.status
}

export function isLessonAvailable(status: LessonViewStatus): boolean {
  return status === 'published' || status === 'in_progress' || status === 'completed'
}

export const lessonStatusLabels: Record<LessonViewStatus, string> = {
  published: 'Published',
  planned: 'Planned',
  in_progress: 'In progress',
  completed: 'Completed',
}
