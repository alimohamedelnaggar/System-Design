import assert from 'node:assert/strict'
import test from 'node:test'
import type { Quiz } from '../src/types/curriculum.ts'
import {
  assertValidCurriculum,
  BLUEPRINT_DOMAIN_COUNT,
  BLUEPRINT_MODULE_COUNTS,
  BLUEPRINT_PLANNED_LESSONS,
  BLUEPRINT_PUBLISHED_LESSONS,
  BLUEPRINT_TOTAL_MODULES,
  checkQuizStandard,
  codeExamples,
  comparisons,
  diagrams,
  domains,
  getAllDomains,
  getAllLessons,
  getBlueprintModuleCount,
  getDomainBySlug,
  getDomainProgress,
  getLessonBySlug,
  getLessonContent,
  getLessonsByModule,
  getModuleBySlug,
  getNextLesson,
  getPreviousLesson,
  getQuizStandard,
  lessons,
  lessonSections,
  lessonSummaries,
  matchesBlueprint,
  modules,
  practicalChallenges,
  QUIZ_STANDARDS,
  quizzes,
  validateCurriculum,
} from '../src/data/curriculum/index.ts'
import { getSimulationBySlug } from '../src/features/simulations/registry/simulationLookup.ts'

test('getAllDomains returns eight uniquely identified domains', () => {
  const all = getAllDomains()
  assert.equal(all.length, BLUEPRINT_DOMAIN_COUNT)
  assert.equal(new Set(all.map((domain) => domain.id)).size, BLUEPRINT_DOMAIN_COUNT)
  assert.equal(new Set(all.map((domain) => domain.slug)).size, BLUEPRINT_DOMAIN_COUNT)
  assert.deepEqual(
    all.map((domain) => domain.number),
    [1, 2, 3, 4, 5, 6, 7, 8],
  )
  assert.equal(all.reduce((total, domain) => total + domain.modules.length, 0), BLUEPRINT_TOTAL_MODULES)
})

test('every domain has its exact approved module count', () => {
  assert.deepEqual([...BLUEPRINT_MODULE_COUNTS], [7, 7, 8, 7, 8, 8, 9, 13])
  assert.deepEqual(
    domains.map((domain) => domain.modules.length),
    [...BLUEPRINT_MODULE_COUNTS],
  )
  assert.deepEqual(
    modules.map((module) => module.domainId),
    domains.flatMap((domain) => domain.modules.map(() => domain.id)),
  )
  assert.ok(
    matchesBlueprint(domains.map((domain) => domain.modules.length)),
    'domain module counts must match the blueprint',
  )
  assert.equal(getBlueprintModuleCount(8), 13)
  assert.equal(getBlueprintModuleCount(9), undefined)
})

test('modules are numbered and ordered sequentially inside each domain', () => {
  for (const domain of domains) {
    assert.deepEqual(
      domain.modules.map((module) => module.order),
      Array.from({ length: domain.modules.length }, (_, index) => index + 1),
    )
    assert.deepEqual(
      domain.modules.map((module) => module.number),
      domain.modules.map((module) => `${domain.number}.${module.order}`),
    )
  }
})

test('the curriculum contains 67 modules and 67 lesson metadata records', () => {
  assert.equal(modules.length, 67)
  assert.equal(lessons.length, 67)
  assert.equal(getAllLessons().length, modules.length)
  assert.equal(new Set(modules.map((module) => module.id)).size, modules.length)
  assert.equal(new Set(modules.map((module) => module.slug)).size, modules.length)
  assert.equal(new Set(lessons.map((lesson) => lesson.id)).size, lessons.length)
  assert.equal(new Set(lessons.map((lesson) => lesson.slug)).size, lessons.length)
})

test('module and lesson counts agree for every domain', () => {
  for (const domain of domains) {
    const domainLessons = lessons.filter((lesson) => lesson.moduleId.startsWith(`module-${domain.number}-`))
    assert.equal(domainLessons.length, domain.modules.length)
    assert.equal(
      domain.modules.reduce((total, module) => total + module.lessonIds.length, 0),
      domain.modules.length,
    )
    for (const module of domain.modules) {
      assert.equal(module.lessonIds.length, 1)
      assert.equal(domain.moduleLessonCounts[module.id], 1)
      assert.equal(getLessonsByModule(module.id).length, 1)
    }
  }
})

test('sixteen published lessons remain and all other lessons are planned', () => {
  const published = lessons.filter((lesson) => lesson.status === 'published')
  const planned = lessons.filter((lesson) => lesson.status === 'planned')
  assert.equal(published.length, BLUEPRINT_PUBLISHED_LESSONS)
  assert.equal(planned.length, BLUEPRINT_PLANNED_LESSONS)
  assert.deepEqual(published.map((lesson) => lesson.id), [
    'lesson-1-1',
    'lesson-1-2',
    'lesson-1-3',
    'lesson-1-4',
    'lesson-1-5',
    'lesson-1-6',
    'lesson-2-1',
    'lesson-2-2',
    'lesson-2-3',
    'lesson-2-4',
    'lesson-2-5',
    'lesson-2-6',
    'lesson-2-7',
    'lesson-3-1',
    'lesson-3-2',
    'lesson-3-3',
  ])
  assert.ok(planned.every((lesson) => lesson.sectionIds.length === 0 && lesson.quizId === null))
})

test('getDomainBySlug resolves valid and invalid slugs', () => {
  assert.equal(getDomainBySlug('system-design-fundamentals')?.number, 1)
  assert.equal(getDomainBySlug('networking-communication')?.number, 2)
  assert.equal(getDomainBySlug('not-a-domain'), undefined)
  assert.equal(getDomainBySlug(undefined), undefined)
})

test('getModuleBySlug resolves approved modules', () => {
  const module = getModuleBySlug('module-1-1-what-is-system-design')
  assert.equal(module?.number, '1.1')
  assert.equal(module?.title, 'What is System Design?')
  assert.equal(getModuleBySlug('module-9-9-missing'), undefined)
  assert.equal(getModuleBySlug(undefined), undefined)
})

test('getLessonBySlug resolves all sixteen published lessons', () => {
  const firstLesson = getLessonBySlug('what-is-system-design')
  assert.equal(firstLesson?.id, 'lesson-1-1')
  assert.equal(firstLesson?.moduleId, 'module-1-1')
  assert.equal(firstLesson?.status, 'published')

  const secondLesson = getLessonBySlug('requirements-and-constraints')
  assert.equal(secondLesson?.id, 'lesson-1-2')
  assert.equal(secondLesson?.moduleId, 'module-1-2')
  assert.equal(secondLesson?.status, 'published')
  assert.equal(secondLesson?.title, 'Client-Server Architecture')

  const thirdLesson = getLessonBySlug('core-building-blocks')
  assert.equal(thirdLesson?.id, 'lesson-1-3')
  assert.equal(thirdLesson?.moduleId, 'module-1-3')
  assert.equal(thirdLesson?.slug, 'core-building-blocks')
  assert.equal(thirdLesson?.status, 'published')
  assert.equal(thirdLesson?.title, 'Web Fundamentals')

  const fourthLesson = getLessonBySlug('trade-offs-and-design-decisions')
  assert.equal(fourthLesson?.id, 'lesson-1-4')
  assert.equal(fourthLesson?.moduleId, 'module-1-4')
  assert.equal(fourthLesson?.slug, 'trade-offs-and-design-decisions')
  assert.equal(fourthLesson?.status, 'published')
  assert.equal(fourthLesson?.title, 'APIs')

  const fifthLesson = getLessonBySlug('sketching-your-first-design')
  assert.equal(fifthLesson?.id, 'lesson-1-5')
  assert.equal(fifthLesson?.moduleId, 'module-1-5')
  assert.equal(fifthLesson?.slug, 'sketching-your-first-design')
  assert.equal(fifthLesson?.status, 'published')
  assert.equal(fifthLesson?.title, 'Performance Basics')

  const sixthLesson = getLessonBySlug('back-of-the-envelope-scale-estimation')
  assert.equal(sixthLesson?.id, 'lesson-1-6')
  assert.equal(sixthLesson?.moduleId, 'module-1-6')
  assert.equal(sixthLesson?.slug, 'back-of-the-envelope-scale-estimation')
  assert.equal(sixthLesson?.status, 'published')
  assert.equal(sixthLesson?.title, 'Architecture Styles')

  const seventhLesson = getLessonBySlug('the-request-lifecycle')
  assert.equal(seventhLesson?.id, 'lesson-2-1')
  assert.equal(seventhLesson?.moduleId, 'module-2-1')
  assert.equal(seventhLesson?.slug, 'the-request-lifecycle')
  assert.equal(seventhLesson?.status, 'published')
  assert.equal(seventhLesson?.title, 'Network Foundations')

  const eighthLesson = getLessonBySlug('tcp-http-and-tls-fundamentals')
  assert.equal(eighthLesson?.id, 'lesson-2-2')
  assert.equal(eighthLesson?.moduleId, 'module-2-2')
  assert.equal(eighthLesson?.slug, 'tcp-http-and-tls-fundamentals')
  assert.equal(eighthLesson?.status, 'published')
  assert.equal(eighthLesson?.title, 'HTTP Deep Dive')

  const ninthLesson = getLessonBySlug('routing-and-the-public-internet')
  assert.equal(ninthLesson?.id, 'lesson-2-3')
  assert.equal(ninthLesson?.moduleId, 'module-2-3')
  assert.equal(ninthLesson?.slug, 'routing-and-the-public-internet')
  assert.equal(ninthLesson?.status, 'published')
  assert.equal(ninthLesson?.title, 'Communication Patterns')

  const tenthLesson = getLessonBySlug('latency-bandwidth-and-failure-modes')
  assert.equal(tenthLesson?.id, 'lesson-2-4')
  assert.equal(tenthLesson?.moduleId, 'module-2-4')
  assert.equal(tenthLesson?.slug, 'latency-bandwidth-and-failure-modes')
  assert.equal(tenthLesson?.status, 'published')
  assert.equal(tenthLesson?.title, 'API Communication')

  const eleventhLesson = getLessonBySlug('choosing-the-right-protocol')
  assert.equal(eleventhLesson?.id, 'lesson-2-5')
  assert.equal(eleventhLesson?.moduleId, 'module-2-5')
  assert.equal(eleventhLesson?.slug, 'choosing-the-right-protocol')
  assert.equal(eleventhLesson?.status, 'published')
  assert.equal(eleventhLesson?.title, 'Real-Time Communication')

  const twelfthLesson = getLessonBySlug('dns-and-name-resolution')
  assert.equal(twelfthLesson?.id, 'lesson-2-6')
  assert.equal(twelfthLesson?.moduleId, 'module-2-6')
  assert.equal(twelfthLesson?.slug, 'dns-and-name-resolution')
  assert.equal(twelfthLesson?.status, 'published')
  assert.equal(twelfthLesson?.title, 'Load Balancing')

  const thirteenthLesson = getLessonBySlug('streaming-and-long-lived-connections')
  assert.equal(thirteenthLesson?.id, 'lesson-2-7')
  assert.equal(thirteenthLesson?.moduleId, 'module-2-7')
  assert.equal(thirteenthLesson?.slug, 'streaming-and-long-lived-connections')
  assert.equal(thirteenthLesson?.status, 'published')
  assert.equal(thirteenthLesson?.title, 'Reverse Proxy')

  const fourteenthLesson = getLessonBySlug('relational-vs-nosql-models')
  assert.equal(fourteenthLesson?.id, 'lesson-3-1')
  assert.equal(fourteenthLesson?.moduleId, 'module-3-1')
  assert.equal(fourteenthLesson?.slug, 'relational-vs-nosql-models')
  assert.equal(fourteenthLesson?.status, 'published')
  assert.equal(fourteenthLesson?.title, 'Database Fundamentals')

  const fifteenthLesson = getLessonBySlug('schema-design-for-access-patterns')
  assert.equal(fifteenthLesson?.id, 'lesson-3-2')
  assert.equal(fifteenthLesson?.moduleId, 'module-3-2')
  assert.equal(fifteenthLesson?.slug, 'schema-design-for-access-patterns')
  assert.equal(fifteenthLesson?.status, 'published')
  assert.equal(fifteenthLesson?.title, 'SQL Databases')

  const sixteenthLesson = getLessonBySlug('indexes-and-query-performance')
  assert.equal(sixteenthLesson?.id, 'lesson-3-3')
  assert.equal(sixteenthLesson?.moduleId, 'module-3-3')
  assert.equal(sixteenthLesson?.slug, 'indexes-and-query-performance')
  assert.equal(sixteenthLesson?.status, 'published')
  assert.equal(sixteenthLesson?.title, 'Database Performance')
  assert.equal(getLessonBySlug('missing-lesson'), undefined)
  assert.equal(getLessonBySlug(undefined), undefined)
})

test('getLessonsByModule returns ordered lessons', () => {
  const firstModuleLessons = getLessonsByModule('module-1-1')
  assert.equal(firstModuleLessons.length, 1)
  assert.equal(firstModuleLessons[0]?.id, 'lesson-1-1')
  assert.deepEqual(
    getLessonsByModule('module-1-2').map((lesson) => lesson.id),
    ['lesson-1-2'],
  )
  assert.deepEqual(
    getLessonsByModule('module-1-3').map((lesson) => lesson.id),
    ['lesson-1-3'],
  )
  assert.deepEqual(
    getLessonsByModule('module-1-4').map((lesson) => lesson.id),
    ['lesson-1-4'],
  )
  assert.deepEqual(
    getLessonsByModule('module-1-5').map((lesson) => lesson.id),
    ['lesson-1-5'],
  )
  assert.deepEqual(
    getLessonsByModule('module-1-6').map((lesson) => lesson.id),
    ['lesson-1-6'],
  )
  assert.deepEqual(
    getLessonsByModule('module-2-1').map((lesson) => lesson.id),
    ['lesson-2-1'],
  )
  assert.deepEqual(
    getLessonsByModule('module-2-2').map((lesson) => lesson.id),
    ['lesson-2-2'],
  )
  assert.deepEqual(
    getLessonsByModule('module-2-3').map((lesson) => lesson.id),
    ['lesson-2-3'],
  )
  assert.deepEqual(
    getLessonsByModule('module-2-4').map((lesson) => lesson.id),
    ['lesson-2-4'],
  )
  assert.deepEqual(
    getLessonsByModule('module-2-5').map((lesson) => lesson.id),
    ['lesson-2-5'],
  )
  assert.deepEqual(
    getLessonsByModule('module-2-6').map((lesson) => lesson.id),
    ['lesson-2-6'],
  )
  assert.deepEqual(
    getLessonsByModule('module-3-1').map((lesson) => lesson.id),
    ['lesson-3-1'],
  )
  assert.deepEqual(
    getLessonsByModule('module-3-2').map((lesson) => lesson.id),
    ['lesson-3-2'],
  )
  assert.deepEqual(
    getLessonsByModule('module-3-3').map((lesson) => lesson.id),
    ['lesson-3-3'],
  )
  assert.deepEqual(getLessonsByModule('module-9-9'), [])
})

test('getNextLesson walks across modules and domains', () => {
  assert.equal(getNextLesson('lesson-1-1')?.id, 'lesson-1-2')
  assert.equal(getNextLesson('lesson-1-2')?.id, 'lesson-1-3')
  assert.equal(getNextLesson('lesson-1-3')?.id, 'lesson-1-4')
  assert.equal(getNextLesson('lesson-1-4')?.id, 'lesson-1-5')
  assert.equal(getNextLesson('lesson-1-5')?.id, 'lesson-1-6')
  assert.equal(getNextLesson('lesson-1-6')?.id, 'lesson-1-7')
  assert.equal(getNextLesson('lesson-1-7')?.id, 'lesson-2-1')
  assert.equal(getNextLesson('lesson-2-1')?.id, 'lesson-2-2')
  assert.equal(getNextLesson('lesson-2-2')?.id, 'lesson-2-3')
  assert.equal(getNextLesson('lesson-2-3')?.id, 'lesson-2-4')
  assert.equal(getNextLesson('lesson-2-4')?.id, 'lesson-2-5')
  assert.equal(getNextLesson('lesson-2-5')?.id, 'lesson-2-6')
  assert.equal(getNextLesson('lesson-2-6')?.id, 'lesson-2-7')
  assert.equal(getNextLesson('lesson-2-7')?.id, 'lesson-3-1')
  assert.equal(getNextLesson('lesson-3-1')?.id, 'lesson-3-2')
  assert.equal(getNextLesson('lesson-3-2')?.id, 'lesson-3-3')
  assert.equal(getNextLesson('lesson-3-3')?.id, 'lesson-3-4')
  assert.equal(getNextLesson('lesson-8-13'), undefined)
  assert.equal(getNextLesson('unknown'), undefined)
})

test('getPreviousLesson walks backwards across modules and domains', () => {
  assert.equal(getPreviousLesson('lesson-1-2')?.id, 'lesson-1-1')
  assert.equal(getPreviousLesson('lesson-1-3')?.id, 'lesson-1-2')
  assert.equal(getPreviousLesson('lesson-1-4')?.id, 'lesson-1-3')
  assert.equal(getPreviousLesson('lesson-1-5')?.id, 'lesson-1-4')
  assert.equal(getPreviousLesson('lesson-1-6')?.id, 'lesson-1-5')
  assert.equal(getPreviousLesson('lesson-2-1')?.id, 'lesson-1-7')
  assert.equal(getPreviousLesson('lesson-2-2')?.id, 'lesson-2-1')
  assert.equal(getPreviousLesson('lesson-2-3')?.id, 'lesson-2-2')
  assert.equal(getPreviousLesson('lesson-2-4')?.id, 'lesson-2-3')
  assert.equal(getPreviousLesson('lesson-2-5')?.id, 'lesson-2-4')
  assert.equal(getPreviousLesson('lesson-2-6')?.id, 'lesson-2-5')
  assert.equal(getPreviousLesson('lesson-2-7')?.id, 'lesson-2-6')
  assert.equal(getPreviousLesson('lesson-3-1')?.id, 'lesson-2-7')
  assert.equal(getPreviousLesson('lesson-3-2')?.id, 'lesson-3-1')
  assert.equal(getPreviousLesson('lesson-3-3')?.id, 'lesson-3-2')
  assert.equal(getPreviousLesson('lesson-1-1'), undefined)
  assert.equal(getPreviousLesson('unknown'), undefined)
})

test('getDomainProgress derives progress from completed lesson ids', () => {
  const notStarted = getDomainProgress('domain-01')
  assert.deepEqual(notStarted, {
    domainId: 'domain-01',
    totalLessons: 7,
    completedLessons: 0,
    percent: 0,
    status: 'not-started',
  })

  const inProgress = getDomainProgress(1, ['lesson-1-1'])
  assert.equal(inProgress.completedLessons, 1)
  assert.equal(inProgress.percent, 14)
  assert.equal(inProgress.status, 'in-progress')

  const unknown = getDomainProgress('domain-99')
  assert.equal(unknown.totalLessons, 0)
  assert.equal(unknown.status, 'not-started')
})

test('getLessonContent resolves every separated content store', () => {
  const content = getLessonContent('what-is-system-design')
  assert.ok(content)
  assert.equal(content.lesson.id, 'lesson-1-1')
  assert.equal(content.learningObjectives.length, 10)
  assert.equal(content.sections.length, 12)
  assert.equal(content.diagrams.length, 3)
  assert.equal(content.codeExamples.length, 2)
  assert.equal(content.comparisons.length, 1)
  assert.equal(content.quiz?.questions.length, 5)
  assert.ok(content.practicalChallenge)
  assert.ok(content.summary)

  const secondContent = getLessonContent('requirements-and-constraints')
  assert.ok(secondContent)
  assert.equal(secondContent.lesson.id, 'lesson-1-2')
  assert.equal(secondContent.learningObjectives.length, 12)
  assert.equal(secondContent.sections.length, 13)
  assert.equal(secondContent.diagrams.length, 4)
  assert.equal(secondContent.codeExamples.length, 3)
  assert.equal(secondContent.comparisons.length, 2)
  assert.equal(secondContent.quiz?.questions.length, 5)
  assert.ok(secondContent.practicalChallenge)
  assert.ok(secondContent.summary)

  const thirdContent = getLessonContent('core-building-blocks')
  assert.ok(thirdContent)
  assert.equal(thirdContent.lesson.id, 'lesson-1-3')
  assert.equal(thirdContent.lesson.title, 'Web Fundamentals')
  assert.equal(thirdContent.learningObjectives.length, 12)
  assert.equal(thirdContent.sections.length, 14)
  assert.equal(thirdContent.diagrams.length, 4)
  assert.equal(thirdContent.codeExamples.length, 3)
  assert.equal(thirdContent.comparisons.length, 2)
  assert.equal(thirdContent.quiz?.id, 'quiz-1-3')
  assert.equal(thirdContent.quiz?.questions.length, 5)
  assert.equal(thirdContent.practicalChallenge?.id, 'challenge-1-3')
  assert.equal(thirdContent.summary?.id, 'summary-1-3')
  assert.equal(thirdContent.lesson.metadata?.simulationSlug, undefined)

  const fourthContent = getLessonContent('trade-offs-and-design-decisions')
  assert.ok(fourthContent)
  assert.equal(fourthContent.lesson.id, 'lesson-1-4')
  assert.equal(fourthContent.lesson.title, 'APIs')
  assert.equal(fourthContent.learningObjectives.length, 12)
  assert.equal(fourthContent.sections.length, 14)
  assert.equal(fourthContent.diagrams.length, 4)
  assert.equal(fourthContent.codeExamples.length, 3)
  assert.equal(fourthContent.comparisons.length, 3)
  assert.equal(fourthContent.quiz?.id, 'quiz-1-4')
  assert.equal(fourthContent.quiz?.questions.length, 5)
  assert.equal(fourthContent.practicalChallenge?.id, 'challenge-1-4')
  assert.equal(fourthContent.summary?.id, 'summary-1-4')
  assert.equal(fourthContent.lesson.metadata?.simulationSlug, undefined)

  const fifthContent = getLessonContent('sketching-your-first-design')
  assert.ok(fifthContent)
  assert.equal(fifthContent.lesson.id, 'lesson-1-5')
  assert.equal(fifthContent.lesson.moduleId, 'module-1-5')
  assert.equal(fifthContent.lesson.slug, 'sketching-your-first-design')
  assert.equal(fifthContent.lesson.title, 'Performance Basics')
  assert.equal(fifthContent.lesson.status, 'published')
  assert.equal(fifthContent.learningObjectives.length, 12)
  assert.equal(fifthContent.sections.length, 14)
  assert.equal(fifthContent.diagrams.length, 4)
  assert.equal(fifthContent.codeExamples.length, 3)
  assert.equal(fifthContent.comparisons.length, 3)
  assert.equal(fifthContent.quiz?.id, 'quiz-1-5')
  assert.equal(fifthContent.quiz?.questions.length, 5)
  assert.equal(fifthContent.practicalChallenge?.id, 'challenge-1-5')
  assert.equal(fifthContent.summary?.id, 'summary-1-5')
  assert.equal(fifthContent.lesson.metadata?.simulationSlug, undefined)

  const sixthContent = getLessonContent('back-of-the-envelope-scale-estimation')
  assert.ok(sixthContent)
  assert.equal(sixthContent.lesson.id, 'lesson-1-6')
  assert.equal(sixthContent.lesson.moduleId, 'module-1-6')
  assert.equal(sixthContent.lesson.slug, 'back-of-the-envelope-scale-estimation')
  assert.equal(sixthContent.lesson.title, 'Architecture Styles')
  assert.equal(sixthContent.lesson.status, 'published')
  assert.equal(sixthContent.learningObjectives.length, 12)
  assert.equal(sixthContent.sections.length, 16)
  assert.equal(sixthContent.diagrams.length, 5)
  assert.equal(sixthContent.codeExamples.length, 3)
  assert.equal(sixthContent.comparisons.length, 3)
  assert.equal(sixthContent.quiz?.id, 'quiz-1-6')
  assert.equal(sixthContent.quiz?.questions.length, 5)
  assert.equal(sixthContent.practicalChallenge?.id, 'challenge-1-6')
  assert.equal(sixthContent.summary?.id, 'summary-1-6')
  assert.equal(sixthContent.lesson.metadata?.simulationSlug, undefined)

  const seventhContent = getLessonContent('the-request-lifecycle')
  assert.ok(seventhContent)
  assert.equal(seventhContent.lesson.id, 'lesson-2-1')
  assert.equal(seventhContent.lesson.moduleId, 'module-2-1')
  assert.equal(seventhContent.lesson.slug, 'the-request-lifecycle')
  assert.equal(seventhContent.lesson.title, 'Network Foundations')
  assert.equal(seventhContent.lesson.status, 'published')
  assert.equal(seventhContent.learningObjectives.length, 12)
  assert.equal(seventhContent.sections.length, 16)
  assert.equal(seventhContent.diagrams.length, 5)
  assert.equal(seventhContent.codeExamples.length, 3)
  assert.equal(seventhContent.comparisons.length, 3)
  assert.equal(seventhContent.quiz?.id, 'quiz-2-1')
  assert.equal(seventhContent.quiz?.questions.length, 5)
  assert.equal(seventhContent.practicalChallenge?.id, 'challenge-2-1')
  assert.equal(seventhContent.summary?.id, 'summary-2-1')
  assert.equal(seventhContent.lesson.metadata?.simulationSlug, undefined)

  const eighthContent = getLessonContent('tcp-http-and-tls-fundamentals')
  assert.ok(eighthContent)
  assert.equal(eighthContent.lesson.id, 'lesson-2-2')
  assert.equal(eighthContent.lesson.moduleId, 'module-2-2')
  assert.equal(eighthContent.lesson.slug, 'tcp-http-and-tls-fundamentals')
  assert.equal(eighthContent.lesson.title, 'HTTP Deep Dive')
  assert.equal(eighthContent.lesson.status, 'published')
  assert.equal(eighthContent.learningObjectives.length, 12)
  assert.equal(eighthContent.sections.length, 15)
  assert.equal(eighthContent.diagrams.length, 5)
  assert.equal(eighthContent.codeExamples.length, 3)
  assert.equal(eighthContent.comparisons.length, 3)
  assert.equal(eighthContent.quiz?.id, 'quiz-2-2')
  assert.equal(eighthContent.quiz?.questions.length, 5)
  assert.equal(eighthContent.practicalChallenge?.id, 'challenge-2-2')
  assert.equal(eighthContent.summary?.id, 'summary-2-2')
  assert.equal(eighthContent.lesson.metadata?.simulationSlug, undefined)

  const ninthContent = getLessonContent('routing-and-the-public-internet')
  assert.ok(ninthContent)
  assert.equal(ninthContent.lesson.id, 'lesson-2-3')
  assert.equal(ninthContent.lesson.moduleId, 'module-2-3')
  assert.equal(ninthContent.lesson.slug, 'routing-and-the-public-internet')
  assert.equal(ninthContent.lesson.title, 'Communication Patterns')
  assert.equal(ninthContent.lesson.status, 'published')
  assert.equal(ninthContent.learningObjectives.length, 12)
  assert.equal(ninthContent.sections.length, 16)
  assert.equal(ninthContent.diagrams.length, 5)
  assert.equal(ninthContent.codeExamples.length, 3)
  assert.equal(ninthContent.comparisons.length, 3)
  assert.equal(ninthContent.quiz?.id, 'quiz-2-3')
  assert.equal(ninthContent.quiz?.questions.length, 5)
  assert.equal(ninthContent.practicalChallenge?.id, 'challenge-2-3')
  assert.equal(ninthContent.summary?.id, 'summary-2-3')
  assert.equal(ninthContent.lesson.metadata?.simulationSlug, undefined)

  const tenthContent = getLessonContent('latency-bandwidth-and-failure-modes')
  assert.ok(tenthContent)
  assert.equal(tenthContent.lesson.id, 'lesson-2-4')
  assert.equal(tenthContent.lesson.moduleId, 'module-2-4')
  assert.equal(tenthContent.lesson.slug, 'latency-bandwidth-and-failure-modes')
  assert.equal(tenthContent.lesson.title, 'API Communication')
  assert.equal(tenthContent.lesson.status, 'published')
  assert.equal(tenthContent.learningObjectives.length, 12)
  assert.equal(tenthContent.sections.length, 16)
  assert.equal(tenthContent.diagrams.length, 5)
  assert.equal(tenthContent.codeExamples.length, 3)
  assert.equal(tenthContent.comparisons.length, 3)
  assert.equal(tenthContent.quiz?.id, 'quiz-2-4')
  assert.equal(tenthContent.quiz?.questions.length, 5)
  assert.equal(tenthContent.practicalChallenge?.id, 'challenge-2-4')
  assert.equal(tenthContent.summary?.id, 'summary-2-4')
  assert.equal(tenthContent.lesson.metadata?.simulationSlug, undefined)

  const eleventhContent = getLessonContent('choosing-the-right-protocol')
  assert.ok(eleventhContent)
  assert.equal(eleventhContent.lesson.id, 'lesson-2-5')
  assert.equal(eleventhContent.lesson.moduleId, 'module-2-5')
  assert.equal(eleventhContent.lesson.slug, 'choosing-the-right-protocol')
  assert.equal(eleventhContent.lesson.title, 'Real-Time Communication')
  assert.equal(eleventhContent.lesson.status, 'published')
  assert.equal(eleventhContent.learningObjectives.length, 12)
  assert.equal(eleventhContent.sections.length, 16)
  assert.equal(eleventhContent.diagrams.length, 5)
  assert.equal(eleventhContent.codeExamples.length, 3)
  assert.equal(eleventhContent.comparisons.length, 3)
  assert.equal(eleventhContent.quiz?.id, 'quiz-2-5')
  assert.equal(eleventhContent.quiz?.questions.length, 5)
  assert.equal(eleventhContent.practicalChallenge?.id, 'challenge-2-5')
  assert.equal(eleventhContent.summary?.id, 'summary-2-5')
  assert.equal(eleventhContent.lesson.metadata?.simulationSlug, undefined)

  const twelfthContent = getLessonContent('dns-and-name-resolution')
  assert.ok(twelfthContent)
  assert.equal(twelfthContent.lesson.id, 'lesson-2-6')
  assert.equal(twelfthContent.lesson.moduleId, 'module-2-6')
  assert.equal(twelfthContent.lesson.slug, 'dns-and-name-resolution')
  assert.equal(twelfthContent.lesson.title, 'Load Balancing')
  assert.equal(twelfthContent.lesson.status, 'published')
  assert.equal(twelfthContent.learningObjectives.length, 12)
  assert.equal(twelfthContent.sections.length, 16)
  assert.equal(twelfthContent.diagrams.length, 5)
  assert.equal(twelfthContent.codeExamples.length, 3)
  assert.equal(twelfthContent.comparisons.length, 3)
  assert.equal(twelfthContent.quiz?.id, 'quiz-2-6')
  assert.equal(twelfthContent.quiz?.questions.length, 5)
  assert.equal(twelfthContent.practicalChallenge?.id, 'challenge-2-6')
  assert.equal(twelfthContent.summary?.id, 'summary-2-6')
  assert.equal(twelfthContent.lesson.metadata?.simulationSlug, undefined)

  assert.equal(getLessonContent('missing'), undefined)
})

