import type { Quiz } from '../../types/curriculum.ts'

export type QuizAnswers = Readonly<Record<string, string>>

export interface QuizQuestionResult {
  questionId: string
  prompt: string
  selectedOptionId: string | null
  selectedLabel: string | null
  selectedExplanation?: string
  correctOptionId: string | null
  correctLabel: string | null
  isCorrect: boolean
  explanation?: string
}

export interface QuizResult {
  quizId: string
  lessonId: string
  answers: QuizAnswers
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  unansweredQuestions: number
  score: number
  passThreshold: number
  passed: boolean
  completedAt: string
  durationSeconds: number | null
  questionResults: QuizQuestionResult[]
}

export interface QuizValidationIssue {
  entity: string
  message: string
}

export interface QuizValidationResult {
  valid: boolean
  issues: QuizValidationIssue[]
}

export interface PlayableQuizContext {
  quiz: Quiz
  lessonId: string
  valid: boolean
  issues: QuizValidationIssue[]
}

export type QuizSessionView = 'questions' | 'results' | 'review'

export interface QuizSessionState {
  totalQuestions: number
  currentIndex: number
  answers: Record<string, string>
  result: QuizResult | null
  view: QuizSessionView
}

export type QuizSessionAction =
  | { type: 'select'; questionId: string; optionId: string }
  | { type: 'clear'; questionId: string }
  | { type: 'goTo'; index: number }
  | { type: 'next'; total: number }
  | { type: 'previous' }
  | { type: 'submit'; result: QuizResult }
  | { type: 'review' }
  | { type: 'backToResults' }
  | { type: 'retake' }
