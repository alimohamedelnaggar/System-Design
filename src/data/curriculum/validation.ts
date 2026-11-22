import type { ValidationIssue } from '../../types/curriculum.ts'
import {
  BLUEPRINT_DOMAIN_COUNT,
  BLUEPRINT_MODULE_COUNTS,
  BLUEPRINT_PLANNED_LESSONS,
  BLUEPRINT_PUBLISHED_LESSONS,
  BLUEPRINT_TOTAL_MODULES,
} from './blueprint.ts'
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
import { getLessonsByModule } from './lookup.ts'
import { checkQuizStandard } from './quizStandards.ts'
import { quizzes } from './quizzes.ts'

interface Identifiable {
  id: string
}

interface Sluggable {
  slug: string
}

interface EntityGroup {
  label: string
  items: readonly Identifiable[]
}

const quizQuestions = quizzes.flatMap((quiz) => quiz.questions)
const quizOptions = quizQuestions.flatMap((question) => question.options)
const comparisonRows = comparisons.flatMap((comparison) => comparison.rows)
const diagramNodes = diagrams.flatMap((diagram) => diagram.nodes)
const diagramEdges = diagrams.flatMap((diagram) => diagram.edges)

const entityGroups: EntityGroup[] = [
  { label: 'domain', items: domains },
  { label: 'module', items: modules },
  { label: 'lesson', items: lessons },
  { label: 'section', items: lessonSections },
  { label: 'diagram', items: diagrams },
  { label: 'diagram node', items: diagramNodes },
  { label: 'diagram edge', items: diagramEdges },
  { label: 'code example', items: codeExamples },
  { label: 'comparison', items: comparisons },
  { label: 'comparison row', items: comparisonRows },
  { label: 'quiz', items: quizzes },
  { label: 'quiz question', items: quizQuestions },
  { label: 'quiz option', items: quizOptions },
  { label: 'practical challenge', items: practicalChallenges },
  { label: 'lesson summary', items: lessonSummaries },
]

function findDuplicateIds(items: readonly Identifiable[], label: string): ValidationIssue[] {
  const seen = new Set<string>()
  const issues: ValidationIssue[] = []

  for (const item of items) {
    if (seen.has(item.id)) {
      issues.push({
        code: 'duplicate-id',
        entity: label,
        message: `Duplicate ${label} id: ${item.id}`,
      })
    }
    seen.add(item.id)
  }

  return issues
}

function findDuplicateSlugs(items: readonly Sluggable[], label: string): ValidationIssue[] {
  const seen = new Set<string>()
  const issues: ValidationIssue[] = []

  for (const item of items) {
    if (seen.has(item.slug)) {
      issues.push({
        code: 'duplicate-slug',
        entity: label,
        message: `Duplicate ${label} slug: ${item.slug}`,
      })
    }
    seen.add(item.slug)
  }

  return issues
}

function findCrossGroupDuplicateIds(groups: readonly EntityGroup[]): ValidationIssue[] {
  const owner = new Map<string, string>()
  const issues: ValidationIssue[] = []

  for (const group of groups) {
    for (const item of group.items) {
      const previousOwner = owner.get(item.id)
      if (previousOwner && previousOwner !== group.label) {
        issues.push({
          code: 'duplicate-id',
          entity: group.label,
          message: `Id ${item.id} is used by both ${previousOwner} and ${group.label}`,
        })
      } else {
        owner.set(item.id, group.label)
      }
    }
  }

  return issues
}

function requireText(
  value: string,
  entity: string,
  field: string,
  issues: ValidationIssue[],
): void {
  if (value.trim().length === 0) {
    issues.push({
      code: 'missing-required-metadata',
      entity,
      message: `Missing required ${field} on ${entity}`,
    })
  }
}

function checkReferences(
  ids: readonly string[],
  available: ReadonlySet<string>,
  entity: string,
  field: string,
  issues: ValidationIssue[],
): void {
  for (const id of ids) {
    if (!available.has(id)) {
      issues.push({
        code: 'missing-module-reference',
        entity,
        message: `${entity} references missing ${field}: ${id}`,
      })
    }
  }
}

