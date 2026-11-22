import assert from 'node:assert/strict'
import test from 'node:test'
import { getLessonBySlug, getQuizById, quizzes } from '../src/data/curriculum/index.ts'
import {
  DEFAULT_QUIZ_PASS_THRESHOLD,
  calculateQuizResult,
  countAnsweredQuestions,
  createQuizSessionState,
  normalizePassThreshold,
  quizSessionReducer,
  resolvePlayableQuiz,
  validateQuizStructure,
} from '../src/features/quiz/index.ts'
import { createMemoryProgressStorage } from '../src/features/progress/storage.ts'
import { createProgressService } from '../src/features/progress/progressService.ts'

const canonicalQuiz = getQuizById('quiz-1-1')
if (!canonicalQuiz) throw new Error('Canonical quiz is missing.')

const questionCount = canonicalQuiz.questions.length
const q1 = canonicalQuiz.questions[0]
const q2 = canonicalQuiz.questions[1]
if (!q1 || !q2) throw new Error('Canonical quiz questions are missing.')

function correctOptionId(question: (typeof canonicalQuiz.questions)[number]): string {
  const option = question.options.find((candidate) => candidate.isCorrect)
  if (!option) throw new Error(`Question ${question.id} has no correct option.`)
  return option.id
}

function incorrectOptionId(question: (typeof canonicalQuiz.questions)[number]): string {
  const option = question.options.find((candidate) => !candidate.isCorrect)
  if (!option) throw new Error(`Question ${question.id} has no incorrect option.`)
  return option.id
}

function answersForFirst(count: number): Record<string, string> {
  return Object.fromEntries(
    canonicalQuiz.questions.slice(0, count).map((question) => [question.id, correctOptionId(question)]),
  )
}

const q1Correct = correctOptionId(q1)
const q2Correct = correctOptionId(q2)
const q1Incorrect = incorrectOptionId(q1)
const q2Incorrect = incorrectOptionId(q2)

test('all three published quizzes are preserved and structurally valid under the final standard', () => {
  assert.equal(quizzes.length, 3)
  assert.deepEqual(
    quizzes.map((quiz) => quiz.id),
    ['quiz-1-1', 'quiz-1-2', 'quiz-1-3'],
  )
  assert.equal(canonicalQuiz.id, 'quiz-1-1')
  assert.equal(canonicalQuiz.title, 'What is System Design? — knowledge check')
  assert.equal(canonicalQuiz.passThreshold, 0.8)
  assert.equal(canonicalQuiz.standard, 'final')
  assert.equal(canonicalQuiz.questions.length, 5)
  assert.deepEqual(
    canonicalQuiz.questions.map((question) => question.options.length),
    [4, 4, 4, 4, 4],
  )
  assert.ok(
    canonicalQuiz.questions.every(
      (question) => question.options.filter((option) => option.isCorrect).length === 1,
    ),
  )
  assert.ok(
    canonicalQuiz.questions.every((question) =>
      question.options.every((option) => (option.explanation ?? '').trim().length > 0),
    ),
  )
  assert.equal(validateQuizStructure(canonicalQuiz).valid, true)

  for (const quiz of quizzes) {
    assert.equal(quiz.passThreshold, 0.8)
    assert.equal(quiz.standard, 'final')
    assert.equal(quiz.questions.length, 5)
    assert.deepEqual(
      quiz.questions.map((question) => question.options.length),
      [4, 4, 4, 4, 4],
    )
    assert.equal(new Set(quiz.questions.map((question) => question.id)).size, 5)
    assert.ok(
      quiz.questions.every(
        (question) => question.options.filter((option) => option.isCorrect).length === 1,
      ),
    )
    assert.ok(
      quiz.questions.every((question) =>
        question.options.every((option) => (option.explanation ?? '').trim().length > 0),
      ),
    )
    assert.equal(validateQuizStructure(quiz).valid, true)
  }
})