test('published lesson metadata stays associated with Domain 01 and Module 1.1', () => {
  const lesson = getLessonBySlug('what-is-system-design')
  assert.ok(lesson)
  assert.equal(lesson.id, 'lesson-1-1')
  assert.equal(lesson.moduleId, 'module-1-1')
  assert.equal(lesson.status, 'published')
  assert.deepEqual(
    getLessonBySlug('what-is-system-design')?.learningObjectives.map((objective) => objective.id),
    Array.from({ length: 10 }, (_, index) => `objective-1-1-${index + 1}`),
  )
  assert.equal(new Set(lesson.learningObjectives.map((objective) => objective.id)).size, 10)
})

test('published lesson metadata stays associated with Domain 01 and Module 1.2', () => {
  const lesson = getLessonBySlug('requirements-and-constraints')
  assert.ok(lesson)
  assert.equal(lesson.id, 'lesson-1-2')
  assert.equal(lesson.moduleId, 'module-1-2')
  assert.equal(lesson.slug, 'requirements-and-constraints')
  assert.equal(lesson.title, 'Client-Server Architecture')
  assert.equal(lesson.status, 'published')
  assert.equal(lesson.learningObjectives.length, 12)
  assert.equal(lesson.sectionIds.length, 13)
  assert.equal(lesson.diagramIds.length, 4)
  assert.equal(lesson.codeExampleIds.length, 3)
  assert.equal(lesson.comparisonIds.length, 2)
  assert.equal(lesson.quizId, 'quiz-1-2')
  assert.equal(lesson.practicalChallengeId, 'challenge-1-2')
  assert.equal(lesson.summaryId, 'summary-1-2')
  assert.deepEqual(
    lesson.learningObjectives.map((objective) => objective.id),
    Array.from({ length: 12 }, (_, index) => `objective-1-2-${index + 1}`),
  )
  assert.equal(new Set(lesson.learningObjectives.map((objective) => objective.id)).size, 12)
})

test('published lesson metadata stays associated with Domain 01 and Module 1.3', () => {
  const lesson = getLessonBySlug('core-building-blocks')
  assert.ok(lesson)
  assert.equal(lesson.id, 'lesson-1-3')
  assert.equal(lesson.moduleId, 'module-1-3')
  assert.equal(lesson.slug, 'core-building-blocks')
  assert.equal(lesson.title, 'Web Fundamentals')
  assert.equal(lesson.status, 'published')
  assert.equal(lesson.learningObjectives.length, 12)
  assert.equal(lesson.sectionIds.length, 14)
  assert.equal(lesson.diagramIds.length, 4)
  assert.equal(lesson.codeExampleIds.length, 3)
  assert.equal(lesson.comparisonIds.length, 2)
  assert.equal(lesson.quizId, 'quiz-1-3')
  assert.equal(lesson.practicalChallengeId, 'challenge-1-3')
  assert.equal(lesson.summaryId, 'summary-1-3')
  assert.deepEqual(
    lesson.learningObjectives.map((objective) => objective.id),
    Array.from({ length: 12 }, (_, index) => `objective-1-3-${index + 1}`),
  )
  assert.equal(new Set(lesson.learningObjectives.map((objective) => objective.id)).size, 12)
  assert.deepEqual(
    lesson.sectionIds,
    Array.from({ length: 14 }, (_, index) => `section-1-3-${index + 1}`),
  )
  assert.equal(lesson.metadata?.simulationSlug, undefined)
})

test('published lesson metadata stays associated with Domain 01 and Module 1.4', () => {
  const lesson = getLessonBySlug('trade-offs-and-design-decisions')
  assert.ok(lesson)
  assert.equal(lesson.id, 'lesson-1-4')
  assert.equal(lesson.moduleId, 'module-1-4')
  assert.equal(lesson.slug, 'trade-offs-and-design-decisions')
  assert.equal(lesson.title, 'APIs')
  assert.equal(lesson.status, 'published')
  assert.equal(lesson.learningObjectives.length, 12)
  assert.equal(lesson.sectionIds.length, 14)
  assert.equal(lesson.diagramIds.length, 4)
  assert.equal(lesson.codeExampleIds.length, 3)
  assert.equal(lesson.comparisonIds.length, 3)
  assert.equal(lesson.quizId, 'quiz-1-4')
  assert.equal(lesson.practicalChallengeId, 'challenge-1-4')
  assert.equal(lesson.summaryId, 'summary-1-4')
  assert.deepEqual(
    lesson.learningObjectives.map((objective) => objective.id),
    Array.from({ length: 12 }, (_, index) => `objective-1-4-${index + 1}`),
  )
  assert.equal(new Set(lesson.learningObjectives.map((objective) => objective.id)).size, 12)
  assert.deepEqual(
    lesson.sectionIds,
    Array.from({ length: 14 }, (_, index) => `section-1-4-${index + 1}`),
  )
  assert.equal(lesson.metadata?.simulationSlug, undefined)
})

test('published lesson metadata stays associated with Domain 01 and Module 1.5', () => {
  const lesson = getLessonBySlug('sketching-your-first-design')
  assert.ok(lesson)
  assert.equal(lesson.id, 'lesson-1-5')
  assert.equal(lesson.moduleId, 'module-1-5')
  assert.equal(lesson.slug, 'sketching-your-first-design')
  assert.equal(lesson.title, 'Performance Basics')
  assert.equal(lesson.status, 'published')
  assert.equal(lesson.learningObjectives.length, 12)
  assert.equal(lesson.sectionIds.length, 14)
  assert.equal(lesson.diagramIds.length, 4)
  assert.equal(lesson.codeExampleIds.length, 3)
  assert.equal(lesson.comparisonIds.length, 3)
  assert.equal(lesson.quizId, 'quiz-1-5')
  assert.equal(lesson.practicalChallengeId, 'challenge-1-5')
  assert.equal(lesson.summaryId, 'summary-1-5')
  assert.deepEqual(
    lesson.learningObjectives.map((objective) => objective.id),
    Array.from({ length: 12 }, (_, index) => `objective-1-5-${index + 1}`),
  )
  assert.equal(new Set(lesson.learningObjectives.map((objective) => objective.id)).size, 12)
  assert.deepEqual(
    lesson.sectionIds,
    Array.from({ length: 14 }, (_, index) => `section-1-5-${index + 1}`),
  )
  assert.deepEqual(lesson.diagramIds, [
    'diagram-1-5-request-timeline',
    'diagram-1-5-latency-throughput',
    'diagram-1-5-latency-percentiles',
    'diagram-1-5-bottleneck',
  ])
  assert.deepEqual(lesson.codeExampleIds, [
    'code-1-5-client-response-time',
    'code-1-5-aspnet-request-duration',
    'code-1-5-throughput-calculation',
  ])
  assert.deepEqual(lesson.comparisonIds, [
    'comparison-1-5-latency-vs-throughput',
    'comparison-1-5-bandwidth-vs-throughput',
    'comparison-1-5-average-vs-percentile',
  ])
  assert.equal(lesson.metadata?.simulationSlug, undefined)
})

test('published lesson metadata stays associated with Domain 01 and Module 1.6', () => {
  const lesson = getLessonBySlug('back-of-the-envelope-scale-estimation')
  assert.ok(lesson)
  assert.equal(lesson.id, 'lesson-1-6')
  assert.equal(lesson.moduleId, 'module-1-6')
  assert.equal(lesson.slug, 'back-of-the-envelope-scale-estimation')
  assert.equal(lesson.number, 1)
  assert.equal(lesson.order, 1)
  assert.equal(lesson.title, 'Architecture Styles')
  assert.equal(lesson.status, 'published')
  assert.equal(lesson.learningObjectives.length, 12)
  assert.equal(lesson.sectionIds.length, 16)
  assert.equal(lesson.diagramIds.length, 5)
  assert.equal(lesson.codeExampleIds.length, 3)
  assert.equal(lesson.comparisonIds.length, 3)
  assert.equal(lesson.quizId, 'quiz-1-6')
  assert.equal(lesson.practicalChallengeId, 'challenge-1-6')
  assert.equal(lesson.summaryId, 'summary-1-6')
  assert.deepEqual(
    lesson.learningObjectives.map((objective) => objective.id),
    Array.from({ length: 12 }, (_, index) => `objective-1-6-${index + 1}`),
  )
  assert.equal(new Set(lesson.learningObjectives.map((objective) => objective.id)).size, 12)
  assert.deepEqual(
    lesson.sectionIds,
    Array.from({ length: 16 }, (_, index) => `section-1-6-${index + 1}`),
  )
  assert.deepEqual(lesson.diagramIds, [
    'diagram-1-6-monolith',
    'diagram-1-6-layered-architecture',
    'diagram-1-6-modular-monolith',
    'diagram-1-6-monolith-vs-modular',
    'diagram-1-6-layered-request-flow',
  ])
  assert.deepEqual(lesson.codeExampleIds, [
    'code-1-6-monolith-structure',
    'code-1-6-layered-flow',
    'code-1-6-module-boundaries',
  ])
  assert.deepEqual(lesson.comparisonIds, [
    'comparison-1-6-monolith-vs-modular-monolith',
    'comparison-1-6-layered-vs-modular-architecture',
    'comparison-1-6-monolith-vs-microservices',
  ])
  assert.equal(lesson.metadata?.simulationSlug, undefined)
})

test('published lesson metadata stays associated with Domain 02 and Module 2.1', () => {
  const lesson = getLessonBySlug('the-request-lifecycle')
  assert.ok(lesson)
  assert.equal(lesson.id, 'lesson-2-1')
  assert.equal(lesson.moduleId, 'module-2-1')
  assert.equal(lesson.slug, 'the-request-lifecycle')
  assert.equal(lesson.number, 1)
  assert.equal(lesson.order, 1)
  assert.equal(lesson.title, 'Network Foundations')
  assert.equal(lesson.status, 'published')
  assert.equal(lesson.learningObjectives.length, 12)
  assert.equal(lesson.sectionIds.length, 16)
  assert.equal(lesson.diagramIds.length, 5)
  assert.equal(lesson.codeExampleIds.length, 3)
  assert.equal(lesson.comparisonIds.length, 3)
  assert.equal(lesson.quizId, 'quiz-2-1')
  assert.equal(lesson.practicalChallengeId, 'challenge-2-1')
  assert.equal(lesson.summaryId, 'summary-2-1')
  assert.deepEqual(
    lesson.learningObjectives.map((objective) => objective.id),
    Array.from({ length: 12 }, (_, index) => `objective-2-1-${index + 1}`),
  )
  assert.equal(new Set(lesson.learningObjectives.map((objective) => objective.id)).size, 12)
  assert.deepEqual(
    lesson.sectionIds,
    Array.from({ length: 16 }, (_, index) => `section-2-1-${index + 1}`),
  )
  assert.deepEqual(lesson.diagramIds, [
    'diagram-2-1-basic-network',
    'diagram-2-1-ip-and-port',
    'diagram-2-1-tcp-handshake',
    'diagram-2-1-tcp-vs-udp',
    'diagram-2-1-end-to-end-flow',
  ])
  assert.deepEqual(lesson.codeExampleIds, [
    'code-2-1-inspect-endpoint',
    'code-2-1-tcp-listener',
    'code-2-1-udp-datagram',
  ])
  assert.deepEqual(lesson.comparisonIds, [
    'comparison-2-1-ipv4-vs-ipv6',
    'comparison-2-1-public-vs-private-ip',
    'comparison-2-1-tcp-vs-udp',
  ])
  assert.equal(lesson.metadata?.simulationSlug, undefined)
})

test('published lesson metadata stays associated with Domain 02 and Module 2.2', () => {
  const lesson = getLessonBySlug('tcp-http-and-tls-fundamentals')
  assert.ok(lesson)
  assert.equal(lesson.id, 'lesson-2-2')
  assert.equal(lesson.moduleId, 'module-2-2')
  assert.equal(lesson.slug, 'tcp-http-and-tls-fundamentals')
  assert.equal(lesson.number, 1)
  assert.equal(lesson.order, 1)
  assert.equal(lesson.title, 'HTTP Deep Dive')
  assert.equal(lesson.status, 'published')
  assert.equal(lesson.estimatedMinutes, 60)
  assert.equal(lesson.learningObjectives.length, 12)
  assert.equal(lesson.sectionIds.length, 15)
  assert.equal(lesson.diagramIds.length, 5)
  assert.equal(lesson.codeExampleIds.length, 3)
  assert.equal(lesson.comparisonIds.length, 3)
  assert.equal(lesson.quizId, 'quiz-2-2')
  assert.equal(lesson.practicalChallengeId, 'challenge-2-2')
  assert.equal(lesson.summaryId, 'summary-2-2')
  assert.deepEqual(
    lesson.learningObjectives.map((objective) => objective.id),
    Array.from({ length: 12 }, (_, index) => `objective-2-2-${index + 1}`),
  )
  assert.equal(new Set(lesson.learningObjectives.map((objective) => objective.id)).size, 12)
  assert.deepEqual(
    lesson.sectionIds,
    Array.from({ length: 15 }, (_, index) => `section-2-2-${index + 1}`),
  )
  assert.deepEqual(lesson.diagramIds, [
    'diagram-2-2-http11-request-flow',
    'diagram-2-2-http2-multiplexing',
    'diagram-2-2-http3-quic-streams',
    'diagram-2-2-keepalive-lifecycle',
    'diagram-2-2-version-comparison',
  ])
  assert.deepEqual(lesson.codeExampleIds, [
    'code-2-2-curl-versions',
    'code-2-2-headers-example',
    'code-2-2-aspnet-response-headers',
  ])
  assert.deepEqual(lesson.comparisonIds, [
    'comparison-2-2-http11-vs-http2',
    'comparison-2-2-http2-vs-http3',
    'comparison-2-2-persistent-vs-tcp-keepalive',
  ])
  assert.equal(lesson.metadata?.simulationSlug, undefined)
})

test('seventh lesson has sixteen ordered sections with accurate network foundations content', () => {
  const expectedTitles = [
    'Introduction: How Computers Communicate',
    'What Is a Computer Network?',
    'IP Addresses',
    'IPv4 vs IPv6',
    'Public vs Private IP Addresses',
    'Ports',
    'IP Address + Port: Identifying an Application Endpoint',
    'What Is TCP?',
    'TCP Three-Way Handshake',
    'TCP Reliability and Flow Control',
    'What Is UDP?',
    'TCP vs UDP',
    'Sockets and Application Communication',
    'How This Works in Real System Design',
    'Common Mistakes and Misconceptions',
    'Key Takeaways',
  ]
  const lesson = getLessonBySlug('the-request-lifecycle')
  assert.ok(lesson)
  const sections = lessonSections.filter((section) => lesson.sectionIds.includes(section.id))

  assert.equal(sections.length, 16)
  assert.deepEqual(
    sections.map((section) => section.order),
    Array.from({ length: 16 }, (_, index) => index + 1),
  )
  assert.deepEqual(sections.map((section) => section.title), expectedTitles)
  assert.equal(sections[0]?.kind, 'introduction')
  assert.equal(sections[3]?.kind, 'tradeoffs')
  assert.equal(sections[4]?.kind, 'tradeoffs')
  assert.equal(sections[6]?.kind, 'process')
  assert.equal(sections[8]?.kind, 'process')
  assert.equal(sections[9]?.kind, 'process')
  assert.equal(sections[11]?.kind, 'tradeoffs')
  assert.equal(sections[12]?.kind, 'process')
  assert.equal(sections[13]?.kind, 'process')
  assert.equal(sections[14]?.kind, 'mistakes')
  assert.ok(sections.every((section) => section.paragraphs.length > 0))
  assert.ok(sections.every((section) => section.paragraphs.every((paragraph) => paragraph.trim().length > 0)))
  assert.ok(sections.every((section) => section.keyPoints && section.keyPoints.length >= 3))
  assert.equal(sections[3]?.tradeoffs?.length, 5)
  assert.equal(sections[4]?.tradeoffs?.length, 5)
  assert.equal(sections[6]?.steps?.length, 6)
  assert.equal(sections[8]?.steps?.length, 5)
  assert.equal(sections[9]?.steps?.length, 6)
  assert.equal(sections[11]?.tradeoffs?.length, 6)
  assert.equal(sections[12]?.steps?.length, 6)
  assert.equal(sections[13]?.steps?.length, 9)
  assert.equal(sections[14]?.commonMistakes?.length, 11)
  assert.ok(sections[0]?.paragraphs.join(' ').includes('How does data travel from one application to another across a network?'))
  assert.ok(sections[2]?.paragraphs.join(' ').includes('192.168.1.10'))
  assert.ok(sections[2]?.paragraphs.join(' ').includes('2001:db8::10'))
  assert.ok(sections[2]?.paragraphs.join(' ').includes('2001:db8::/32'))
  assert.ok(sections[3]?.paragraphs.join(' ').includes('32-bit'))
  assert.ok(sections[3]?.paragraphs.join(' ').includes('128-bit'))
  assert.ok(sections[3]?.paragraphs.join(' ').includes('Dual-stack'))
  assert.ok(sections[4]?.paragraphs.join(' ').includes('10.0.0.0/8'))
  assert.ok(sections[4]?.paragraphs.join(' ').includes('172.16.0.0/12'))
  assert.ok(sections[4]?.paragraphs.join(' ').includes('192.168.0.0/16'))
  assert.ok(sections[4]?.paragraphs.join(' ').includes('Network Address Translation'))
  assert.ok(sections[5]?.paragraphs.join(' ').includes('49152 to 65535'))
  assert.ok(sections[5]?.paragraphs.join(' ').includes('TCP port 443 and UDP port 443'))
  assert.ok(sections[6]?.paragraphs.join(' ').includes('192.168.1.20:51524 → 203.0.113.10:443'))
  assert.ok(sections[6]?.paragraphs.join(' ').includes('203.0.113.0/24'))
  assert.ok(sections[7]?.paragraphs.join(' ').includes('reliable ordered byte stream'))
  assert.ok(sections[8]?.steps?.some((step) => step.title.includes('Server responds with SYN-ACK')))
  assert.ok(sections[9]?.paragraphs.join(' ').includes('Flow control and congestion control solve different problems'))
  assert.ok(sections[10]?.paragraphs.join(' ').includes('User Datagram Protocol'))
  assert.ok(sections[11]?.paragraphs.join(' ').includes('QUIC'))
  assert.ok(sections[12]?.paragraphs.join(' ').includes('operating-system endpoint'))
  assert.ok(sections[13]?.steps?.some((step) => step.title.includes('TLS negotiation occurs')))
  assert.ok(
    sections[15]?.keyPoints?.some((point) =>
      point.includes('Application → Socket → Transport Protocol + Port → IP Address → Network → Destination Application'),
    ),
  )
})

test('seventh lesson diagrams are complete, unique and referenced correctly', () => {
  const lesson = getLessonBySlug('the-request-lifecycle')
  assert.ok(lesson)
  const lessonDiagrams = diagrams.filter((diagram) => lesson.diagramIds.includes(diagram.id))
  assert.equal(lessonDiagrams.length, 5)
  assert.ok(lesson.diagramIds.every((id) => diagrams.some((diagram) => diagram.id === id)))
  assert.ok(lessonDiagrams.every((diagram) => diagram.title.trim().length > 0 && diagram.description.trim().length > 0))
  assert.ok(lessonDiagrams.every((diagram) => diagram.nodes.length >= 3 && diagram.edges.length >= 2))
  assert.deepEqual(
    lessonDiagrams.map((diagram) => diagram.layout),
    ['topology', 'topology', 'flow', 'comparison', 'topology'],
  )
  assert.equal(
    new Set(lessonDiagrams.flatMap((diagram) => diagram.nodes.map((node) => node.id))).size,
    lessonDiagrams.reduce((total, diagram) => total + diagram.nodes.length, 0),
  )
  assert.equal(
    new Set(lessonDiagrams.flatMap((diagram) => diagram.edges.map((edge) => edge.id))).size,
    lessonDiagrams.reduce((total, diagram) => total + diagram.edges.length, 0),
  )
  assert.ok(lessonDiagrams[0]?.nodes.some((node) => node.label === 'Router'))
  assert.ok(lessonDiagrams[0]?.edges.some((edge) => edge.label === 'response path reverses'))
  assert.ok(lessonDiagrams[1]?.nodes.some((node) => node.label === 'Client endpoint 192.168.1.20:51524'))
  assert.ok(lessonDiagrams[1]?.nodes.some((node) => node.label === 'Destination port 443 (listening)'))
  assert.ok(lessonDiagrams[2]?.edges.some((edge) => edge.label.includes('SYN + client initial sequence number')))
  assert.ok(lessonDiagrams[2]?.edges.some((edge) => edge.label.includes('SYN-ACK + server initial sequence number')))
  assert.ok(lessonDiagrams[3]?.nodes.some((node) => node.label === 'Optional application reliability rules'))
  assert.ok(lessonDiagrams[4]?.nodes.some((node) => node.label === 'DNS resolver'))
  assert.ok(lessonDiagrams[4]?.edges.some((edge) => edge.label === 'IP answer, not a connection'))
})

test('seventh lesson code examples and comparisons are complete and referenced correctly', () => {
  const lesson = getLessonBySlug('the-request-lifecycle')
  assert.ok(lesson)
  const lessonExamples = codeExamples.filter((example) => lesson.codeExampleIds.includes(example.id))
  assert.equal(lessonExamples.length, 3)
  assert.deepEqual(lessonExamples.map((example) => example.language), ['bash', 'text', 'text'])
  assert.ok(lessonExamples.every((example) => example.code.trim().length > 0))
  assert.ok(lessonExamples.every((example) => (example.explanation ?? '').trim().length > 0))
  assert.ok(lessonExamples.every((example) => example.code.split('\n').length <= 16))
  assert.ok(lessonExamples[0]?.code.includes('Test-NetConnection'))
  assert.ok(lessonExamples[0]?.code.includes('nc -vz store.example.com 443'))
  assert.ok(lessonExamples[0]?.explanation?.includes('name problem'))
  assert.ok(lessonExamples[1]?.code.includes('new TcpListener(IPAddress.Any, 5000)'))
  assert.ok(lessonExamples[1]?.code.includes('AcceptTcpClientAsync'))
  assert.ok(lessonExamples[1]?.explanation?.includes('framing'))
  assert.ok(lessonExamples[2]?.code.includes('new UdpClient(0)'))
  assert.ok(lessonExamples[2]?.code.includes('SendAsync'))
  assert.ok(lessonExamples[2]?.explanation?.includes('no built-in'))

  const lessonComparisons = comparisons.filter((comparison) => lesson.comparisonIds.includes(comparison.id))
  assert.equal(lessonComparisons.length, 3)
  assert.ok(lessonComparisons.every((comparison) => comparison.columns.length === 2))
  assert.deepEqual(
    lessonComparisons.map((comparison) => comparison.rows.length),
    [6, 6, 8],
  )
  assert.deepEqual(
    lessonComparisons[0]?.rows.map((row) => row.criterion),
    ['Address size', 'Representation', 'Address space', 'Header and protocol differences', 'Deployment considerations', 'Transition approach'],
  )
  assert.deepEqual(
    lessonComparisons[1]?.rows.map((row) => row.criterion),
    ['Reachability', 'Routing', 'Typical use', 'IPv4 examples', 'NAT relationship', 'Security misconception'],
  )
  assert.deepEqual(
    lessonComparisons[2]?.rows.map((row) => row.criterion),
    ['Connection behavior', 'Reliability', 'Ordering', 'Retransmission', 'Data model', 'Overhead and congestion behavior', 'Common applications', 'Application responsibility'],
  )
  assert.ok(lessonComparisons[0]?.summary.includes('different address families'))
  assert.ok(lessonComparisons[1]?.summary.includes('globally routable'))
  assert.ok(lessonComparisons[2]?.summary.includes('reliable ordered byte stream'))
  assert.ok(
    lessonComparisons[2]?.rows.some((row) => (row.values.udp ?? '').includes('HTTP/3')),
  )
})