/** Returns every detected curriculum problem; an empty array means valid data. */
export function validateCurriculum(): ValidationIssue[] {
  const issues: ValidationIssue[] = []

  // Approved blueprint shape.
  if (domains.length !== BLUEPRINT_DOMAIN_COUNT) {
    issues.push({
      code: 'blueprint-mismatch',
      entity: 'curriculum',
      message: `Expected ${BLUEPRINT_DOMAIN_COUNT} domains, found ${domains.length}`,
    })
  }
  if (modules.length !== BLUEPRINT_TOTAL_MODULES) {
    issues.push({
      code: 'blueprint-mismatch',
      entity: 'curriculum',
      message: `Expected ${BLUEPRINT_TOTAL_MODULES} modules, found ${modules.length}`,
    })
  }
  for (const [index, expected] of BLUEPRINT_MODULE_COUNTS.entries()) {
    const domainNumber = index + 1
    const actual = modules.filter((module) => module.domainId === `domain-${String(domainNumber).padStart(2, '0')}`).length
    if (actual !== expected) {
      issues.push({
        code: 'blueprint-mismatch',
        entity: `domain-${String(domainNumber).padStart(2, '0')}`,
        message: `Expected ${expected} modules, found ${actual}`,
      })
    }
  }
  if (lessons.length !== BLUEPRINT_TOTAL_MODULES) {
    issues.push({
      code: 'blueprint-mismatch',
      entity: 'curriculum',
      message: `Expected ${BLUEPRINT_TOTAL_MODULES} lesson metadata records, found ${lessons.length}`,
    })
  }
  const publishedLessons = lessons.filter((lesson) => lesson.status === 'published').length
  const plannedLessons = lessons.filter((lesson) => lesson.status === 'planned').length
  if (publishedLessons !== BLUEPRINT_PUBLISHED_LESSONS || plannedLessons !== BLUEPRINT_PLANNED_LESSONS) {
    issues.push({
      code: 'blueprint-mismatch',
      entity: 'curriculum',
      message: `Expected ${BLUEPRINT_PUBLISHED_LESSONS} published and ${BLUEPRINT_PLANNED_LESSONS} planned lessons, found ${publishedLessons} and ${plannedLessons}`,
    })
  }

  // Duplicate ids and slugs.
  for (const group of entityGroups) {
    issues.push(...findDuplicateIds(group.items, group.label))
  }
  issues.push(...findCrossGroupDuplicateIds(entityGroups))
  issues.push(...findDuplicateSlugs(domains, 'domain'))
  issues.push(...findDuplicateSlugs(modules, 'module'))
  issues.push(...findDuplicateSlugs(lessons, 'lesson'))

  // References between entities.
  const domainIds = new Set(domains.map((domain) => domain.id))
  const moduleIds = new Set(modules.map((module) => module.id))
  const lessonIds = new Set(lessons.map((lesson) => lesson.id))
  const sectionIds = new Set(lessonSections.map((section) => section.id))
  const diagramIds = new Set(diagrams.map((diagram) => diagram.id))
  const codeExampleIds = new Set(codeExamples.map((example) => example.id))
  const comparisonIds = new Set(comparisons.map((comparison) => comparison.id))
  const quizIds = new Set(quizzes.map((quiz) => quiz.id))
  const challengeIds = new Set(practicalChallenges.map((challenge) => challenge.id))
  const summaryIds = new Set(lessonSummaries.map((summary) => summary.id))
  const diagramNodeIds = new Set(diagramNodes.map((node) => node.id))

  for (const module of modules) {
    checkReferences([module.domainId], domainIds, module.id, 'domain', issues)
    checkReferences(module.lessonIds, lessonIds, module.id, 'lesson', issues)
  }

  for (const lesson of lessons) {
    checkReferences([lesson.moduleId], moduleIds, lesson.id, 'module', issues)
    checkReferences(lesson.sectionIds, sectionIds, lesson.id, 'section', issues)
    checkReferences(lesson.diagramIds, diagramIds, lesson.id, 'diagram', issues)
    checkReferences(lesson.codeExampleIds, codeExampleIds, lesson.id, 'code example', issues)
    checkReferences(lesson.comparisonIds, comparisonIds, lesson.id, 'comparison', issues)
    if (lesson.quizId) checkReferences([lesson.quizId], quizIds, lesson.id, 'quiz', issues)
    if (lesson.practicalChallengeId) {
      checkReferences([lesson.practicalChallengeId], challengeIds, lesson.id, 'challenge', issues)
    }
    if (lesson.summaryId) {
      checkReferences([lesson.summaryId], summaryIds, lesson.id, 'summary', issues)
    }
  }

  for (const diagram of diagrams) {
    checkReferences(
      diagram.edges.flatMap((edge) => [edge.source, edge.target]),
      diagramNodeIds,
      diagram.id,
      'diagram node',
      issues,
    )
  }

  // Lesson and module ordering.
  for (const domain of domains) {
    const moduleOrders = domain.modules.map((module) => module.order)
    if (moduleOrders.some((order, index) => order !== index + 1)) {
      issues.push({
        code: 'invalid-lesson-order',
        entity: domain.id,
        message: 'Module orders must be sequential from 1 within a domain',
      })
    }

    for (const module of domain.modules) {
      if (domain.moduleLessonCounts[module.id] !== module.lessonIds.length) {
        issues.push({
          code: 'missing-required-metadata',
          entity: domain.id,
          message: `Module lesson count mismatch for ${module.id}`,
        })
      }
    }
  }

  for (const module of modules) {
    const moduleLessons = getLessonsByModule(module.id)
    const hasValidOrder = moduleLessons.every(
      (lesson, index) => lesson.order === index + 1 && lesson.number === lesson.order,
    )
    const idsMatchOrder =
      module.lessonIds.join('|') === moduleLessons.map((lesson) => lesson.id).join('|')

    if (!hasValidOrder || !idsMatchOrder) {
      issues.push({
        code: 'invalid-lesson-order',
        entity: module.id,
        message: 'Lesson order, number and module lessonIds must agree and start at 1',
      })
    }
  }

  for (const lesson of lessons) {
    const lessonSections = lesson.sectionIds
      .map((id) => lessonSectionsById.get(id))
      .filter((section): section is NonNullable<typeof section> => section !== undefined)
      .sort((first, second) => first.order - second.order)

    if (lessonSections.some((section, index) => section.order !== index + 1)) {
      issues.push({
        code: 'invalid-lesson-order',
        entity: lesson.id,
        message: 'Section orders must be sequential from 1 within a lesson',
      })
    }
  }

  // Required metadata.
  for (const domain of domains) {
    requireText(domain.id, domain.id, 'id', issues)
    requireText(domain.slug, domain.id, 'slug', issues)
    requireText(domain.title, domain.id, 'title', issues)
    requireText(domain.description, domain.id, 'description', issues)
    if (domain.number < 1 || domain.estimatedHours <= 0 || domain.modules.length === 0) {
      issues.push({
        code: 'missing-required-metadata',
        entity: domain.id,
        message: 'Domain needs a positive number, estimated hours and at least one module',
      })
    }
    if (domain.learningObjectives.length === 0) {
      issues.push({
        code: 'missing-required-metadata',
        entity: domain.id,
        message: 'Domain needs at least one learning objective',
      })
    }
  }

  for (const module of modules) {
    requireText(module.id, module.id, 'id', issues)
    requireText(module.slug, module.id, 'slug', issues)
    requireText(module.title, module.id, 'title', issues)
    requireText(module.description, module.id, 'description', issues)
    requireText(module.number, module.id, 'number', issues)
    if (module.estimatedHours <= 0 || module.lessonIds.length === 0) {
      issues.push({
        code: 'missing-required-metadata',
        entity: module.id,
        message: 'Module needs positive estimated hours and at least one lesson',
      })
    }
  }

  for (const lesson of lessons) {
    requireText(lesson.id, lesson.id, 'id', issues)
    requireText(lesson.slug, lesson.id, 'slug', issues)
    requireText(lesson.title, lesson.id, 'title', issues)
    requireText(lesson.description, lesson.id, 'description', issues)
    if (lesson.number < 1 || lesson.order < 1 || lesson.estimatedMinutes <= 0) {
      issues.push({
        code: 'missing-required-metadata',
        entity: lesson.id,
        message: 'Lesson needs positive number, order and estimated minutes',
      })
    }
    if (lesson.status === 'published') {
      if (lesson.learningObjectives.length === 0 || lesson.sectionIds.length === 0 || !lesson.summaryId) {
        issues.push({
          code: 'missing-required-metadata',
          entity: lesson.id,
          message: 'Published lesson needs objectives, at least one section and a summary',
        })
      }
    }
  }

  for (const quiz of quizzes) {
    requireText(quiz.id, quiz.id, 'id', issues)
    if (quiz.passThreshold < 0 || quiz.passThreshold > 1 || quiz.questions.length === 0) {
      issues.push({
        code: 'missing-required-metadata',
        entity: quiz.id,
        message: 'Quiz needs a pass threshold between 0 and 1 and at least one question',
      })
    }
    for (const question of quiz.questions) {
      const correctCount = question.options.filter((option) => option.isCorrect).length
      if (question.options.length < 2 || correctCount !== 1) {
        issues.push({
          code: 'missing-required-metadata',
          entity: question.id,
          message: 'Quiz question needs at least two options and exactly one correct option',
        })
      }
    }
    for (const violation of checkQuizStandard(quiz)) {
      issues.push({
        code: 'quiz-standard-mismatch',
        entity: quiz.id,
        message: `Quiz standard ${quiz.standard ?? 'sample'} expects ${violation.expected} ${violation.field} but found ${violation.actual}`,
      })
    }
  }

  return issues
}

const lessonSectionsById = new Map(lessonSections.map((section) => [section.id, section]))

/** Throws when the curriculum data is inconsistent. Useful in tests and dev startup. */
export function assertValidCurriculum(): void {
  const issues = validateCurriculum()
  if (issues.length > 0) {
    const details = issues.map((issue) => `[${issue.code}] ${issue.entity}: ${issue.message}`)
    throw new Error(`Invalid curriculum data:\n${details.join('\n')}`)
  }
}