test('canonical lesson and quiz references resolve to a playable quiz', () => {
  const lesson = getLessonBySlug('what-is-system-design')
  assert.ok(lesson)
  const resolved = resolvePlayableQuiz(lesson)

  assert.ok(resolved)
  assert.equal(resolved.valid, true)
  assert.deepEqual(resolved.issues, [])
  assert.equal(resolved.lessonId, 'lesson-1-1')
  assert.equal(resolved.quiz.id, 'quiz-1-1')
})

test('second lesson quiz resolves, scores and records progress independently', () => {
  const quiz = getQuizById('quiz-1-2')
  const lesson = getLessonBySlug('requirements-and-constraints')
  assert.ok(quiz && lesson)
  assert.equal(quiz.title, 'Client-Server Architecture — knowledge check')

  const resolved = resolvePlayableQuiz(lesson)
  assert.ok(resolved)
  assert.equal(resolved.valid, true)
  assert.deepEqual(resolved.issues, [])
  assert.equal(resolved.lessonId, 'lesson-1-2')
  assert.equal(resolved.quiz.id, 'quiz-1-2')

  const prepared = quiz.questions.map((question) =>
    question.options.map((option) => ({ id: option.id, label: option.label })),
  )
  assert.equal(JSON.stringify(prepared).includes('isCorrect'), false)

  const answers: Record<string, string> = {}
  for (const question of quiz.questions) {
    const correct = question.options.find((option) => option.isCorrect)
    assert.ok(correct)
    answers[question.id] = correct.id
  }
  const result = calculateQuizResult(quiz, answers, { lessonId: 'lesson-1-2' })
  assert.equal(result.score, 100)
  assert.equal(result.passed, true)
  assert.equal(result.questionResults.length, 5)
  assert.equal(result.questionResults[3]?.isCorrect, true)

  const storage = createMemoryProgressStorage()
  const service = createProgressService({ storage })
  const attempt = service.saveQuizAttempt({
    quizId: result.quizId,
    lessonId: result.lessonId,
    score: result.score,
    correctAnswers: result.correctAnswers,
    totalQuestions: result.totalQuestions,
    answeredQuestions: result.totalQuestions - result.unansweredQuestions,
    passed: result.passed,
    completedAt: result.completedAt,
    durationSeconds: result.durationSeconds,
  })

  assert.ok(attempt)
  assert.equal(service.getBestQuizScore('quiz-1-2'), 100)
  assert.equal(service.getQuizProgress('quiz-1-2')?.lessonId, 'lesson-1-2')
  assert.equal(service.getLessonProgress('lesson-1-2')?.status, 'in_progress')
})

