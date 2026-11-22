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

test('one published sample lesson remains and all other lessons are planned', () => {
  const published = lessons.filter((lesson) => lesson.status === 'published')
  const planned = lessons.filter((lesson) => lesson.status === 'planned')
  assert.equal(published.length, BLUEPRINT_PUBLISHED_LESSONS)
  assert.equal(planned.length, BLUEPRINT_PLANNED_LESSONS)
  assert.deepEqual(published.map((lesson) => lesson.id), ['lesson-1-1'])
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

test('getLessonBySlug resolves the sample lesson', () => {
  const lesson = getLessonBySlug('what-is-system-design')
  assert.equal(lesson?.id, 'lesson-1-1')
  assert.equal(lesson?.moduleId, 'module-1-1')
  assert.equal(lesson?.status, 'published')
  assert.equal(getLessonBySlug('missing-lesson'), undefined)
  assert.equal(getLessonBySlug(undefined), undefined)
})

test('getLessonsByModule returns ordered lessons', () => {
  const firstModuleLessons = getLessonsByModule('module-1-1')
  assert.equal(firstModuleLessons.length, 1)
  assert.equal(firstModuleLessons[0]?.id, 'lesson-1-1')
  assert.deepEqual(
    getLessonsByModule('module-3-1').map((lesson) => lesson.id),
    ['lesson-3-1'],
  )
  assert.deepEqual(getLessonsByModule('module-9-9'), [])
})

test('getNextLesson walks across modules and domains', () => {
  assert.equal(getNextLesson('lesson-1-1')?.id, 'lesson-1-2')
  assert.equal(getNextLesson('lesson-1-7')?.id, 'lesson-2-1')
  assert.equal(getNextLesson('lesson-8-13'), undefined)
  assert.equal(getNextLesson('unknown'), undefined)
})

test('getPreviousLesson walks backwards across modules and domains', () => {
  assert.equal(getPreviousLesson('lesson-1-2')?.id, 'lesson-1-1')
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

  assert.equal(lessonSections.length, 12)
  assert.deepEqual(
    lessonSections.map((section) => section.order),
    Array.from({ length: 12 }, (_, index) => index + 1),
  )
  assert.deepEqual(
    lessonSections.map((section) => section.title),
    expectedTitles,
  )
  assert.equal(lessonSections[0]?.kind, 'introduction')
  assert.equal(lessonSections[4]?.kind, 'process')
  assert.equal(lessonSections[8]?.kind, 'tradeoffs')
  assert.equal(lessonSections[9]?.kind, 'process')
  assert.equal(lessonSections[10]?.kind, 'mistakes')
  assert.ok(lessonSections.every((section) => section.paragraphs.length > 0))
  assert.ok(lessonSections.every((section) => section.paragraphs.every((paragraph) => paragraph.trim().length > 0)))
  assert.ok((lessonSections[4]?.steps?.length ?? 0) >= 7)
  assert.ok((lessonSections[8]?.tradeoffs?.length ?? 0) >= 4)
  assert.ok((lessonSections[9]?.steps?.length ?? 0) === 10)
  assert.ok((lessonSections[10]?.commonMistakes?.length ?? 0) >= 7)
})

test('first lesson diagrams are complete, unique and referenced correctly', () => {
  const lesson = getLessonBySlug('what-is-system-design')
  assert.ok(lesson)
  assert.equal(diagrams.length, 3)
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
  assert.ok(diagrams[0]?.nodes.some((node) => node.label === 'Client'))
  assert.ok(diagrams[0]?.nodes.some((node) => node.label === 'Application server'))
  assert.ok(diagrams[0]?.nodes.some((node) => node.label === 'Database'))
  assert.ok(diagrams[1]?.edges.some((edge) => (edge.label ?? '').toLowerCase().includes('hit')))
  assert.ok(diagrams[1]?.edges.some((edge) => (edge.label ?? '').toLowerCase().includes('miss')))
  assert.equal(diagrams[2]?.layout, 'comparison')
})

test('first lesson code examples are small, explained and referenced correctly', () => {
  const lesson = getLessonBySlug('what-is-system-design')
  assert.ok(lesson)
  assert.equal(codeExamples.length, 2)
  assert.deepEqual(lesson.codeExampleIds, [
    'code-1-1-http-request-response',
    'code-1-1-api-endpoint',
  ])
  assert.ok(codeExamples.every((example) => example.code.trim().length > 0))
  assert.ok(codeExamples.every((example) => (example.explanation ?? '').trim().length > 0))
  assert.ok(codeExamples.every((example) => example.code.split('\n').length <= 16))
  assert.ok(codeExamples[0]?.code.includes('GET /products/42'))
  assert.ok(codeExamples[1]?.code.includes('cache.TryGet(id)'))
})

test('canonical quiz targets the final standard with five four-option questions', () => {
  assert.equal(quizzes.length, 1)
  const quiz = quizzes[0]
  assert.ok(quiz)
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

test('lesson challenge, summary and simulation link are complete and resolvable', () => {
  const lesson = getLessonBySlug('what-is-system-design')
  assert.ok(lesson)
  assert.equal(practicalChallenges.length, 1)
  assert.equal(lessonSummaries.length, 1)

  const challenge = practicalChallenges[0]
  assert.ok(challenge)
  assert.equal(challenge.id, 'challenge-1-1')
  assert.equal(challenge.title, 'Challenge: Design a Simple Online Store')
  assert.ok(challenge.requirements.length >= 5)
  assert.ok(challenge.hints && challenge.hints.length >= 3)
  assert.ok(challenge.deliverables.length > 0)

  const summary = lessonSummaries[0]
  assert.ok(summary)
  assert.equal(summary.id, 'summary-1-1')
  assert.ok(summary.keyTakeaways.length >= 6)

  const simulationSlug = lesson.metadata?.simulationSlug
  assert.equal(simulationSlug, 'client-server-request-flow')
  assert.equal(getSimulationBySlug(simulationSlug)?.id, 'sim-client-server')
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