test('seventh lesson quiz, challenge and summary are complete without a simulation link', () => {
  const quiz = quizzes.find((candidate) => candidate.id === 'quiz-2-1')
  const lesson = getLessonBySlug('the-request-lifecycle')
  assert.ok(quiz && lesson)
  assert.equal(lesson.quizId, quiz.id)
  assert.equal(quiz.title, 'Network Foundations — knowledge check')
  assert.equal(quiz.passThreshold, 0.8)
  assert.equal(quiz.standard, 'final')
  assert.deepEqual(checkQuizStandard(quiz), [])
  assert.equal(quiz.questions.length, 5)
  assert.ok(quiz.questions.every((question) => question.options.length === 4))
  assert.ok(quiz.questions.every((question) => question.options.filter((option) => option.isCorrect).length === 1))
  assert.ok(quiz.questions.every((question) => question.options.every((option) => (option.explanation ?? '').trim().length > 0)))
  assert.deepEqual(
    quiz.questions.map((question) => question.options.findIndex((option) => option.isCorrect)),
    [1, 2, 1, 2, 0],
  )
  assert.equal(lessons.filter((candidate) => candidate.quizId === quiz.id).length, 1)

  const challenge = practicalChallenges.find((candidate) => candidate.id === lesson.practicalChallengeId)
  assert.ok(challenge)
  assert.equal(challenge.id, 'challenge-2-1')
  assert.ok(challenge.scenario.includes('192.168.1.20'))
  assert.ok(challenge.scenario.includes('203.0.113.10'))
  assert.ok(challenge.scenario.includes('documentation'))
  assert.equal(challenge.requirements.length, 9)
  assert.ok(challenge.constraints.length >= 5)
  assert.ok(challenge.deliverables.length >= 4)
  assert.ok(challenge.hints && challenge.hints.length >= 6)
  assert.ok(challenge.requirements.some((requirement) => requirement.includes('four-tuple') || requirement.includes('source and destination endpoints')))
  assert.ok(challenge.requirements.some((requirement) => requirement.includes('UDP')))
  assert.ok(challenge.requirements.some((requirement) => requirement.includes('sockets')))

  const summary = lessonSummaries.find((candidate) => candidate.id === lesson.summaryId)
  assert.ok(summary)
  assert.equal(summary.id, 'summary-2-1')
  assert.ok(summary.keyTakeaways.length >= 10)
  assert.ok(summary.nextSteps && summary.nextSteps.length >= 2)
  assert.ok(
    summary.keyTakeaways.some((takeaway) =>
      takeaway.includes('Application → Socket → Transport Protocol + Port → IP Address → Network → Destination Application'),
    ),
  )
  assert.ok(summary.overview.includes('sockets'))

  const simulationSlug = lesson.metadata?.simulationSlug
  assert.equal(simulationSlug, undefined)
  assert.equal(getSimulationBySlug(simulationSlug), undefined)
})

test('eighth lesson has fifteen ordered sections with accurate HTTP Deep Dive content', () => {
  const expectedTitles = [
    'Introduction: Why HTTP Keeps Evolving',
    'Understanding the HTTP Message Model',
    'HTTP/1.1 Fundamentals',
    'HTTP/1.1 Connection Management',
    'HTTP Keep-Alive: What Does It Actually Mean?',
    'HTTP/1.1 Limitations',
    'HTTP/2: A New Communication Model',
    'HTTP/2 Header Compression and Prioritization',
    'HTTP/2 and Head-of-Line Blocking',
    'HTTP/3: Introducing QUIC',
    'HTTP/3 and Independent Streams',
    'HTTP Headers Deep Dive',
    'Compression and Protocol Negotiation',
    'HTTP Versions Compared in Real Systems',
    'System Design Implications and Key Takeaways',
  ]
  const lesson = getLessonBySlug('tcp-http-and-tls-fundamentals')
  assert.ok(lesson)
  const sections = lessonSections.filter((section) => lesson.sectionIds.includes(section.id))

  assert.equal(sections.length, 15)
  assert.deepEqual(
    sections.map((section) => section.order),
    Array.from({ length: 15 }, (_, index) => index + 1),
  )
  assert.deepEqual(sections.map((section) => section.title), expectedTitles)
  assert.equal(sections[0]?.kind, 'introduction')
  assert.equal(sections[3]?.kind, 'process')
  assert.equal(sections[5]?.kind, 'tradeoffs')
  assert.equal(sections[6]?.kind, 'process')
  assert.equal(sections[8]?.kind, 'process')
  assert.equal(sections[13]?.kind, 'tradeoffs')
  assert.equal(sections[14]?.kind, 'mistakes')
  assert.ok(sections.every((section) => section.paragraphs.length > 0))
  assert.ok(sections.every((section) => section.paragraphs.every((paragraph) => paragraph.trim().length > 0)))
  assert.ok(sections.every((section) => section.keyPoints && section.keyPoints.length >= 3))
  assert.equal(sections[3]?.steps?.length, 6)
  assert.equal(sections[6]?.steps?.length, 5)
  assert.equal(sections[8]?.steps?.length, 5)
  assert.equal(sections[12]?.steps?.length, 5)
  assert.equal(sections[5]?.tradeoffs?.length, 5)
  assert.equal(sections[13]?.tradeoffs?.length, 6)
  assert.equal(sections[14]?.commonMistakes?.length, 9)
  assert.ok(sections[0]?.paragraphs.join(' ').includes('HTTP sits one layer above that machinery'))
  assert.ok(sections[1]?.paragraphs.join(' ').includes('HTTP is commonly described as stateless'))
  assert.ok(sections[4]?.paragraphs.join(' ').includes('TCP keepalive is a different mechanism'))
  assert.ok(sections[7]?.paragraphs.join(' ').includes('HPACK uses a static table'))
  assert.ok(sections[8]?.paragraphs.join(' ').includes('transport-level head-of-line blocking'))
  assert.ok(sections[9]?.paragraphs.join(' ').includes('QUIC runs over UDP'))
  assert.ok(sections[12]?.paragraphs.join(' ').includes('ALPN lets'))
  assert.ok(
    sections[14]?.keyPoints?.some((point) =>
      point.includes('HTTP semantics → framing → transport → negotiation is the core mental model'),
    ),
  )
})

test('eighth lesson diagrams are complete, unique and referenced correctly', () => {
  const lesson = getLessonBySlug('tcp-http-and-tls-fundamentals')
  assert.ok(lesson)
  const lessonDiagrams = diagrams.filter((diagram) => lesson.diagramIds.includes(diagram.id))
  assert.equal(lessonDiagrams.length, 5)
  assert.ok(lesson.diagramIds.every((id) => diagrams.some((diagram) => diagram.id === id)))
  assert.ok(lessonDiagrams.every((diagram) => diagram.title.trim().length > 0 && diagram.description.trim().length > 0))
  assert.ok(lessonDiagrams.every((diagram) => diagram.nodes.length >= 3 && diagram.edges.length >= 2))
  assert.deepEqual(
    lessonDiagrams.map((diagram) => diagram.layout),
    ['timeline', 'flow', 'topology', 'timeline', 'comparison'],
  )
  assert.equal(
    new Set(lessonDiagrams.flatMap((diagram) => diagram.nodes.map((node) => node.id))).size,
    lessonDiagrams.reduce((total, diagram) => total + diagram.nodes.length, 0),
  )
  assert.equal(
    new Set(lessonDiagrams.flatMap((diagram) => diagram.edges.map((edge) => edge.id))).size,
    lessonDiagrams.reduce((total, diagram) => total + diagram.edges.length, 0),
  )
  assert.ok(lessonDiagrams[0]?.nodes.some((node) => node.label === 'One persistent TCP connection'))
  assert.ok(lessonDiagrams[0]?.edges.some((edge) => edge.label === 'TCP + optional TLS setup once'))
  assert.ok(lessonDiagrams[1]?.nodes.some((node) => node.label === 'Binary framing layer'))
  assert.ok(lessonDiagrams[1]?.edges.some((edge) => edge.label === 'ordered frame sequence: 1, 3, 5, 1, 3'))
  assert.ok(lessonDiagrams[2]?.nodes.some((node) => node.label === 'QUIC connection with TLS 1.3'))
  assert.ok(lessonDiagrams[2]?.edges.some((edge) => edge.label === 'delivery continues'))
  assert.ok(lessonDiagrams[3]?.nodes.some((node) => node.label === '8. Connection closes'))
  assert.ok(lessonDiagrams[3]?.edges.some((edge) => edge.label === 'reuse for next request'))
  assert.ok(lessonDiagrams[4]?.nodes.some((node) => node.label === 'QUIC over UDP'))
  assert.ok(lessonDiagrams[4]?.edges.some((edge) => edge.label === 'h3 via QUIC ALPN'))
})

test('eighth lesson code examples and comparisons are complete and referenced correctly', () => {
  const lesson = getLessonBySlug('tcp-http-and-tls-fundamentals')
  assert.ok(lesson)
  const lessonExamples = codeExamples.filter((example) => lesson.codeExampleIds.includes(example.id))
  assert.equal(lessonExamples.length, 3)
  assert.deepEqual(lessonExamples.map((example) => example.language), ['bash', 'text', 'text'])
  assert.ok(lessonExamples.every((example) => example.code.trim().length > 0))
  assert.ok(lessonExamples.every((example) => (example.explanation ?? '').trim().length > 0))
  assert.ok(lessonExamples.every((example) => example.code.split('\n').length <= 16))
  assert.ok(lessonExamples[0]?.code.includes('--http3'))
  assert.ok(lessonExamples[0]?.explanation?.includes('negotiated HTTP version'))
  assert.ok(lessonExamples[1]?.code.includes('Content-Encoding: br'))
  assert.ok(lessonExamples[1]?.explanation?.includes('HPACK'))
  assert.ok(lessonExamples[2]?.code.includes('OnStarting'))
  assert.ok(lessonExamples[2]?.explanation?.includes('protocol negotiation'))

  const lessonComparisons = comparisons.filter((comparison) => lesson.comparisonIds.includes(comparison.id))
  assert.equal(lessonComparisons.length, 3)
  assert.ok(lessonComparisons.every((comparison) => comparison.columns.length === 2))
  assert.deepEqual(
    lessonComparisons.map((comparison) => comparison.rows.length),
    [5, 6, 5],
  )
  assert.deepEqual(
    lessonComparisons[0]?.rows.map((row) => row.criterion),
    ['Framing', 'Multiplexing', 'Connection use', 'Header compression', 'Head-of-line blocking'],
  )
  assert.deepEqual(
    lessonComparisons[1]?.rows.map((row) => row.criterion),
    ['Transport protocol', 'Multiplexing', 'Packet-loss behavior', 'Handshake', 'Connection migration', 'Deployment considerations'],
  )
  assert.deepEqual(
    lessonComparisons[2]?.rows.map((row) => row.criterion),
    ['Layer', 'Purpose', 'Mechanism', 'Typical configuration', 'What it does not guarantee'],
  )
  assert.ok(lessonComparisons[0]?.summary.includes('binary frames and multiplexed streams'))
  assert.ok(lessonComparisons[1]?.summary.includes('QUIC over UDP'))
  assert.ok(lessonComparisons[2]?.summary.includes('reuses application exchanges'))
  assert.ok(
    lessonComparisons[1]?.rows.some((row) => (row.values.h3 ?? '').includes('Connection IDs')),
  )
})

test('eighth lesson quiz, challenge and summary are complete without a simulation link', () => {
  const quiz = quizzes.find((candidate) => candidate.id === 'quiz-2-2')
  const lesson = getLessonBySlug('tcp-http-and-tls-fundamentals')
  assert.ok(quiz && lesson)
  assert.equal(lesson.quizId, quiz.id)
  assert.equal(quiz.title, 'HTTP Deep Dive — knowledge check')
  assert.equal(quiz.passThreshold, 0.8)
  assert.equal(quiz.standard, 'final')
  assert.deepEqual(checkQuizStandard(quiz), [])
  assert.equal(quiz.questions.length, 5)
  assert.ok(quiz.questions.every((question) => question.options.length === 4))
  assert.ok(quiz.questions.every((question) => question.options.filter((option) => option.isCorrect).length === 1))
  assert.ok(quiz.questions.every((question) => question.options.every((option) => (option.explanation ?? '').trim().length > 0)))
  assert.deepEqual(
    quiz.questions.map((question) => question.options.findIndex((option) => option.isCorrect)),
    [2, 3, 1, 1, 3],
  )
  assert.equal(lessons.filter((candidate) => candidate.quizId === quiz.id).length, 1)

  const challenge = practicalChallenges.find((candidate) => candidate.id === lesson.practicalChallengeId)
  assert.ok(challenge)
  assert.equal(challenge.id, 'challenge-2-2')
  assert.equal(challenge.title, 'Challenge: Diagnose HTTP Performance Across Protocol Versions')
  assert.ok(challenge.scenario.includes('unstable mobile networks'))
  assert.equal(challenge.requirements.length, 9)
  assert.equal(challenge.constraints.length, 5)
  assert.equal(challenge.deliverables.length, 5)
  assert.ok(challenge.hints && challenge.hints.length === 6)
  assert.ok(challenge.requirements.some((requirement) => requirement.includes('Expected reasoning')))
  assert.ok(challenge.deliverables.some((deliverable) => deliverable.includes('Evaluation criteria')))
  assert.ok(challenge.hints.some((hint) => hint.includes('Model solution step')))

  const summary = lessonSummaries.find((candidate) => candidate.id === lesson.summaryId)
  assert.ok(summary)
  assert.equal(summary.id, 'summary-2-2')
  assert.ok(summary.keyTakeaways.length >= 14)
  assert.ok(summary.nextSteps && summary.nextSteps.length >= 2)
  assert.ok(
    summary.keyTakeaways.some((takeaway) =>
      takeaway.includes('HTTP semantics → framing → transport → negotiation is the mental model'),
    ),
  )
  assert.ok(summary.overview.includes('HTTP evolution'))

  const simulationSlug = lesson.metadata?.simulationSlug
  assert.equal(simulationSlug, undefined)
  assert.equal(getSimulationBySlug(simulationSlug), undefined)
})

test('content stores contain exactly the sixteen published lessons without mixing their blocks', () => {
  assert.equal(lessonSections.length, 242)
  assert.equal(diagrams.length, 74)
  assert.equal(codeExamples.length, 47)
  assert.equal(comparisons.length, 44)
  assert.equal(quizzes.length, 16)
  assert.equal(practicalChallenges.length, 16)
  assert.equal(lessonSummaries.length, 16)

  const first = getLessonBySlug('what-is-system-design')
  const second = getLessonBySlug('requirements-and-constraints')
  const third = getLessonBySlug('core-building-blocks')
  const fourth = getLessonBySlug('trade-offs-and-design-decisions')
  const fifth = getLessonBySlug('sketching-your-first-design')
  const sixth = getLessonBySlug('back-of-the-envelope-scale-estimation')
  const seventh = getLessonBySlug('the-request-lifecycle')
  const eighth = getLessonBySlug('tcp-http-and-tls-fundamentals')
  const ninth = getLessonBySlug('routing-and-the-public-internet')
  const tenth = getLessonBySlug('latency-bandwidth-and-failure-modes')
  const eleventh = getLessonBySlug('choosing-the-right-protocol')
  const twelfth = getLessonBySlug('dns-and-name-resolution')
  const thirteenth = getLessonBySlug('streaming-and-long-lived-connections')
  const fourteenth = getLessonBySlug('relational-vs-nosql-models')
  const fifteenth = getLessonBySlug('schema-design-for-access-patterns')
  const sixteenth = getLessonBySlug('indexes-and-query-performance')
  assert.ok(first && second && third && fourth && fifth && sixth && seventh && eighth && ninth && tenth && eleventh && twelfth && thirteenth && fourteenth && fifteenth && sixteenth)
  const blockSets = [first, second, third, fourth, fifth, sixth, seventh, eighth, ninth, tenth, eleventh, twelfth, thirteenth, fourteenth, fifteenth, sixteenth].map((lesson) => [
    lesson.sectionIds,
    lesson.diagramIds,
    lesson.codeExampleIds,
    lesson.comparisonIds,
  ])
  for (let left = 0; left < blockSets.length; left += 1) {
    for (let right = left + 1; right < blockSets.length; right += 1) {
      blockSets[left]?.forEach((ids, index) => {
        assert.equal(ids.some((id) => blockSets[right]?.[index]?.includes(id)), false)
      })
    }
  }
})

test('first lesson has twelve ordered sections with the required structure', () => {
  const expectedTitles = [
    'Why Should You Learn System Design?',
    'What Is System Design?',
    'A Real-World Analogy',
    'Main Building Blocks of a Software System',
    'How Components Work Together',
    'Functional Requirements',
    'Non-Functional Requirements',
    'Functional vs Non-Functional Requirements',
    'Why Trade-offs Matter',
    'How to Approach a System Design Problem',
    'Common Mistakes',
    'Key Takeaways',
  ]
  const lesson = getLessonBySlug('what-is-system-design')
  assert.ok(lesson)
  const sections = lessonSections.filter((section) => lesson.sectionIds.includes(section.id))

  assert.equal(sections.length, 12)
  assert.deepEqual(
    sections.map((section) => section.order),
    Array.from({ length: 12 }, (_, index) => index + 1),
  )
  assert.deepEqual(
    sections.map((section) => section.title),
    expectedTitles,
  )
  assert.equal(sections[0]?.kind, 'introduction')
  assert.equal(sections[4]?.kind, 'process')
  assert.equal(sections[8]?.kind, 'tradeoffs')
  assert.equal(sections[9]?.kind, 'process')
  assert.equal(sections[10]?.kind, 'mistakes')
  assert.ok(sections.every((section) => section.paragraphs.length > 0))
  assert.ok(sections.every((section) => section.paragraphs.every((paragraph) => paragraph.trim().length > 0)))
  assert.ok((sections[4]?.steps?.length ?? 0) >= 7)
  assert.ok((sections[8]?.tradeoffs?.length ?? 0) >= 4)
  assert.ok((sections[9]?.steps?.length ?? 0) === 10)
  assert.ok((sections[10]?.commonMistakes?.length ?? 0) >= 7)
})

test('second lesson has thirteen ordered sections with the required structure', () => {
  const expectedTitles = [
    'Introduction: How Do Applications Communicate?',
    'What Is a Client?',
    'What Is a Server?',
    'Client-Server Architecture',
    'Request-Response Model',
    'Real Request Walkthrough',
    'Stateless vs Stateful Communication',
    'What Is Multi-tier Architecture?',
    '2-Tier Architecture',
    '3-Tier Architecture',
    '2-Tier vs 3-Tier Comparison',
    'Common Mistakes',
    'Key Takeaways',
  ]
  const lesson = getLessonBySlug('requirements-and-constraints')
  assert.ok(lesson)
  const sections = lessonSections.filter((section) => lesson.sectionIds.includes(section.id))

  assert.equal(sections.length, 13)
  assert.deepEqual(
    sections.map((section) => section.order),
    Array.from({ length: 13 }, (_, index) => index + 1),
  )
  assert.deepEqual(
    sections.map((section) => section.title),
    expectedTitles,
  )
  assert.equal(sections[0]?.kind, 'introduction')
  assert.equal(sections[3]?.kind, 'tradeoffs')
  assert.equal(sections[4]?.kind, 'process')
  assert.equal(sections[5]?.kind, 'process')
  assert.equal(sections[8]?.kind, 'tradeoffs')
  assert.equal(sections[9]?.kind, 'process')
  assert.equal(sections[11]?.kind, 'mistakes')
  assert.ok(sections.every((section) => section.paragraphs.length > 0))
  assert.ok(sections.every((section) => section.paragraphs.every((paragraph) => paragraph.trim().length > 0)))
  assert.ok(sections.every((section) => section.keyPoints && section.keyPoints.length >= 3))
  assert.equal(sections[4]?.steps?.length, 8)
  assert.equal(sections[5]?.steps?.length, 6)
  assert.equal(sections[9]?.steps?.length, 6)
  assert.ok((sections[3]?.tradeoffs?.length ?? 0) >= 4)
  assert.ok((sections[8]?.tradeoffs?.length ?? 0) >= 3)
  assert.ok((sections[11]?.commonMistakes?.length ?? 0) >= 7)
  assert.ok(sections[1]?.paragraphs.join(' ').includes('backend service'))
  assert.ok(sections[6]?.paragraphs.join(' ').includes('does not mean the application stores no data'))
  assert.ok(sections[9]?.paragraphs.join(' ').includes('Logical tiers are not physical servers'))
})

test('third lesson has fourteen ordered sections with the required structure', () => {
  const expectedTitles = [
    'Introduction: What Happens When You Open a Web Page?',
    'Understanding URLs and Domain Names',
    'What Is HTTP?',
    'HTTP Request Structure',
    'HTTP Response Structure',
    'HTTP vs HTTPS',
    'DNS Fundamentals',
    'DNS Resolution Walkthrough',
    'TCP and the Connection',
    'TLS and the TLS Handshake',
    'The Complete Browser-to-Server Journey',
    'Performance and Security Implications',
    'Common Mistakes and Misconceptions',
    'Key Takeaways',
  ]
  const lesson = getLessonBySlug('core-building-blocks')
  assert.ok(lesson)
  const sections = lessonSections.filter((section) => lesson.sectionIds.includes(section.id))

  assert.equal(sections.length, 14)
  assert.deepEqual(
    sections.map((section) => section.order),
    Array.from({ length: 14 }, (_, index) => index + 1),
  )
  assert.deepEqual(
    sections.map((section) => section.title),
    expectedTitles,
  )
  assert.equal(sections[0]?.kind, 'introduction')
  assert.equal(sections[5]?.kind, 'tradeoffs')
  assert.equal(sections[7]?.kind, 'process')
  assert.equal(sections[8]?.kind, 'process')
  assert.equal(sections[9]?.kind, 'process')
  assert.equal(sections[10]?.kind, 'process')
  assert.equal(sections[11]?.kind, 'tradeoffs')
  assert.equal(sections[12]?.kind, 'mistakes')
  assert.ok(sections.every((section) => section.paragraphs.length > 0))
  assert.ok(sections.every((section) => section.paragraphs.every((paragraph) => paragraph.trim().length > 0)))
  assert.equal(sections[7]?.steps?.length, 7)
  assert.equal(sections[8]?.steps?.length, 4)
  assert.equal(sections[9]?.steps?.length, 4)
  assert.equal(sections[10]?.steps?.length, 10)
  assert.ok((sections[5]?.tradeoffs?.length ?? 0) >= 3)
  assert.ok((sections[11]?.tradeoffs?.length ?? 0) >= 4)
  assert.ok((sections[12]?.commonMistakes?.length ?? 0) >= 7)
  assert.ok(sections[1]?.paragraphs.join(' ').includes('shop.example.com'))
  assert.ok(sections[10]?.steps?.some((step) => step.title.includes('TLS negotiation occurs')))
  assert.ok(
    sections[13]?.paragraphs.join(' ').includes(
      'URL → DNS → IP Address → Transport Connection → TLS → HTTP Request → Server → HTTP Response',
    ),
  )
})

test('fourth lesson has fourteen ordered sections with the required structure', () => {
  const expectedTitles = [
    'Introduction: Why APIs Matter',
    'What Is an API?',
    'API Contracts',
    'REST Fundamentals',
    'Resource-Oriented Endpoint Design',
    'HTTP Methods',
    'JSON Fundamentals',
    'HTTP Status Codes',
    'Request and Response Walkthrough',
    'API Errors and Error Responses',
    'API Design Quality',
    'API Versioning and Compatibility',
    'Common Mistakes and Misconceptions',
    'Key Takeaways',
  ]
  const lesson = getLessonBySlug('trade-offs-and-design-decisions')
  assert.ok(lesson)
  const sections = lessonSections.filter((section) => lesson.sectionIds.includes(section.id))

  assert.equal(sections.length, 14)
  assert.deepEqual(
    sections.map((section) => section.order),
    Array.from({ length: 14 }, (_, index) => index + 1),
  )
  assert.deepEqual(
    sections.map((section) => section.title),
    expectedTitles,
  )
  assert.equal(sections[0]?.kind, 'introduction')
  assert.equal(sections[4]?.kind, 'tradeoffs')
  assert.equal(sections[8]?.kind, 'process')
  assert.equal(sections[10]?.kind, 'tradeoffs')
  assert.equal(sections[12]?.kind, 'mistakes')
  assert.ok(sections.every((section) => section.paragraphs.length > 0))
  assert.ok(sections.every((section) => section.paragraphs.every((paragraph) => paragraph.trim().length > 0)))
  assert.equal(sections[8]?.steps?.length, 8)
  assert.ok((sections[4]?.tradeoffs?.length ?? 0) >= 3)
  assert.ok((sections[10]?.tradeoffs?.length ?? 0) >= 4)
  assert.ok((sections[12]?.commonMistakes?.length ?? 0) >= 7)
  assert.ok(sections[0]?.paragraphs.join(' ').includes('add it to the basket'))
  assert.ok(sections[2]?.paragraphs.join(' ').includes('GET /api/products/42'))
  assert.ok(sections[4]?.paragraphs.join(' ').includes('DELETE /api/products/42'))
  assert.ok(sections[4]?.paragraphs.join(' ').includes('/getProducts'))
  assert.ok(sections[5]?.keyPoints?.some((point) => point.includes('Safe means not intended to change state')))
  assert.ok(sections[7]?.paragraphs.join(' ').includes('429 Too Many Requests'))
  assert.ok(sections[8]?.steps?.some((step) => step.title.includes('Client interprets the response')))
  assert.ok(sections[9]?.paragraphs.join(' ').includes('RFC 9457'))
  assert.ok(sections[11]?.paragraphs.join(' ').includes('URL versioning'))
  assert.ok(
    sections[13]?.keyPoints?.some((point) =>
      point.includes('Client Intent → API Contract → HTTP Request → Server Processing → HTTP Response → Client Interpretation'),
    ),
  )
})

test('fifth lesson has fourteen ordered sections with the required structure', () => {
  const expectedTitles = [
    'Introduction: Why Performance Matters',
    'Understanding System Performance',
    'Latency',
    'Throughput',
    'Bandwidth',
    'Response Time',
    'Latency vs Response Time',
    'How Latency and Throughput Interact',
    'Percentiles and Latency Distribution',
    'Performance Bottlenecks',
    'Performance Measurement and Testing',
    'Performance Trade-offs',
    'Common Mistakes and Misconceptions',
    'Key Takeaways',
  ]
  const lesson = getLessonBySlug('sketching-your-first-design')
  assert.ok(lesson)
  const sections = lessonSections.filter((section) => lesson.sectionIds.includes(section.id))

  assert.equal(sections.length, 14)
  assert.deepEqual(
    sections.map((section) => section.order),
    Array.from({ length: 14 }, (_, index) => index + 1),
  )
  assert.deepEqual(
    sections.map((section) => section.title),
    expectedTitles,
  )
  assert.equal(sections[0]?.kind, 'introduction')
  assert.equal(sections[6]?.kind, 'process')
  assert.equal(sections[11]?.kind, 'tradeoffs')
  assert.equal(sections[12]?.kind, 'mistakes')
  assert.ok(sections.every((section) => section.paragraphs.length > 0))
  assert.ok(sections.every((section) => section.paragraphs.every((paragraph) => paragraph.trim().length > 0)))
  assert.equal(sections[6]?.steps?.length, 6)
  assert.ok((sections[11]?.tradeoffs?.length ?? 0) >= 6)
  assert.ok((sections[12]?.commonMistakes?.length ?? 0) >= 8)
  assert.ok(sections[0]?.paragraphs.join(' ').includes('functionally correct'))
  assert.ok(sections[2]?.paragraphs.join(' ').includes('Network latency'))
  assert.ok(sections[3]?.paragraphs.join(' ').includes('500 requests per second'))
  assert.ok(sections[4]?.paragraphs.join(' ').includes('100 Mbps'))
  assert.ok(sections[5]?.paragraphs.join(' ').includes('Time to first byte'))
  assert.ok(sections[6]?.steps?.some((step) => step.title.includes('Server queues the request')))
  assert.ok(sections[8]?.paragraphs.join(' ').includes('1,000 product requests'))
  assert.ok(sections[9]?.paragraphs.join(' ').includes('database CPU'))
  assert.ok(sections[10]?.paragraphs.join(' ').includes('Stress testing'))
  assert.ok(
    sections[13]?.keyPoints?.some((point) =>
      point.includes('Workload → Resource Utilization → Queueing and Processing → Latency/Response Time → Throughput and User Experience'),
    ),
  )
})

