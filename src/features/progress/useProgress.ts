import { createContext, useContext } from 'react'
import type { LearningProgressState, ProgressService } from './types.ts'

type ProgressActions = Omit<ProgressService, 'getState' | 'subscribe'>

export interface ProgressContextValue extends ProgressActions {
  state: LearningProgressState
}

export const ProgressContext = createContext<ProgressContextValue | null>(null)

export function useProgress(): ProgressContextValue {
  const value = useContext(ProgressContext)
  if (!value) {
    throw new Error('useProgress must be used inside a ProgressProvider.')
  }
  return value
}
