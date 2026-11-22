import type {
  Domain,
  DomainProgress,
  Lesson,
  LessonContent,
  Module,
  Quiz,
} from '../../types/curriculum.ts'
import { diagrams } from './diagrams.ts'
import { domains } from './domains.ts'
import {
  codeExamples,
  comparisons,
  lessonSections,
  lessonSummaries,
  practicalChallenges,
} from './lessonContent.ts'
import { lessons } from './lessons.ts'
import { modules } from './modules.ts'
import { quizzes } from './quizzes.ts'

const domainBySlug = new Map(domains.map((domain) => [domain.slug, domain]))
const domainById = new Map(domains.map((domain) => [domain.id, domain]))
const moduleBySlug = new Map(modules.map((module) => [module.slug, module]))
const lessonBySlug = new Map(lessons.map((lesson) => [lesson.slug, lesson]))
const lessonById = new Map(lessons.map((lesson) => [lesson.id, lesson]))
const sectionById = new Map(lessonSections.map((section) => [section.id, section]))
const diagramById = new Map(diagrams.map((diagram) => [diagram.id, diagram]))
const codeExampleById = new Map(codeExamples.map((example) => [example.id, example]))
const comparisonById = new Map(comparisons.map((comparison) => [comparison.id, comparison]))
const quizById = new Map(quizzes.map((quiz) => [quiz.id, quiz]))
const challengeById = new Map(
  practicalChallenges.map((challenge) => [challenge.id, challenge]),
)
const summaryById = new Map(lessonSummaries.map((summary) => [summary.id, summary]))

function resolveIds<T>(ids: string[], store: Map<string, T>): T[] {
  return ids
    .map((id) => store.get(id))
    .filter((item): item is T => item !== undefined)
}

/** All domains in curriculum order. */
export function getAllDomains(): Domain[] {
  return domains
}

export function getDomainBySlug(slug: string | undefined): Domain | undefined {
  if (!slug) return undefined
  return domainBySlug.get(slug)
}

export function getModuleBySlug(slug: string | undefined): Module | undefined {
  if (!slug) return undefined
  return moduleBySlug.get(slug)
}

export function getLessonBySlug(slug: string | undefined): Lesson | undefined {
  if (!slug) return undefined
  return lessonBySlug.get(slug)
}

export function getLessonById(id: string | undefined): Lesson | undefined {
  if (!id) return undefined
  return lessonById.get(id)
}

export function getQuizById(id: string | undefined): Quiz | undefined {
  if (!id) return undefined
  return quizById.get(id)
}

/** Reverse lookup used when validating quiz → lesson references. */
export function getLessonForQuiz(quizId: string | undefined): Lesson | undefined {
  if (!quizId) return undefined
  return lessons.find((lesson) => lesson.quizId === quizId)
}

export function getModuleById(id: string | undefined): Module | undefined {
  if (!id) return undefined
  return modules.find((module) => module.id === id)
}

export function getDomainById(id: string | undefined): Domain | undefined {
  if (!id) return undefined
  return domainById.get(id)
}

export function getLessonsByModule(moduleId: string): Lesson[] {
  return lessons
    .filter((lesson) => lesson.moduleId === moduleId)
    .sort((first, second) => first.order - second.order || first.number - second.number)
}

/** Flat domain → module → lesson reading order used for next/previous navigation. */
function getOrderedLessons(): Lesson[] {
  const ordered: Lesson[] = []

  for (const domain of domains) {
    for (const module of domain.modules) {
      ordered.push(...getLessonsByModule(module.id))
    }
  }

  for (const lesson of lessons) {
    if (!ordered.includes(lesson)) ordered.push(lesson)
  }

  return ordered
}

export function getNextLesson(lessonId: string): Lesson | undefined {
  const ordered = getOrderedLessons()
  const index = ordered.findIndex((lesson) => lesson.id === lessonId)
  return index === -1 ? undefined : ordered[index + 1]
}

export function getPreviousLesson(lessonId: string): Lesson | undefined {
  const ordered = getOrderedLessons()
  const index = ordered.findIndex((lesson) => lesson.id === lessonId)
  return index <= 0 ? undefined : ordered[index - 1]
}

export function getDomainProgress(
  domainId: string | number,
  completedLessonIds: readonly string[] = [],
): DomainProgress {
  const id =
    typeof domainId === 'number'
      ? `domain-${String(domainId).padStart(2, '0')}`
      : domainId
  const domain = domainById.get(id)

  if (!domain) {
    return {
      domainId: id,
      totalLessons: 0,
      completedLessons: 0,
      percent: 0,
      status: 'not-started',
    }
  }

  const completed = new Set(completedLessonIds)
  const domainLessonIds = domain.modules.flatMap((module) => module.lessonIds)
  const completedLessons = domainLessonIds.filter((lessonId) => completed.has(lessonId)).length
  const totalLessons = domainLessonIds.length
  const percent = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100)

  return {
    domainId: id,
    totalLessons,
    completedLessons,
    percent,
    status:
      completedLessons === 0
        ? 'not-started'
        : completedLessons === totalLessons
          ? 'complete'
          : 'in-progress',
  }
}

/** Resolves a lesson's separated content into one object for rendering. */
export function getLessonContent(slug: string | undefined): LessonContent | undefined {
  const lesson = getLessonBySlug(slug)
  if (!lesson) return undefined

  return {
    lesson,
    learningObjectives: lesson.learningObjectives,
    sections: resolveIds(lesson.sectionIds, sectionById).sort((a, b) => a.order - b.order),
    diagrams: resolveIds(lesson.diagramIds, diagramById),
    codeExamples: resolveIds(lesson.codeExampleIds, codeExampleById),
    comparisons: resolveIds(lesson.comparisonIds, comparisonById),
    quiz: lesson.quizId ? quizById.get(lesson.quizId) ?? null : null,
    practicalChallenge: lesson.practicalChallengeId
      ? challengeById.get(lesson.practicalChallengeId) ?? null
      : null,
    summary: lesson.summaryId ? summaryById.get(lesson.summaryId) ?? null : null,
  }
}

export function getModulesByDomain(domainId: string): Module[] {
  return domains.find((domain) => domain.id === domainId)?.modules ?? []
}

export function getAllLessons(): Lesson[] {
  return lessons
}