test('sixth lesson has sixteen ordered sections with the required structure', () => {
  const expectedTitles = [
    'Introduction: Why Architecture Matters',
    'What Is Software Architecture?',
    'Understanding Monolithic Architecture',
    'How a Monolith Works',
    'Advantages of Monolithic Architecture',
    'Disadvantages and Challenges of Monolithic Architecture',
    'Layered Architecture',
    'How Layered Architecture Handles a Request',
    'Benefits and Trade-offs of Layered Architecture',
    'Modular Monolith',
    'How Modular Monolith Modules Communicate',
    'Modular Monolith vs Traditional Monolith',
    'Architecture Selection: Which One Should We Choose?',
    'Architecture Quality Attributes',
    'Common Mistakes and Misconceptions',
    'Key Takeaways',
  ]
  const lesson = getLessonBySlug('back-of-the-envelope-scale-estimation')
  assert.ok(lesson)
  const sections = lessonSections.filter((section) => lesson.sectionIds.includes(section.id))

  assert.equal(sections.length, 16)
  assert.deepEqual(
    sections.map((section) => section.order),
    Array.from({ length: 16 }, (_, index) => index + 1),
  )
  assert.deepEqual(
    sections.map((section) => section.title),
    expectedTitles,
  )
  assert.equal(sections[0]?.kind, 'introduction')
  assert.equal(sections[3]?.kind, 'process')
  assert.equal(sections[5]?.kind, 'tradeoffs')
  assert.equal(sections[7]?.kind, 'process')
  assert.equal(sections[8]?.kind, 'tradeoffs')
  assert.equal(sections[10]?.kind, 'process')
  assert.equal(sections[12]?.kind, 'tradeoffs')
  assert.equal(sections[13]?.kind, 'tradeoffs')
  assert.equal(sections[14]?.kind, 'mistakes')
  assert.ok(sections.every((section) => section.paragraphs.length > 0))
  assert.ok(sections.every((section) => section.paragraphs.every((paragraph) => paragraph.trim().length > 0)))
  assert.ok(sections.every((section) => section.keyPoints && section.keyPoints.length >= 3))
  assert.equal(sections[3]?.steps?.length, 7)
  assert.equal(sections[7]?.steps?.length, 6)
  assert.equal(sections[10]?.steps?.length, 6)
  assert.equal(sections[5]?.tradeoffs?.length, 4)
  assert.equal(sections[8]?.tradeoffs?.length, 6)
  assert.equal(sections[12]?.tradeoffs?.length, 5)
  assert.equal(sections[13]?.tradeoffs?.length, 6)
  assert.equal(sections[14]?.commonMistakes?.length, 10)
  assert.ok(sections[0]?.paragraphs.join(' ').includes('How should we organize the application'))
  assert.ok(sections[2]?.paragraphs.join(' ').includes('one deployable unit'))
  assert.ok(sections[3]?.steps?.some((step) => step.title.includes('Application receives it')))
  assert.ok(sections[6]?.paragraphs.join(' ').includes('presentation layer'))
  assert.ok(sections[7]?.steps?.some((step) => step.title.includes('Business layer applies rules')))
  assert.ok(sections[9]?.paragraphs.join(' ').includes('explicit interface'))
  assert.ok(sections[10]?.steps?.some((step) => step.title.includes('Data ownership stays with each module')))
  assert.ok(sections[12]?.paragraphs.join(' ').includes('Scenario A'))
  assert.ok(
    sections[15]?.keyPoints?.some((point) =>
      point.includes('Requirements → Constraints → Components and Responsibilities → Boundaries and Dependencies → Deployment Model → Architectural Trade-offs'),
    ),
  )
})

test('first lesson diagrams are complete, unique and referenced correctly', () => {
  const lesson = getLessonBySlug('what-is-system-design')
  assert.ok(lesson)
  const lessonDiagrams = diagrams.filter((diagram) => lesson.diagramIds.includes(diagram.id))
  assert.equal(lessonDiagrams.length, 3)
  assert.deepEqual(lesson.diagramIds, [
    'diagram-1-1-basic-system',
    'diagram-1-1-request-path',
    'diagram-1-1-system-growth',
  ])
  assert.ok(
    lesson.diagramIds.every((id) => diagrams.some((diagram) => diagram.id === id)),
    'every lesson diagram reference must resolve',
  )
  assert.equal(new Set(diagrams.flatMap((diagram) => diagram.nodes.map((node) => node.id))).size, diagrams.reduce((total, diagram) => total + diagram.nodes.length, 0))
  assert.equal(new Set(diagrams.flatMap((diagram) => diagram.edges.map((edge) => edge.id))).size, diagrams.reduce((total, diagram) => total + diagram.edges.length, 0))
  assert.ok(diagrams.every((diagram) => diagram.title.trim().length > 0 && diagram.description.trim().length > 0))
  assert.ok(diagrams.every((diagram) => diagram.nodes.length >= 3 && diagram.edges.length >= 2))
  assert.ok(diagrams.every((diagram) => ['flow', 'layers', 'topology', 'comparison', 'timeline'].includes(diagram.layout)))
  assert.ok(lessonDiagrams[0]?.nodes.some((node) => node.label === 'Client'))
  assert.ok(lessonDiagrams[0]?.nodes.some((node) => node.label === 'Application server'))
  assert.ok(lessonDiagrams[0]?.nodes.some((node) => node.label === 'Database'))
  assert.ok(lessonDiagrams[1]?.edges.some((edge) => (edge.label ?? '').toLowerCase().includes('hit')))
  assert.ok(lessonDiagrams[1]?.edges.some((edge) => (edge.label ?? '').toLowerCase().includes('miss')))
  assert.equal(lessonDiagrams[2]?.layout, 'comparison')
})

test('second lesson diagrams are complete, unique and referenced correctly', () => {
  const lesson = getLessonBySlug('requirements-and-constraints')
  assert.ok(lesson)
  const lessonDiagrams = diagrams.filter((diagram) => lesson.diagramIds.includes(diagram.id))
  assert.deepEqual(lesson.diagramIds, [
    'diagram-1-2-basic-client-server',
    'diagram-1-2-request-lifecycle',
    'diagram-1-2-two-tier',
    'diagram-1-2-three-tier',
  ])
  assert.equal(lessonDiagrams.length, 4)
  assert.ok(lesson.diagramIds.every((id) => diagrams.some((diagram) => diagram.id === id)))
  assert.ok(lessonDiagrams.every((diagram) => diagram.title.trim().length > 0 && diagram.description.trim().length > 0))
  assert.ok(lessonDiagrams.every((diagram) => diagram.nodes.length >= 3 && diagram.edges.length >= 2))
  assert.equal(new Set(lessonDiagrams.flatMap((diagram) => diagram.nodes.map((node) => node.id))).size, 14)
  assert.equal(new Set(lessonDiagrams.flatMap((diagram) => diagram.edges.map((edge) => edge.id))).size, 16)
  assert.ok(lessonDiagrams[0]?.nodes.some((node) => node.label === 'Network'))
  assert.ok(lessonDiagrams[0]?.edges.some((edge) => edge.label === 'request'))
  assert.ok(lessonDiagrams[0]?.edges.some((edge) => edge.label === 'response'))
  assert.ok(lessonDiagrams[1]?.nodes.every((node) => /^[1-5]\./.test(node.label)))
  assert.ok(lessonDiagrams[2]?.nodes.some((node) => node.label === 'Database server'))
  assert.ok(lessonDiagrams[3]?.nodes.some((node) => node.label === 'Presentation tier'))
  assert.ok(lessonDiagrams[3]?.nodes.some((node) => node.label === 'Application tier'))
  assert.ok(lessonDiagrams[3]?.nodes.some((node) => node.label === 'Data tier'))
  assert.ok(lessonDiagrams[3]?.edges.some((edge) => edge.label === 'request'))
  assert.ok(lessonDiagrams[3]?.edges.some((edge) => edge.label === 'response'))
})

test('third lesson diagrams are complete, unique and referenced correctly', () => {
  const lesson = getLessonBySlug('core-building-blocks')
  assert.ok(lesson)
  assert.deepEqual(lesson.diagramIds, [
    'diagram-1-3-url-anatomy',
    'diagram-1-3-dns-resolution',
    'diagram-1-3-tcp-handshake',
    'diagram-1-3-https-lifecycle',
  ])
  const lessonDiagrams = diagrams.filter((diagram) => lesson.diagramIds.includes(diagram.id))
  assert.equal(lessonDiagrams.length, 4)
  assert.ok(lesson.diagramIds.every((id) => diagrams.some((diagram) => diagram.id === id)))
  assert.ok(lessonDiagrams.every((diagram) => diagram.title.trim().length > 0 && diagram.description.trim().length > 0))
  assert.ok(lessonDiagrams.every((diagram) => diagram.nodes.length >= 3 && diagram.edges.length >= 2))
  assert.equal(
    new Set(diagrams.flatMap((diagram) => diagram.nodes.map((node) => node.id))).size,
    diagrams.reduce((total, diagram) => total + diagram.nodes.length, 0),
  )
  assert.equal(
    new Set(diagrams.flatMap((diagram) => diagram.edges.map((edge) => edge.id))).size,
    diagrams.reduce((total, diagram) => total + diagram.edges.length, 0),
  )
  assert.ok(lessonDiagrams[0]?.nodes.some((node) => node.label === 'shop.example.com'))
  assert.ok(lessonDiagrams[0]?.nodes.some((node) => node.label === '?category=lamps'))
  assert.ok(lessonDiagrams[1]?.nodes.some((node) => node.label === 'Recursive resolver'))
  assert.ok(lessonDiagrams[1]?.nodes.some((node) => node.label === '.com TLD server'))
  assert.ok(lessonDiagrams[1]?.nodes.some((node) => node.label === 'Authoritative server'))
  assert.deepEqual(
    lessonDiagrams[2]?.edges.map((edge) => edge.label),
    ['SYN', 'SYN-ACK', 'ACK', 'connection ready'],
  )
  assert.ok(lessonDiagrams[3]?.nodes.some((node) => node.label === 'TLS handshake'))
  assert.ok(lessonDiagrams[3]?.nodes.some((node) => node.label === 'HTTP response'))
  assert.ok(lessonDiagrams[3]?.edges.some((edge) => edge.label === 'render'))
})

test('fourth lesson diagrams are complete, unique and referenced correctly', () => {
  const lesson = getLessonBySlug('trade-offs-and-design-decisions')
  assert.ok(lesson)
  assert.deepEqual(lesson.diagramIds, [
    'diagram-1-4-api-boundary',
    'diagram-1-4-request-anatomy',
    'diagram-1-4-rest-resource-model',
    'diagram-1-4-request-lifecycle',
  ])
  const lessonDiagrams = diagrams.filter((diagram) => lesson.diagramIds.includes(diagram.id))
  assert.equal(lessonDiagrams.length, 4)
  assert.ok(lesson.diagramIds.every((id) => diagrams.some((diagram) => diagram.id === id)))
  assert.ok(lessonDiagrams.every((diagram) => diagram.title.trim().length > 0 && diagram.description.trim().length > 0))
  assert.ok(lessonDiagrams.every((diagram) => diagram.nodes.length >= 3 && diagram.edges.length >= 2))
  assert.equal(
    new Set(diagrams.flatMap((diagram) => diagram.nodes.map((node) => node.id))).size,
    diagrams.reduce((total, diagram) => total + diagram.nodes.length, 0),
  )
  assert.equal(
    new Set(diagrams.flatMap((diagram) => diagram.edges.map((edge) => edge.id))).size,
    diagrams.reduce((total, diagram) => total + diagram.edges.length, 0),
  )
  assert.ok(lessonDiagrams[0]?.nodes.some((node) => node.label === 'API contract'))
  assert.ok(lessonDiagrams[0]?.nodes.some((node) => node.label === 'Data storage'))
  assert.ok(lessonDiagrams[1]?.nodes.some((node) => node.label === '/api/products/42'))
  assert.ok(lessonDiagrams[1]?.nodes.some((node) => node.label === 'Optional JSON body'))
  assert.ok(lessonDiagrams[2]?.nodes.some((node) => node.label === '/api/products'))
  assert.ok(lessonDiagrams[2]?.nodes.some((node) => node.label === 'PATCH partial'))
  assert.ok(lessonDiagrams[3]?.nodes.some((node) => node.label === 'Validation'))
  assert.ok(lessonDiagrams[3]?.nodes.some((node) => node.label === 'Client interpretation'))
  assert.ok(lessonDiagrams[3]?.edges.some((edge) => edge.label === 'return to client'))
})

test('fifth lesson diagrams are complete, unique and referenced correctly', () => {
  const lesson = getLessonBySlug('sketching-your-first-design')
  assert.ok(lesson)
  assert.deepEqual(lesson.diagramIds, [
    'diagram-1-5-request-timeline',
    'diagram-1-5-latency-throughput',
    'diagram-1-5-latency-percentiles',
    'diagram-1-5-bottleneck',
  ])
  const lessonDiagrams = diagrams.filter((diagram) => lesson.diagramIds.includes(diagram.id))
  assert.equal(lessonDiagrams.length, 4)
  assert.ok(lesson.diagramIds.every((id) => diagrams.some((diagram) => diagram.id === id)))
  assert.ok(lessonDiagrams.every((diagram) => diagram.title.trim().length > 0 && diagram.description.trim().length > 0))
  assert.ok(lessonDiagrams.every((diagram) => diagram.nodes.length >= 3 && diagram.edges.length >= 2))
  assert.equal(
    new Set(diagrams.flatMap((diagram) => diagram.nodes.map((node) => node.id))).size,
    diagrams.reduce((total, diagram) => total + diagram.nodes.length, 0),
  )
  assert.equal(
    new Set(diagrams.flatMap((diagram) => diagram.edges.map((edge) => edge.id))).size,
    diagrams.reduce((total, diagram) => total + diagram.edges.length, 0),
  )
  assert.equal(lessonDiagrams[0]?.layout, 'timeline')
  assert.ok(lessonDiagrams[0]?.nodes.some((node) => node.label === 'Server queue'))
  assert.ok(lessonDiagrams[0]?.nodes.some((node) => node.label === 'Client receives response'))
  assert.ok(lessonDiagrams[1]?.nodes.some((node) => node.label === 'Throughput ceiling'))
  assert.ok(lessonDiagrams[1]?.nodes.some((node) => node.label === 'Latency rise'))
  assert.ok(lessonDiagrams[2]?.nodes.some((node) => node.label === 'p95'))
  assert.ok(lessonDiagrams[2]?.nodes.some((node) => node.label === 'p99'))
  assert.ok(lessonDiagrams[2]?.nodes.some((node) => node.label === 'Long-tail requests'))
  assert.ok(lessonDiagrams[3]?.nodes.some((node) => node.label === 'Database (bottleneck)'))
  assert.ok(lessonDiagrams[3]?.nodes.some((node) => node.label === 'Application servers'))
  assert.ok(lessonDiagrams[3]?.edges.some((edge) => edge.label === 'causes waiting'))
})

test('sixth lesson diagrams are complete, unique and referenced correctly', () => {
  const lesson = getLessonBySlug('back-of-the-envelope-scale-estimation')
  assert.ok(lesson)
  assert.deepEqual(lesson.diagramIds, [
    'diagram-1-6-monolith',
    'diagram-1-6-layered-architecture',
    'diagram-1-6-modular-monolith',
    'diagram-1-6-monolith-vs-modular',
    'diagram-1-6-layered-request-flow',
  ])
  const lessonDiagrams = diagrams.filter((diagram) => lesson.diagramIds.includes(diagram.id))
  assert.equal(lessonDiagrams.length, 5)
  assert.ok(lesson.diagramIds.every((id) => diagrams.some((diagram) => diagram.id === id)))
  assert.ok(lessonDiagrams.every((diagram) => diagram.title.trim().length > 0 && diagram.description.trim().length > 0))
  assert.ok(lessonDiagrams.every((diagram) => diagram.nodes.length >= 3 && diagram.edges.length >= 2))
  assert.equal(
    new Set(lessonDiagrams.flatMap((diagram) => diagram.nodes.map((node) => node.id))).size,
    lessonDiagrams.reduce((total, diagram) => total + diagram.nodes.length, 0),
  )
  assert.equal(
    new Set(lessonDiagrams.flatMap((diagram) => diagram.edges.map((edge) => edge.id))).size,
    lessonDiagrams.reduce((total, diagram) => total + diagram.edges.length, 0),
  )
  assert.deepEqual(
    lessonDiagrams.map((diagram) => diagram.layout),
    ['topology', 'layers', 'topology', 'comparison', 'flow'],
  )
  assert.ok(lessonDiagrams[0]?.nodes.some((node) => node.label === 'Single application (one deployment unit)'))
  assert.ok(lessonDiagrams[0]?.nodes.some((node) => node.label === 'Shared database'))
  assert.ok(lessonDiagrams[1]?.nodes.some((node) => node.label === 'Presentation layer'))
  assert.ok(lessonDiagrams[1]?.nodes.some((node) => node.label === 'Business logic layer'))
  assert.ok(lessonDiagrams[1]?.nodes.some((node) => node.label === 'Data access layer'))
  assert.ok(lessonDiagrams[2]?.nodes.some((node) => node.label === 'Controlled module interfaces'))
  assert.ok(lessonDiagrams[2]?.nodes.some((node) => node.label === 'Orders module'))
  assert.ok(lessonDiagrams[3]?.nodes.some((node) => node.label === 'Tightly coupled monolith'))
  assert.ok(lessonDiagrams[3]?.nodes.some((node) => node.label === 'Modular monolith'))
  assert.ok(lessonDiagrams[4]?.nodes.some((node) => node.label === 'Client request: GET /products/42'))
  assert.ok(lessonDiagrams[4]?.edges.some((edge) => edge.label === 'HTTP response'))
})

test('first lesson code examples are small, explained and referenced correctly', () => {
  const lesson = getLessonBySlug('what-is-system-design')
  assert.ok(lesson)
  const lessonExamples = codeExamples.filter((example) => lesson.codeExampleIds.includes(example.id))
  assert.equal(lessonExamples.length, 2)
  assert.deepEqual(lesson.codeExampleIds, [
    'code-1-1-http-request-response',
    'code-1-1-api-endpoint',
  ])
  assert.ok(codeExamples.every((example) => example.code.trim().length > 0))
  assert.ok(codeExamples.every((example) => (example.explanation ?? '').trim().length > 0))
  assert.ok(lessonExamples.every((example) => example.code.split('\n').length <= 16))
  assert.ok(lessonExamples[0]?.code.includes('GET /products/42'))
  assert.ok(lessonExamples[1]?.code.includes('cache.TryGet(id)'))
})

test('second lesson code examples and comparisons are complete and referenced correctly', () => {
  const lesson = getLessonBySlug('requirements-and-constraints')
  assert.ok(lesson)
  const lessonExamples = codeExamples.filter((example) => lesson.codeExampleIds.includes(example.id))
  assert.deepEqual(lesson.codeExampleIds, [
    'code-1-2-http-get-request',
    'code-1-2-csharp-api-endpoint',
    'code-1-2-fetch-client-request',
  ])
  assert.equal(lessonExamples.length, 3)
  assert.ok(lessonExamples.every((example) => example.code.trim().length > 0))
  assert.ok(lessonExamples.every((example) => (example.explanation ?? '').trim().length > 0))
  assert.ok(lessonExamples.every((example) => example.code.split('\n').length <= 16))
  assert.ok(lessonExamples[0]?.code.includes('GET /api/products/42'))
  assert.ok(lessonExamples[1]?.code.includes('MapGet("/api/products/{id:int}"'))
  assert.ok(lessonExamples[2]?.code.includes('await fetch'))
  assert.ok(lessonExamples[2]?.code.includes('response.ok'))
  assert.ok(lessonExamples[2]?.code.includes('response.json()'))

  const lessonComparisons = comparisons.filter((comparison) => lesson.comparisonIds.includes(comparison.id))
  assert.deepEqual(lesson.comparisonIds, [
    'comparison-1-2-stateless-vs-stateful',
    'comparison-1-2-two-tier-vs-three-tier',
  ])
  assert.equal(lessonComparisons.length, 2)
  assert.ok(lessonComparisons.every((comparison) => comparison.columns.length === 2))
  assert.deepEqual(
    lessonComparisons[1]?.rows.map((row) => row.criterion),
    [
      'Architecture',
      'Responsibility distribution',
      'Business logic location',
      'Database access',
      'Maintainability',
      'Security considerations',
      'Complexity',
      'Typical use cases',
    ],
  )
  assert.ok(lessonComparisons[0]?.rows.some((row) => row.criterion === 'Data storage'))
})

test('third lesson code examples and comparisons are complete and referenced correctly', () => {
  const lesson = getLessonBySlug('core-building-blocks')
  assert.ok(lesson)
  assert.deepEqual(lesson.codeExampleIds, [
    'code-1-3-raw-http',
    'code-1-3-fetch-request',
    'code-1-3-aspnet-endpoint',
  ])
  const lessonExamples = codeExamples.filter((example) => lesson.codeExampleIds.includes(example.id))
  assert.equal(lessonExamples.length, 3)
  assert.ok(lessonExamples.every((example) => example.code.trim().length > 0))
  assert.ok(lessonExamples.every((example) => (example.explanation ?? '').trim().length > 0))
  assert.ok(lessonExamples.every((example) => example.code.split('\n').length <= 16))
  assert.ok(lessonExamples[0]?.code.includes('GET /products?category=lamps'))
  assert.ok(lessonExamples[0]?.code.includes('HTTP/1.1 200 OK'))
  assert.ok(lessonExamples[1]?.code.includes('await fetch'))
  assert.ok(lessonExamples[1]?.code.includes('response.ok'))
  assert.ok(lessonExamples[1]?.explanation?.includes('does not perform DNS, TCP or TLS itself'))
  assert.ok(lessonExamples[2]?.code.includes('MapGet("/api/products"'))

  assert.deepEqual(lesson.comparisonIds, [
    'comparison-1-3-http-vs-https',
    'comparison-1-3-domain-vs-ip',
  ])
  const lessonComparisons = comparisons.filter((comparison) => lesson.comparisonIds.includes(comparison.id))
  assert.equal(lessonComparisons.length, 2)
  assert.ok(lessonComparisons.every((comparison) => comparison.columns.length === 2))
  assert.deepEqual(
    lessonComparisons[0]?.rows.map((row) => row.criterion),
    ['Meaning', 'Encryption', 'Authentication', 'Integrity', 'Typical usage', 'Security implications', 'Performance implication'],
  )
  assert.deepEqual(
    lessonComparisons[1]?.rows.map((row) => row.criterion),
    ['Meaning', 'Purpose', 'Human readability', 'Network routing role', 'Relationship between them', 'Operational implication'],
  )
  assert.ok(lessonComparisons[0]?.summary.includes('carried over a TLS-protected connection'))
  assert.ok(lessonComparisons[0]?.rows.some((row) => (row.values.https ?? '').includes('not a separate application protocol')))
  assert.ok(lessonComparisons[1]?.summary.includes('numeric locator'))
})

test('fourth lesson code examples and comparisons are complete and referenced correctly', () => {
  const lesson = getLessonBySlug('trade-offs-and-design-decisions')
  assert.ok(lesson)
  assert.deepEqual(lesson.codeExampleIds, [
    'code-1-4-http-request-response',
    'code-1-4-fetch-product',
    'code-1-4-aspnet-product-endpoint',
  ])
  const lessonExamples = codeExamples.filter((example) => lesson.codeExampleIds.includes(example.id))
  assert.equal(lessonExamples.length, 3)
  assert.ok(lessonExamples.every((example) => example.code.trim().length > 0))
  assert.ok(lessonExamples.every((example) => (example.explanation ?? '').trim().length > 0))
  assert.ok(lessonExamples.every((example) => example.code.split('\n').length <= 20))
  assert.ok(lessonExamples[0]?.code.includes('GET /api/products/42 HTTP/1.1'))
  assert.ok(lessonExamples[0]?.code.includes('HTTP/1.1 200 OK'))
  assert.ok(lessonExamples[0]?.code.includes('"priceMinor": 3900'))
  assert.ok(lessonExamples[1]?.code.includes('response.ok'))
  assert.ok(lessonExamples[1]?.explanation?.includes('does not reject the promise'))
  assert.ok(lessonExamples[2]?.code.includes('MapGet("/api/products/{id:int}"'))
  assert.ok(lessonExamples[2]?.code.includes('Results.NotFound'))

  assert.deepEqual(lesson.comparisonIds, [
    'comparison-1-4-put-vs-patch',
    'comparison-1-4-401-vs-403',
    'comparison-1-4-post-vs-put',
  ])
  const lessonComparisons = comparisons.filter((comparison) => lesson.comparisonIds.includes(comparison.id))
  assert.equal(lessonComparisons.length, 3)
  assert.ok(lessonComparisons.every((comparison) => comparison.columns.length === 2))
  assert.deepEqual(
    lessonComparisons[0]?.rows.map((row) => row.criterion),
    ['Intended purpose', 'Update semantics', 'Idempotency', 'Request body', 'Typical usage', 'Retry behaviour'],
  )
  assert.deepEqual(
    lessonComparisons[1]?.rows.map((row) => row.criterion),
    ['Meaning', 'Authentication state', 'Authorization decision', 'Typical API behaviour', 'Example scenario', 'Client response'],
  )
  assert.deepEqual(
    lessonComparisons[2]?.rows.map((row) => row.criterion),
    ['Intended purpose', 'Creation behaviour', 'Idempotency', 'Typical endpoint', 'Typical response', 'Retry implications'],
  )
  assert.ok(lessonComparisons[0]?.summary.includes('idempotent'))
  assert.ok(lessonComparisons[1]?.summary.includes('still does not have permission'))
  assert.ok(lessonComparisons[1]?.rows.some((row) => (row.values['403'] ?? '').includes('identity is not the problem')))
  assert.ok(lessonComparisons[2]?.summary.includes('create a resource'))
})

test('fifth lesson code examples and comparisons are complete and referenced correctly', () => {
  const lesson = getLessonBySlug('sketching-your-first-design')
  assert.ok(lesson)
  assert.deepEqual(lesson.codeExampleIds, [
    'code-1-5-client-response-time',
    'code-1-5-aspnet-request-duration',
    'code-1-5-throughput-calculation',
  ])
  const lessonExamples = codeExamples.filter((example) => lesson.codeExampleIds.includes(example.id))
  assert.equal(lessonExamples.length, 3)
  assert.ok(lessonExamples.every((example) => example.code.trim().length > 0))
  assert.ok(lessonExamples.every((example) => (example.explanation ?? '').trim().length > 0))
  assert.ok(lessonExamples.every((example) => example.code.split('\n').length <= 20))
  assert.ok(lessonExamples[0]?.code.includes('performance.now()'))
  assert.ok(lessonExamples[0]?.code.includes('await fetch'))
  assert.ok(lessonExamples[0]?.explanation?.includes('response headers'))
  assert.ok(lessonExamples[1]?.code.includes('Stopwatch.StartNew()'))
  assert.ok(lessonExamples[1]?.code.includes('LogInformation'))
  assert.ok(lessonExamples[2]?.code.includes('completedRequests / elapsedSeconds'))
  assert.ok(lessonExamples[2]?.explanation?.includes('800 RPS'))

  assert.deepEqual(lesson.comparisonIds, [
    'comparison-1-5-latency-vs-throughput',
    'comparison-1-5-bandwidth-vs-throughput',
    'comparison-1-5-average-vs-percentile',
  ])
  const lessonComparisons = comparisons.filter((comparison) => lesson.comparisonIds.includes(comparison.id))
  assert.equal(lessonComparisons.length, 3)
  assert.ok(lessonComparisons.every((comparison) => comparison.columns.length === 2))
  assert.ok(lessonComparisons.every((comparison) => comparison.rows.length >= 3))
  assert.deepEqual(
    lessonComparisons[0]?.rows.map((row) => row.criterion),
    ['Meaning', 'Measurement unit', 'What it tells us', 'Typical metric', 'Practical example', 'Relationship under load'],
  )
  assert.deepEqual(
    lessonComparisons[1]?.rows.map((row) => row.criterion),
    ['Capacity vs achieved work', 'Units', 'Network context', 'Example', 'Common misconception', 'What improves it'],
  )
  assert.deepEqual(
    lessonComparisons[2]?.rows.map((row) => row.criterion),
    ['What it represents', 'Strength', 'Limitation', 'Use case', 'Why the tail matters', 'Interpretation example'],
  )
  assert.ok(lessonComparisons[1]?.summary.includes('transfer capacity'))
  assert.ok(lessonComparisons[2]?.summary.includes('hides slow subgroups'))
  assert.ok(
    lessonComparisons[2]?.rows.some((row) => (row.values.percentile ?? '').includes('p50 or p99')),
  )
})

