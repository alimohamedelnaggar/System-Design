import assert from 'node:assert/strict'
import test from 'node:test'
import { checkQuizStandard, getLessonBySlug, getQuizById, quizzes } from '../src/data/curriculum/index.ts'
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

test('all sixteen published quizzes are preserved and structurally valid under the final standard', () => {
  assert.equal(quizzes.length, 16)
  assert.deepEqual(
    quizzes.map((quiz) => quiz.id),
    ['quiz-1-1', 'quiz-1-2', 'quiz-1-3', 'quiz-1-4', 'quiz-1-5', 'quiz-1-6', 'quiz-2-1', 'quiz-2-2', 'quiz-2-3', 'quiz-2-4', 'quiz-2-5', 'quiz-2-6', 'quiz-2-7', 'quiz-3-1', 'quiz-3-2', 'quiz-3-3'],
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

test('fourth lesson quiz resolves, scores and records progress independently', () => {
  const quiz = getQuizById('quiz-1-4')
  const lesson = getLessonBySlug('trade-offs-and-design-decisions')
  assert.ok(quiz && lesson)
  assert.equal(quiz.title, 'APIs — knowledge check')
  assert.equal(quiz.standard, 'final')
  assert.equal(quiz.passThreshold, 0.8)
  assert.equal(validateQuizStructure(quiz).valid, true)

  const resolved = resolvePlayableQuiz(lesson)
  assert.ok(resolved)
  assert.equal(resolved.valid, true)
  assert.deepEqual(resolved.issues, [])
  assert.equal(resolved.lessonId, 'lesson-1-4')
  assert.equal(resolved.quiz.id, 'quiz-1-4')

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
  const result = calculateQuizResult(quiz, answers, { lessonId: 'lesson-1-4' })
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
    { lessonId: 'lesson-1-4' },
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
  assert.equal(service.getBestQuizScore('quiz-1-4'), 100)
  assert.equal(service.getQuizProgress('quiz-1-4')?.lessonId, 'lesson-1-4')
  assert.equal(service.getQuizProgress('quiz-1-3'), undefined)
  assert.equal(service.getLessonProgress('lesson-1-4')?.status, 'in_progress')
})

test('fifth lesson quiz resolves, scores and records progress independently', () => {
  const quiz = getQuizById('quiz-1-5')
  const lesson = getLessonBySlug('sketching-your-first-design')
  assert.ok(quiz && lesson)
  assert.equal(quiz.title, 'Performance Basics — knowledge check')
  assert.equal(quiz.standard, 'final')
  assert.equal(quiz.passThreshold, 0.8)
  assert.equal(validateQuizStructure(quiz).valid, true)

  const resolved = resolvePlayableQuiz(lesson)
  assert.ok(resolved)
  assert.equal(resolved.valid, true)
  assert.deepEqual(resolved.issues, [])
  assert.equal(resolved.lessonId, 'lesson-1-5')
  assert.equal(resolved.quiz.id, 'quiz-1-5')

  const prepared = quiz.questions.map((question) =>
    question.options.map((option) => ({ id: option.id, label: option.label })),
  )
  assert.equal(JSON.stringify(prepared).includes('isCorrect'), false)
  assert.equal(JSON.stringify(prepared).includes('explanation'), false)

  const answersAt = (indices: readonly number[]): Record<string, string> =>
    Object.fromEntries(
      quiz.questions.map((question, index) => [
        question.id,
        question.options[indices[index] ?? 0]?.id ?? '',
      ]),
    )

  const result = calculateQuizResult(quiz, answersAt([2, 2, 0, 3, 1]), { lessonId: 'lesson-1-5' })
  assert.equal(result.score, 100)
  assert.equal(result.correctAnswers, 5)
  assert.equal(result.passed, true)
  assert.equal(result.questionResults.length, 5)
  assert.ok(result.questionResults.every((questionResult) => (questionResult.explanation ?? '').trim().length > 0))
  assert.ok(result.questionResults.every((questionResult) => (questionResult.selectedExplanation ?? '').trim().length > 0))

  const boundary = calculateQuizResult(quiz, answersAt([2, 2, 0, 3, 0]), { lessonId: 'lesson-1-5' })
  assert.equal(boundary.correctAnswers, 4)
  assert.equal(boundary.score, 80)
  assert.equal(boundary.passed, true)
  assert.equal(boundary.unansweredQuestions, 0)

  const failed = calculateQuizResult(quiz, answersAt([0, 0, 1, 0, 0]), { lessonId: 'lesson-1-5' })
  assert.equal(failed.correctAnswers, 0)
  assert.equal(failed.score, 0)
  assert.equal(failed.passed, false)
  assert.equal(failed.passThreshold, 0.8)

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
  assert.equal(service.getBestQuizScore('quiz-1-5'), 100)
  assert.equal(service.getQuizProgress('quiz-1-5')?.lessonId, 'lesson-1-5')
  assert.equal(service.getQuizProgress('quiz-1-4'), undefined)
  assert.equal(service.getLessonProgress('lesson-1-5')?.status, 'in_progress')
})

test('sixth lesson quiz resolves, scores and records progress independently', () => {
  const quiz = getQuizById('quiz-1-6')
  const lesson = getLessonBySlug('back-of-the-envelope-scale-estimation')
  assert.ok(quiz && lesson)
  assert.equal(quiz.title, 'Architecture Styles — knowledge check')
  assert.equal(quiz.standard, 'final')
  assert.equal(quiz.passThreshold, 0.8)
  assert.equal(validateQuizStructure(quiz).valid, true)

  const resolved = resolvePlayableQuiz(lesson)
  assert.ok(resolved)
  assert.equal(resolved.valid, true)
  assert.deepEqual(resolved.issues, [])
  assert.equal(resolved.lessonId, 'lesson-1-6')
  assert.equal(resolved.quiz.id, 'quiz-1-6')

  const prepared = quiz.questions.map((question) =>
    question.options.map((option) => ({ id: option.id, label: option.label })),
  )
  assert.equal(JSON.stringify(prepared).includes('isCorrect'), false)
  assert.equal(JSON.stringify(prepared).includes('explanation'), false)

  const answersAt = (indices: readonly number[]): Record<string, string> =>
    Object.fromEntries(
      quiz.questions.map((question, index) => [
        question.id,
        question.options[indices[index] ?? 0]?.id ?? '',
      ]),
    )

  const result = calculateQuizResult(quiz, answersAt([2, 1, 3, 0, 2]), { lessonId: 'lesson-1-6' })
  assert.equal(result.score, 100)
  assert.equal(result.correctAnswers, 5)
  assert.equal(result.passed, true)
  assert.equal(result.questionResults.length, 5)
  assert.ok(result.questionResults.every((questionResult) => (questionResult.explanation ?? '').trim().length > 0))
  assert.ok(result.questionResults.every((questionResult) => (questionResult.selectedExplanation ?? '').trim().length > 0))

  const boundary = calculateQuizResult(quiz, answersAt([2, 1, 3, 0, 0]), { lessonId: 'lesson-1-6' })
  assert.equal(boundary.correctAnswers, 4)
  assert.equal(boundary.score, 80)
  assert.equal(boundary.passed, true)
  assert.equal(boundary.unansweredQuestions, 0)

  const failed = calculateQuizResult(quiz, answersAt([0, 0, 0, 1, 0]), { lessonId: 'lesson-1-6' })
  assert.equal(failed.correctAnswers, 0)
  assert.equal(failed.score, 0)
  assert.equal(failed.passed, false)
  assert.equal(failed.passThreshold, 0.8)

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
  assert.equal(service.getBestQuizScore('quiz-1-6'), 100)
  assert.equal(service.getQuizProgress('quiz-1-6')?.lessonId, 'lesson-1-6')
  assert.equal(service.getQuizProgress('quiz-1-5'), undefined)
  assert.equal(service.getLessonProgress('lesson-1-6')?.status, 'in_progress')
})

test('seventh lesson quiz resolves, scores and records progress independently', () => {
  const quiz = getQuizById('quiz-2-1')
  const lesson = getLessonBySlug('the-request-lifecycle')
  assert.ok(quiz && lesson)
  assert.equal(quiz.title, 'Network Foundations — knowledge check')
  assert.equal(quiz.standard, 'final')
  assert.equal(quiz.passThreshold, 0.8)
  assert.equal(validateQuizStructure(quiz).valid, true)

  const resolved = resolvePlayableQuiz(lesson)
  assert.ok(resolved)
  assert.equal(resolved.valid, true)
  assert.deepEqual(resolved.issues, [])
  assert.equal(resolved.lessonId, 'lesson-2-1')
  assert.equal(resolved.quiz.id, 'quiz-2-1')

  const prepared = quiz.questions.map((question) =>
    question.options.map((option) => ({ id: option.id, label: option.label })),
  )
  assert.equal(JSON.stringify(prepared).includes('isCorrect'), false)
  assert.equal(JSON.stringify(prepared).includes('explanation'), false)

  const answersAt = (indices: readonly number[]): Record<string, string> =>
    Object.fromEntries(
      quiz.questions.map((question, index) => [
        question.id,
        question.options[indices[index] ?? 0]?.id ?? '',
      ]),
    )

  const result = calculateQuizResult(quiz, answersAt([1, 2, 1, 2, 0]), { lessonId: 'lesson-2-1' })
  assert.equal(result.score, 100)
  assert.equal(result.correctAnswers, 5)
  assert.equal(result.passed, true)
  assert.equal(result.questionResults.length, 5)
  assert.ok(result.questionResults.every((questionResult) => (questionResult.explanation ?? '').trim().length > 0))
  assert.ok(result.questionResults.every((questionResult) => (questionResult.selectedExplanation ?? '').trim().length > 0))

  const boundary = calculateQuizResult(quiz, answersAt([1, 2, 1, 2, 1]), { lessonId: 'lesson-2-1' })
  assert.equal(boundary.correctAnswers, 4)
  assert.equal(boundary.score, 80)
  assert.equal(boundary.passed, true)
  assert.equal(boundary.unansweredQuestions, 0)

  const failed = calculateQuizResult(quiz, answersAt([0, 0, 0, 0, 1]), { lessonId: 'lesson-2-1' })
  assert.equal(failed.correctAnswers, 0)
  assert.equal(failed.score, 0)
  assert.equal(failed.passed, false)
  assert.equal(failed.passThreshold, 0.8)

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
  assert.equal(service.getBestQuizScore('quiz-2-1'), 100)
  assert.equal(service.getQuizProgress('quiz-2-1')?.lessonId, 'lesson-2-1')
  assert.equal(service.getQuizProgress('quiz-1-6'), undefined)
  assert.equal(service.getLessonProgress('lesson-2-1')?.status, 'in_progress')
})

test('eighth lesson quiz resolves, scores and records progress independently', () => {
  const quiz = getQuizById('quiz-2-2')
  const lesson = getLessonBySlug('tcp-http-and-tls-fundamentals')
  assert.ok(quiz && lesson)
  assert.equal(quiz.title, 'HTTP Deep Dive — knowledge check')
  assert.equal(quiz.standard, 'final')
  assert.equal(quiz.passThreshold, 0.8)
  assert.equal(validateQuizStructure(quiz).valid, true)

  const resolved = resolvePlayableQuiz(lesson)
  assert.ok(resolved)
  assert.equal(resolved.valid, true)
  assert.deepEqual(resolved.issues, [])
  assert.equal(resolved.lessonId, 'lesson-2-2')
  assert.equal(resolved.quiz.id, 'quiz-2-2')

  const prepared = quiz.questions.map((question) =>
    question.options.map((option) => ({ id: option.id, label: option.label })),
  )
  assert.equal(JSON.stringify(prepared).includes('isCorrect'), false)
  assert.equal(JSON.stringify(prepared).includes('explanation'), false)

  const answersAt = (indices: readonly number[]): Record<string, string> =>
    Object.fromEntries(
      quiz.questions.map((question, index) => [
        question.id,
        question.options[indices[index] ?? 0]?.id ?? '',
      ]),
    )

  const result = calculateQuizResult(quiz, answersAt([2, 3, 1, 1, 3]), { lessonId: 'lesson-2-2' })
  assert.equal(result.score, 100)
  assert.equal(result.correctAnswers, 5)
  assert.equal(result.passed, true)
  assert.equal(result.questionResults.length, 5)
  assert.ok(result.questionResults.every((questionResult) => (questionResult.explanation ?? '').trim().length > 0))
  assert.ok(result.questionResults.every((questionResult) => (questionResult.selectedExplanation ?? '').trim().length > 0))

  const boundary = calculateQuizResult(quiz, answersAt([2, 3, 1, 1, 0]), { lessonId: 'lesson-2-2' })
  assert.equal(boundary.correctAnswers, 4)
  assert.equal(boundary.score, 80)
  assert.equal(boundary.passed, true)
  assert.equal(boundary.unansweredQuestions, 0)

  const failed = calculateQuizResult(quiz, answersAt([0, 0, 0, 0, 0]), { lessonId: 'lesson-2-2' })
  assert.equal(failed.correctAnswers, 0)
  assert.equal(failed.score, 0)
  assert.equal(failed.passed, false)
  assert.equal(failed.passThreshold, 0.8)

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
  assert.equal(service.getBestQuizScore('quiz-2-2'), 100)
  assert.equal(service.getQuizProgress('quiz-2-2')?.lessonId, 'lesson-2-2')
  assert.equal(service.getQuizProgress('quiz-2-1'), undefined)
  assert.equal(service.getLessonProgress('lesson-2-2')?.status, 'in_progress')
})

test('ninth lesson quiz resolves, scores and records progress independently', () => {
  const quiz = getQuizById('quiz-2-3')
  const lesson = getLessonBySlug('routing-and-the-public-internet')
  assert.ok(quiz && lesson)
  assert.equal(quiz.title, 'Communication Patterns — knowledge check')
  assert.equal(quiz.standard, 'final')
  assert.equal(quiz.passThreshold, 0.8)
  assert.equal(validateQuizStructure(quiz).valid, true)
  assert.deepEqual(checkQuizStandard(quiz), [])

  const resolved = resolvePlayableQuiz(lesson)
  assert.ok(resolved)
  assert.equal(resolved.valid, true)
  assert.deepEqual(resolved.issues, [])
  assert.equal(resolved.lessonId, 'lesson-2-3')
  assert.equal(resolved.quiz.id, 'quiz-2-3')

  assert.deepEqual(
    quiz.questions.map((question) => question.id),
    Array.from({ length: 5 }, (_, index) => `quiz-2-3-q${index + 1}`),
  )
  assert.deepEqual(
    quiz.questions.map((question) => question.options.length),
    [4, 4, 4, 4, 4],
  )
  assert.ok(quiz.questions.every((question) => question.options.filter((option) => option.isCorrect).length === 1))
  assert.ok(quiz.questions.every((question) => question.options.every((option) => (option.explanation ?? '').trim().length > 0)))
  assert.ok(quiz.questions.every((question) => (question.explanation ?? '').trim().length > 0))

  const prepared = quiz.questions.map((question) =>
    question.options.map((option) => ({ id: option.id, label: option.label })),
  )
  assert.equal(JSON.stringify(prepared).includes('isCorrect'), false)
  assert.equal(JSON.stringify(prepared).includes('explanation'), false)

  const answersAt = (indices: readonly number[]): Record<string, string> =>
    Object.fromEntries(
      quiz.questions.map((question, index) => [
        question.id,
        question.options[indices[index] ?? 0]?.id ?? '',
      ]),
    )

  const result = calculateQuizResult(quiz, answersAt([3, 1, 2, 0, 2]), { lessonId: 'lesson-2-3' })
  assert.equal(result.score, 100)
  assert.equal(result.correctAnswers, 5)
  assert.equal(result.passed, true)
  assert.equal(result.questionResults.length, 5)
  assert.ok(result.questionResults.every((questionResult) => (questionResult.explanation ?? '').trim().length > 0))
  assert.ok(result.questionResults.every((questionResult) => (questionResult.selectedExplanation ?? '').trim().length > 0))

  const boundary = calculateQuizResult(quiz, answersAt([3, 1, 2, 0, 0]), { lessonId: 'lesson-2-3' })
  assert.equal(boundary.correctAnswers, 4)
  assert.equal(boundary.score, 80)
  assert.equal(boundary.passed, true)
  assert.equal(boundary.unansweredQuestions, 0)

  const failed = calculateQuizResult(quiz, answersAt([0, 0, 0, 1, 0]), { lessonId: 'lesson-2-3' })
  assert.equal(failed.correctAnswers, 0)
  assert.equal(failed.score, 0)
  assert.equal(failed.passed, false)
  assert.equal(failed.passThreshold, 0.8)

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
    durationSeconds: 120,
  })

  assert.ok(attempt)
  assert.equal(service.getBestQuizScore('quiz-2-3'), 100)
  assert.equal(service.getQuizProgress('quiz-2-3')?.lessonId, 'lesson-2-3')
  assert.equal(service.getQuizProgress('quiz-2-2'), undefined)
  assert.equal(service.getLessonProgress('lesson-2-3')?.status, 'in_progress')
})

test('tenth lesson quiz resolves, scores and records progress independently', () => {
  const quiz = getQuizById('quiz-2-4')
  const lesson = getLessonBySlug('latency-bandwidth-and-failure-modes')
  assert.ok(quiz && lesson)
  assert.equal(quiz.title, 'API Communication — knowledge check')
  assert.equal(quiz.standard, 'final')
  assert.equal(quiz.passThreshold, 0.8)
  assert.equal(validateQuizStructure(quiz).valid, true)
  assert.deepEqual(checkQuizStandard(quiz), [])

  const resolved = resolvePlayableQuiz(lesson)
  assert.ok(resolved)
  assert.equal(resolved.valid, true)
  assert.deepEqual(resolved.issues, [])
  assert.equal(resolved.lessonId, 'lesson-2-4')
  assert.equal(resolved.quiz.id, 'quiz-2-4')

  assert.deepEqual(
    quiz.questions.map((question) => question.id),
    Array.from({ length: 5 }, (_, index) => `quiz-2-4-q${index + 1}`),
  )
  assert.deepEqual(
    quiz.questions.map((question) => question.options.length),
    [4, 4, 4, 4, 4],
  )
  assert.deepEqual(
    quiz.questions.map((question) => question.options.findIndex((option) => option.isCorrect)),
    [2, 0, 3, 1, 2],
  )
  assert.ok(quiz.questions.every((question) => question.options.filter((option) => option.isCorrect).length === 1))
  assert.ok(quiz.questions.every((question) => question.options.every((option) => (option.explanation ?? '').trim().length > 0)))
  assert.ok(quiz.questions.every((question) => (question.explanation ?? '').trim().length > 0))

  const prepared = quiz.questions.map((question) =>
    question.options.map((option) => ({ id: option.id, label: option.label })),
  )
  assert.equal(JSON.stringify(prepared).includes('isCorrect'), false)
  assert.equal(JSON.stringify(prepared).includes('explanation'), false)

  const answersAt = (indices: readonly number[]): Record<string, string> =>
    Object.fromEntries(
      quiz.questions.map((question, index) => [
        question.id,
        question.options[indices[index] ?? 0]?.id ?? '',
      ]),
    )

  const result = calculateQuizResult(quiz, answersAt([2, 0, 3, 1, 2]), { lessonId: 'lesson-2-4' })
  assert.equal(result.score, 100)
  assert.equal(result.correctAnswers, 5)
  assert.equal(result.passed, true)
  assert.equal(result.questionResults.length, 5)
  assert.ok(result.questionResults.every((questionResult) => (questionResult.explanation ?? '').trim().length > 0))
  assert.ok(result.questionResults.every((questionResult) => (questionResult.selectedExplanation ?? '').trim().length > 0))

  const boundary = calculateQuizResult(quiz, answersAt([2, 0, 3, 1, 0]), { lessonId: 'lesson-2-4' })
  assert.equal(boundary.correctAnswers, 4)
  assert.equal(boundary.score, 80)
  assert.equal(boundary.passed, true)
  assert.equal(boundary.unansweredQuestions, 0)

  const failed = calculateQuizResult(quiz, answersAt([0, 1, 0, 0, 1]), { lessonId: 'lesson-2-4' })
  assert.equal(failed.correctAnswers, 0)
  assert.equal(failed.score, 0)
  assert.equal(failed.passed, false)
  assert.equal(failed.passThreshold, 0.8)

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
    durationSeconds: 120,
  })

  assert.ok(attempt)
  assert.equal(service.getBestQuizScore('quiz-2-4'), 100)
  assert.equal(service.getQuizProgress('quiz-2-4')?.lessonId, 'lesson-2-4')
  assert.equal(service.getQuizProgress('quiz-2-3'), undefined)
  assert.equal(service.getLessonProgress('lesson-2-4')?.status, 'in_progress')
})