test('third lesson quiz resolves, scores and records progress independently', () => {
  const quiz = getQuizById('quiz-1-3')
  const lesson = getLessonBySlug('core-building-blocks')
  assert.ok(quiz && lesson)
  assert.equal(quiz.title, 'Web Fundamentals — knowledge check')
  assert.equal(quiz.standard, 'final')
  assert.equal(quiz.passThreshold, 0.8)
  assert.equal(validateQuizStructure(quiz).valid, true)

  const resolved = resolvePlayableQuiz(lesson)
  assert.ok(resolved)
  assert.equal(resolved.valid, true)
  assert.deepEqual(resolved.issues, [])
  assert.equal(resolved.lessonId, 'lesson-1-3')
  assert.equal(resolved.quiz.id, 'quiz-1-3')

  const prepared = quiz.questions.map((question) =>
    question.options.map((option) => ({ id: option.id, label: option.label })),
  )
  assert.equal(JSON.stringify(prepared).includes('isCorrect'), false)
  assert.equal(JSON.stringify(prepared).includes('explanation'), false)

  const answers: Record<string, string> = {}
  for (const question of quiz.questions) {
    const correct = question.options.find((option) => option.isCorrect)
    assert.ok(correct)
    answers[question.id] = correct.id
  }
  const result = calculateQuizResult(quiz, answers, { lessonId: 'lesson-1-3' })
  assert.equal(result.score, 100)
  assert.equal(result.passed, true)
  assert.equal(result.questionResults.length, 5)
  assert.equal(result.questionResults[0]?.isCorrect, true)
  assert.equal(result.questionResults[0]?.correctLabel, quiz.questions[0]?.options.find((option) => option.isCorrect)?.label)
  assert.ok(result.questionResults.every((questionResult) => (questionResult.explanation ?? '').trim().length > 0))

  const partial = calculateQuizResult(
    quiz,
    Object.fromEntries(
      quiz.questions.slice(0, 4).map((question) => [question.id, question.options.find((option) => option.isCorrect)?.id ?? '']),
    ),
    { lessonId: 'lesson-1-3' },
  )
  assert.equal(partial.score, 80)
  assert.equal(partial.passed, true)
  assert.equal(partial.unansweredQuestions, 1)

  const storage = createMemoryProgressStorage()
  const service = createProgressService({ storage })
  const attempt = service.saveQuizAttempt({
    quizId: result.quizId,
    lessonId: result.lessonId,
    score: result.score,
    correctAnswers: result.correctAnswers,
    totalQuestions: result.totalQuestions,
    answeredQuestions: result.totalQuestions - result.unansweredQuestions,
    passed: result.passed,
    completedAt: result.completedAt,
    durationSeconds: result.durationSeconds,
  })

  assert.ok(attempt)
  assert.equal(service.getBestQuizScore('quiz-1-3'), 100)
  assert.equal(service.getQuizProgress('quiz-1-3')?.lessonId, 'lesson-1-3')
  assert.equal(service.getQuizProgress('quiz-1-2'), undefined)
  assert.equal(service.getLessonProgress('lesson-1-3')?.status, 'in_progress')
})

test('question data is prepared for rendering without revealing correctness', () => {
  const session = createQuizSessionState(canonicalQuiz.questions.length)
  const prepared = canonicalQuiz.questions.map((question, index) => ({
    index,
    prompt: question.prompt,
    options: question.options.map((option) => ({ id: option.id, label: option.label })),
    selectedOptionId: session.answers[question.id] ?? null,
  }))

  assert.equal(prepared.length, 5)
  assert.deepEqual(
    prepared.map((question) => question.selectedOptionId),
    [null, null, null, null, null],
  )
  assert.equal(session.result, null)
  assert.equal(session.view, 'questions')
  for (const question of prepared) {
    assert.ok(question.prompt.length > 0)
    assert.equal(new Set(question.options.map((option) => option.id)).size, question.options.length)
    assert.equal(JSON.stringify(question.options).includes('isCorrect'), false)
  }
})

test('quiz structure validation rejects duplicate ids and invalid single-choice rules', () => {
  const duplicateQuestions = {
    ...canonicalQuiz,
    questions: [q1, { ...q1 }],
  }
  const duplicateResult = validateQuizStructure(duplicateQuestions)
  assert.equal(duplicateResult.valid, false)
  assert.ok(
    duplicateResult.issues.some((issue) => issue.message.includes('unique and non-empty')),
  )

  const twoCorrect = {
    ...canonicalQuiz,
    questions: [
      {
        ...q1,
        options: q1.options.map((option, index) => ({ ...option, isCorrect: index < 2 })),
      },
    ],
  }
  assert.equal(
    validateQuizStructure(twoCorrect).issues.some((issue) =>
      issue.message.includes('exactly one correct option'),
    ),
    true,
  )
})

test('selecting an answer stores exactly one option id for the question', () => {
  const initial = createQuizSessionState(questionCount)
  const next = quizSessionReducer(initial, {
    type: 'select',
    questionId: q1.id,
    optionId: q1Incorrect,
  })

  assert.deepEqual(next.answers, { [q1.id]: q1Incorrect })
  assert.equal(countAnsweredQuestions(next.answers, canonicalQuiz), 1)
})

