import type { LearningProgressState, LessonProgressRecord, QuizAttempt, QuizProgressRecord } from './types.ts'

export const PROGRESS_STORAGE_KEY = 'sda.learning-progress'
export const PROGRESS_SCHEMA_VERSION = 1

const RECENT_LIMIT = 12
const ATTEMPT_HISTORY_LIMIT = 20

export interface ProgressStorage {
  load(): LearningProgressState
  save(state: LearningProgressState): void
  clear(): void
}

export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export function createInitialProgressState(): LearningProgressState {
  return {
    version: PROGRESS_SCHEMA_VERSION,
    lessons: {},
    quizzes: {},
    recentLessonIds: [],
    updatedAt: null,
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function asRecord(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {}
}

function readText(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value : null
}

function readDate(value: unknown): string | null {
  const text = readText(value)
  if (!text) return null
  const timestamp = Date.parse(text)
  return Number.isNaN(timestamp) ? null : new Date(timestamp).toISOString()
}

function readScore(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null
  return Math.min(100, Math.max(0, value))
}

function readCount(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) return null
  return Math.floor(value)
}

function readDuration(value: unknown): number | null {
  if (value === null || value === undefined) return null
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) return null
  return Math.round(value)
}

function parseLessonRecord(id: string, value: unknown): LessonProgressRecord | undefined {
  if (!isRecord(value) || value.lessonId !== id) return undefined
  if (
    value.status !== 'not_started' &&
    value.status !== 'in_progress' &&
    value.status !== 'completed'
  ) {
    return undefined
  }

  return {
    lessonId: id,
    status: value.status,
    startedAt: readDate(value.startedAt),
    completedAt: readDate(value.completedAt),
    lastAccessedAt: readDate(value.lastAccessedAt),
  }
}

function parseQuizAttempt(value: unknown): QuizAttempt | undefined {
  if (!isRecord(value)) return undefined

  const attemptId = readText(value.attemptId)
  const quizId = readText(value.quizId)
  const lessonId = readText(value.lessonId)
  const completedAt = readDate(value.completedAt)
  const score = readScore(value.score)
  const correctAnswers = readCount(value.correctAnswers)
  const totalQuestions = readCount(value.totalQuestions)
  const answeredQuestions = readCount(value.answeredQuestions)

  if (
    !attemptId ||
    !quizId ||
    !lessonId ||
    !completedAt ||
    score === null ||
    correctAnswers === null ||
    totalQuestions === null ||
    answeredQuestions === null ||
    typeof value.passed !== 'boolean'
  ) {
    return undefined
  }

  return {
    attemptId,
    quizId,
    lessonId,
    score,
    correctAnswers,
    totalQuestions,
    answeredQuestions,
    passed: value.passed,
    completedAt,
    durationSeconds: readDuration(value.durationSeconds),
  }
}

function parseQuizProgress(id: string, value: unknown): QuizProgressRecord | undefined {
  if (!isRecord(value) || value.quizId !== id) return undefined

  const lessonId = readText(value.lessonId)
  const attempts = readCount(value.attempts)
  const bestScore = readScore(value.bestScore)
  const latestScore = readScore(value.latestScore)
  const lastAttemptAt = readDate(value.lastAttemptAt)

  if (
    !lessonId ||
    attempts === null ||
    bestScore === null ||
    latestScore === null ||
    !lastAttemptAt ||
    typeof value.passed !== 'boolean'
  ) {
    return undefined
  }

  const history = Array.isArray(value.history)
    ? value.history
        .map((item) => parseQuizAttempt(item))
        .filter((item): item is QuizAttempt => item !== undefined)
        .slice(-ATTEMPT_HISTORY_LIMIT)
    : []

  return {
    quizId: id,
    lessonId,
    attempts,
    bestScore,
    latestScore,
    passed: value.passed,
    lastAttemptAt,
    history,
  }
}