test('eleventh lesson quiz resolves, scores and records progress independently', () => {
  const quiz = getQuizById('quiz-2-5')
  const lesson = getLessonBySlug('choosing-the-right-protocol')
  assert.ok(quiz && lesson)
  assert.equal(quiz.title, 'Real-Time Communication — knowledge check')
  assert.equal(quiz.standard, 'final')
  assert.equal(quiz.passThreshold, 0.8)
  assert.equal(validateQuizStructure(quiz).valid, true)
  assert.deepEqual(checkQuizStandard(quiz), [])

  const resolved = resolvePlayableQuiz(lesson)
  assert.ok(resolved)
  assert.equal(resolved.valid, true)
  assert.deepEqual(resolved.issues, [])
  assert.equal(resolved.lessonId, 'lesson-2-5')
  assert.equal(resolved.quiz.id, 'quiz-2-5')

  assert.deepEqual(
    quiz.questions.map((question) => question.id),
    Array.from({ length: 5 }, (_, index) => `quiz-2-5-q${index + 1}`),
  )
  assert.deepEqual(
    quiz.questions.map((question) => question.options.length),
    [4, 4, 4, 4, 4],
  )
  assert.deepEqual(
    quiz.questions.map((question) => question.options.findIndex((option) => option.isCorrect)),
    [1, 3, 0, 2, 1],
  )
  assert.ok(quiz.questions.every((question) => question.options.filter((option) => option.isCorrect).length === 1))
  assert.ok(quiz.questions.every((question) => question.options.every((option) => (option.explanation ?? '').trim().length > 0)))
  assert.ok(quiz.questions.every((question) => (question.explanation ?? '').trim().length > 0))

  const prepared = quiz.questions.map((question) =>
    question.options.map((option) => ({ id: option.id, label: option.label })),
  )
  assert.equal(JSON.stringify(prepared).includes('isCorrect'), false)
  assert.equal(JSON.stringify(prepared).includes('explanation'), false)

  const answersAt = (indices: readonly number[]): Record<string, string> =>
    Object.fromEntries(
      quiz.questions.map((question, index) => [
        question.id,
        question.options[indices[index] ?? 0]?.id ?? '',
      ]),
    )

  const result = calculateQuizResult(quiz, answersAt([1, 3, 0, 2, 1]), { lessonId: 'lesson-2-5' })
  assert.equal(result.score, 100)
  assert.equal(result.correctAnswers, 5)
  assert.equal(result.passed, true)
  assert.equal(result.questionResults.length, 5)
  assert.ok(result.questionResults.every((questionResult) => (questionResult.explanation ?? '').trim().length > 0))
  assert.ok(result.questionResults.every((questionResult) => (questionResult.selectedExplanation ?? '').trim().length > 0))

  const boundary = calculateQuizResult(quiz, answersAt([1, 3, 0, 2, 0]), { lessonId: 'lesson-2-5' })
  assert.equal(boundary.correctAnswers, 4)
  assert.equal(boundary.score, 80)
  assert.equal(boundary.passed, true)
  assert.equal(boundary.unansweredQuestions, 0)

  const failed = calculateQuizResult(quiz, answersAt([0, 0, 1, 0, 0]), { lessonId: 'lesson-2-5' })
  assert.equal(failed.correctAnswers, 0)
  assert.equal(failed.score, 0)
  assert.equal(failed.passed, false)
  assert.equal(failed.passThreshold, 0.8)

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
    durationSeconds: 120,
  })

  assert.ok(attempt)
  assert.equal(service.getBestQuizScore('quiz-2-5'), 100)
  assert.equal(service.getQuizProgress('quiz-2-5')?.lessonId, 'lesson-2-5')
  assert.equal(service.getQuizProgress('quiz-2-4'), undefined)
  assert.equal(service.getLessonProgress('lesson-2-5')?.status, 'in_progress')
})