test('sixth lesson code examples and comparisons are complete and referenced correctly', () => {
  const lesson = getLessonBySlug('back-of-the-envelope-scale-estimation')
  assert.ok(lesson)
  assert.deepEqual(lesson.codeExampleIds, [
    'code-1-6-monolith-structure',
    'code-1-6-layered-flow',
    'code-1-6-module-boundaries',
  ])
  const lessonExamples = codeExamples.filter((example) => lesson.codeExampleIds.includes(example.id))
  assert.equal(lessonExamples.length, 3)
  assert.ok(lessonExamples.every((example) => example.code.trim().length > 0))
  assert.ok(lessonExamples.every((example) => (example.explanation ?? '').trim().length > 0))
  assert.ok(lessonExamples.every((example) => example.code.split('\n').length <= 20))
  assert.ok(lessonExamples.every((example) => example.language === 'text'))
  assert.ok(lessonExamples[0]?.code.includes('ProductController'))
  assert.ok(lessonExamples[0]?.explanation?.includes('controller → service → repository → database'))
  assert.ok(lessonExamples[1]?.code.includes('app.MapGet("/api/products/{id:int}"'))
  assert.ok(lessonExamples[1]?.code.includes('IProductRepository'))
  assert.ok(lessonExamples[2]?.code.includes('ICatalogModule'))
  assert.ok(lessonExamples[2]?.code.includes('payments.Charge'))
  assert.ok(lessonExamples[2]?.explanation?.includes('one deployment unit'))

  assert.deepEqual(lesson.comparisonIds, [
    'comparison-1-6-monolith-vs-modular-monolith',
    'comparison-1-6-layered-vs-modular-architecture',
    'comparison-1-6-monolith-vs-microservices',
  ])
  const lessonComparisons = comparisons.filter((comparison) => lesson.comparisonIds.includes(comparison.id))
  assert.equal(lessonComparisons.length, 3)
  assert.ok(lessonComparisons.every((comparison) => comparison.columns.length === 2))
  assert.ok(lessonComparisons.every((comparison) => comparison.rows.length >= 5))
  assert.deepEqual(
    lessonComparisons[0]?.rows.map((row) => row.criterion),
    [
      'Deployment model',
      'Internal boundaries',
      'Coupling',
      'Module encapsulation',
      'Ownership',
      'Testing',
      'Maintainability',
      'Operational and design complexity',
    ],
  )
  assert.deepEqual(
    lessonComparisons[1]?.rows.map((row) => row.criterion),
    [
      'Primary organization principle',
      'Separation of responsibilities',
      'Business boundaries',
      'Dependency management',
      'Testing emphasis',
      'Typical use cases',
      'Can they coexist?',
    ],
  )
  assert.deepEqual(
    lessonComparisons[2]?.rows.map((row) => row.criterion),
    [
      'Deployment units',
      'Communication',
      'Data ownership',
      'Operational complexity',
      'Independent scaling',
      'Failure boundaries',
      'Introductory fit',
    ],
  )
  assert.ok(lessonComparisons[0]?.summary.includes('one deployable application'))
  assert.ok(lessonComparisons[1]?.summary.includes('technical role'))
  assert.ok(lessonComparisons[2]?.summary.includes('independently deployed services'))
  assert.ok(
    lessonComparisons[0]?.rows.some((row) => (row.values.modular ?? '').includes('public module interfaces')),
  )
})

test('published quizzes target the final standard with five four-option questions', () => {
  assert.equal(quizzes.length, 16)
  assert.deepEqual(
    quizzes.map((quiz) => quiz.id),
    ['quiz-1-1', 'quiz-1-2', 'quiz-1-3', 'quiz-1-4', 'quiz-1-5', 'quiz-1-6', 'quiz-2-1', 'quiz-2-2', 'quiz-2-3', 'quiz-2-4', 'quiz-2-5', 'quiz-2-6', 'quiz-2-7', 'quiz-3-1', 'quiz-3-2', 'quiz-3-3'],
  )
  for (const quiz of quizzes) {
    assert.equal(quiz.standard, 'final')
    assert.equal(getQuizStandard(quiz).id, 'final')
    assert.deepEqual(checkQuizStandard(quiz), [])
    assert.equal(quiz.questions.length, 5)
    assert.deepEqual(
      quiz.questions.map((question) => question.options.length),
      [4, 4, 4, 4, 4],
    )
    assert.ok(quiz.questions.every((question) => question.options.filter((option) => option.isCorrect).length === 1))
    assert.ok(quiz.questions.every((question) => question.options.every((option) => (option.explanation ?? '').trim().length > 0)))
    assert.equal(quiz.passThreshold, 0.8)
  }
})

test('canonical quiz resolves back to the first lesson', () => {
  const quiz = quizzes[0]
  assert.ok(quiz)
  const lesson = getLessonBySlug('what-is-system-design')
  assert.ok(lesson)
  assert.equal(lesson.quizId, quiz.id)
  assert.equal(
    lessons.filter((candidate) => candidate.quizId === quiz.id).length,
    1,
  )
})

test('second lesson quiz resolves back to the client-server lesson', () => {
  const quiz = quizzes.find((candidate) => candidate.id === 'quiz-1-2')
  const lesson = getLessonBySlug('requirements-and-constraints')
  assert.ok(quiz && lesson)
  assert.equal(lesson.quizId, quiz.id)
  assert.equal(quiz.title, 'Client-Server Architecture — knowledge check')
  assert.equal(
    lessons.filter((candidate) => candidate.quizId === quiz.id).length,
    1,
  )
  assert.equal(getQuizStandard(quiz).id, 'final')
})

test('third lesson quiz resolves back to the web fundamentals lesson', () => {
  const quiz = quizzes.find((candidate) => candidate.id === 'quiz-1-3')
  const lesson = getLessonBySlug('core-building-blocks')
  assert.ok(quiz && lesson)
  assert.equal(lesson.quizId, quiz.id)
  assert.equal(quiz.title, 'Web Fundamentals — knowledge check')
  assert.equal(quiz.description, 'Five questions on DNS, HTTP, HTTPS, transport and the complete browser journey.')
  assert.equal(quiz.passThreshold, 0.8)
  assert.equal(quiz.standard, 'final')
  assert.deepEqual(checkQuizStandard(quiz), [])
  assert.equal(quiz.questions.length, 5)
  assert.deepEqual(
    quiz.questions.map((question) => question.id),
    Array.from({ length: 5 }, (_, index) => `quiz-1-3-q${index + 1}`),
  )
  assert.ok(quiz.questions.every((question) => question.options.length === 4))
  assert.ok(quiz.questions.every((question) => question.options.filter((option) => option.isCorrect).length === 1))
  assert.ok(quiz.questions.every((question) => question.options.every((option) => (option.explanation ?? '').trim().length > 0)))
  assert.ok(quiz.questions.every((question) => (question.explanation ?? '').trim().length > 0))
  assert.equal(
    lessons.filter((candidate) => candidate.quizId === quiz.id).length,
    1,
  )
  assert.ok(quiz.questions[0]?.prompt.includes('shop.example.com'))
  assert.ok(quiz.questions[1]?.prompt.includes('/products'))
  assert.ok(quiz.questions[2]?.prompt.includes('HTTPS'))
  assert.ok(quiz.questions[3]?.prompt.includes('TCP'))
  assert.ok(quiz.questions[4]?.prompt.includes('shop.example.com/products'))
})

test('fourth lesson quiz resolves back to the APIs lesson', () => {
  const quiz = quizzes.find((candidate) => candidate.id === 'quiz-1-4')
  const lesson = getLessonBySlug('trade-offs-and-design-decisions')
  assert.ok(quiz && lesson)
  assert.equal(lesson.quizId, quiz.id)
  assert.equal(quiz.title, 'APIs — knowledge check')
  assert.equal(quiz.description, 'Five questions on API contracts, REST resources, methods, status codes and error design.')
  assert.equal(quiz.passThreshold, 0.8)
  assert.equal(quiz.standard, 'final')
  assert.deepEqual(checkQuizStandard(quiz), [])
  assert.equal(quiz.questions.length, 5)
  assert.deepEqual(
    quiz.questions.map((question) => question.id),
    Array.from({ length: 5 }, (_, index) => `quiz-1-4-q${index + 1}`),
  )
  assert.ok(quiz.questions.every((question) => question.options.length === 4))
  assert.ok(quiz.questions.every((question) => question.options.filter((option) => option.isCorrect).length === 1))
  assert.ok(quiz.questions.every((question) => question.options.every((option) => (option.explanation ?? '').trim().length > 0)))
  assert.ok(quiz.questions.every((question) => (question.explanation ?? '').trim().length > 0))
  assert.equal(
    lessons.filter((candidate) => candidate.quizId === quiz.id).length,
    1,
  )
  assert.ok(quiz.questions[0]?.prompt.includes('API contract'))
  assert.ok(quiz.questions[1]?.prompt.includes('getProducts'))
  assert.ok(quiz.questions[2]?.prompt.includes('retries after a timeout'))
  assert.ok(quiz.questions[2]?.options.some((option) => option.label.includes('PUT')))
  assert.ok(quiz.questions[3]?.prompt.includes('401'))
  assert.ok(quiz.questions[4]?.prompt.includes('PATCH /api/products/42'))
})

test('fifth lesson quiz resolves back to the Performance Basics lesson', () => {
  const quiz = quizzes.find((candidate) => candidate.id === 'quiz-1-5')
  const lesson = getLessonBySlug('sketching-your-first-design')
  assert.ok(quiz && lesson)
  assert.equal(lesson.quizId, quiz.id)
  assert.equal(quiz.title, 'Performance Basics — knowledge check')
  assert.equal(
    quiz.description,
    'Five questions on latency, throughput, bandwidth, response-time boundaries, percentiles and bottlenecks.',
  )
  assert.equal(quiz.passThreshold, 0.8)
  assert.equal(quiz.standard, 'final')
  assert.deepEqual(checkQuizStandard(quiz), [])
  assert.equal(quiz.questions.length, 5)
  assert.deepEqual(
    quiz.questions.map((question) => question.id),
    Array.from({ length: 5 }, (_, index) => `quiz-1-5-q${index + 1}`),
  )
  assert.ok(quiz.questions.every((question) => question.options.length === 4))
  assert.ok(quiz.questions.every((question) => question.options.filter((option) => option.isCorrect).length === 1))
  assert.ok(quiz.questions.every((question) => question.options.every((option) => (option.explanation ?? '').trim().length > 0)))
  assert.ok(quiz.questions.every((question) => (question.explanation ?? '').trim().length > 0))
  assert.equal(
    lessons.filter((candidate) => candidate.quizId === quiz.id).length,
    1,
  )
  assert.ok(quiz.questions[0]?.prompt.includes('800 requests per second'))
  assert.ok(quiz.questions[1]?.prompt.includes('100 Mbps'))
  assert.ok(quiz.questions[2]?.prompt.includes('fetch promise'))
  assert.ok(quiz.questions[3]?.prompt.includes('p95'))
  assert.ok(quiz.questions[4]?.prompt.includes('database CPU'))
})

test('sixth lesson quiz resolves back to the Architecture Styles lesson', () => {
  const quiz = quizzes.find((candidate) => candidate.id === 'quiz-1-6')
  const lesson = getLessonBySlug('back-of-the-envelope-scale-estimation')
  assert.ok(quiz && lesson)
  assert.equal(lesson.quizId, quiz.id)
  assert.equal(quiz.title, 'Architecture Styles — knowledge check')
  assert.equal(
    quiz.description,
    'Five questions on monolithic deployment, layered responsibilities, module boundaries, architectural trade-offs and scenario-based selection.',
  )
  assert.equal(quiz.passThreshold, 0.8)
  assert.equal(quiz.standard, 'final')
  assert.deepEqual(checkQuizStandard(quiz), [])
  assert.equal(quiz.questions.length, 5)
  assert.deepEqual(
    quiz.questions.map((question) => question.id),
    Array.from({ length: 5 }, (_, index) => `quiz-1-6-q${index + 1}`),
  )
  assert.ok(quiz.questions.every((question) => question.options.length === 4))
  assert.ok(quiz.questions.every((question) => question.options.filter((option) => option.isCorrect).length === 1))
  assert.ok(quiz.questions.every((question) => question.options.every((option) => (option.explanation ?? '').trim().length > 0)))
  assert.ok(quiz.questions.every((question) => (question.explanation ?? '').trim().length > 0))
  assert.deepEqual(
    quiz.questions.map((question) => question.options.findIndex((option) => option.isCorrect)),
    [2, 1, 3, 0, 2],
  )
  assert.equal(
    lessons.filter((candidate) => candidate.quizId === quiz.id).length,
    1,
  )
  assert.ok(quiz.questions[0]?.prompt.includes('single unit'))
  assert.ok(quiz.questions[1]?.prompt.includes('dependency direction'))
  assert.ok(quiz.questions[2]?.prompt.includes('current price'))
  assert.ok(quiz.questions[3]?.prompt.includes('for flexibility'))
  assert.ok(quiz.questions[4]?.prompt.includes('Four developers'))
})

test('eighth lesson quiz resolves back to the HTTP Deep Dive lesson', () => {
  const quiz = quizzes.find((candidate) => candidate.id === 'quiz-2-2')
  const lesson = getLessonBySlug('tcp-http-and-tls-fundamentals')
  assert.ok(quiz && lesson)
  assert.equal(lesson.quizId, quiz.id)
  assert.equal(quiz.title, 'HTTP Deep Dive — knowledge check')
  assert.equal(
    quiz.description,
    'Five applied questions on HTTP message semantics, persistent connections, HTTP/2 multiplexing, HTTP/3 over QUIC, headers, compression and protocol negotiation.',
  )
  assert.equal(quiz.passThreshold, 0.8)
  assert.equal(quiz.standard, 'final')
  assert.deepEqual(checkQuizStandard(quiz), [])
  assert.equal(quiz.questions.length, 5)
  assert.deepEqual(
    quiz.questions.map((question) => question.id),
    Array.from({ length: 5 }, (_, index) => `quiz-2-2-q${index + 1}`),
  )
  assert.ok(quiz.questions.every((question) => question.options.length === 4))
  assert.ok(quiz.questions.every((question) => question.options.filter((option) => option.isCorrect).length === 1))
  assert.ok(quiz.questions.every((question) => question.options.every((option) => (option.explanation ?? '').trim().length > 0)))
  assert.ok(quiz.questions.every((question) => (question.explanation ?? '').trim().length > 0))
  assert.deepEqual(
    quiz.questions.map((question) => question.options.findIndex((option) => option.isCorrect)),
    [2, 3, 1, 1, 3],
  )
  assert.equal(
    lessons.filter((candidate) => candidate.quizId === quiz.id).length,
    1,
  )
  assert.ok(quiz.questions[0]?.prompt.includes('HTTP persistent connections'))
  assert.ok(quiz.questions[1]?.prompt.includes('HTTP/2 over TCP'))
  assert.ok(quiz.questions[2]?.prompt.includes('Content-Encoding: br'))
  assert.ok(quiz.questions[3]?.prompt.includes('HTTP/3'))
  assert.ok(quiz.questions[4]?.prompt.includes('ALPN'))
})

test('first lesson challenge, summary and simulation link are complete and resolvable', () => {
  const lesson = getLessonBySlug('what-is-system-design')
  assert.ok(lesson)
  assert.equal(practicalChallenges.length, 16)
  assert.equal(lessonSummaries.length, 16)

  const challenge = practicalChallenges.find((candidate) => candidate.id === lesson.practicalChallengeId)
  assert.ok(challenge)
  assert.equal(challenge.id, 'challenge-1-1')
  assert.equal(challenge.title, 'Challenge: Design a Simple Online Store')
  assert.ok(challenge.requirements.length >= 5)
  assert.ok(challenge.hints && challenge.hints.length >= 3)
  assert.ok(challenge.deliverables.length > 0)

  const summary = lessonSummaries.find((candidate) => candidate.id === lesson.summaryId)
  assert.ok(summary)
  assert.equal(summary.id, 'summary-1-1')
  assert.ok(summary.keyTakeaways.length >= 6)

  const simulationSlug = lesson.metadata?.simulationSlug
  assert.equal(simulationSlug, 'client-server-request-flow')
  assert.equal(getSimulationBySlug(simulationSlug)?.id, 'sim-client-server')
})

test('second lesson challenge, summary and simulation link are complete and resolvable', () => {
  const lesson = getLessonBySlug('requirements-and-constraints')
  assert.ok(lesson)
  const challenge = practicalChallenges.find((candidate) => candidate.id === lesson.practicalChallengeId)
  assert.ok(challenge)
  assert.equal(challenge.id, 'challenge-1-2')
  assert.equal(challenge.title, 'Challenge: Design a Client-Server Product Catalog')
  assert.equal(challenge.requirements.length, 7)
  assert.ok(challenge.constraints.length >= 4)
  assert.ok(challenge.deliverables.length >= 3)
  assert.ok(challenge.hints && challenge.hints.length >= 4)
  assert.ok(challenge.scenario.includes('several client types'))

  const summary = lessonSummaries.find((candidate) => candidate.id === lesson.summaryId)
  assert.ok(summary)
  assert.equal(summary.id, 'summary-1-2')
  assert.ok(summary.keyTakeaways.length >= 7)
  assert.ok(summary.nextSteps && summary.nextSteps.length >= 2)

  const simulationSlug = lesson.metadata?.simulationSlug
  assert.equal(simulationSlug, 'client-server-request-flow')
  assert.equal(getSimulationBySlug(simulationSlug)?.id, 'sim-client-server')
})

test('third lesson challenge and summary are complete without a simulation link', () => {
  const lesson = getLessonBySlug('core-building-blocks')
  assert.ok(lesson)
  const challenge = practicalChallenges.find((candidate) => candidate.id === lesson.practicalChallengeId)
  assert.ok(challenge)
  assert.equal(challenge.id, 'challenge-1-3')
  assert.equal(challenge.title, 'Challenge: Follow a Store Product Page Request')
  assert.ok(challenge.scenario.includes('https://shop.example.com/products?category=lamps'))
  assert.ok(challenge.requirements.length >= 8)
  assert.ok(challenge.constraints.length >= 4)
  assert.ok(challenge.deliverables.length >= 4)
  assert.ok(challenge.hints && challenge.hints.length >= 5)
  assert.ok(challenge.requirements.some((requirement) => requirement.includes('DNS resolution')))
  assert.ok(challenge.requirements.some((requirement) => requirement.includes('performance question')))
  assert.ok(challenge.requirements.some((requirement) => requirement.includes('security question')))

  const summary = lessonSummaries.find((candidate) => candidate.id === lesson.summaryId)
  assert.ok(summary)
  assert.equal(summary.id, 'summary-1-3')
  assert.ok(summary.keyTakeaways.length >= 9)
  assert.ok(summary.nextSteps && summary.nextSteps.length >= 2)
  assert.ok(
    summary.keyTakeaways.some((takeaway) =>
      takeaway.includes('URL → DNS → IP Address → Transport Connection → TLS → HTTP Request → Server → HTTP Response'),
    ),
  )

  const simulationSlug = lesson.metadata?.simulationSlug
  assert.equal(simulationSlug, undefined)
  assert.equal(getSimulationBySlug(simulationSlug), undefined)
})

test('fourth lesson challenge and summary are complete without a simulation link', () => {
  const lesson = getLessonBySlug('trade-offs-and-design-decisions')
  assert.ok(lesson)
  const challenge = practicalChallenges.find((candidate) => candidate.id === lesson.practicalChallengeId)
  assert.ok(challenge)
  assert.equal(challenge.id, 'challenge-1-4')
  assert.equal(challenge.title, 'Challenge: Design a Product API Contract')
  assert.ok(challenge.scenario.includes('partially update product stock'))
  assert.ok(challenge.requirements.length >= 8)
  assert.ok(challenge.constraints.length >= 5)
  assert.ok(challenge.deliverables.length >= 4)
  assert.ok(challenge.hints && challenge.hints.length >= 5)
  assert.ok(challenge.requirements.some((requirement) => requirement.includes('resource-oriented endpoints')))
  assert.ok(challenge.requirements.some((requirement) => requirement.includes('JSON error shape')))
  assert.ok(challenge.requirements.some((requirement) => requirement.includes('backward-compatibility')))
  assert.ok(challenge.requirements.some((requirement) => requirement.includes('success criteria')))

  const summary = lessonSummaries.find((candidate) => candidate.id === lesson.summaryId)
  assert.ok(summary)
  assert.equal(summary.id, 'summary-1-4')
  assert.ok(summary.keyTakeaways.length >= 10)
  assert.ok(summary.nextSteps && summary.nextSteps.length >= 2)
  assert.ok(
    summary.keyTakeaways.some((takeaway) =>
      takeaway.includes('Client Intent → API Contract → HTTP Request → Server Processing → HTTP Response → Client Interpretation'),
    ),
  )

  const simulationSlug = lesson.metadata?.simulationSlug
  assert.equal(simulationSlug, undefined)
  assert.equal(getSimulationBySlug(simulationSlug), undefined)
})

test('fifth lesson challenge and summary are complete without a simulation link', () => {
  const lesson = getLessonBySlug('sketching-your-first-design')
  assert.ok(lesson)
  const challenge = practicalChallenges.find((candidate) => candidate.id === lesson.practicalChallengeId)
  assert.ok(challenge)
  assert.equal(challenge.id, 'challenge-1-5')
  assert.equal(challenge.title, 'Challenge: Diagnose a Store API Slowdown')
  assert.ok(challenge.scenario.includes('100 requests per second'))
  assert.ok(challenge.scenario.includes('2,000 requests per second'))
  assert.ok(challenge.requirements.length >= 8)
  assert.ok(challenge.constraints.length >= 4)
  assert.ok(challenge.deliverables.length >= 4)
  assert.ok(challenge.hints && challenge.hints.length >= 5)
  assert.ok(challenge.requirements.some((requirement) => requirement.includes('offered load')))
  assert.ok(challenge.requirements.some((requirement) => requirement.includes('p95')))
  assert.ok(challenge.requirements.some((requirement) => requirement.includes('adding application servers')))
  assert.ok(challenge.requirements.some((requirement) => requirement.includes('success criteria')))

  const summary = lessonSummaries.find((candidate) => candidate.id === lesson.summaryId)
  assert.ok(summary)
  assert.equal(summary.id, 'summary-1-5')
  assert.ok(summary.keyTakeaways.length >= 10)
  assert.ok(summary.nextSteps && summary.nextSteps.length >= 2)
  assert.ok(
    summary.keyTakeaways.some((takeaway) =>
      takeaway.includes('Workload → Resource Utilization → Queueing and Processing → Latency/Response Time → Throughput and User Experience'),
    ),
  )

  const simulationSlug = lesson.metadata?.simulationSlug
  assert.equal(simulationSlug, undefined)
  assert.equal(getSimulationBySlug(simulationSlug), undefined)
})

test('sixth lesson challenge and summary are complete without a simulation link', () => {
  const lesson = getLessonBySlug('back-of-the-envelope-scale-estimation')
  assert.ok(lesson)
  const challenge = practicalChallenges.find((candidate) => candidate.id === lesson.practicalChallengeId)
  assert.ok(challenge)
  assert.equal(challenge.id, 'challenge-1-6')
  assert.equal(challenge.title, 'Challenge: Choose an Architecture for an Evolving Store')
  assert.ok(challenge.scenario.includes('product catalog'))
  assert.ok(challenge.scenario.includes('Four developers'))
  assert.ok(challenge.requirements.length >= 10)
  assert.ok(challenge.constraints.length >= 5)
  assert.ok(challenge.deliverables.length >= 4)
  assert.ok(challenge.hints && challenge.hints.length >= 6)
  assert.ok(challenge.requirements.some((requirement) => requirement.includes('module interfaces')))
  assert.ok(challenge.requirements.some((requirement) => requirement.includes('data ownership')))
  assert.ok(challenge.requirements.some((requirement) => requirement.includes('trade-off')))
  assert.ok(challenge.requirements.some((requirement) => requirement.includes('success criteria')))

  const summary = lessonSummaries.find((candidate) => candidate.id === lesson.summaryId)
  assert.ok(summary)
  assert.equal(summary.id, 'summary-1-6')
  assert.ok(summary.keyTakeaways.length >= 10)
  assert.ok(summary.nextSteps && summary.nextSteps.length >= 2)
  assert.ok(
    summary.keyTakeaways.some((takeaway) =>
      takeaway.includes('Requirements → Constraints → Components and Responsibilities → Boundaries and Dependencies → Deployment Model → Architectural Trade-offs'),
    ),
  )
  assert.ok(summary.overview.includes('deployable application'))

  const simulationSlug = lesson.metadata?.simulationSlug
  assert.equal(simulationSlug, undefined)
  assert.equal(getSimulationBySlug(simulationSlug), undefined)
})

test('final quiz standard is available for future educational lessons', () => {
  assert.deepEqual(QUIZ_STANDARDS.final, {
    id: 'final',
    label: 'Final educational lesson standard',
    questionCount: 5,
    optionsPerQuestion: 4,
  })

  const makeQuestion = (index: number) => ({
    id: `q-${index}`,
    prompt: `Question ${index}`,
    options: [0, 1, 2, 3].map((option) => ({
      id: `q-${index}-a-${option}`,
      label: `Option ${option}`,
      isCorrect: option === 0,
    })),
  })
  const base = {
    title: 'Future quiz',
    description: 'Standard check',
    passThreshold: 0.8,
    standard: 'final' as const,
  }

  const compliant: Quiz = { ...base, id: 'quiz-final-valid', questions: [1, 2, 3, 4, 5].map(makeQuestion) }
  assert.deepEqual(checkQuizStandard(compliant), [])

  const tooFewQuestions: Quiz = { ...base, id: 'quiz-final-short', questions: [1, 2].map(makeQuestion) }
  assert.deepEqual(checkQuizStandard(tooFewQuestions), [{ field: 'questions', expected: 5, actual: 2 }])

  const tooFewOptions: Quiz = {
    ...base,
    id: 'quiz-final-options',
    questions: [{ ...makeQuestion(1), options: makeQuestion(1).options.slice(0, 3) }],
  }
  assert.ok(
    checkQuizStandard(tooFewOptions).some(
      (violation) => violation.field === 'options' && violation.expected === 4 && violation.actual === 3,
    ),
  )
})

