import { domains, modules } from '../../data/curriculum/index.ts'
import type { Lesson, Module } from '../../types/curriculum.ts'

export interface LessonLocation {
  domainSlug: string
  domainTitle: string
  moduleId: string
  moduleNumber: string
  moduleTitle: string
}

export function getLessonModule(lesson: Lesson): Module | undefined {
  return modules.find((module) => module.id === lesson.moduleId)
}

export function findLessonLocation(lesson: Lesson): LessonLocation | undefined {
  const module = getLessonModule(lesson)
  if (!module) return undefined

  const domain = domains.find((item) => item.id === module.domainId)
  if (!domain) return undefined

  return {
    domainSlug: domain.slug,
    domainTitle: domain.title,
    moduleId: module.id,
    moduleNumber: module.number,
    moduleTitle: module.title,
  }
}
