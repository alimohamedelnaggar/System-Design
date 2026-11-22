import { useMemo, useSyncExternalStore, type ReactNode } from 'react'
import { progressService } from './progressService.ts'
import type { ProgressService } from './types.ts'
import { ProgressContext, type ProgressContextValue } from './useProgress.ts'

interface ProgressProviderProps {
  children: ReactNode
  service?: ProgressService
}

/** Subscribes once to the external progress store and shares one snapshot. */
export function ProgressProvider({ children, service = progressService }: ProgressProviderProps) {
  const state = useSyncExternalStore(service.subscribe, service.getState, service.getState)

  const value = useMemo<ProgressContextValue>(
    () => ({
      state,
      startLesson: service.startLesson,
      markLessonInProgress: service.markLessonInProgress,
      completeLesson: service.completeLesson,
      resetLessonProgress: service.resetLessonProgress,
      saveQuizAttempt: service.saveQuizAttempt,
      resetAllProgress: service.resetAllProgress,
      getLessonProgress: service.getLessonProgress,
      getQuizProgress: service.getQuizProgress,
      getBestQuizScore: service.getBestQuizScore,
      getLatestQuizScore: service.getLatestQuizScore,
      getOverallProgress: service.getOverallProgress,
      getDomainProgress: service.getDomainProgress,
      getDomainProgressSummaries: service.getDomainProgressSummaries,
      getRecentActivity: service.getRecentActivity,
      getQuizPerformance: service.getQuizPerformance,
    }),
    [service, state],
  )

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}