test('twelfth lesson quiz resolves, scores and records progress independently', () => {
  const quiz = getQuizById('quiz-2-6')
  const lesson = getLessonBySlug('dns-and-name-resolution')
  assert.ok(quiz && lesson)
  assert.equal(quiz.title, 'Load Balancing — knowledge check')
  assert.equal(quiz.standard, 'final')
  assert.equal(quiz.passThreshold, 0.8)
  assert.equal(validateQuizStructure(quiz).valid, true)
  assert.deepEqual(checkQuizStandard(quiz), [])

  const resolved = resolvePlayableQuiz(lesson)
  assert.ok(resolved)
  assert.equal(resolved.valid, true)
  assert.deepEqual(resolved.issues, [])
  assert.equal(resolved.lessonId, 'lesson-2-6')
  assert.equal(resolved.quiz.id, 'quiz-2-6')

  assert.deepEqual(
    quiz.questions.map((question) => question.id),
    Array.from({ length: 5 }, (_, index) => `quiz-2-6-q${index + 1}`),
  )
  assert.deepEqual(
    quiz.questions.map((question) => question.options.length),
    [4, 4, 4, 4, 4],
  )
  assert.deepEqual(
    quiz.questions.map((question) => question.options.findIndex((option) => option.isCorrect)),
    [2, 0, 3, 1, 2],
  )
  assert.ok(quiz.questions.every((question) => question.options.filter((option) => option.isCorrect).length === 1))
  assert.ok(quiz.questions.every((question) => question.options.every((option) => (option.explanation ?? '').trim().length > 0)))
  assert.ok(quiz.questions.every((question) => (question.explanation ?? '').trim().length > 0))

  const prepared = quiz.questions.map((question) =>
    question.options.map((option) => ({ id: option.id, label: option.label })),
  )
  assert.equal(JSON.stringify(prepared).includes('isCorrect'), false)
  assert.equal(JSON.stringify(prepared).includes('explanation'), false)

  const answersAt = (indices: readonly number[]): Record<string, string> =>
    Object.fromEntries(
      quiz.questions.map((question, index) => [
        question.id,
        question.options[indices[index] ?? 0]?.id ?? '',
      ]),
    )

  const result = calculateQuizResult(quiz, answersAt([2, 0, 3, 1, 2]), { lessonId: 'lesson-2-6' })
  assert.equal(result.score, 100)
  assert.equal(result.correctAnswers, 5)
  assert.equal(result.passed, true)
  assert.equal(result.questionResults.length, 5)
  assert.ok(result.questionResults.every((questionResult) => (questionResult.explanation ?? '').trim().length > 0))
  assert.ok(result.questionResults.every((questionResult) => (questionResult.selectedExplanation ?? '').trim().length > 0))

  const boundary = calculateQuizResult(quiz, answersAt([2, 0, 3, 1, 0]), { lessonId: 'lesson-2-6' })
  assert.equal(boundary.correctAnswers, 4)
  assert.equal(boundary.score, 80)
  assert.equal(boundary.passed, true)
  assert.equal(boundary.unansweredQuestions, 0)

  const failed = calculateQuizResult(quiz, answersAt([0, 1, 0, 0, 0]), { lessonId: 'lesson-2-6' })
  assert.equal(failed.correctAnswers, 0)
  assert.equal(failed.score, 0)
  assert.equal(failed.passed, false)
  assert.equal(failed.passThreshold, 0.8)

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
    durationSeconds: 120,
  })

  assert.ok(attempt)
  assert.equal(service.getBestQuizScore('quiz-2-6'), 100)
  assert.equal(service.getQuizProgress('quiz-2-6')?.lessonId, 'lesson-2-6')
  assert.equal(service.getQuizProgress('quiz-2-5'), undefined)
  assert.equal(service.getLessonProgress('lesson-2-6')?.status, 'in_progress')
})

