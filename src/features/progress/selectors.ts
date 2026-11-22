import {
  getAllDomains,
  getAllLessons,
  getDomainById,
  getDomainProgress,
  getLessonById,
  getModuleById,
  getQuizById,
} from '../../data/curriculum/index.ts'
import type {
  DomainProgressSummary,
  LearningProgressState,
  LessonProgressStatus,
  OverallProgressSummary,
  QuizPerformanceSummary,
  RecentActivityItem,
} from './types.ts'

function completedLessonIds(state: LearningProgressState): string[] {
  return Object.values(state.lessons)
    .filter((record) => record.status === 'completed')
    .map((record) => record.lessonId)
}

function inProgressLessonIds(state: LearningProgressState): string[] {
  return Object.values(state.lessons)
    .filter((record) => record.status === 'in_progress')
    .map((record) => record.lessonId)
}

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.min(100, Math.max(0, Math.round(value)))
}

/** All 67 curriculum lessons form the denominator; planned lessons stay uncompleted. */
export function selectOverallProgress(state: LearningProgressState): OverallProgressSummary {
  const domains = getAllDomains()
  const lessons = getAllLessons()
  const completed = new Set(completedLessonIds(state))
  const inProgress = new Set(inProgressLessonIds(state))
  const publishedLessons = lessons.filter((lesson) => lesson.status === 'published').length
  const completedLessons = lessons.filter(
    (lesson) => lesson.status === 'published' && completed.has(lesson.id),
  ).length
  const inProgressLessons = lessons.filter(
    (lesson) => lesson.status === 'published' && inProgress.has(lesson.id) && !completed.has(lesson.id),
  ).length
  const quizzesAttempted = Object.values(state.quizzes).filter((record) => record.attempts > 0).length

  return {
    totalDomains: domains.length,
    totalModules: domains.reduce((total, domain) => total + domain.modules.length, 0),
    totalLessons: lessons.length,
    publishedLessons,
    completedLessons,
    inProgressLessons,
    completedQuizzes: quizzesAttempted,
    completionPercent:
      lessons.length === 0 ? 0 : clampPercent((completedLessons / lessons.length) * 100),
  }
}

export function selectDomainProgress(
  state: LearningProgressState,
  domainId: string,
): DomainProgressSummary {
  const domain = getDomainById(domainId)
  const progress = getDomainProgress(domainId, completedLessonIds(state))

  return {
    ...progress,
    domainNumber: domain?.number ?? 0,
    domainTitle: domain?.title ?? 'Unknown domain',
  }
}

export function selectDomainProgressSummaries(
  state: LearningProgressState,
): DomainProgressSummary[] {
  return getAllDomains().map((domain) => selectDomainProgress(state, domain.id))
}

export function selectRecentActivity(
  state: LearningProgressState,
  limit = 6,
): RecentActivityItem[] {
  return state.recentLessonIds
    .map((lessonId) => {
      const lesson = getLessonById(lessonId)
      const record = state.lessons[lessonId]
      if (!lesson || !record) return undefined

      const module = getModuleById(lesson.moduleId)
      const domain = module ? getDomainById(module.domainId) : undefined
      const activityAt = record.lastAccessedAt ?? record.completedAt ?? record.startedAt

      return {
        lessonId,
        lessonTitle: lesson.title,
        lessonNumber: lesson.number,
        moduleNumber: module?.number ?? '—',
        moduleTitle: module?.title ?? 'Unknown module',
        domainTitle: domain?.title ?? 'Unknown domain',
        status: record.status as LessonProgressStatus,
        activityAt,
      }
    })
    .filter((item): item is RecentActivityItem => item !== undefined)
    .sort((first, second) => {
      const firstTime = first.activityAt ? Date.parse(first.activityAt) : 0
      const secondTime = second.activityAt ? Date.parse(second.activityAt) : 0
      return secondTime - firstTime
    })
    .slice(0, Math.max(0, limit))
}

export function selectQuizPerformance(state: LearningProgressState): QuizPerformanceSummary {
  const records = Object.values(state.quizzes).filter((record) => record.attempts > 0)
  const totalAttempts = records.reduce((total, record) => total + record.attempts, 0)
  const averageLatestScore =
    records.length === 0
      ? 0
      : clampPercent(
          records.reduce((total, record) => total + record.latestScore, 0) / records.length,
        )

  let topQuiz: QuizPerformanceSummary['topQuiz'] = null
  for (const record of records) {
    const quiz = getQuizById(record.quizId)
    if (!quiz) continue
    if (!topQuiz || record.bestScore > topQuiz.score) {
      topQuiz = { quizId: quiz.id, quizTitle: quiz.title, score: clampPercent(record.bestScore) }
    }
  }

  return {
    attemptedQuizzes: records.length,
    passedQuizzes: records.filter((record) => record.passed).length,
    totalAttempts,
    averageLatestScore,
    bestScore: records.length === 0 ? 0 : clampPercent(Math.max(...records.map((record) => record.bestScore))),
    topQuiz,
  }
}
