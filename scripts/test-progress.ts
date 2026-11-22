import assert from 'node:assert/strict'
import test from 'node:test'
import {
  createBrowserProgressStorage,
  createInitialProgressState,
  createMemoryProgressStorage,
  normalizeProgressState,
  parseProgressState,
  PROGRESS_SCHEMA_VERSION,
  PROGRESS_STORAGE_KEY,
} from '../src/features/progress/storage.ts'
import { createProgressService } from '../src/features/progress/progressService.ts'

const FIRST = '2026-01-01T10:00:00.000Z'
const SECOND = '2026-01-01T10:05:00.000Z'
const THIRD = '2026-01-01T10:10:00.000Z'

function makeService(times: readonly string[] = [FIRST, SECOND, THIRD]) {
  const storage = createMemoryProgressStorage()
  let index = 0
  const service = createProgressService({
    storage,
    now: () => times[Math.min(index++, times.length - 1)] ?? FIRST,
  })
  return { service, storage }
}

function validAttempt(score: number, passed: boolean) {
  return {
    quizId: 'quiz-1-1',
    lessonId: 'lesson-1-1',
    score,
    correctAnswers: score === 100 ? 2 : 1,
    totalQuestions: 2,
    answeredQuestions: 2,
    passed,
    durationSeconds: 42,
  }
}

test('initial progress is empty and never fabricated', () => {
  const { service } = makeService()
  assert.deepEqual(service.getState(), createInitialProgressState())

  const overall = service.getOverallProgress()
  assert.equal(overall.totalLessons, 67)
  assert.equal(overall.publishedLessons, 1)
  assert.equal(overall.completedLessons, 0)
  assert.equal(overall.inProgressLessons, 0)
  assert.equal(overall.completionPercent, 0)
  assert.equal(overall.completedQuizzes, 0)
})

test('starting a lesson records access information and marks it in progress', () => {
  const { service } = makeService()
  service.startLesson('lesson-1-1')

  const record = service.getLessonProgress('lesson-1-1')
  assert.equal(record?.status, 'in_progress')
  assert.equal(record?.startedAt, FIRST)
  assert.equal(record?.lastAccessedAt, FIRST)
  assert.equal(record?.completedAt, null)
  assert.deepEqual(service.getState().recentLessonIds, ['lesson-1-1'])
})

test('completing a lesson stores a completion date without quiz dependence', () => {
  const { service } = makeService()
  service.saveQuizAttempt(validAttempt(100, true))
  assert.equal(service.getLessonProgress('lesson-1-1')?.status, 'in_progress')

  service.completeLesson('lesson-1-1')
  const record = service.getLessonProgress('lesson-1-1')
  assert.equal(record?.status, 'completed')
  assert.equal(record?.completedAt, SECOND)
  assert.equal(record?.startedAt, FIRST)
})

test('updating an existing lesson preserves original timestamps', () => {
  const { service } = makeService()
  service.startLesson('lesson-1-1')
  service.completeLesson('lesson-1-1')
  service.completeLesson('lesson-1-1')

  const record = service.getLessonProgress('lesson-1-1')
  assert.equal(record?.startedAt, FIRST)
  assert.equal(record?.completedAt, SECOND)
  assert.equal(record?.lastAccessedAt, THIRD)
})

test('saving a quiz attempt creates versioned quiz progress with history', () => {
  const { service } = makeService()
  const attempt = service.saveQuizAttempt(validAttempt(50, true))

  assert.ok(attempt)
  assert.equal(attempt.attemptId, 'quiz-1-1-attempt-1')
  const progress = service.getQuizProgress('quiz-1-1')
  assert.equal(progress?.attempts, 1)
  assert.equal(progress?.bestScore, 50)
  assert.equal(progress?.latestScore, 50)
  assert.equal(progress?.passed, true)
  assert.equal(progress?.history.length, 1)
})

test('best score only increases across attempts', () => {
  const { service } = makeService()
  service.saveQuizAttempt(validAttempt(50, false))
  service.saveQuizAttempt(validAttempt(80, true))
  service.saveQuizAttempt(validAttempt(60, false))

  assert.equal(service.getBestQuizScore('quiz-1-1'), 80)
  assert.equal(service.getLatestQuizScore('quiz-1-1'), 60)
  assert.equal(service.getQuizProgress('quiz-1-1')?.attempts, 3)
  assert.equal(service.getQuizProgress('quiz-1-1')?.passed, true)
})