test('thirteenth lesson quiz resolves, scores and records progress independently', () => {
  const quiz = getQuizById('quiz-2-7')
  const lesson = getLessonBySlug('streaming-and-long-lived-connections')
  assert.ok(quiz && lesson)
  assert.equal(quiz.title, 'Reverse Proxy: Final Assessment')
  assert.equal(quiz.standard, 'final')
  assert.equal(quiz.passThreshold, 0.8)
  assert.equal(validateQuizStructure(quiz).valid, true)
  assert.deepEqual(checkQuizStandard(quiz), [])

  const resolved = resolvePlayableQuiz(lesson)
  assert.ok(resolved)
  assert.equal(resolved.valid, true)
  assert.deepEqual(resolved.issues, [])
  assert.equal(resolved.lessonId, 'lesson-2-7')
  assert.equal(resolved.quiz.id, 'quiz-2-7')

  assert.deepEqual(
    quiz.questions.map((question) => question.id),
    Array.from({ length: 5 }, (_, index) => `quiz-2-7-q${index + 1}`),
  )
  assert.deepEqual(
    quiz.questions.map((question) => question.options.length),
    [4, 4, 4, 4, 4],
  )
  assert.deepEqual(
    quiz.questions.map((question) => question.options.findIndex((option) => option.isCorrect)),
    [2, 0, 3, 1, 2],
  )
  assert.ok(quiz.questions.every((question) => question.options.filter((option) => option.isCorrect).length === 1))
  assert.ok(quiz.questions.every((question) => question.options.every((option) => (option.explanation ?? '').trim().length > 0)))
  assert.ok(quiz.questions.every((question) => (question.explanation ?? '').trim().length > 0))

  const prepared = quiz.questions.map((question) =>
    question.options.map((option) => ({ id: option.id, label: option.label })),
  )
  assert.equal(JSON.stringify(prepared).includes('isCorrect'), false)
  assert.equal(JSON.stringify(prepared).includes('explanation'), false)

  const answersAt = (indices: readonly number[]): Record<string, string> =>
    Object.fromEntries(
      quiz.questions.map((question, index) => [
        question.id,
        question.options[indices[index] ?? 0]?.id ?? '',
      ]),
    )

  const result = calculateQuizResult(quiz, answersAt([2, 0, 3, 1, 2]), { lessonId: 'lesson-2-7' })
  assert.equal(result.score, 100)
  assert.equal(result.correctAnswers, 5)
  assert.equal(result.passed, true)
  assert.equal(result.questionResults.length, 5)
  assert.ok(result.questionResults.every((questionResult) => (questionResult.explanation ?? '').trim().length > 0))
  assert.ok(result.questionResults.every((questionResult) => (questionResult.selectedExplanation ?? '').trim().length > 0))

  const boundary = calculateQuizResult(quiz, answersAt([2, 0, 3, 1, 0]), { lessonId: 'lesson-2-7' })
  assert.equal(boundary.correctAnswers, 4)
  assert.equal(boundary.score, 80)
  assert.equal(boundary.passed, true)
  assert.equal(boundary.unansweredQuestions, 0)

  const failed = calculateQuizResult(quiz, answersAt([0, 1, 0, 0, 0]), { lessonId: 'lesson-2-7' })
  assert.equal(failed.correctAnswers, 0)
  assert.equal(failed.score, 0)
  assert.equal(failed.passed, false)
  assert.equal(failed.passThreshold, 0.8)

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
    durationSeconds: 120,
  })

  assert.ok(attempt)
  assert.equal(service.getBestQuizScore('quiz-2-7'), 100)
  assert.equal(service.getQuizProgress('quiz-2-7')?.lessonId, 'lesson-2-7')
  assert.equal(service.getQuizProgress('quiz-2-6'), undefined)
  assert.equal(service.getLessonProgress('lesson-2-7')?.status, 'in_progress')
})

