export type LessonProgressStatus = 'not_started' | 'in_progress' | 'completed'

export interface LessonProgressRecord {
  lessonId: string
  status: LessonProgressStatus
  startedAt: string | null
  completedAt: string | null
  lastAccessedAt: string | null
}

export interface QuizAttempt {
  attemptId: string
  quizId: string
  lessonId: string
  score: number
  correctAnswers: number
  totalQuestions: number
  answeredQuestions: number
  passed: boolean
  completedAt: string
  durationSeconds: number | null
}

export interface QuizAttemptInput {
  quizId: string
  lessonId: string
  score: number
  correctAnswers: number
  totalQuestions: number
  answeredQuestions: number
  passed: boolean
  completedAt?: string
  durationSeconds?: number | null
}

export interface QuizProgressRecord {
  quizId: string
  lessonId: string
  attempts: number
  bestScore: number
  latestScore: number
  passed: boolean
  lastAttemptAt: string
  history: QuizAttempt[]
}

export interface LearningProgressState {
  version: number
  lessons: Record<string, LessonProgressRecord>
  quizzes: Record<string, QuizProgressRecord>
  recentLessonIds: string[]
  updatedAt: string | null
}

export interface OverallProgressSummary {
  totalDomains: number
  totalModules: number
  totalLessons: number
  publishedLessons: number
  completedLessons: number
  inProgressLessons: number
  completedQuizzes: number
  completionPercent: number
}

export interface DomainProgressSummary {
  domainId: string
  domainNumber: number
  domainTitle: string
  totalLessons: number
  completedLessons: number
  percent: number
  status: 'not-started' | 'in-progress' | 'complete'
}

export interface RecentActivityItem {
  lessonId: string
  lessonTitle: string
  lessonNumber: number
  moduleNumber: string
  moduleTitle: string
  domainTitle: string
  status: LessonProgressStatus
  activityAt: string | null
}

export interface QuizPerformanceSummary {
  attemptedQuizzes: number
  passedQuizzes: number
  totalAttempts: number
  averageLatestScore: number
  bestScore: number
  topQuiz: {
    quizId: string
    quizTitle: string
    score: number
  } | null
}

export interface ProgressService {
  getState(): LearningProgressState
  subscribe(listener: () => void): () => void
  startLesson(lessonId: string): void
  markLessonInProgress(lessonId: string): void
  completeLesson(lessonId: string): void
  resetLessonProgress(lessonId: string): void
  saveQuizAttempt(input: QuizAttemptInput): QuizAttempt | undefined
  resetAllProgress(): void
  getLessonProgress(lessonId: string): LessonProgressRecord | undefined
  getQuizProgress(quizId: string): QuizProgressRecord | undefined
  getBestQuizScore(quizId: string): number | undefined
  getLatestQuizScore(quizId: string): number | undefined
  getOverallProgress(): OverallProgressSummary
  getDomainProgress(domainId: string): DomainProgressSummary
  getDomainProgressSummaries(): DomainProgressSummary[]
  getRecentActivity(limit?: number): RecentActivityItem[]
  getQuizPerformance(): QuizPerformanceSummary
}
