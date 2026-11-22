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

test('three published lessons remain and all other lessons are planned', () => {
  const published = lessons.filter((lesson) => lesson.status === 'published')
  const planned = lessons.filter((lesson) => lesson.status === 'planned')
  assert.equal(published.length, BLUEPRINT_PUBLISHED_LESSONS)
  assert.equal(planned.length, BLUEPRINT_PLANNED_LESSONS)
  assert.deepEqual(published.map((lesson) => lesson.id), ['lesson-1-1', 'lesson-1-2', 'lesson-1-3'])
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

test('getLessonBySlug resolves all three published lessons', () => {
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
    getLessonsByModule('module-3-1').map((lesson) => lesson.id),
    ['lesson-3-1'],
  )
  assert.deepEqual(getLessonsByModule('module-9-9'), [])
})

test('getNextLesson walks across modules and domains', () => {
  assert.equal(getNextLesson('lesson-1-1')?.id, 'lesson-1-2')
  assert.equal(getNextLesson('lesson-1-2')?.id, 'lesson-1-3')
  assert.equal(getNextLesson('lesson-1-3')?.id, 'lesson-1-4')
  assert.equal(getNextLesson('lesson-1-7')?.id, 'lesson-2-1')
  assert.equal(getNextLesson('lesson-8-13'), undefined)
  assert.equal(getNextLesson('unknown'), undefined)
})

test('getPreviousLesson walks backwards across modules and domains', () => {
  assert.equal(getPreviousLesson('lesson-1-2')?.id, 'lesson-1-1')
  assert.equal(getPreviousLesson('lesson-1-3')?.id, 'lesson-1-2')
  assert.equal(getPreviousLesson('lesson-2-1')?.id, 'lesson-1-7')
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

test('content stores contain exactly the three published lessons without mixing their blocks', () => {
  assert.equal(lessonSections.length, 39)
  assert.equal(diagrams.length, 11)
  assert.equal(codeExamples.length, 8)
  assert.equal(comparisons.length, 5)
  assert.equal(quizzes.length, 3)
  assert.equal(practicalChallenges.length, 3)
  assert.equal(lessonSummaries.length, 3)

  const first = getLessonBySlug('what-is-system-design')
  const second = getLessonBySlug('requirements-and-constraints')
  const third = getLessonBySlug('core-building-blocks')
  assert.ok(first && second && third)
  const blockSets = [first, second, third].map((lesson) => [
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
  assert.ok(codeExamples.every((example) => example.code.split('\n').length <= 16))
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

test('published quizzes target the final standard with five four-option questions', () => {
  assert.equal(quizzes.length, 3)
  assert.deepEqual(
    quizzes.map((quiz) => quiz.id),
    ['quiz-1-1', 'quiz-1-2', 'quiz-1-3'],
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

test('first lesson challenge, summary and simulation link are complete and resolvable', () => {
  const lesson = getLessonBySlug('what-is-system-design')
  assert.ok(lesson)
  assert.equal(practicalChallenges.length, 3)
  assert.equal(lessonSummaries.length, 3)

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

test('curriculum validation reports no issues', () => {
  assert.deepEqual(validateCurriculum(), [])
  assert.doesNotThrow(() => assertValidCurriculum())
})