test('fourteenth lesson quiz resolves, scores and records progress independently', () => {
  const quiz = getQuizById('quiz-3-1')
  const lesson = getLessonBySlug('relational-vs-nosql-models')
  assert.ok(quiz && lesson)
  assert.equal(quiz.title, 'Database Fundamentals: Final Assessment')
  assert.equal(quiz.standard, 'final')
  assert.equal(quiz.passThreshold, 0.8)
  assert.equal(validateQuizStructure(quiz).valid, true)
  assert.deepEqual(checkQuizStandard(quiz), [])

  const resolved = resolvePlayableQuiz(lesson)
  assert.ok(resolved)
  assert.equal(resolved.valid, true)
  assert.deepEqual(resolved.issues, [])
  assert.equal(resolved.lessonId, 'lesson-3-1')
  assert.equal(resolved.quiz.id, 'quiz-3-1')

  assert.deepEqual(
    quiz.questions.map((question) => question.id),
    Array.from({ length: 5 }, (_, index) => `quiz-3-1-q${index + 1}`),
  )
  assert.deepEqual(
    quiz.questions.map((question) => question.options.length),
    [4, 4, 4, 4, 4],
  )
  assert.deepEqual(
    quiz.questions.map((question) => question.options.findIndex((option) => option.isCorrect)),
    [1, 2, 0, 3, 2],
  )
  assert.ok(quiz.questions.every((question) => question.options.filter((option) => option.isCorrect).length === 1))
  assert.ok(quiz.questions.every((question) => question.options.every((option) => (option.explanation ?? '').trim().length > 0)))
  assert.ok(quiz.questions.every((question) => (question.explanation ?? '').trim().length > 0))

  const prepared = quiz.questions.map((question) =>
    question.options.map((option) => ({ id: option.id, label: option.label })),
  )
  assert.equal(JSON.stringify(prepared).includes('isCorrect'), false)
  assert.equal(JSON.stringify(prepared).includes('explanation'), false)

  const answersAt = (indices: readonly number[]): Record<string, string> =>
    Object.fromEntries(
      quiz.questions.map((question, index) => [
        question.id,
        question.options[indices[index] ?? 0]?.id ?? '',
      ]),
    )

  const result = calculateQuizResult(quiz, answersAt([1, 2, 0, 3, 2]), { lessonId: 'lesson-3-1' })
  assert.equal(result.score, 100)
  assert.equal(result.correctAnswers, 5)
  assert.equal(result.passed, true)
  assert.equal(result.questionResults.length, 5)
  assert.ok(result.questionResults.every((questionResult) => (questionResult.explanation ?? '').trim().length > 0))
  assert.ok(result.questionResults.every((questionResult) => (questionResult.selectedExplanation ?? '').trim().length > 0))

  const boundary = calculateQuizResult(quiz, answersAt([1, 2, 0, 3, 0]), { lessonId: 'lesson-3-1' })
  assert.equal(boundary.correctAnswers, 4)
  assert.equal(boundary.score, 80)
  assert.equal(boundary.passed, true)
  assert.equal(boundary.unansweredQuestions, 0)

  const failed = calculateQuizResult(quiz, answersAt([0, 1, 1, 0, 0]), { lessonId: 'lesson-3-1' })
  assert.equal(failed.correctAnswers, 0)
  assert.equal(failed.score, 0)
  assert.equal(failed.passed, false)
  assert.equal(failed.passThreshold, 0.8)

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
    durationSeconds: 130,
  })

  assert.ok(attempt)
  assert.equal(service.getBestQuizScore('quiz-3-1'), 100)
  assert.equal(service.getQuizProgress('quiz-3-1')?.lessonId, 'lesson-3-1')
  assert.equal(service.getQuizProgress('quiz-2-7'), undefined)
  assert.equal(service.getLessonProgress('lesson-3-1')?.status, 'in_progress')
})

