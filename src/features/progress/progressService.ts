import { getLessonById, getLessonForQuiz, getQuizById } from '../../data/curriculum/index.ts'
import {
  selectDomainProgress,
  selectDomainProgressSummaries,
  selectOverallProgress,
  selectQuizPerformance,
  selectRecentActivity,
} from './selectors.ts'
import {
  browserProgressStorage,
  createInitialProgressState,
  serializeProgressState,
  type ProgressStorage,
} from './storage.ts'
import type {
  LearningProgressState,
  LessonProgressRecord,
  ProgressService,
  QuizAttempt,
  QuizAttemptInput,
  QuizProgressRecord,
} from './types.ts'

const ATTEMPT_HISTORY_LIMIT = 20
const RECENT_LIMIT = 12

function defaultCanTrackLesson(lessonId: string): boolean {
  return getLessonById(lessonId)?.status === 'published'
}

function defaultCanTrackQuiz(quizId: string, lessonId: string): boolean {
  const quiz = getQuizById(quizId)
  const lesson = getLessonById(lessonId)
  if (!quiz || !lesson || lesson.status !== 'published') return false
  return lesson.quizId === quizId && getLessonForQuiz(quizId)?.id === lessonId
}

function normalizeDate(value: string | undefined, fallback: string): string {
  if (typeof value !== 'string') return fallback
  const timestamp = Date.parse(value)
  return Number.isNaN(timestamp) ? fallback : new Date(timestamp).toISOString()
}

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.min(100, Math.max(0, value))
}

function clampCount(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0
  return Math.floor(value)
}

function sanitizeState(
  state: LearningProgressState,
  canTrackLesson: (lessonId: string) => boolean,
  canTrackQuiz: (quizId: string, lessonId: string) => boolean,
): LearningProgressState {
  const lessons: Record<string, LessonProgressRecord> = {}
  for (const [lessonId, record] of Object.entries(state.lessons)) {
    if (canTrackLesson(lessonId)) lessons[lessonId] = record
  }

  const quizzes: Record<string, QuizProgressRecord> = {}
  for (const [quizId, record] of Object.entries(state.quizzes)) {
    if (canTrackQuiz(quizId, record.lessonId)) quizzes[quizId] = record
  }

  return {
    ...state,
    lessons,
    quizzes,
    recentLessonIds: state.recentLessonIds.filter(canTrackLesson).slice(0, RECENT_LIMIT),
  }
}

function withRecentLesson(state: LearningProgressState, lessonId: string): LearningProgressState {
  return {
    ...state,
    recentLessonIds: [lessonId, ...state.recentLessonIds.filter((id) => id !== lessonId)].slice(
      0,
      RECENT_LIMIT,
    ),
  }
}

function applyLessonAccess(
  state: LearningProgressState,
  lessonId: string,
  now: string,
  complete: boolean,
  canTrackLesson: (lessonId: string) => boolean,
): LearningProgressState {
  if (!canTrackLesson(lessonId)) return state

  const existing = state.lessons[lessonId]
  const record: LessonProgressRecord = {
    lessonId,
    status: complete || existing?.status === 'completed' ? 'completed' : 'in_progress',
    startedAt: existing?.startedAt ?? now,
    completedAt: complete ? existing?.completedAt ?? now : existing?.completedAt ?? null,
    lastAccessedAt: now,
  }

  return {
    ...withRecentLesson(state, lessonId),
    lessons: { ...state.lessons, [lessonId]: record },
    updatedAt: now,
  }
}

export interface CreateProgressServiceOptions {
  storage?: ProgressStorage
  now?: () => string
  canTrackLesson?: (lessonId: string) => boolean
  canTrackQuiz?: (quizId: string, lessonId: string) => boolean
}