test('changing an answer replaces the previous selection', () => {
  const initial = createQuizSessionState(questionCount)
  const selected = quizSessionReducer(initial, {
    type: 'select',
    questionId: q1.id,
    optionId: q1Incorrect,
  })
  const changed = quizSessionReducer(selected, {
    type: 'select',
    questionId: q1.id,
    optionId: q1Correct,
  })

  assert.deepEqual(changed.answers, { [q1.id]: q1Correct })
  assert.equal(Object.keys(changed.answers).length, 1)
})

test('navigation between questions preserves selected answers', () => {
  let session = createQuizSessionState(questionCount)
  session = quizSessionReducer(session, {
    type: 'select',
    questionId: q1.id,
    optionId: q1Correct,
  })
  session = quizSessionReducer(session, { type: 'next', total: questionCount })
  assert.equal(session.currentIndex, 1)
  session = quizSessionReducer(session, { type: 'next', total: questionCount })
  assert.equal(session.currentIndex, 2)
  session = quizSessionReducer(session, { type: 'previous' })
  assert.equal(session.currentIndex, 1)
  session = quizSessionReducer(session, { type: 'previous' })
  assert.equal(session.currentIndex, 0)
  session = quizSessionReducer(session, { type: 'goTo', index: questionCount - 1 })
  assert.equal(session.currentIndex, questionCount - 1)
  assert.equal(session.answers[q1.id], q1Correct)
})

test('clearing a selected answer leaves other answers intact', () => {
  let session = createQuizSessionState(questionCount)
  session = quizSessionReducer(session, {
    type: 'select',
    questionId: q1.id,
    optionId: q1Correct,
  })
  session = quizSessionReducer(session, {
    type: 'select',
    questionId: q2.id,
    optionId: q2Correct,
  })
  session = quizSessionReducer(session, { type: 'clear', questionId: q1.id })

  assert.deepEqual(session.answers, { [q2.id]: q2Correct })
  assert.equal(countAnsweredQuestions(session.answers, canonicalQuiz), 1)
})

test('submitting a quiz calculates the result and switches to the result view', () => {
  let session = createQuizSessionState(questionCount)
  for (const question of canonicalQuiz.questions) {
    session = quizSessionReducer(session, {
      type: 'select',
      questionId: question.id,
      optionId: correctOptionId(question),
    })
  }
  const result = calculateQuizResult(canonicalQuiz, session.answers, {
    lessonId: 'lesson-1-1',
    startedAtMs: 1_000,
    completedAtMs: 45_000,
  })
  session = quizSessionReducer(session, { type: 'submit', result })

  assert.equal(session.view, 'results')
  assert.equal(session.result?.score, 100)
  assert.equal(session.result?.passed, true)
  assert.equal(session.result?.durationSeconds, 44)
})

test('score, percentage, and pass/fail use canonical quiz metadata', () => {
  const perfect = calculateQuizResult(canonicalQuiz, answersForFirst(5), {
    lessonId: 'lesson-1-1',
  })
  const passBoundary = calculateQuizResult(canonicalQuiz, answersForFirst(4), {
    lessonId: 'lesson-1-1',
  })
  const belowBoundary = calculateQuizResult(canonicalQuiz, answersForFirst(3), {
    lessonId: 'lesson-1-1',
  })
  const failed = calculateQuizResult(canonicalQuiz, {}, { lessonId: 'lesson-1-1' })

  assert.equal(perfect.score, 100)
  assert.equal(perfect.correctAnswers, 5)
  assert.equal(perfect.passed, true)
  assert.equal(passBoundary.score, 80)
  assert.equal(passBoundary.correctAnswers, 4)
  assert.equal(passBoundary.passed, true)
  assert.equal(belowBoundary.score, 60)
  assert.equal(belowBoundary.correctAnswers, 3)
  assert.equal(belowBoundary.passed, false)
  assert.equal(belowBoundary.passThreshold, 0.8)
  assert.equal(failed.score, 0)
  assert.equal(failed.passed, false)
})