test('fifteenth lesson quiz resolves, scores and records progress independently', () => {
  const quiz = getQuizById('quiz-3-2')
  const lesson = getLessonBySlug('schema-design-for-access-patterns')
  assert.ok(quiz && lesson)
  assert.equal(quiz.title, 'SQL Databases: Final Assessment')
  assert.equal(quiz.standard, 'final')
  assert.equal(quiz.passThreshold, 0.8)
  assert.equal(validateQuizStructure(quiz).valid, true)
  assert.deepEqual(checkQuizStandard(quiz), [])

  const resolved = resolvePlayableQuiz(lesson)
  assert.ok(resolved)
  assert.equal(resolved.valid, true)
  assert.deepEqual(resolved.issues, [])
  assert.equal(resolved.lessonId, 'lesson-3-2')
  assert.equal(resolved.quiz.id, 'quiz-3-2')

  assert.deepEqual(
    quiz.questions.map((question) => question.id),
    Array.from({ length: 5 }, (_, index) => `quiz-3-2-q${index + 1}`),
  )
  assert.deepEqual(
    quiz.questions.map((question) => question.options.length),
    [4, 4, 4, 4, 4],
  )
  assert.deepEqual(
    quiz.questions.map((question) => question.options.findIndex((option) => option.isCorrect)),
    [2, 2, 1, 1, 2],
  )
  assert.ok(quiz.questions.every((question) => question.options.filter((option) => option.isCorrect).length === 1))
  assert.ok(quiz.questions.every((question) => question.options.every((option) => (option.explanation ?? '').trim().length > 0)))
  assert.ok(quiz.questions.every((question) => (question.explanation ?? '').trim().length > 0))

  const prepared = quiz.questions.map((question) =>
    question.options.map((option) => ({ id: option.id, label: option.label })),
  )
  assert.equal(JSON.stringify(prepared).includes('isCorrect'), false)
  assert.equal(JSON.stringify(prepared).includes('explanation'), false)

  const answersAt = (indices: readonly number[]): Record<string, string> =>
    Object.fromEntries(
      quiz.questions.map((question, index) => [
        question.id,
        question.options[indices[index] ?? 0]?.id ?? '',
      ]),
    )

  const result = calculateQuizResult(quiz, answersAt([2, 2, 1, 1, 2]), { lessonId: 'lesson-3-2' })
  assert.equal(result.score, 100)
  assert.equal(result.correctAnswers, 5)
  assert.equal(result.passed, true)
  assert.equal(result.questionResults.length, 5)
  assert.ok(result.questionResults.every((questionResult) => (questionResult.explanation ?? '').trim().length > 0))
  assert.ok(result.questionResults.every((questionResult) => (questionResult.selectedExplanation ?? '').trim().length > 0))

  const boundary = calculateQuizResult(quiz, answersAt([2, 2, 1, 1, 0]), { lessonId: 'lesson-3-2' })
  assert.equal(boundary.correctAnswers, 4)
  assert.equal(boundary.score, 80)
  assert.equal(boundary.passed, true)
  assert.equal(boundary.unansweredQuestions, 0)

  const failed = calculateQuizResult(quiz, answersAt([0, 0, 0, 0, 0]), { lessonId: 'lesson-3-2' })
  assert.equal(failed.correctAnswers, 0)
  assert.equal(failed.score, 0)
  assert.equal(failed.passed, false)
  assert.equal(failed.passThreshold, 0.8)

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
    durationSeconds: 145,
  })

  assert.ok(attempt)
  assert.equal(service.getBestQuizScore('quiz-3-2'), 100)
  assert.equal(service.getQuizProgress('quiz-3-2')?.lessonId, 'lesson-3-2')
  assert.equal(service.getQuizProgress('quiz-3-1'), undefined)
  assert.equal(service.getLessonProgress('lesson-3-2')?.status, 'in_progress')
})