test('ninth lesson metadata preserves the canonical module seed and communication identity', () => {
  const lesson = getLessonBySlug('routing-and-the-public-internet')
  assert.ok(lesson)
  assert.equal(lesson.id, 'lesson-2-3')
  assert.equal(lesson.moduleId, 'module-2-3')
  assert.equal(lesson.slug, 'routing-and-the-public-internet')
  assert.equal(lesson.number, 1)
  assert.equal(lesson.order, 1)
  assert.equal(lesson.title, 'Communication Patterns')
  assert.equal(lesson.status, 'published')
  assert.equal(lesson.estimatedMinutes, 60)
  assert.equal(lesson.learningObjectives.length, 12)
  assert.deepEqual(
    lesson.learningObjectives.map((objective) => objective.id),
    Array.from({ length: 12 }, (_, index) => `objective-2-3-${index + 1}`),
  )
  assert.equal(new Set(lesson.learningObjectives.map((objective) => objective.id)).size, 12)
  assert.deepEqual(
    lesson.sectionIds,
    Array.from({ length: 16 }, (_, index) => `section-2-3-${index + 1}`),
  )
  assert.deepEqual(lesson.diagramIds, [
    'diagram-2-3-sync-request-response',
    'diagram-2-3-async-queue',
    'diagram-2-3-sync-critical-path',
    'diagram-2-3-hybrid-order-workflow',
    'diagram-2-3-pattern-decision-flow',
  ])
  assert.deepEqual(lesson.codeExampleIds, [
    'code-2-3-sync-service-call',
    'code-2-3-accepted-background-job',
    'code-2-3-awaited-vs-deferred-work',
  ])
  assert.deepEqual(lesson.comparisonIds, [
    'comparison-2-3-sync-vs-async',
    'comparison-2-3-request-response-vs-fire-and-forget',
    'comparison-2-3-sync-async-hybrid',
  ])
  assert.equal(lesson.quizId, 'quiz-2-3')
  assert.equal(lesson.practicalChallengeId, 'challenge-2-3')
  assert.equal(lesson.summaryId, 'summary-2-3')
  assert.equal(lesson.metadata?.simulationSlug, undefined)
})

test('ninth lesson has sixteen ordered sections with communication pattern content', () => {
  const expectedTitles = [
    'Introduction: How Software Components Communicate',
    'Understanding Synchronous Communication',
    'The Synchronous Request Lifecycle',
    'Benefits of Synchronous Communication',
    'Challenges of Synchronous Communication',
    'Understanding Asynchronous Communication',
    'The Asynchronous Communication Lifecycle',
    'Benefits of Asynchronous Communication',
    'Challenges and Trade-offs of Asynchronous Communication',
    'Request-Response vs Fire-and-Forget',
    'Synchronous vs Asynchronous: A Detailed Comparison',
    'Hybrid Communication Patterns',
    'Timeouts, Retries, and Failure Behavior',
    'Choosing the Right Communication Pattern',
    'Real-World System Design Examples',
    'Common Mistakes and Key Takeaways',
  ]
  const lesson = getLessonBySlug('routing-and-the-public-internet')
  assert.ok(lesson)
  const sections = lessonSections.filter((section) => lesson.sectionIds.includes(section.id))

  assert.equal(sections.length, 16)
  assert.deepEqual(
    sections.map((section) => section.order),
    Array.from({ length: 16 }, (_, index) => index + 1),
  )
  assert.deepEqual(
    sections.map((section) => section.title),
    expectedTitles,
  )
  assert.equal(sections[0]?.kind, 'introduction')
  assert.equal(sections[2]?.kind, 'process')
  assert.equal(sections[2]?.steps?.length, 6)
  assert.equal(sections[4]?.kind, 'tradeoffs')
  assert.equal(sections[6]?.kind, 'process')
  assert.equal(sections[6]?.steps?.length, 7)
  assert.equal(sections[11]?.kind, 'process')
  assert.equal(sections[11]?.steps?.length, 6)
  assert.equal(sections[15]?.kind, 'mistakes')
  assert.ok(sections.every((section) => section.paragraphs.length > 0))
  assert.ok(sections.every((section) => (section.keyPoints?.length ?? 0) >= 3))
  assert.ok(sections[5]?.paragraphs.join(' ').includes('async and await'))
  assert.ok(sections[6]?.paragraphs.join(' ').includes('broker or queue'))
  assert.ok(sections[11]?.paragraphs.join(' ').includes('202 Accepted'))
  assert.ok(sections[12]?.paragraphs.join(' ').includes('Exponential backoff'))
  assert.ok(sections[15]?.commonMistakes && sections[15].commonMistakes.length >= 7)
  assert.ok(lesson.learningObjectives.every((objective) => objective.text.trim().length > 20))
})

test('ninth lesson diagrams are complete, unique and referenced correctly', () => {
  const lesson = getLessonBySlug('routing-and-the-public-internet')
  assert.ok(lesson)
  const lessonDiagrams = diagrams.filter((diagram) => lesson.diagramIds.includes(diagram.id))

  assert.equal(lessonDiagrams.length, 5)
  assert.deepEqual(
    lessonDiagrams.map((diagram) => diagram.id),
    lesson.diagramIds,
  )
  assert.deepEqual(
    lessonDiagrams.map((diagram) => diagram.layout),
    ['timeline', 'flow', 'timeline', 'topology', 'flow'],
  )
  assert.equal(new Set(lessonDiagrams.flatMap((diagram) => diagram.nodes.map((node) => node.id))).size, 31)
  assert.equal(new Set(lessonDiagrams.flatMap((diagram) => diagram.edges.map((edge) => edge.id))).size, 32)
  assert.ok(lessonDiagrams[0]?.nodes.some((node) => node.label === 'Client caller'))
  assert.ok(lessonDiagrams[0]?.edges.some((edge) => edge.label.includes('caller waits')))
  assert.ok(lessonDiagrams[1]?.description.includes('One common asynchronous implementation'))
  assert.ok(lessonDiagrams[2]?.nodes.some((node) => node.label === 'Final response after 180 ms'))
  assert.ok(lessonDiagrams[3]?.nodes.some((node) => node.label === '202 Accepted + status URL'))
  assert.ok(lessonDiagrams[4]?.nodes.some((node) => node.label === 'Final result needed immediately?'))
})

test('ninth lesson code examples and comparisons are complete and referenced correctly', () => {
  const lesson = getLessonBySlug('routing-and-the-public-internet')
  assert.ok(lesson)
  const lessonExamples = codeExamples.filter((example) => lesson.codeExampleIds.includes(example.id))
  const lessonComparisons = comparisons.filter((comparison) => lesson.comparisonIds.includes(comparison.id))

  assert.equal(lessonExamples.length, 3)
  assert.deepEqual(
    lessonExamples.map((example) => example.id),
    lesson.codeExampleIds,
  )
  assert.ok(lessonExamples.every((example) => example.code.trim().length > 0))
  assert.ok(lessonExamples.every((example) => example.code.split('\n').length <= 20))
  assert.ok(lessonExamples[0]?.code.includes('CancellationToken cancellationToken'))
  assert.ok(lessonExamples[1]?.code.includes('Results.Accepted'))
  assert.ok(lessonExamples[2]?.code.includes('RebuildRecommendationsJob'))
  assert.ok(lessonExamples[0]?.explanation.includes('async and await'))
  assert.ok(lessonExamples[1]?.explanation.includes('durable storage or messaging'))
  assert.ok(lessonExamples[2]?.explanation.includes('async and await'))

  assert.equal(lessonComparisons.length, 3)
  assert.deepEqual(
    lessonComparisons.map((comparison) => comparison.id),
    lesson.comparisonIds,
  )
  assert.deepEqual(
    lessonComparisons.map((comparison) => comparison.columns.map((column) => column.label)),
    [
      ['Synchronous', 'Asynchronous'],
      ['Request-response', 'Fire-and-forget'],
      ['Synchronous', 'Asynchronous', 'Hybrid'],
    ],
  )
  assert.deepEqual(
    lessonComparisons[0]?.rows.map((row) => row.criterion),
    ['Caller waiting', 'Result availability', 'Coupling', 'Latency', 'Failure behavior', 'Complexity', 'Typical use cases'],
  )
  assert.deepEqual(
    lessonComparisons[1]?.rows.map((row) => row.criterion),
    ['Interaction model', 'Confirmation', 'Result availability', 'Failure visibility', 'Reliability requirements', 'Appropriate use cases'],
  )
  assert.deepEqual(
    lessonComparisons[2]?.rows.map((row) => row.criterion),
    ['User experience', 'Processing lifecycle', 'Infrastructure complexity', 'Consistency', 'Operational requirements', 'Example use cases'],
  )
  assert.ok(lessonComparisons[0]?.summary.includes('separates acceptance from completion'))
  assert.ok(lessonComparisons[1]?.summary.includes('explicit reliability strategy'))
  assert.ok(lessonComparisons[2]?.summary.includes('accept work synchronously'))
})

test('ninth lesson quiz, challenge and summary are complete without a simulation link', () => {
  const quiz = quizzes.find((candidate) => candidate.id === 'quiz-2-3')
  const lesson = getLessonBySlug('routing-and-the-public-internet')
  assert.ok(quiz && lesson)
  assert.equal(lesson.quizId, quiz.id)
  assert.equal(quiz.title, 'Communication Patterns — knowledge check')
  assert.equal(quiz.passThreshold, 0.8)
  assert.equal(quiz.standard, 'final')
  assert.deepEqual(checkQuizStandard(quiz), [])
  assert.equal(quiz.questions.length, 5)
  assert.ok(quiz.questions.every((question) => question.options.length === 4))
  assert.ok(quiz.questions.every((question) => question.options.filter((option) => option.isCorrect).length === 1))
  assert.ok(quiz.questions.every((question) => question.options.every((option) => (option.explanation ?? '').trim().length > 0)))
  assert.deepEqual(
    quiz.questions.map((question) => question.options.findIndex((option) => option.isCorrect)),
    [3, 1, 2, 0, 2],
  )
  assert.equal(lessons.filter((candidate) => candidate.quizId === quiz.id).length, 1)
  assert.ok(quiz.questions[0]?.prompt.includes('profile API'))
  assert.ok(quiz.questions[1]?.prompt.includes('202 Accepted'))
  assert.ok(quiz.questions[2]?.prompt.includes('trade-off'))
  assert.ok(quiz.questions[3]?.prompt.includes('e-commerce order design'))
  assert.ok(quiz.questions[4]?.prompt.includes('payment provider'))

  const challenge = practicalChallenges.find((candidate) => candidate.id === lesson.practicalChallengeId)
  assert.ok(challenge)
  assert.equal(challenge.id, 'challenge-2-3')
  assert.equal(challenge.title, 'Challenge: Design Communication Patterns for an E-Commerce Order Workflow')
  assert.ok(challenge.scenario.includes('synchronous communication for every operation'))
  assert.equal(challenge.requirements.length, 10)
  assert.equal(challenge.constraints.length, 5)
  assert.equal(challenge.deliverables.length, 6)
  assert.ok(challenge.hints && challenge.hints.length === 6)
  assert.ok(challenge.requirements.some((requirement) => requirement.includes('Expected reasoning')))
  assert.ok(challenge.deliverables.some((deliverable) => deliverable.includes('Evaluation criteria')))
  assert.ok(challenge.deliverables.some((deliverable) => deliverable.includes('Detailed model solution')))

  const summary = lessonSummaries.find((candidate) => candidate.id === lesson.summaryId)
  assert.ok(summary)
  assert.equal(summary.id, 'summary-2-3')
  assert.ok(summary.keyTakeaways.length >= 14)
  assert.ok(summary.nextSteps && summary.nextSteps.length >= 2)
  assert.ok(summary.overview.includes('who waits and when work completes'))
  assert.ok(summary.keyTakeaways.some((takeaway) => takeaway.includes('202 Accepted reports acceptance')))

  const simulationSlug = lesson.metadata?.simulationSlug
  assert.equal(simulationSlug, undefined)
  assert.equal(getSimulationBySlug(simulationSlug), undefined)
})

test('tenth lesson metadata preserves the canonical module seed and API communication identity', () => {
  const lesson = getLessonBySlug('latency-bandwidth-and-failure-modes')
  assert.ok(lesson)
  assert.equal(lesson.id, 'lesson-2-4')
  assert.equal(lesson.moduleId, 'module-2-4')
  assert.equal(lesson.slug, 'latency-bandwidth-and-failure-modes')
  assert.equal(lesson.number, 1)
  assert.equal(lesson.order, 1)
  assert.equal(lesson.title, 'API Communication')
  assert.equal(lesson.status, 'published')
  assert.equal(lesson.estimatedMinutes, 65)
  assert.equal(lesson.learningObjectives.length, 12)
  assert.deepEqual(
    lesson.learningObjectives.map((objective) => objective.id),
    Array.from({ length: 12 }, (_, index) => `objective-2-4-${index + 1}`),
  )
  assert.equal(new Set(lesson.learningObjectives.map((objective) => objective.id)).size, 12)
  assert.ok(lesson.learningObjectives.every((objective) => objective.text.trim().length > 20))
  assert.deepEqual(
    lesson.sectionIds,
    Array.from({ length: 16 }, (_, index) => `section-2-4-${index + 1}`),
  )
  assert.deepEqual(lesson.diagramIds, [
    'diagram-2-4-rest-resource-communication',
    'diagram-2-4-graphql-query-execution',
    'diagram-2-4-grpc-service-communication',
    'diagram-2-4-grpc-streaming-types',
    'diagram-2-4-multi-style-architecture',
  ])
  assert.deepEqual(lesson.codeExampleIds, [
    'code-2-4-rest-product-endpoint',
    'code-2-4-graphql-schema-query',
    'code-2-4-grpc-service-contract',
  ])
  assert.deepEqual(lesson.comparisonIds, [
    'comparison-2-4-rest-vs-graphql',
    'comparison-2-4-rest-vs-grpc',
    'comparison-2-4-graphql-vs-grpc',
  ])
  assert.equal(lesson.quizId, 'quiz-2-4')
  assert.equal(lesson.practicalChallengeId, 'challenge-2-4')
  assert.equal(lesson.summaryId, 'summary-2-4')
  assert.equal(lesson.metadata?.simulationSlug, undefined)
})

test('tenth lesson has sixteen ordered sections with API communication content', () => {
  const expectedTitles = [
    'Introduction: Why Do We Need Different API Styles?',
    'API Communication Fundamentals',
    'REST: Resource-Oriented API Design',
    'Designing REST Endpoints',
    'REST Benefits and Limitations',
    'GraphQL: Querying Exactly What You Need',
    'GraphQL Schema and Operations',
    'GraphQL Benefits and Challenges',
    'gRPC: Remote Procedure Calls',
    'Protocol Buffers and gRPC Contracts',
    'gRPC Communication Patterns',
    'gRPC Benefits and Limitations',
    'REST vs GraphQL vs gRPC',
    'API Communication in Real Architectures',
    'Choosing the Right API Communication Style',
    'Common Mistakes and Key Takeaways',
  ]
  const lesson = getLessonBySlug('latency-bandwidth-and-failure-modes')
  assert.ok(lesson)
  const sections = lessonSections.filter((section) => lesson.sectionIds.includes(section.id))

  assert.equal(sections.length, 16)
  assert.deepEqual(
    sections.map((section) => section.order),
    Array.from({ length: 16 }, (_, index) => index + 1),
  )
  assert.deepEqual(
    sections.map((section) => section.title),
    expectedTitles,
  )
  assert.equal(sections[0]?.kind, 'introduction')
  assert.equal(sections[3]?.kind, 'process')
  assert.equal(sections[3]?.steps?.length, 6)
  assert.equal(sections[4]?.kind, 'tradeoffs')
  assert.equal(sections[6]?.kind, 'process')
  assert.equal(sections[6]?.steps?.length, 6)
  assert.equal(sections[10]?.kind, 'process')
  assert.equal(sections[10]?.steps?.length, 4)
  assert.equal(sections[13]?.kind, 'process')
  assert.equal(sections[13]?.steps?.length, 6)
  assert.equal(sections[15]?.kind, 'mistakes')
  assert.ok(sections.every((section) => section.paragraphs.length > 0))
  assert.ok(sections.every((section) => (section.keyPoints?.length ?? 0) >= 3))
  assert.ok(sections[2]?.paragraphs.join(' ').includes('not simply'))
  assert.ok(sections[3]?.steps?.some((step) => step.title === 'Choose the HTTP method'))
  assert.ok(sections[5]?.paragraphs.join(' ').includes('resolvers determine the actual backend work'))
  assert.ok(sections[7]?.paragraphs.join(' ').includes('N+1 query problem'))
  assert.ok(sections[9]?.paragraphs.join(' ').includes('Field numbers'))
  assert.ok(sections[11]?.paragraphs.join(' ').includes('gRPC-Web'))
  assert.ok(sections[14]?.paragraphs.join(' ').includes('Four practical scenarios'))
  assert.ok(sections[15]?.commonMistakes && sections[15].commonMistakes.length >= 7)
})

test('tenth lesson diagrams are complete, unique and referenced correctly', () => {
  const lesson = getLessonBySlug('latency-bandwidth-and-failure-modes')
  assert.ok(lesson)
  const lessonDiagrams = diagrams.filter((diagram) => lesson.diagramIds.includes(diagram.id))

  assert.equal(lessonDiagrams.length, 5)
  assert.deepEqual(
    lessonDiagrams.map((diagram) => diagram.id),
    lesson.diagramIds,
  )
  assert.deepEqual(
    lessonDiagrams.map((diagram) => diagram.layout),
    ['flow', 'flow', 'flow', 'comparison', 'layers'],
  )
  assert.equal(new Set(lessonDiagrams.flatMap((diagram) => diagram.nodes.map((node) => node.id))).size, 42)
  assert.equal(new Set(lessonDiagrams.flatMap((diagram) => diagram.edges.map((edge) => edge.id))).size, 35)
  assert.ok(lessonDiagrams[0]?.nodes.some((node) => node.label === 'Identifier: 42'))
  assert.ok(lessonDiagrams[1]?.description.includes('Multiple resolvers'))
  assert.ok(lessonDiagrams[2]?.nodes.some((node) => node.label === 'HTTP/2 transport'))
  assert.ok(lessonDiagrams[3]?.edges.some((edge) => edge.label === 'many ↔ many'))
  assert.ok(lessonDiagrams[4]?.description.includes('not an architecture every application must adopt'))
})

test('tenth lesson code examples and comparisons are complete and referenced correctly', () => {
  const lesson = getLessonBySlug('latency-bandwidth-and-failure-modes')
  assert.ok(lesson)
  const lessonExamples = codeExamples.filter((example) => lesson.codeExampleIds.includes(example.id))
  const lessonComparisons = comparisons.filter((comparison) => lesson.comparisonIds.includes(comparison.id))

  assert.equal(lessonExamples.length, 3)
  assert.deepEqual(
    lessonExamples.map((example) => example.id),
    lesson.codeExampleIds,
  )
  assert.ok(lessonExamples.every((example) => example.language === 'text'))
  assert.ok(lessonExamples.every((example) => example.code.trim().length > 0))
  assert.ok(lessonExamples.every((example) => example.code.split('\n').length <= 20))
  assert.ok(lessonExamples[0]?.code.includes('CancellationToken cancellationToken'))
  assert.ok(lessonExamples[0]?.code.includes('Results.NotFound()'))
  assert.ok(lessonExamples[1]?.code.includes('type Product { id: ID!'))
  assert.ok(lessonExamples[1]?.code.includes('query ProductCard($id: ID!)'))
  assert.ok(lessonExamples[2]?.code.includes('syntax = "proto3";'))
  assert.ok(lessonExamples[2]?.code.includes('GetProductAsync'))
  assert.ok(lessonExamples[0]?.explanation.includes('representation'))
  assert.ok(lessonExamples[1]?.explanation.includes('N+1'))
  assert.ok(lessonExamples[2]?.explanation.includes('Field numbers'))

  assert.equal(lessonComparisons.length, 3)
  assert.deepEqual(
    lessonComparisons.map((comparison) => comparison.id),
    lesson.comparisonIds,
  )
  assert.deepEqual(
    lessonComparisons.map((comparison) => comparison.columns.map((column) => column.label)),
    [
      ['REST', 'GraphQL'],
      ['REST', 'gRPC'],
      ['GraphQL', 'gRPC'],
    ],
  )
  assert.deepEqual(
    lessonComparisons[0]?.rows.map((row) => row.criterion),
    ['API model', 'Data selection', 'Endpoints', 'Caching', 'Client flexibility', 'Complexity', 'Common use cases'],
  )
  assert.deepEqual(
    lessonComparisons[1]?.rows.map((row) => row.criterion),
    ['Communication model', 'Data representation', 'Transport', 'Browser compatibility', 'Streaming', 'Contracts', 'Tooling', 'Common use cases'],
  )
  assert.deepEqual(
    lessonComparisons[2]?.rows.map((row) => row.criterion),
    ['Client interaction', 'Contract model', 'Data selection', 'Serialization', 'Streaming', 'Typical architecture', 'Operational complexity'],
  )
  assert.ok(lessonComparisons[0]?.summary.includes('clients select fields'))
  assert.ok(lessonComparisons[1]?.summary.includes('first-class streaming'))
  assert.ok(lessonComparisons[2]?.summary.includes('ordered streams'))
})

test('tenth lesson quiz, challenge and summary are complete without a simulation link', () => {
  const quiz = quizzes.find((candidate) => candidate.id === 'quiz-2-4')
  const lesson = getLessonBySlug('latency-bandwidth-and-failure-modes')
  assert.ok(quiz && lesson)
  assert.equal(lesson.quizId, quiz.id)
  assert.equal(quiz.title, 'API Communication — knowledge check')
  assert.equal(quiz.passThreshold, 0.8)
  assert.equal(quiz.standard, 'final')
  assert.deepEqual(checkQuizStandard(quiz), [])
  assert.equal(quiz.questions.length, 5)
  assert.ok(quiz.questions.every((question) => question.options.length === 4))
  assert.ok(quiz.questions.every((question) => question.options.filter((option) => option.isCorrect).length === 1))
  assert.ok(quiz.questions.every((question) => question.options.every((option) => (option.explanation ?? '').trim().length > 0)))
  assert.ok(quiz.questions.every((question) => (question.explanation ?? '').trim().length > 0))
  assert.deepEqual(
    quiz.questions.map((question) => question.options.findIndex((option) => option.isCorrect)),
    [2, 0, 3, 1, 2],
  )
  assert.equal(lessons.filter((candidate) => candidate.quizId === quiz.id).length, 1)
  assert.ok(quiz.questions[0]?.prompt.includes('catalogue API'))
  assert.ok(quiz.questions[1]?.prompt.includes('mobile client'))
  assert.ok(quiz.questions[2]?.prompt.includes('protobuf field'))
  assert.ok(quiz.questions[3]?.prompt.includes('continuous price updates'))
  assert.ok(quiz.questions[4]?.prompt.includes('public web app'))

  const challenge = practicalChallenges.find((candidate) => candidate.id === lesson.practicalChallengeId)
  assert.ok(challenge)
  assert.equal(challenge.id, 'challenge-2-4')
  assert.equal(challenge.title, 'Challenge: Choose the API Communication Style for a Multi-Client Platform')
  assert.ok(challenge.scenario.includes('real-time analytics component'))
  assert.equal(challenge.requirements.length, 11)
  assert.equal(challenge.constraints.length, 6)
  assert.equal(challenge.deliverables.length, 5)
  assert.ok(challenge.hints && challenge.hints.length === 10)
  assert.ok(challenge.requirements.some((requirement) => requirement.includes('Expected reasoning')))
  assert.ok(challenge.deliverables.some((deliverable) => deliverable.includes('Evaluation criteria')))
  assert.ok(challenge.deliverables.some((deliverable) => deliverable.includes('Detailed model solution')))

  const summary = lessonSummaries.find((candidate) => candidate.id === lesson.summaryId)
  assert.ok(summary)
  assert.equal(summary.id, 'summary-2-4')
  assert.ok(summary.keyTakeaways.length >= 16)
  assert.ok(summary.nextSteps && summary.nextSteps.length >= 2)
  assert.ok(summary.overview.includes('different answers'))
  assert.ok(summary.keyTakeaways.some((takeaway) => takeaway.includes('field numbers')))

  const simulationSlug = lesson.metadata?.simulationSlug
  assert.equal(simulationSlug, undefined)
  assert.equal(getSimulationBySlug(simulationSlug), undefined)
})

test('eleventh lesson metadata preserves the canonical module seed and real-time identity', () => {
  const lesson = getLessonBySlug('choosing-the-right-protocol')
  assert.ok(lesson)
  assert.equal(lesson.id, 'lesson-2-5')
  assert.equal(lesson.moduleId, 'module-2-5')
  assert.equal(lesson.slug, 'choosing-the-right-protocol')
  assert.equal(lesson.number, 1)
  assert.equal(lesson.order, 1)
  assert.equal(lesson.title, 'Real-Time Communication')
  assert.equal(lesson.status, 'published')
  assert.equal(lesson.estimatedMinutes, 70)
  assert.equal(lesson.learningObjectives.length, 12)
  assert.deepEqual(
    lesson.learningObjectives.map((objective) => objective.id),
    Array.from({ length: 12 }, (_, index) => `objective-2-5-${index + 1}`),
  )
  assert.equal(new Set(lesson.learningObjectives.map((objective) => objective.id)).size, 12)
  assert.ok(lesson.learningObjectives.every((objective) => objective.text.trim().length > 20))
  assert.deepEqual(
    lesson.sectionIds,
    Array.from({ length: 16 }, (_, index) => `section-2-5-${index + 1}`),
  )
  assert.deepEqual(lesson.diagramIds, [
    'diagram-2-5-polling-vs-long-polling',
    'diagram-2-5-websocket-handshake-and-full-duplex',
    'diagram-2-5-sse-event-stream',
    'diagram-2-5-websocket-horizontal-scaling',
    'diagram-2-5-realtime-decision-flow',
  ])
  assert.deepEqual(lesson.codeExampleIds, [
    'code-2-5-browser-websocket-client',
    'code-2-5-eventsource-client',
    'code-2-5-aspnetcore-sse-endpoint',
  ])
  assert.deepEqual(lesson.comparisonIds, [
    'comparison-2-5-websockets-vs-sse',
    'comparison-2-5-sse-vs-long-polling',
    'comparison-2-5-websockets-vs-long-polling',
  ])
  assert.equal(lesson.quizId, 'quiz-2-5')
  assert.equal(lesson.practicalChallengeId, 'challenge-2-5')
  assert.equal(lesson.summaryId, 'summary-2-5')
  assert.equal(lesson.metadata?.simulationSlug, undefined)
})

test('eleventh lesson has sixteen ordered sections with real-time content', () => {
  const expectedTitles = [
    'Introduction: Why Real-Time Communication?',
    'The Problem with Regular Polling',
    'Long Polling: Keeping a Request Open',
    'WebSockets: Full-Duplex Communication',
    'WebSocket Handshake and Connection Lifecycle',
    'WebSocket Messages and Communication Patterns',
    'Server-Sent Events (SSE)',
    'SSE Event Stream Structure',
    'Comparing the Three Approaches',
    'Connection Lifecycle and Failure Handling',
    'Scaling Real-Time Systems',
    'Security Considerations',
    'Infrastructure and Operational Considerations',
    'Choosing the Right Technology',
    'Real-World System Design Scenarios',
    'Common Mistakes and Key Takeaways',
  ]
  const lesson = getLessonBySlug('choosing-the-right-protocol')
  assert.ok(lesson)
  const sections = lessonSections.filter((section) => lesson.sectionIds.includes(section.id))

  assert.equal(sections.length, 16)
  assert.deepEqual(
    sections.map((section) => section.order),
    Array.from({ length: 16 }, (_, index) => index + 1),
  )
  assert.deepEqual(
    sections.map((section) => section.title),
    expectedTitles,
  )
  assert.equal(sections[0]?.kind, 'introduction')
  assert.equal(sections[2]?.kind, 'process')
  assert.equal(sections[2]?.steps?.length, 5)
  assert.equal(sections[4]?.kind, 'process')
  assert.equal(sections[4]?.steps?.length, 6)
  assert.equal(sections[9]?.kind, 'process')
  assert.equal(sections[9]?.steps?.length, 6)
  assert.equal(sections[10]?.kind, 'tradeoffs')
  assert.equal(sections[10]?.tradeoffs?.length, 6)
  assert.equal(sections[12]?.kind, 'tradeoffs')
  assert.equal(sections[12]?.tradeoffs?.length, 6)
  assert.equal(sections[13]?.kind, 'tradeoffs')
  assert.equal(sections[13]?.tradeoffs?.length, 5)
  assert.equal(sections[14]?.kind, 'process')
  assert.equal(sections[14]?.steps?.length, 4)
  assert.equal(sections[15]?.kind, 'mistakes')
  assert.equal(sections[15]?.commonMistakes?.length, 7)
  assert.ok(sections.every((section) => section.paragraphs.length > 0))
  assert.ok(sections.every((section) => (section.keyPoints?.length ?? 0) >= 3))
  assert.ok(sections[1]?.paragraphs.join(' ').includes('discovery takes eight seconds'))
  assert.ok(sections[2]?.steps?.some((step) => step.title === 'Server waits'))
  assert.ok(sections[4]?.paragraphs.join(' ').includes('101 Switching Protocols'))
  assert.ok(sections[4]?.paragraphs.join(' ').includes('HTTP/2 and HTTP/3'))
  assert.ok(sections[7]?.paragraphs.join(' ').includes('Last-Event-ID'))
  assert.ok(sections[9]?.steps?.some((step) => step.title === 'Back off before retry'))
  assert.ok(sections[10]?.paragraphs.join(' ').includes('file descriptor'))
  assert.ok(sections[11]?.paragraphs.join(' ').includes('Origin header'))
  assert.ok(sections[14]?.steps?.some((step) => step.title === 'WhatsApp-like chat'))
})