/** Safely converts unknown persisted JSON into a valid in-memory state. */
export function normalizeProgressState(value: unknown): LearningProgressState {
  if (!isRecord(value) || value.version !== PROGRESS_SCHEMA_VERSION) {
    return createInitialProgressState()
  }

  const lessons: Record<string, LessonProgressRecord> = {}
  for (const [id, record] of Object.entries(asRecord(value.lessons))) {
    const parsed = parseLessonRecord(id, record)
    if (parsed) lessons[id] = parsed
  }

  const quizzes: Record<string, QuizProgressRecord> = {}
  for (const [id, record] of Object.entries(asRecord(value.quizzes))) {
    const parsed = parseQuizProgress(id, record)
    if (parsed) quizzes[id] = parsed
  }

  const recentLessonIds = Array.isArray(value.recentLessonIds)
    ? value.recentLessonIds
        .filter((item): item is string => typeof item === 'string' && item.length > 0)
        .filter((item, index, all) => all.indexOf(item) === index)
        .slice(0, RECENT_LIMIT)
    : []

  return {
    version: PROGRESS_SCHEMA_VERSION,
    lessons,
    quizzes,
    recentLessonIds,
    updatedAt: readDate(value.updatedAt),
  }
}

export function parseProgressState(raw: string | null | undefined): LearningProgressState {
  if (typeof raw !== 'string' || raw.length === 0) return createInitialProgressState()

  try {
    return normalizeProgressState(JSON.parse(raw) as unknown)
  } catch {
    return createInitialProgressState()
  }
}

export function serializeProgressState(state: LearningProgressState): string {
  return JSON.stringify(state)
}

function resolveBrowserStorage(backend: StorageLike | null | undefined): StorageLike | null {
  if (backend) return backend
  try {
    const candidate = (globalThis as { localStorage?: StorageLike }).localStorage
    if (
      candidate &&
      typeof candidate.getItem === 'function' &&
      typeof candidate.setItem === 'function' &&
      typeof candidate.removeItem === 'function'
    ) {
      return candidate
    }
  } catch {
    return null
  }
  return null
}

/** LocalStorage adapter. All persistence errors are contained here. */
export function createBrowserProgressStorage(backend?: StorageLike | null): ProgressStorage {
  let storage = resolveBrowserStorage(backend)

  function getStorage(): StorageLike | null {
    if (storage === undefined) storage = resolveBrowserStorage(backend)
    return storage ?? null
  }

  return {
    load: () => {
      try {
        return parseProgressState(getStorage()?.getItem(PROGRESS_STORAGE_KEY))
      } catch {
        return createInitialProgressState()
      }
    },
    save: (state) => {
      try {
        getStorage()?.setItem(PROGRESS_STORAGE_KEY, serializeProgressState(state))
      } catch {
        // Storage can be disabled or full; the in-memory service still works.
      }
    },
    clear: () => {
      try {
        getStorage()?.removeItem(PROGRESS_STORAGE_KEY)
      } catch {
        // Nothing else to do; state is cleared in memory by the service.
      }
    },
  }
}

export const browserProgressStorage = createBrowserProgressStorage()

export interface MemoryProgressStorage extends ProgressStorage {
  readRaw(): string | null
  readonly saveCalls: number
  readonly writeCount: number
  readonly clearCalls: number
}

/** Deterministic storage used by service tests; no browser globals required. */
export function createMemoryProgressStorage(
  initialState: LearningProgressState = createInitialProgressState(),
): MemoryProgressStorage {
  let raw: string | null = serializeProgressState(initialState)
  let saveCalls = 0
  let writeCount = 0
  let clearCalls = 0

  return {
    load: () => parseProgressState(raw),
    save: (state) => {
      saveCalls += 1
      const next = serializeProgressState(state)
      if (next !== raw) {
        raw = next
        writeCount += 1
      }
    },
    clear: () => {
      clearCalls += 1
      raw = null
    },
    readRaw: () => raw,
    get saveCalls() {
      return saveCalls
    },
    get writeCount() {
      return writeCount
    },
    get clearCalls() {
      return clearCalls
    },
  }
}