test('sixteenth lesson quiz resolves, scores and records progress independently', () => {
  const quiz = getQuizById('quiz-3-3')
  const lesson = getLessonBySlug('indexes-and-query-performance')
  assert.ok(quiz && lesson)
  assert.equal(quiz.title, 'Database Performance: Final Assessment')
  assert.equal(quiz.standard, 'final')
  assert.equal(quiz.passThreshold, 0.8)
  assert.equal(validateQuizStructure(quiz).valid, true)
  assert.deepEqual(checkQuizStandard(quiz), [])

  const resolved = resolvePlayableQuiz(lesson)
  assert.ok(resolved)
  assert.equal(resolved.valid, true)
  assert.deepEqual(resolved.issues, [])
  assert.equal(resolved.lessonId, 'lesson-3-3')
  assert.equal(resolved.quiz.id, 'quiz-3-3')

  assert.deepEqual(
    quiz.questions.map((question) => question.id),
    Array.from({ length: 5 }, (_, index) => `quiz-3-3-q${index + 1}`),
  )
  assert.deepEqual(
    quiz.questions.map((question) => question.options.length),
    [4, 4, 4, 4, 4],
  )
  assert.deepEqual(
    quiz.questions.map((question) => question.options.findIndex((option) => option.isCorrect)),
    [1, 3, 1, 0, 2],
  )
  assert.ok(quiz.questions.every((question) => question.options.filter((option) => option.isCorrect).length === 1))
  assert.ok(quiz.questions.every((question) => question.options.every((option) => (option.explanation ?? '').trim().length > 0)))
  assert.ok(quiz.questions.every((question) => (question.explanation ?? '').trim().length > 0))

  const prepared = quiz.questions.map((question) =>
    question.options.map((option) => ({ id: option.id, label: option.label })),
  )
  assert.equal(JSON.stringify(prepared).includes('isCorrect'), false)
  assert.equal(JSON.stringify(prepared).includes('explanation'), false)

  const answersAt = (indices: readonly number[]): Record<string, string> =>
    Object.fromEntries(
      quiz.questions.map((question, index) => [
        question.id,
        question.options[indices[index] ?? 0]?.id ?? '',
      ]),
    )

  const result = calculateQuizResult(quiz, answersAt([1, 3, 1, 0, 2]), { lessonId: 'lesson-3-3' })
  assert.equal(result.score, 100)
  assert.equal(result.correctAnswers, 5)
  assert.equal(result.passed, true)
  assert.equal(result.questionResults.length, 5)
  assert.ok(result.questionResults.every((questionResult) => (questionResult.explanation ?? '').trim().length > 0))
  assert.ok(result.questionResults.every((questionResult) => (questionResult.selectedExplanation ?? '').trim().length > 0))

  const boundary = calculateQuizResult(quiz, answersAt([1, 3, 1, 0, 0]), { lessonId: 'lesson-3-3' })
  assert.equal(boundary.correctAnswers, 4)
  assert.equal(boundary.score, 80)
  assert.equal(boundary.passed, true)
  assert.equal(boundary.unansweredQuestions, 0)

  const failed = calculateQuizResult(quiz, answersAt([0, 0, 0, 0, 0]), { lessonId: 'lesson-3-3' })
  assert.equal(failed.correctAnswers, 1)
  assert.equal(failed.score, 20)
  assert.equal(failed.passed, false)
  assert.equal(failed.passThreshold, 0.8)

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
    durationSeconds: 160,
  })

  assert.ok(attempt)
  assert.equal(service.getBestQuizScore('quiz-3-3'), 100)
  assert.equal(service.getQuizProgress('quiz-3-3')?.lessonId, 'lesson-3-3')
  assert.equal(service.getQuizProgress('quiz-3-2'), undefined)
  assert.equal(service.getLessonProgress('lesson-3-3')?.status, 'in_progress')
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