test('eleventh lesson diagrams are complete, unique and referenced correctly', () => {
  const lesson = getLessonBySlug('choosing-the-right-protocol')
  assert.ok(lesson)
  const lessonDiagrams = diagrams.filter((diagram) => lesson.diagramIds.includes(diagram.id))

  assert.equal(lessonDiagrams.length, 5)
  assert.deepEqual(
    lessonDiagrams.map((diagram) => diagram.id),
    lesson.diagramIds,
  )
  assert.deepEqual(
    lessonDiagrams.map((diagram) => diagram.layout),
    ['comparison', 'flow', 'flow', 'layers', 'flow'],
  )
  assert.equal(new Set(lessonDiagrams.flatMap((diagram) => diagram.nodes.map((node) => node.id))).size, 44)
  assert.equal(new Set(lessonDiagrams.flatMap((diagram) => diagram.edges.map((edge) => edge.id))).size, 43)
  assert.ok(lessonDiagrams[0]?.nodes.some((node) => node.label === 'Long-poll request at t=0'))
  assert.ok(lessonDiagrams[1]?.description.includes('101 Switching Protocols'))
  assert.ok(lessonDiagrams[2]?.nodes.some((node) => node.label === 'Reconnect with Last-Event-ID'))
  assert.ok(lessonDiagrams[3]?.nodes.some((node) => node.label === 'Shared pub/sub layer'))
  assert.ok(lessonDiagrams[4]?.nodes.some((node) => node.label === 'Regular Polling'))
})

test('eleventh lesson code examples and comparisons are complete and referenced correctly', () => {
  const lesson = getLessonBySlug('choosing-the-right-protocol')
  assert.ok(lesson)
  const lessonExamples = codeExamples.filter((example) => lesson.codeExampleIds.includes(example.id))
  const lessonComparisons = comparisons.filter((comparison) => lesson.comparisonIds.includes(comparison.id))

  assert.equal(lessonExamples.length, 3)
  assert.deepEqual(
    lessonExamples.map((example) => example.id),
    lesson.codeExampleIds,
  )
  assert.deepEqual(
    lessonExamples.map((example) => example.language),
    ['javascript', 'javascript', 'text'],
  )
  assert.ok(lessonExamples.every((example) => example.code.trim().length > 0))
  assert.ok(lessonExamples[0]?.code.includes('new WebSocket('))
  assert.ok(lessonExamples[0]?.code.includes('chat.message'))
  assert.ok(lessonExamples[1]?.code.includes('new EventSource('))
  assert.ok(lessonExamples[1]?.code.includes('method: "POST"'))
  assert.ok(lessonExamples[2]?.code.includes('text/event-stream'))
  assert.ok(lessonExamples[2]?.code.includes('FlushAsync'))
  assert.ok(lessonExamples[0]?.explanation.includes('reconnect'))
  assert.ok(lessonExamples[1]?.explanation.includes('Last-Event-ID'))
  assert.ok(lessonExamples[2]?.explanation.includes('retained events'))

  assert.equal(lessonComparisons.length, 3)
  assert.deepEqual(
    lessonComparisons.map((comparison) => comparison.id),
    lesson.comparisonIds,
  )
  assert.deepEqual(
    lessonComparisons.map((comparison) => comparison.columns.map((column) => column.label)),
    [
      ['WebSocket', 'SSE'],
      ['SSE', 'Long Polling'],
      ['WebSocket', 'Long Polling'],
    ],
  )
  assert.deepEqual(
    lessonComparisons[0]?.rows.map((row) => row.criterion),
    ['Communication direction', 'Transport and format', 'Reconnection', 'Ordering and replay', 'Connection overhead', 'Best fit', 'Primary cost'],
  )
  assert.deepEqual(
    lessonComparisons[1]?.rows.map((row) => row.criterion),
    ['Communication direction', 'Connection lifecycle', 'Reconnection and recovery', 'Request overhead', 'Best fit', 'Primary cost'],
  )
  assert.deepEqual(
    lessonComparisons[2]?.rows.map((row) => row.criterion),
    ['Communication direction', 'Connection lifecycle', 'Per-update overhead', 'Failure handling', 'Best fit', 'Primary cost'],
  )
  assert.ok(lessonComparisons[0]?.summary.includes('one-way text stream'))
  assert.ok(lessonComparisons[1]?.summary.includes('browser reconnection'))
  assert.ok(lessonComparisons[2]?.summary.includes('repeated requests'))
})

test('eleventh lesson quiz, challenge and summary are complete without a simulation link', () => {
  const quiz = quizzes.find((candidate) => candidate.id === 'quiz-2-5')
  const lesson = getLessonBySlug('choosing-the-right-protocol')
  assert.ok(quiz && lesson)
  assert.equal(lesson.quizId, quiz.id)
  assert.equal(quiz.title, 'Real-Time Communication — knowledge check')
  assert.equal(quiz.passThreshold, 0.8)
  assert.equal(quiz.standard, 'final')
  assert.deepEqual(checkQuizStandard(quiz), [])
  assert.equal(quiz.questions.length, 5)
  assert.ok(quiz.questions.every((question) => question.options.length === 4))
  assert.ok(quiz.questions.every((question) => question.options.filter((option) => option.isCorrect).length === 1))
  assert.ok(quiz.questions.every((question) => question.options.every((option) => (option.explanation ?? '').trim().length > 0)))
  assert.ok(quiz.questions.every((question) => (question.explanation ?? '').trim().length > 0))
  assert.deepEqual(
    quiz.questions.map((question) => question.options.findIndex((option) => option.isCorrect)),
    [1, 3, 0, 2, 1],
  )
  assert.equal(lessons.filter((candidate) => candidate.quizId === quiz.id).length, 1)
  assert.ok(quiz.questions[0]?.prompt.includes('HTTP/1.1 WebSocket opening handshake'))
  assert.ok(quiz.questions[1]?.prompt.includes('notification centre'))
  assert.ok(quiz.questions[2]?.prompt.includes('Long Polling request lifecycle'))
  assert.ok(quiz.questions[3]?.prompt.includes('load balancer'))
  assert.ok(quiz.questions[4]?.prompt.includes('typing indicators'))

  const challenge = practicalChallenges.find((candidate) => candidate.id === lesson.practicalChallengeId)
  assert.ok(challenge)
  assert.equal(challenge.id, 'challenge-2-5')
  assert.equal(challenge.title, 'Challenge: Design Real-Time Communication for a Collaboration Platform')
  assert.ok(challenge.scenario.includes('unstable mobile networks'))
  assert.equal(challenge.requirements.length, 11)
  assert.equal(challenge.constraints.length, 6)
  assert.equal(challenge.deliverables.length, 5)
  assert.ok(challenge.hints && challenge.hints.length === 10)
  assert.ok(challenge.requirements.some((requirement) => requirement.includes('communication direction')))
  assert.ok(challenge.deliverables.some((deliverable) => deliverable.includes('evaluation criteria')))
  assert.ok(challenge.deliverables.some((deliverable) => deliverable.includes('Detailed model solution')))
  assert.ok(challenge.hints.some((hint) => hint.includes('Model solution step')))

  const summary = lessonSummaries.find((candidate) => candidate.id === lesson.summaryId)
  assert.ok(summary)
  assert.equal(summary.id, 'summary-2-5')
  assert.ok(summary.keyTakeaways.length >= 16)
  assert.ok(summary.nextSteps && summary.nextSteps.length >= 2)
  assert.ok(summary.overview.includes('direction'))
  assert.ok(summary.keyTakeaways.some((takeaway) => takeaway.includes('text/event-stream')))

  const simulationSlug = lesson.metadata?.simulationSlug
  assert.equal(simulationSlug, undefined)
  assert.equal(getSimulationBySlug(simulationSlug), undefined)
})

test('twelfth lesson metadata preserves the canonical module seed and load-balancing identity', () => {
  const lesson = getLessonBySlug('dns-and-name-resolution')
  assert.ok(lesson)
  assert.equal(lesson.id, 'lesson-2-6')
  assert.equal(lesson.moduleId, 'module-2-6')
  assert.equal(lesson.slug, 'dns-and-name-resolution')
  assert.equal(lesson.number, 1)
  assert.equal(lesson.order, 1)
  assert.equal(lesson.title, 'Load Balancing')
  assert.equal(lesson.status, 'published')
  assert.equal(lesson.estimatedMinutes, 75)
  assert.equal(lesson.learningObjectives.length, 12)
  assert.deepEqual(
    lesson.learningObjectives.map((objective) => objective.id),
    Array.from({ length: 12 }, (_, index) => `objective-2-6-${index + 1}`),
  )
  assert.equal(new Set(lesson.learningObjectives.map((objective) => objective.id)).size, 12)
  assert.ok(lesson.learningObjectives.every((objective) => objective.text.trim().length > 20))
  assert.deepEqual(
    lesson.sectionIds,
    Array.from({ length: 16 }, (_, index) => `section-2-6-${index + 1}`),
  )
  assert.deepEqual(lesson.diagramIds, [
    'diagram-2-6-basic-load-balancing-architecture',
    'diagram-2-6-l4-vs-l7-routing',
    'diagram-2-6-algorithm-comparison',
    'diagram-2-6-health-check-recovery',
    'diagram-2-6-high-availability-architecture',
  ])
  assert.deepEqual(lesson.codeExampleIds, [
    'code-2-6-round-robin-rotation',
    'code-2-6-weighted-round-robin',
    'code-2-6-aspnetcore-health-checks',
  ])
  assert.deepEqual(lesson.comparisonIds, [
    'comparison-2-6-l4-vs-l7',
    'comparison-2-6-algorithms',
    'comparison-2-6-active-vs-passive-health-checks',
  ])
  assert.equal(lesson.quizId, 'quiz-2-6')
  assert.equal(lesson.practicalChallengeId, 'challenge-2-6')
  assert.equal(lesson.summaryId, 'summary-2-6')
  assert.equal(lesson.metadata?.simulationSlug, undefined)
})

test('twelfth lesson has sixteen ordered sections with load-balancing content', () => {
  const expectedTitles = [
    'Introduction: Why Do We Need Load Balancing?',
    'What Is a Load Balancer?',
    'How a Load Balancer Handles a Request',
    'Layer 4 Load Balancing',
    'Layer 7 Load Balancing',
    'L4 vs L7: Architectural Trade-offs',
    'Load-Balancing Algorithms: Round Robin',
    'Weighted Round Robin',
    'Least Connections',
    'IP Hash and Session Affinity',
    'Other Distribution Strategies',
    'Health Checks: Knowing Which Servers Are Healthy',
    'Handling Unhealthy Backends',
    'Load Balancer Availability and Failure Scenarios',
    'Real-World System Design and Practical Decisions',
    'Common Mistakes and Key Takeaways',
  ]
  const lesson = getLessonBySlug('dns-and-name-resolution')
  assert.ok(lesson)
  const sections = lessonSections.filter((section) => lesson.sectionIds.includes(section.id))

  assert.equal(sections.length, 16)
  assert.deepEqual(
    sections.map((section) => section.order),
    Array.from({ length: 16 }, (_, index) => index + 1),
  )
  assert.deepEqual(
    sections.map((section) => section.title),
    expectedTitles,
  )
  assert.equal(sections[0]?.kind, 'introduction')
  assert.equal(sections[2]?.kind, 'process')
  assert.equal(sections[2]?.steps?.length, 5)
  assert.equal(sections[5]?.kind, 'tradeoffs')
  assert.equal(sections[5]?.tradeoffs?.length, 4)
  assert.equal(sections[12]?.kind, 'process')
  assert.equal(sections[12]?.steps?.length, 6)
  assert.equal(sections[14]?.kind, 'tradeoffs')
  assert.equal(sections[14]?.tradeoffs?.length, 4)
  assert.equal(sections[15]?.kind, 'mistakes')
  assert.equal(sections[15]?.commonMistakes?.length, 9)
  assert.ok(sections.every((section) => section.paragraphs.length > 0))
  assert.ok(sections.every((section) => (section.keyPoints?.length ?? 0) >= 5))
  assert.ok(sections[1]?.paragraphs.join(' ').includes('Client → Load Balancer → Server A / Server B / Server C'))
  assert.ok(sections[5]?.paragraphs.join(' ').includes('not automatically faster in every workload'))
  assert.ok(sections[7]?.paragraphs.join(' ').includes('5:3:2'))
  assert.ok(sections[8]?.paragraphs.join(' ').includes('proxy for load'))
  assert.ok(sections[11]?.paragraphs.join(' ').includes('readiness endpoint'))
  assert.ok(sections[12]?.paragraphs.join(' ').includes('cascading overload'))
  assert.ok(sections[12]?.paragraphs.join(' ').includes('flapping'))
  assert.ok(sections[13]?.paragraphs.join(' ').includes('Connection draining'))
  assert.ok(sections[15]?.commonMistakes?.some((mistake) => mistake.includes('Layer 7')))
})

test('twelfth lesson diagrams are complete, unique and referenced correctly', () => {
  const lesson = getLessonBySlug('dns-and-name-resolution')
  assert.ok(lesson)
  const lessonDiagrams = diagrams.filter((diagram) => lesson.diagramIds.includes(diagram.id))

  assert.equal(lessonDiagrams.length, 5)
  assert.deepEqual(
    lessonDiagrams.map((diagram) => diagram.id),
    lesson.diagramIds,
  )
  assert.deepEqual(
    lessonDiagrams.map((diagram) => diagram.layout),
    ['topology', 'comparison', 'comparison', 'timeline', 'topology'],
  )
  assert.equal(new Set(lessonDiagrams.flatMap((diagram) => diagram.nodes.map((node) => node.id))).size, 42)
  assert.equal(new Set(lessonDiagrams.flatMap((diagram) => diagram.edges.map((edge) => edge.id))).size, 47)
  assert.ok(lessonDiagrams[0]?.nodes.some((node) => node.label === 'Load balancer'))
  assert.ok(lessonDiagrams[1]?.nodes.some((node) => node.label === 'IP address and port'))
  assert.ok(lessonDiagrams[1]?.nodes.some((node) => node.label === 'Host, path and headers'))
  assert.ok(lessonDiagrams[2]?.nodes.some((node) => node.label === '5 : 3 : 2'))
  assert.ok(lessonDiagrams[3]?.nodes.some((node) => node.label === 'Failure threshold'))
  assert.ok(lessonDiagrams[4]?.description.includes('conceptual topology'))
})

test('twelfth lesson code examples and comparisons are complete and referenced correctly', () => {
  const lesson = getLessonBySlug('dns-and-name-resolution')
  assert.ok(lesson)
  const lessonExamples = codeExamples.filter((example) => lesson.codeExampleIds.includes(example.id))
  const lessonComparisons = comparisons.filter((comparison) => lesson.comparisonIds.includes(comparison.id))

  assert.equal(lessonExamples.length, 3)
  assert.deepEqual(
    lessonExamples.map((example) => example.id),
    lesson.codeExampleIds,
  )
  assert.deepEqual(
    lessonExamples.map((example) => example.language),
    ['typescript', 'typescript', 'text'],
  )
  assert.ok(lessonExamples.every((example) => example.code.trim().length > 0))
  assert.ok(lessonExamples[0]?.code.includes('pickRoundRobin'))
  assert.ok(lessonExamples[0]?.code.includes('nextIndex'))
  assert.ok(lessonExamples[1]?.code.includes('pickWeighted'))
  assert.ok(lessonExamples[1]?.code.includes('totalWeight'))
  assert.ok(lessonExamples[2]?.code.includes('AddHealthChecks'))
  assert.ok(lessonExamples[2]?.code.includes('MapHealthChecks'))
  assert.ok(lessonExamples[2]?.code.includes('HealthCheckResult.Unhealthy'))
  assert.ok(lessonExamples[0]?.explanation.includes('in-memory model'))
  assert.ok(lessonExamples[1]?.explanation.includes('A=5, B=3 and C=2'))
  assert.ok(lessonExamples[2]?.explanation.includes('does not configure an external load balancer'))

  assert.equal(lessonComparisons.length, 3)
  assert.deepEqual(
    lessonComparisons.map((comparison) => comparison.id),
    lesson.comparisonIds,
  )
  assert.deepEqual(
    lessonComparisons.map((comparison) => comparison.columns.map((column) => column.label)),
    [
      ['Layer 4', 'Layer 7'],
      ['Round Robin', 'Weighted Round Robin', 'Least Connections'],
      ['Active health checks', 'Passive health monitoring'],
    ],
  )
  assert.deepEqual(
    lessonComparisons[0]?.rows.map((row) => row.criterion),
    ['OSI layer', 'Protocol awareness', 'Routing information', 'TLS considerations', 'Routing flexibility', 'Processing overhead', 'Connection handling', 'Typical use cases', 'Important caveat'],
  )
  assert.deepEqual(
    lessonComparisons[1]?.rows.map((row) => row.criterion),
    ['Selection mechanism', 'Capacity assumption', 'Request distribution', 'Strengths', 'Weaknesses', 'Suitable workloads'],
  )
  assert.deepEqual(
    lessonComparisons[2]?.rows.map((row) => row.criterion),
    ['How health is detected', 'Detection timing', 'Required configuration', 'Advantages', 'Limitations', 'Appropriate scenarios'],
  )
  assert.ok(lessonComparisons[0]?.summary.includes('transport information'))
  assert.ok(lessonComparisons[1]?.summary.includes('different signals'))
  assert.ok(lessonComparisons[2]?.summary.includes('proactively'))
})

test('twelfth lesson quiz, challenge and summary are complete without a simulation link', () => {
  const quiz = quizzes.find((candidate) => candidate.id === 'quiz-2-6')
  const lesson = getLessonBySlug('dns-and-name-resolution')
  assert.ok(quiz && lesson)
  assert.equal(lesson.quizId, quiz.id)
  assert.equal(quiz.title, 'Load Balancing — knowledge check')
  assert.equal(quiz.passThreshold, 0.8)
  assert.equal(quiz.standard, 'final')
  assert.deepEqual(checkQuizStandard(quiz), [])
  assert.equal(quiz.questions.length, 5)
  assert.ok(quiz.questions.every((question) => question.options.length === 4))
  assert.ok(quiz.questions.every((question) => question.options.filter((option) => option.isCorrect).length === 1))
  assert.ok(quiz.questions.every((question) => question.options.every((option) => (option.explanation ?? '').trim().length > 0)))
  assert.ok(quiz.questions.every((question) => (question.explanation ?? '').trim().length > 0))
  assert.deepEqual(
    quiz.questions.map((question) => question.options.findIndex((option) => option.isCorrect)),
    [2, 0, 3, 1, 2],
  )
  assert.equal(lessons.filter((candidate) => candidate.quizId === quiz.id).length, 1)
  assert.ok(quiz.questions[0]?.prompt.includes('/api/users'))
  assert.ok(quiz.questions[1]?.prompt.includes('8, 4 and 4 CPU cores'))
  assert.ok(quiz.questions[2]?.prompt.includes('Least Connections'))
  assert.ok(quiz.questions[3]?.prompt.includes('readiness probes'))
  assert.ok(quiz.questions[4]?.prompt.includes('redundant load balancers'))

  const challenge = practicalChallenges.find((candidate) => candidate.id === lesson.practicalChallengeId)
  assert.ok(challenge)
  assert.equal(challenge.id, 'challenge-2-6')
  assert.equal(challenge.title, 'Design a Resilient Load-Balancing Strategy')
  assert.ok(challenge.scenario.includes('8 CPU cores'))
  assert.equal(challenge.requirements.length, 10)
  assert.equal(challenge.constraints.length, 7)
  assert.equal(challenge.deliverables.length, 7)
  assert.ok(challenge.hints && challenge.hints.length === 11)
  assert.ok(challenge.requirements.some((requirement) => requirement.includes('cascading overload')))
  assert.ok(challenge.constraints.some((constraint) => constraint.includes('CPU and RAM alone')))
  assert.ok(challenge.deliverables.some((deliverable) => deliverable.includes('Detailed model solution')))
  assert.ok(challenge.hints.some((hint) => hint.includes('Model solution step')))

  const summary = lessonSummaries.find((candidate) => candidate.id === lesson.summaryId)
  assert.ok(summary)
  assert.equal(summary.id, 'summary-2-6')
  assert.ok(summary.keyTakeaways.length >= 16)
  assert.ok(summary.nextSteps && summary.nextSteps.length >= 2)
  assert.ok(summary.overview.includes('entry point'))
  assert.ok(summary.keyTakeaways.some((takeaway) => takeaway.includes('5:3:2')))

  const simulationSlug = lesson.metadata?.simulationSlug
  assert.equal(simulationSlug, undefined)
  assert.equal(getSimulationBySlug(simulationSlug), undefined)
})

test('Module 2.7 publishes the complete Reverse Proxy lesson with preserved canonical identity', () => {
  const lesson = getLessonBySlug('streaming-and-long-lived-connections')
  assert.ok(lesson)
  assert.equal(lesson.id, 'lesson-2-7')
  assert.equal(lesson.moduleId, 'module-2-7')
  assert.equal(lesson.slug, 'streaming-and-long-lived-connections')
  assert.equal(lesson.title, 'Reverse Proxy')
  assert.equal(lesson.status, 'published')
  assert.equal(lesson.order, 1)
  assert.equal(lesson.number, 1)
  assert.equal(lesson.learningObjectives.length, 12)
  assert.equal(new Set(lesson.learningObjectives.map((objective) => objective.id)).size, 12)
  assert.ok(lesson.learningObjectives.every((objective) => objective.text.trim().length > 20))

  const content = getLessonContent(lesson.slug)
  const sections = content.sections
  assert.deepEqual(
    sections.map((section) => section.title),
    [
      'Introduction: Why Do We Need Proxies?',
      'What Is a Proxy Server?',
      'Forward Proxy: Representing the Client',
      'Reverse Proxy: Representing the Server',
      'Forward Proxy vs Reverse Proxy',
      'Reverse Proxy Architecture and Request Flow',
      'TLS Termination and HTTPS Handling',
      'Nginx as a Reverse Proxy',
      'Important Nginx Proxy Headers',
      'Reverse Proxy Routing and Load Distribution',
      'What Is an API Gateway?',
      'API Gateway vs Reverse Proxy',
      'Reverse Proxies in Modern Architectures',
      'Security, Performance, and Reliability',
      'Real-World Architecture and Design Decisions',
      'Common Mistakes and Key Takeaways',
    ],
  )
  assert.deepEqual(
    sections.map((section) => section.order),
    Array.from({ length: 16 }, (_, index) => index + 1),
  )
  assert.ok(sections.every((section) => section.paragraphs.length > 0))
  assert.equal(sections[0]?.kind, 'introduction')
  assert.equal(sections[4]?.kind, 'tradeoffs')
  assert.equal(sections[5]?.kind, 'process')
  assert.equal(sections[5]?.steps?.length, 9)
  assert.equal(sections[6]?.kind, 'tradeoffs')
  assert.equal(sections[9]?.kind, 'tradeoffs')
  assert.equal(sections[11]?.kind, 'tradeoffs')
  assert.equal(sections[13]?.kind, 'tradeoffs')
  assert.equal(sections[14]?.kind, 'tradeoffs')
  assert.equal(sections[15]?.kind, 'mistakes')
  assert.equal(sections[15]?.commonMistakes?.length, 9)
  assert.ok(sections[15]?.paragraphs.join(' ').includes('X-Forwarded-For'))

  assert.deepEqual(
    content.diagrams.map((diagram) => diagram.id),
    [
      'diagram-2-7-forward-vs-reverse-proxy',
      'diagram-2-7-reverse-proxy-request-lifecycle',
      'diagram-2-7-tls-termination-vs-passthrough',
      'diagram-2-7-api-gateway-vs-reverse-proxy',
      'diagram-2-7-production-request-path',
    ],
  )
  assert.deepEqual(
    content.diagrams.map((diagram) => diagram.layout),
    ['comparison', 'flow', 'layers', 'comparison', 'topology'],
  )
  assert.ok(content.diagrams.every((diagram) => diagram.nodes.length >= 7 && diagram.edges.length >= 7))
  assert.ok(
    content.diagrams.every((diagram) =>
      diagram.edges.every(
        (edge) =>
          diagram.nodes.some((node) => node.id === edge.source) &&
          diagram.nodes.some((node) => node.id === edge.target),
      ),
    ),
  )

  assert.deepEqual(
    content.codeExamples.map((example) => example.id),
    [
      'code-2-7-nginx-reverse-proxy',
      'code-2-7-aspnetcore-forwarded-headers',
      'code-2-7-yarp-route-concept',
    ],
  )
  assert.deepEqual(
    content.codeExamples.map((example) => example.language),
    ['text', 'text', 'json'],
  )
  assert.ok(content.codeExamples.every((example) => example.code.split('\n').length <= 16))
  assert.ok(content.codeExamples[0]?.code.includes('proxy_pass http://app_backend;'))
  assert.ok(content.codeExamples[0]?.code.includes('$proxy_add_x_forwarded_for'))
  assert.ok(content.codeExamples[1]?.code.includes('KnownProxies.Add'))
  assert.ok(content.codeExamples[1]?.code.includes('KnownNetworks.Add'))
  assert.ok(content.codeExamples[1]?.code.includes('app.UseForwardedHeaders();'))
  assert.ok(content.codeExamples[2]?.code.includes('/api/products/{**catch-all}'))

  assert.deepEqual(
    content.comparisons.map((comparison) => comparison.id),
    [
      'comparison-2-7-forward-vs-reverse-proxy',
      'comparison-2-7-reverse-proxy-vs-api-gateway',
      'comparison-2-7-tls-termination-vs-passthrough',
    ],
  )
  assert.deepEqual(
    content.comparisons.map((comparison) => comparison.rows.length),
    [7, 9, 7],
  )
  assert.ok(content.comparisons.every((comparison) => comparison.columns.length === 2))
  assert.ok(
    content.comparisons.every((comparison) =>
      comparison.rows.every((row) => comparison.columns.every((column) => (row.values[column.id] ?? '').length > 0)),
    ),
  )

  const quiz = content.quiz
  assert.ok(quiz)
  assert.equal(quiz.id, 'quiz-2-7')
  assert.equal(quiz.title, 'Reverse Proxy: Final Assessment')
  assert.equal(quiz.standard, 'final')
  assert.equal(quiz.passThreshold, 0.8)
  assert.deepEqual(checkQuizStandard(quiz), [])
  assert.equal(quiz.questions.length, 5)
  assert.ok(quiz.questions.every((question) => question.options.length === 4))
  assert.ok(quiz.questions.every((question) => question.options.filter((option) => option.isCorrect).length === 1))
  assert.ok(quiz.questions.every((question) => question.options.every((option) => (option.explanation ?? '').trim().length > 0)))
  assert.ok(quiz.questions.every((question) => (question.explanation ?? '').trim().length > 0))
  assert.deepEqual(
    quiz.questions.map((question) => question.options.findIndex((option) => option.isCorrect)),
    [2, 0, 3, 1, 2],
  )

  const challenge = content.practicalChallenge
  assert.ok(challenge)
  assert.equal(challenge.id, 'challenge-2-7')
  assert.equal(challenge.title, 'Design the Entry Point for a Production E-Commerce Platform')
  assert.ok(challenge.scenario.includes('Angular web frontend'))
  assert.ok(challenge.scenario.includes('https://shop.example.com'))
  assert.equal(challenge.requirements.length, 11)
  assert.equal(challenge.constraints.length, 7)
  assert.equal(challenge.deliverables.length, 6)
  assert.equal(challenge.hints?.length, 11)
  assert.ok(challenge.requirements.some((requirement) => requirement.includes('trusted proxy boundaries')))
  assert.ok(challenge.hints?.some((hint) => hint.includes('There is no single acceptable architecture')))

  const summary = content.summary
  assert.ok(summary)
  assert.equal(summary.id, 'summary-2-7')
  assert.ok(summary.overview.includes('Forward proxies'))
  assert.equal(summary.keyTakeaways.length, 20)
  assert.ok(summary.nextSteps && summary.nextSteps.length >= 2)

  assert.equal(lesson.metadata?.simulationSlug, undefined)
  assert.equal(getSimulationBySlug(lesson.metadata?.simulationSlug), undefined)
  assert.equal(getLessonBySlug('relational-vs-nosql-models')?.status, 'published')
})