test('latest score tracks the most recent attempt', () => {
  const { service } = makeService()
  service.saveQuizAttempt(validAttempt(100, true))
  service.saveQuizAttempt(validAttempt(50, false))

  assert.equal(service.getLatestQuizScore('quiz-1-1'), 50)
  assert.equal(service.getBestQuizScore('quiz-1-1'), 100)
})

test('overall progress uses all 67 lessons as the denominator', () => {
  const { service } = makeService()
  service.completeLesson('lesson-1-1')

  const overall = service.getOverallProgress()
  assert.equal(overall.completedLessons, 1)
  assert.equal(overall.totalLessons, 67)
  assert.equal(overall.completionPercent, 1)
  assert.equal(overall.totalDomains, 8)
  assert.equal(overall.totalModules, 67)
})

test('domain progress is calculated from completed lesson ids', () => {
  const { service } = makeService()
  service.completeLesson('lesson-1-1')

  const first = service.getDomainProgress('domain-01')
  assert.equal(first.completedLessons, 1)
  assert.equal(first.totalLessons, 7)
  assert.equal(first.percent, 14)
  assert.equal(first.status, 'in-progress')

  assert.equal(service.getDomainProgress('domain-02').percent, 0)
  assert.equal(service.getDomainProgressSummaries().length, 8)
})

test('invalid lesson and quiz ids never create progress records', () => {
  const { service } = makeService()
  service.startLesson('lesson-1-2')
  service.startLesson('unknown-lesson')
  service.completeLesson('unknown-lesson')

  assert.equal(service.getLessonProgress('lesson-1-2'), undefined)
  assert.equal(service.getLessonProgress('unknown-lesson'), undefined)

  const mismatched = service.saveQuizAttempt({
    ...validAttempt(100, true),
    lessonId: 'lesson-1-2',
  })
  assert.equal(mismatched, undefined)
  assert.equal(service.getQuizProgress('quiz-1-1'), undefined)
})

test('corrupted local storage data is parsed safely', () => {
  assert.deepEqual(parseProgressState('{not-json'), createInitialProgressState())
  assert.deepEqual(parseProgressState(null), createInitialProgressState())
  assert.deepEqual(
    parseProgressState(JSON.stringify({ version: PROGRESS_SCHEMA_VERSION + 1, lessons: {} })),
    createInitialProgressState(),
  )

  const normalized = normalizeProgressState({
    version: PROGRESS_SCHEMA_VERSION,
    lessons: {
      'lesson-1-1': { lessonId: 'mismatch', status: 'completed' },
      'lesson-1-2': { lessonId: 'lesson-1-2', status: 'not_started' },
    },
    quizzes: {},
    recentLessonIds: ['lesson-1-1', 'lesson-1-1', 42],
    updatedAt: 'not-a-date',
  })
  assert.equal(Object.keys(normalized.lessons).length, 1)
  assert.deepEqual(normalized.recentLessonIds, ['lesson-1-1'])
  assert.equal(normalized.updatedAt, null)
})

test('missing or failing local storage does not crash the service', () => {
  const failingBackend = {
    getItem: () => {
      throw new Error('blocked')
    },
    setItem: () => {
      throw new Error('blocked')
    },
    removeItem: () => {
      throw new Error('blocked')
    },
  }
  const storage = createBrowserProgressStorage(failingBackend)
  const service = createProgressService({ storage })

  assert.doesNotThrow(() => service.startLesson('lesson-1-1'))
  assert.equal(service.getLessonProgress('lesson-1-1')?.status, 'in_progress')
  assert.doesNotThrow(() => service.saveQuizAttempt(validAttempt(100, true)))
  assert.doesNotThrow(() => service.resetAllProgress())
  assert.equal(PROGRESS_STORAGE_KEY, 'sda.learning-progress')
})

test('resetting progress clears stored data and unnecessary writes are skipped', () => {
  const { service, storage } = makeService()
  assert.equal(storage.saveCalls, 0)

  service.startLesson('lesson-1-1')
  assert.equal(storage.writeCount, 1)

  service.startLesson('lesson-1-2')
  assert.equal(storage.saveCalls, 1)

  service.saveQuizAttempt(validAttempt(100, true))
  assert.ok(storage.writeCount > 1)

  service.resetAllProgress()
  assert.deepEqual(service.getState(), createInitialProgressState())
  assert.equal(storage.readRaw(), null)
  assert.equal(storage.clearCalls, 1)
})