/** Centralized, storage-agnostic progress engine. */
export function createProgressService(options: CreateProgressServiceOptions = {}): ProgressService {
  const storage = options.storage ?? browserProgressStorage
  const now = options.now ?? (() => new Date().toISOString())
  const canTrackLesson = options.canTrackLesson ?? defaultCanTrackLesson
  const canTrackQuiz = options.canTrackQuiz ?? defaultCanTrackQuiz
  const listeners = new Set<() => void>()

  let state = sanitizeState(storage.load(), canTrackLesson, canTrackQuiz)
  let attemptSequence = Object.values(state.quizzes).reduce(
    (total, record) => total + record.attempts,
    0,
  )

  function commit(next: LearningProgressState): void {
    if (serializeProgressState(next) === serializeProgressState(state)) return
    state = next
    storage.save(state)
    listeners.forEach((listener) => listener())
  }

  function startLesson(lessonId: string): void {
    commit(applyLessonAccess(state, lessonId, now(), false, canTrackLesson))
  }

  function completeLesson(lessonId: string): void {
    commit(applyLessonAccess(state, lessonId, now(), true, canTrackLesson))
  }

  function saveQuizAttempt(input: QuizAttemptInput): QuizAttempt | undefined {
    if (!canTrackQuiz(input.quizId, input.lessonId)) return undefined
    if (!Number.isFinite(input.score) || input.totalQuestions <= 0) return undefined

    attemptSequence += 1
    const timestamp = normalizeDate(input.completedAt, now())
    const attempt: QuizAttempt = {
      attemptId: `${input.quizId}-attempt-${attemptSequence}`,
      quizId: input.quizId,
      lessonId: input.lessonId,
      score: clampScore(input.score),
      correctAnswers: clampCount(input.correctAnswers),
      totalQuestions: clampCount(input.totalQuestions),
      answeredQuestions: clampCount(input.answeredQuestions),
      passed: input.passed === true,
      completedAt: timestamp,
      durationSeconds:
        typeof input.durationSeconds === 'number' && Number.isFinite(input.durationSeconds)
          ? Math.max(0, Math.round(input.durationSeconds))
          : null,
    }

    const previous = state.quizzes[input.quizId]
    const quizRecord: QuizProgressRecord = {
      quizId: input.quizId,
      lessonId: input.lessonId,
      attempts: (previous?.attempts ?? 0) + 1,
      bestScore: Math.max(previous?.bestScore ?? 0, attempt.score),
      latestScore: attempt.score,
      passed: previous?.passed === true || attempt.passed,
      lastAttemptAt: attempt.completedAt,
      history: [...(previous?.history ?? []), attempt].slice(-ATTEMPT_HISTORY_LIMIT),
    }

    const withQuiz: LearningProgressState = {
      ...state,
      quizzes: { ...state.quizzes, [input.quizId]: quizRecord },
    }
    commit(applyLessonAccess(withQuiz, input.lessonId, attempt.completedAt, false, canTrackLesson))
    return attempt
  }

  function resetAllProgress(): void {
    state = createInitialProgressState()
    storage.clear()
    listeners.forEach((listener) => listener())
  }

  return {
    getState: () => state,
    subscribe: (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    startLesson,
    markLessonInProgress: startLesson,
    completeLesson,
    resetLessonProgress: (lessonId) => {
      if (!canTrackLesson(lessonId) || !state.lessons[lessonId]) return
      const lessons = { ...state.lessons }
      delete lessons[lessonId]
      commit({
        ...state,
        lessons,
        recentLessonIds: state.recentLessonIds.filter((id) => id !== lessonId),
        updatedAt: now(),
      })
    },
    saveQuizAttempt,
    resetAllProgress,
    getLessonProgress: (lessonId) => state.lessons[lessonId],
    getQuizProgress: (quizId) => state.quizzes[quizId],
    getBestQuizScore: (quizId) => state.quizzes[quizId]?.bestScore,
    getLatestQuizScore: (quizId) => state.quizzes[quizId]?.latestScore,
    getOverallProgress: () => selectOverallProgress(state),
    getDomainProgress: (domainId) => selectDomainProgress(state, domainId),
    getDomainProgressSummaries: () => selectDomainProgressSummaries(state),
    getRecentActivity: (limit) => selectRecentActivity(state, limit),
    getQuizPerformance: () => selectQuizPerformance(state),
  }
}

export const progressService = createProgressService()