test('Module 3.1 publishes the complete Database Fundamentals lesson with preserved canonical identity', () => {
  const lesson = getLessonBySlug('relational-vs-nosql-models')
  assert.ok(lesson)
  assert.equal(lesson.id, 'lesson-3-1')
  assert.equal(lesson.moduleId, 'module-3-1')
  assert.equal(lesson.slug, 'relational-vs-nosql-models')
  assert.equal(lesson.title, 'Database Fundamentals')
  assert.equal(lesson.status, 'published')
  assert.equal(lesson.order, 1)
  assert.equal(lesson.number, 1)
  assert.equal(lesson.learningObjectives.length, 12)
  assert.equal(new Set(lesson.learningObjectives.map((objective) => objective.id)).size, 12)
  assert.ok(lesson.learningObjectives.every((objective) => objective.text.trim().length > 20))
  assert.deepEqual(
    getLessonsByModule('module-3-1').map((candidate) => candidate.id),
    ['lesson-3-1'],
  )

  const content = getLessonContent(lesson.slug)
  assert.ok(content)
  const sections = content.sections
  assert.deepEqual(
    sections.map((section) => section.title),
    [
      'Introduction: Why Do Applications Need Databases?',
      'What Is a Database?',
      'Understanding Data Models',
      'Relational Databases: The Core Idea',
      'Tables, Keys, and Relationships',
      'Querying Relational Data',
      'Relational Database Strengths and Limitations',
      'Non-Relational Databases: The Core Idea',
      'Major Non-Relational Data Models',
      'Document Databases in Practice',
      'Structured, Semi-Structured, and Flexible Data',
      'Choosing Between Relational and Non-Relational Databases',
      'Polyglot Persistence: Using Multiple Database Models',
      'Common Database Selection Mistakes',
      'Real-World System Design Scenarios',
      'Key Takeaways and Database Selection Framework',
    ],
  )
  assert.deepEqual(
    sections.map((section) => section.order),
    Array.from({ length: 16 }, (_, index) => index + 1),
  )
  assert.ok(sections.every((section) => section.paragraphs.length > 0))
  assert.ok(sections.every((section) => section.paragraphs.every((paragraph) => paragraph.trim().length > 0)))
  assert.ok(sections.every((section) => section.keyPoints && section.keyPoints.length >= 3))
  assert.equal(sections[0]?.kind, 'introduction')
  assert.equal(sections[4]?.kind, 'process')
  assert.equal(sections[4]?.steps?.length, 5)
  assert.equal(sections[5]?.kind, 'process')
  assert.equal(sections[5]?.steps?.length, 5)
  assert.equal(sections[6]?.kind, 'tradeoffs')
  assert.equal(sections[6]?.tradeoffs?.length, 5)
  assert.equal(sections[8]?.kind, 'tradeoffs')
  assert.equal(sections[8]?.tradeoffs?.length, 4)
  assert.equal(sections[11]?.kind, 'process')
  assert.equal(sections[11]?.steps?.length, 7)
  assert.equal(sections[12]?.kind, 'tradeoffs')
  assert.equal(sections[12]?.tradeoffs?.length, 4)
  assert.equal(sections[13]?.kind, 'mistakes')
  assert.equal(sections[13]?.commonMistakes?.length, 8)
  assert.equal(sections[13]?.steps?.length, 5)
  assert.equal(sections[14]?.kind, 'tradeoffs')
  assert.equal(sections[14]?.tradeoffs?.length, 4)
  assert.equal(sections[15]?.kind, 'process')
  assert.equal(sections[15]?.steps?.length, 8)
  assert.ok(sections[0]?.paragraphs.join(' ').includes('e-commerce platform'))
  assert.ok(sections[0]?.paragraphs.join(' ').includes('users'))
  assert.ok(sections[0]?.paragraphs.join(' ').includes('payments'))
  assert.ok(sections[1]?.paragraphs.join(' ').includes('database management system'))
  assert.ok(sections[3]?.paragraphs.join(' ').includes('OrderItems'))
  assert.ok(sections[4]?.paragraphs.join(' ').includes('junction table'))
  assert.ok(sections[7]?.paragraphs.join(' ').includes('does not mean no schema'))
  assert.ok(sections[10]?.paragraphs.join(' ').includes('can also store JSON in a column'))
  assert.ok(sections[12]?.paragraphs.join(' ').includes('Polyglot persistence'))
  assert.ok(sections[15]?.keyPoints?.some((point) => point.includes('NoSQL is not automatically faster')))

  assert.deepEqual(
    content.diagrams.map((diagram) => diagram.id),
    [
      'diagram-3-1-database-management-fundamentals',
      'diagram-3-1-relational-database-structure',
      'diagram-3-1-relational-vs-document-models',
      'diagram-3-1-major-non-relational-models',
      'diagram-3-1-database-selection-decision-flow',
    ],
  )
  assert.deepEqual(
    content.diagrams.map((diagram) => diagram.layout),
    ['flow', 'topology', 'comparison', 'comparison', 'flow'],
  )
  assert.ok(content.diagrams.every((diagram) => diagram.nodes.length >= 8 && diagram.edges.length >= 8))
  assert.ok(
    content.diagrams.every((diagram) =>
      diagram.edges.every(
        (edge) =>
          diagram.nodes.some((node) => node.id === edge.source) &&
          diagram.nodes.some((node) => node.id === edge.target),
      ),
    ),
  )
  assert.ok(content.diagrams[1]?.nodes.some((node) => node.label === 'OrderItems junction table'))
  assert.ok(content.diagrams[3]?.nodes.some((node) => node.label === 'Graph model'))

  assert.deepEqual(
    content.codeExamples.map((example) => example.id),
    [
      'code-3-1-relational-tables-and-keys',
      'code-3-1-querying-related-data',
      'code-3-1-document-product-representation',
    ],
  )
  assert.deepEqual(
    content.codeExamples.map((example) => example.language),
    ['sql', 'sql', 'json'],
  )
  assert.ok(content.codeExamples.every((example) => example.code.split('\n').length <= 20))
  assert.ok(content.codeExamples[0]?.code.includes('CustomerID INTEGER NOT NULL REFERENCES Customers(CustomerID)'))
  assert.ok(content.codeExamples[0]?.code.includes('PRIMARY KEY (OrderID, ProductID)'))
  assert.ok(content.codeExamples[1]?.code.includes('JOIN Customers AS c ON c.CustomerID = o.CustomerID'))
  assert.ok(content.codeExamples[2]?.code.includes('"switchType": "Linear"'))
  assert.doesNotThrow(() => JSON.parse(content.codeExamples[2]?.code ?? ''))

  assert.deepEqual(
    content.comparisons.map((comparison) => comparison.id),
    [
      'comparison-3-1-relational-vs-non-relational',
      'comparison-3-1-structured-vs-semi-structured',
      'comparison-3-1-relational-vs-document',
    ],
  )
  assert.deepEqual(
    content.comparisons.map((comparison) => comparison.rows.length),
    [7, 7, 7],
  )
  assert.ok(content.comparisons.every((comparison) => comparison.columns.length === 2))
  assert.ok(
    content.comparisons.every((comparison) =>
      comparison.rows.every((row) => comparison.columns.every((column) => (row.values[column.id] ?? '').length > 0)),
    ),
  )

  const quiz = content.quiz
  assert.ok(quiz)
  assert.equal(quiz.id, 'quiz-3-1')
  assert.equal(quiz.title, 'Database Fundamentals: Final Assessment')
  assert.equal(quiz.standard, 'final')
  assert.equal(quiz.passThreshold, 0.8)
  assert.deepEqual(checkQuizStandard(quiz), [])
  assert.equal(quiz.questions.length, 5)
  assert.ok(quiz.questions.every((question) => question.options.length === 4))
  assert.ok(quiz.questions.every((question) => question.options.filter((option) => option.isCorrect).length === 1))
  assert.ok(quiz.questions.every((question) => question.options.every((option) => (option.explanation ?? '').trim().length > 0)))
  assert.ok(quiz.questions.every((question) => (question.explanation ?? '').trim().length > 0))
  assert.deepEqual(
    quiz.questions.map((question) => question.options.findIndex((option) => option.isCorrect)),
    [1, 2, 0, 3, 2],
  )

  const challenge = content.practicalChallenge
  assert.ok(challenge)
  assert.equal(challenge.id, 'challenge-3-1')
  assert.equal(challenge.title, 'Choose a Database Architecture for an E-Commerce Platform')
  assert.ok(challenge.scenario.includes('Product browsing activity grows rapidly'))
  assert.equal(challenge.requirements.length, 10)
  assert.equal(challenge.constraints.length, 7)
  assert.equal(challenge.deliverables.length, 7)
  assert.equal(challenge.hints?.length, 12)
  assert.ok(challenge.requirements.some((requirement) => requirement.includes('polyglot persistence')))
  assert.ok(challenge.hints?.some((hint) => hint.includes('There is no single acceptable architecture')))

  const summary = content.summary
  assert.ok(summary)
  assert.equal(summary.id, 'summary-3-1')
  assert.ok(summary.overview.includes('requirements-driven architectural decision'))
  assert.equal(summary.keyTakeaways.length, 20)
  assert.ok(summary.nextSteps && summary.nextSteps.length >= 2)

  assert.equal(lesson.metadata?.simulationSlug, undefined)
  assert.equal(getSimulationBySlug(lesson.metadata?.simulationSlug), undefined)
  assert.equal(getLessonBySlug('schema-design-for-access-patterns')?.status, 'published')
})

test('Module 3.2 publishes the complete SQL Databases lesson with preserved canonical identity', () => {
  const lesson = getLessonBySlug('schema-design-for-access-patterns')
  assert.ok(lesson)
  assert.equal(lesson.id, 'lesson-3-2')
  assert.equal(lesson.moduleId, 'module-3-2')
  assert.equal(lesson.slug, 'schema-design-for-access-patterns')
  assert.equal(lesson.title, 'SQL Databases')
  assert.equal(lesson.status, 'published')
  assert.equal(lesson.order, 1)
  assert.equal(lesson.number, 1)
  assert.equal(modules.find((module) => module.id === 'module-3-2')?.title, 'Schema Design for Access Patterns')
  assert.deepEqual(
    getLessonsByModule('module-3-2').map((candidate) => candidate.id),
    ['lesson-3-2'],
  )
  assert.equal(lesson.learningObjectives.length, 12)
  assert.equal(new Set(lesson.learningObjectives.map((objective) => objective.id)).size, 12)
  assert.ok(lesson.learningObjectives.every((objective) => objective.text.trim().length > 20))

  const content = getLessonContent(lesson.slug)
  assert.ok(content)
  const sections = content.sections
  assert.deepEqual(
    sections.map((section) => section.title),
    [
      'Introduction: Designing a Relational Database',
      'Tables, Rows, Columns, and Data Types',
      'Primary Keys and Candidate Keys',
      'Foreign Keys and Referential Integrity',
      'One-to-One Relationships',
      'One-to-Many Relationships',
      'Many-to-Many Relationships',
      'Database Constraints and Data Integrity',
      'Designing a Complete Relational Schema',
      'What Is Data Redundancy?',
      'Database Anomalies',
      'Functional Dependencies',
      'First Normal Form (1NF)',
      'Second Normal Form (2NF)',
      'Third Normal Form (3NF), Normalization Trade-offs, and Denormalization',
      'Practical Database Design Workflow and Key Takeaways',
    ],
  )
  assert.deepEqual(
    sections.map((section) => section.order),
    Array.from({ length: 16 }, (_, index) => index + 1),
  )
  assert.ok(sections.every((section) => section.paragraphs.length > 0))
  assert.ok(sections.every((section) => section.paragraphs.every((paragraph) => paragraph.trim().length > 0)))
  assert.ok(sections.every((section) => section.keyPoints && section.keyPoints.length >= 3))
  assert.equal(sections[0]?.kind, 'introduction')
  assert.equal(sections[15]?.kind, 'process')
  assert.equal(sections[15]?.steps?.length, 12)
  assert.equal(sections[15]?.commonMistakes?.length, 8)
  assert.ok(sections[0]?.paragraphs.join(' ').includes('OrderItems'))
  assert.ok(sections[1]?.paragraphs.join(' ').includes('DECIMAL(18,2)'))
  assert.ok(sections[2]?.paragraphs.join(' ').includes('surrogate'))
  assert.ok(sections[3]?.paragraphs.join(' ').includes('ON DELETE SET NULL'))
  assert.ok(sections[6]?.paragraphs.join(' ').includes('junction table'))
  assert.ok(sections[7]?.paragraphs.join(' ').includes('Application validation'))
  assert.ok(sections[10]?.paragraphs.join(' ').includes('deletion anomaly'))
  assert.ok(sections[11]?.paragraphs.join(' ').includes('CustomerID → CustomerName'))
  assert.ok(sections[12]?.paragraphs.join(' ').includes('JSON'))
  assert.ok(sections[13]?.paragraphs.join(' ').includes('partial dependency'))
  assert.ok(sections[14]?.paragraphs.join(' ').includes('Denormalization'))

  assert.deepEqual(
    content.diagrams.map((diagram) => diagram.id),
    [
      'diagram-3-2-relational-building-blocks',
      'diagram-3-2-relationship-types',
      'diagram-3-2-constraints-referential-integrity',
      'diagram-3-2-normalization-before-after',
      'diagram-3-2-1nf-2nf-3nf-progression',
    ],
  )
  assert.deepEqual(
    content.diagrams.map((diagram) => diagram.layout),
    ['layers', 'comparison', 'flow', 'comparison', 'flow'],
  )
  assert.ok(content.diagrams.every((diagram) => diagram.nodes.length >= 5 && diagram.edges.length >= 4))
  assert.equal(new Set(content.diagrams.flatMap((diagram) => diagram.nodes.map((node) => node.id))).size, 31)
  assert.ok(
    content.diagrams.every((diagram) =>
      diagram.edges.every(
        (edge) =>
          diagram.nodes.some((node) => node.id === edge.source) &&
          diagram.nodes.some((node) => node.id === edge.target),
      ),
    ),
  )

  assert.deepEqual(
    content.codeExamples.map((example) => example.id),
    [
      'code-3-2-creating-tables-and-relationships',
      'code-3-2-many-to-many-and-referential-integrity',
      'code-3-2-normalization-in-practice',
    ],
  )
  assert.deepEqual(
    content.codeExamples.map((example) => example.language),
    ['sql', 'sql', 'sql'],
  )
  assert.ok(content.codeExamples.every((example) => example.code.split('\n').length <= 60))
  assert.ok(content.codeExamples[0]?.code.includes('DECIMAL(18,2)'))
  assert.ok(content.codeExamples[0]?.code.includes('ON DELETE NO ACTION'))
  assert.ok(content.codeExamples[1]?.code.includes('StudentCourses'))
  assert.ok(content.codeExamples[2]?.code.includes('PoorOrderRow'))

  assert.deepEqual(
    content.comparisons.map((comparison) => comparison.id),
    [
      'comparison-3-2-primary-key-vs-foreign-key',
      'comparison-3-2-1nf-vs-2nf-vs-3nf',
      'comparison-3-2-normalization-vs-denormalization',
    ],
  )
  assert.deepEqual(
    content.comparisons.map((comparison) => comparison.rows.length),
    [6, 5, 7],
  )
  assert.deepEqual(
    content.comparisons.map((comparison) => comparison.columns.length),
    [2, 3, 2],
  )
  assert.ok(
    content.comparisons.every((comparison) =>
      comparison.rows.every((row) => comparison.columns.every((column) => (row.values[column.id] ?? '').length > 0)),
    ),
  )

  const quiz = content.quiz
  assert.ok(quiz)
  assert.equal(quiz.id, 'quiz-3-2')
  assert.equal(quiz.title, 'SQL Databases: Final Assessment')
  assert.equal(quiz.standard, 'final')
  assert.equal(quiz.passThreshold, 0.8)
  assert.deepEqual(checkQuizStandard(quiz), [])
  assert.equal(quiz.questions.length, 5)
  assert.ok(quiz.questions.every((question) => question.options.length === 4))
  assert.ok(quiz.questions.every((question) => question.options.filter((option) => option.isCorrect).length === 1))
  assert.ok(quiz.questions.every((question) => question.options.every((option) => (option.explanation ?? '').trim().length > 0)))
  assert.ok(quiz.questions.every((question) => (question.explanation ?? '').trim().length > 0))
  assert.deepEqual(
    quiz.questions.map((question) => question.options.findIndex((option) => option.isCorrect)),
    [2, 2, 1, 1, 2],
  )

  const challenge = content.practicalChallenge
  assert.ok(challenge)
  assert.equal(challenge.id, 'challenge-3-2')
  assert.equal(challenge.title, 'Design and Normalize a University Enrollment Database')
  assert.ok(challenge.scenario.includes('UniversityRecords'))
  assert.equal(challenge.requirements.length, 12)
  assert.equal(challenge.constraints.length, 8)
  assert.equal(challenge.deliverables.length, 10)
  assert.equal(challenge.hints?.length, 13)
  assert.ok(challenge.hints?.some((hint) => hint.includes('Model solution step 12')))
  assert.ok(challenge.hints?.some((hint) => hint.includes('Evaluation criteria')))

  const summary = content.summary
  assert.ok(summary)
  assert.equal(summary.id, 'summary-3-2')
  assert.ok(summary.overview.includes('functional dependencies and normalization'))
  assert.equal(summary.keyTakeaways.length, 18)
  assert.ok(summary.nextSteps && summary.nextSteps.length >= 2)

  assert.equal(lesson.metadata?.simulationSlug, undefined)
  assert.equal(getSimulationBySlug(lesson.metadata?.simulationSlug), undefined)
})

test('Module 3.3 publishes the complete Database Performance lesson with preserved canonical identity', () => {
  const lesson = getLessonBySlug('indexes-and-query-performance')
  assert.ok(lesson)
  assert.equal(lesson.id, 'lesson-3-3')
  assert.equal(lesson.moduleId, 'module-3-3')
  assert.equal(lesson.slug, 'indexes-and-query-performance')
  assert.equal(lesson.title, 'Database Performance')
  assert.equal(lesson.status, 'published')
  assert.equal(lesson.order, 1)
  assert.equal(lesson.number, 1)
  assert.equal(modules.find((module) => module.id === 'module-3-3')?.title, 'Indexes and Query Performance')
  assert.deepEqual(
    getLessonsByModule('module-3-3').map((candidate) => candidate.id),
    ['lesson-3-3'],
  )
  assert.equal(lesson.learningObjectives.length, 12)
  assert.equal(new Set(lesson.learningObjectives.map((objective) => objective.id)).size, 12)
  assert.ok(lesson.learningObjectives.every((objective) => objective.text.trim().length > 20))

  const content = getLessonContent(lesson.slug)
  assert.ok(content)
  const sections = content.sections
  assert.deepEqual(
    sections.map((section) => section.title),
    [
      'Why Database Performance Matters',
      'How a Database Executes a Query',
      'What Are Database Indexes?',
      'Clustered Indexes',
      'Nonclustered Indexes',
      'Composite Indexes and Key Order',
      'Covering Indexes and Included Columns',
      'Selectivity, Cardinality, and Statistics',
      'Understanding Execution Plans',
      'Index Seek vs Index Scan',
      'Joins and Query Performance',
      'SARGability and Query Writing',
      'Sorting, Pagination, and Data Retrieval',
      'Index Trade-offs and Maintenance',
      'A Practical Query Optimization Workflow',
      'Common Mistakes and Key Takeaways',
    ],
  )
  assert.deepEqual(
    sections.map((section) => section.order),
    Array.from({ length: 16 }, (_, index) => index + 1),
  )
  assert.ok(sections.every((section) => section.paragraphs.length > 0))
  assert.ok(sections.every((section) => section.paragraphs.every((paragraph) => paragraph.trim().length > 0)))
  assert.ok(sections.every((section) => section.keyPoints && section.keyPoints.length >= 3))
  assert.equal(sections[0]?.kind, 'introduction')
  assert.equal(sections[14]?.kind, 'process')
  assert.equal(sections[14]?.steps?.length, 11)
  assert.equal(sections[15]?.kind, 'mistakes')
  assert.equal(sections[15]?.commonMistakes?.length, 10)
  assert.ok(sections[0]?.paragraphs.join(' ').includes('orders search endpoint'))
  assert.ok(sections[1]?.paragraphs.join(' ').includes('optimizer'))
  assert.ok(sections[3]?.paragraphs.join(' ').includes('SQL Server rowstore clustered index'))
  assert.ok(sections[4]?.paragraphs.join(' ').includes('Key Lookup'))
  assert.ok(sections[5]?.paragraphs.join(' ').includes('(CustomerId, Status, CreatedAt)'))
  assert.ok(sections[6]?.paragraphs.join(' ').includes('INCLUDE'))
  assert.ok(sections[7]?.paragraphs.join(' ').includes('Selectivity'))
  assert.ok(sections[8]?.paragraphs.join(' ').includes('execution plan'))
  assert.ok(sections[9]?.paragraphs.join(' ').includes('Index Seek'))
  assert.ok(sections[10]?.paragraphs.join(' ').includes('Nested Loops'))
  assert.ok(sections[11]?.paragraphs.join(' ').includes('SARGable'))
  assert.ok(sections[12]?.paragraphs.join(' ').includes('N+1'))
  assert.ok(sections[13]?.paragraphs.join(' ').includes('write amplification'))
  assert.ok(sections[14]?.paragraphs.join(' ').includes('Query Store'))
  assert.ok(sections[15]?.paragraphs.join(' ').includes('Measure → Inspect'))

  assert.deepEqual(
    content.diagrams.map((diagram) => diagram.id),
    [
      'diagram-3-3-table-search-with-index',
      'diagram-3-3-clustered-vs-nonclustered',
      'diagram-3-3-composite-index-order',
      'diagram-3-3-reading-an-execution-plan',
      'diagram-3-3-optimization-workflow',
    ],
  )
  assert.deepEqual(
    content.diagrams.map((diagram) => diagram.layout),
    ['comparison', 'layers', 'comparison', 'flow', 'flow'],
  )
  assert.ok(content.diagrams.every((diagram) => diagram.nodes.length >= 5 && diagram.edges.length >= 4))
  assert.equal(new Set(content.diagrams.flatMap((diagram) => diagram.nodes.map((node) => node.id))).size, 34)
  assert.ok(
    content.diagrams.every((diagram) =>
      diagram.edges.every(
        (edge) =>
          diagram.nodes.some((node) => node.id === edge.source) &&
          diagram.nodes.some((node) => node.id === edge.target),
      ),
    ),
  )

  assert.deepEqual(
    content.codeExamples.map((example) => example.id),
    [
      'code-3-3-index-creation-and-usage',
      'code-3-3-composite-covering-index',
      'code-3-3-sargable-date-filter',
    ],
  )
  assert.deepEqual(
    content.codeExamples.map((example) => example.language),
    ['sql', 'sql', 'sql'],
  )
  assert.ok(content.codeExamples.every((example) => example.code.split('\n').length <= 60))
  assert.ok(content.codeExamples[0]?.code.includes('IX_Orders_CustomerId'))
  assert.ok(content.codeExamples[0]?.code.includes('SET STATISTICS IO ON'))
  assert.ok(content.codeExamples[1]?.code.includes('INCLUDE (TotalAmount)'))
  assert.ok(content.codeExamples[2]?.code.includes('YEAR(CreatedAt)'))
  assert.ok(content.codeExamples[2]?.code.includes('CreatedAt < @ToDate'))

  assert.deepEqual(
    content.comparisons.map((comparison) => comparison.id),
    [
      'comparison-3-3-clustered-vs-nonclustered',
      'comparison-3-3-seek-vs-scan',
      'comparison-3-3-sargable-vs-non-sargable',
    ],
  )
  assert.deepEqual(
    content.comparisons.map((comparison) => comparison.rows.length),
    [6, 6, 6],
  )
  assert.deepEqual(
    content.comparisons.map((comparison) => comparison.columns.length),
    [2, 2, 2],
  )
  assert.ok(
    content.comparisons.every((comparison) =>
      comparison.rows.every((row) => comparison.columns.every((column) => (row.values[column.id] ?? '').length > 0)),
    ),
  )

  const quiz = content.quiz
  assert.ok(quiz)
  assert.equal(quiz.id, 'quiz-3-3')
  assert.equal(quiz.title, 'Database Performance: Final Assessment')
  assert.equal(quiz.standard, 'final')
  assert.equal(quiz.passThreshold, 0.8)
  assert.deepEqual(checkQuizStandard(quiz), [])
  assert.equal(quiz.questions.length, 5)
  assert.ok(quiz.questions.every((question) => question.options.length === 4))
  assert.ok(quiz.questions.every((question) => question.options.filter((option) => option.isCorrect).length === 1))
  assert.ok(quiz.questions.every((question) => question.options.every((option) => (option.explanation ?? '').trim().length > 0)))
  assert.ok(quiz.questions.every((question) => (question.explanation ?? '').trim().length > 0))
  assert.deepEqual(
    quiz.questions.map((question) => question.options.findIndex((option) => option.isCorrect)),
    [1, 3, 1, 0, 2],
  )

  const challenge = content.practicalChallenge
  assert.ok(challenge)
  assert.equal(challenge.id, 'challenge-3-3')
  assert.equal(challenge.title, 'Diagnose and Optimize a Slow Orders Query')
  assert.ok(challenge.scenario.includes('OrderItems'))
  assert.equal(challenge.requirements.length, 12)
  assert.equal(challenge.constraints.length, 8)
  assert.equal(challenge.deliverables.length, 10)
  assert.equal(challenge.hints?.length, 13)
  assert.ok(challenge.hints?.some((hint) => hint.includes('Model solution step 12')))
  assert.ok(challenge.hints?.some((hint) => hint.includes('Evaluation criteria')))

  const summary = content.summary
  assert.ok(summary)
  assert.equal(summary.id, 'summary-3-3')
  assert.ok(summary.overview.includes('measured application symptoms'))
  assert.ok(summary.overview.includes('measuring again'))
  assert.equal(summary.keyTakeaways.length, 18)
  assert.ok(summary.nextSteps && summary.nextSteps.length >= 2)

  assert.equal(lesson.metadata?.simulationSlug, undefined)
  assert.equal(getSimulationBySlug(lesson.metadata?.simulationSlug), undefined)
})

test('curriculum validation reports no issues', () => {
  assert.deepEqual(validateCurriculum(), [])
  assert.doesNotThrow(() => assertValidCurriculum())
})