test('pass threshold falls back to the centralized default when metadata is missing', () => {
  assert.equal(DEFAULT_QUIZ_PASS_THRESHOLD, 0.7)
  assert.equal(normalizePassThreshold(undefined), 0.7)
  assert.equal(normalizePassThreshold(null), 0.7)
  assert.equal(normalizePassThreshold(Number.NaN), 0.7)
  assert.equal(normalizePassThreshold(1.4), 1)
  assert.equal(normalizePassThreshold(-0.2), 0)
})

test('explanations and correct answers are available only in the result payload', () => {
  const answers = { ...answersForFirst(5), [q2.id]: q2Incorrect }
  const result = calculateQuizResult(canonicalQuiz, answers, { lessonId: 'lesson-1-1' })
  const q1Option = q1.options.find((option) => option.isCorrect)
  const q2Option = q2.options.find((option) => option.id === q2Incorrect)

  assert.equal(result.questionResults.length, 5)
  assert.equal(result.questionResults[0]?.isCorrect, true)
  assert.equal(result.questionResults[0]?.correctLabel, q1Option?.label)
  assert.equal(result.questionResults[0]?.explanation, q1.explanation)
  assert.equal(result.questionResults[1]?.isCorrect, false)
  assert.equal(result.questionResults[1]?.selectedExplanation, q2Option?.explanation)
  assert.equal(result.incorrectAnswers, 1)
})

test('unanswered questions are counted and scored as incorrect', () => {
  const result = calculateQuizResult(canonicalQuiz, { [q1.id]: q1Correct }, { lessonId: 'lesson-1-1' })

  assert.equal(result.totalQuestions, 5)
  assert.equal(result.correctAnswers, 1)
  assert.equal(result.incorrectAnswers, 0)
  assert.equal(result.unansweredQuestions, 4)
  assert.equal(result.score, 20)
  assert.equal(countAnsweredQuestions(result.answers, canonicalQuiz), 1)
})

test('review and retake actions preserve then reset session state', () => {
  const result = calculateQuizResult(canonicalQuiz, answersForFirst(5), { lessonId: 'lesson-1-1' })
  let session = quizSessionReducer(createQuizSessionState(questionCount), { type: 'submit', result })
  session = quizSessionReducer(session, { type: 'review' })
  assert.equal(session.view, 'review')
  session = quizSessionReducer(session, { type: 'backToResults' })
  assert.equal(session.view, 'results')
  session = quizSessionReducer(session, { type: 'retake' })

  assert.equal(session.view, 'questions')
  assert.equal(session.result, null)
  assert.deepEqual(session.answers, {})
  assert.equal(session.currentIndex, 0)
})

test('saving a calculated result updates quiz progress without completing the lesson', () => {
  const storage = createMemoryProgressStorage()
  const service = createProgressService({ storage })
  const result = calculateQuizResult(canonicalQuiz, answersForFirst(5), {
    lessonId: 'lesson-1-1',
  })
  const attempt = service.saveQuizAttempt({
    quizId: result.quizId,
    lessonId: result.lessonId,
    score: result.score,
    correctAnswers: result.correctAnswers,
    totalQuestions: result.totalQuestions,
    answeredQuestions: result.totalQuestions - result.unansweredQuestions,
    passed: result.passed,
    completedAt: result.completedAt,
    durationSeconds: result.durationSeconds,
  })

  assert.ok(attempt)
  assert.equal(service.getBestQuizScore(result.quizId), 100)
  assert.equal(service.getLatestQuizScore(result.quizId), 100)
  assert.equal(service.getQuizProgress(result.quizId)?.passed, true)
  assert.equal(service.getLessonProgress(result.lessonId)?.status, 'in_progress')
})
