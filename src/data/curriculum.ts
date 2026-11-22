import type { CurriculumStats, LearningDomain } from '../types/curriculum'
import { projects } from './projects'
import { domains as curriculumDomains } from './curriculum/domains.ts'
import { journeyPhases } from './curriculum/journey.ts'

/**
 * Legacy UI adapter. The existing roadmap components expect `modules` as a
 * count and `outcomes` as strings; everything here is derived from the
 * canonical curriculum data in ./curriculum so no metadata is duplicated.
 *
 * New code should import from ./curriculum/index.ts.
 */
export const domains: LearningDomain[] = curriculumDomains.map((domain) => ({
  id: domain.number,
  slug: domain.slug,
  title: domain.title,
  summary: domain.summary,
  description: domain.description,
  modules: domain.modules.length,
  estimatedHours: domain.estimatedHours,
  stage: domain.stage,
  outcomes: domain.learningObjectives.map((objective) => objective.text),
  icon: domain.icon,
}))

export { journeyPhases }

export const curriculumStats: CurriculumStats = {
  domains: domains.length,
  modules: domains.reduce((total, domain) => total + domain.modules, 0),
  hours: domains.reduce((total, domain) => total + domain.estimatedHours, 0),
  projects: projects.length,
}

export const featuredDomains = domains.slice(0, 3)

export function getDomainBySlug(slug: string | undefined): LearningDomain | undefined {
  if (!slug) return undefined
  return domains.find((domain) => domain.slug === slug)
}

export function getPhaseForDomain(domainId: number) {
  return journeyPhases.find((phase) => phase.domainIds.includes(domainId))
}

export function getDomainsForPhase(phase: (typeof journeyPhases)[number]): LearningDomain[] {
  return phase.domainIds
    .map((id) => domains.find((domain) => domain.id === id))
    .filter((domain): domain is LearningDomain => Boolean(domain))
}

// Re-export the non-conflicting canonical helpers for convenient access.
export {
  assertValidCurriculum,
  getAllDomains,
  getAllLessons,
  getDomainProgress,
  getLessonBySlug,
  getLessonContent,
  getLessonsByModule,
  getModuleBySlug,
  getModulesByDomain,
  getNextLesson,
  getPreviousLesson,
  validateCurriculum,
} from './curriculum/index.ts'
