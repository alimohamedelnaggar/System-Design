import type { Quiz, QuizQuestion } from '../../types/curriculum.ts'
import { normalizePassThreshold } from './config.ts'
import type {
  QuizAnswers,
  QuizQuestionResult,
  QuizResult,
  QuizValidationIssue,
  QuizValidationResult,
} from './types.ts'

function isNonEmptyText(value: string | undefined): boolean {
  return typeof value === 'string' && value.trim().length > 0
}

function safeDurationSeconds(startedAtMs: number | undefined, completedAtMs: number | undefined): number | null {
  if (
    typeof startedAtMs !== 'number' ||
    !Number.isFinite(startedAtMs) ||
    typeof completedAtMs !== 'number' ||
    !Number.isFinite(completedAtMs) ||
    completedAtMs < startedAtMs
  ) {
    return null
  }
  return Math.round((completedAtMs - startedAtMs) / 1000)
}

/** Structural checks that protect the engine from invalid or future quiz data. */
export function validateQuizStructure(quiz: Quiz): QuizValidationResult {
  const issues: QuizValidationIssue[] = []

  if (!isNonEmptyText(quiz.id)) {
    issues.push({ entity: 'quiz', message: 'Quiz needs an id.' })
  }
  if (!isNonEmptyText(quiz.title)) {
    issues.push({ entity: quiz.id, message: 'Quiz needs a title.' })
  }
  if (!isNonEmptyText(quiz.description)) {
    issues.push({ entity: quiz.id, message: 'Quiz needs a description.' })
  }
  if (!Number.isFinite(quiz.passThreshold) || quiz.passThreshold < 0 || quiz.passThreshold > 1) {
    issues.push({ entity: quiz.id, message: 'Quiz needs a pass threshold between 0 and 1.' })
  }
  if (quiz.questions.length === 0) {
    issues.push({ entity: quiz.id, message: 'Quiz needs at least one question.' })
  }

  const questionIds = new Set<string>()
  for (const question of quiz.questions) {
    if (!isNonEmptyText(question.id) || questionIds.has(question.id)) {
      issues.push({ entity: question.id || 'question', message: 'Question ids must be unique and non-empty.' })
    }
    questionIds.add(question.id)

    if (!isNonEmptyText(question.prompt)) {
      issues.push({ entity: question.id, message: 'Question needs a prompt.' })
    }
    if (question.options.length < 2) {
      issues.push({ entity: question.id, message: 'Question needs at least two options.' })
    }

    const optionIds = new Set<string>()
    let correctCount = 0
    for (const option of question.options) {
      if (!isNonEmptyText(option.id) || optionIds.has(option.id)) {
        issues.push({ entity: question.id, message: 'Option ids must be unique and non-empty.' })
      }
      optionIds.add(option.id)
      if (!isNonEmptyText(option.label)) {
        issues.push({ entity: option.id || question.id, message: 'Option needs a label.' })
      }
      if (option.isCorrect) correctCount += 1
    }
    if (correctCount !== 1) {
      issues.push({ entity: question.id, message: 'Single-choice question needs exactly one correct option.' })
    }
  }

  return { valid: issues.length === 0, issues }
}

function buildQuestionResult(question: QuizQuestion, answers: QuizAnswers): QuizQuestionResult {
  const rawSelection = answers[question.id]
  const selectedOptionId = typeof rawSelection === 'string' && rawSelection.length > 0 ? rawSelection : null
  const selectedOption = selectedOptionId
    ? question.options.find((option) => option.id === selectedOptionId) ?? null
    : null
  const correctOption = question.options.find((option) => option.isCorrect) ?? null

  return {
    questionId: question.id,
    prompt: question.prompt,
    selectedOptionId,
    selectedLabel: selectedOption?.label ?? null,
    selectedExplanation: selectedOption?.explanation,
    correctOptionId: correctOption?.id ?? null,
    correctLabel: correctOption?.label ?? null,
    isCorrect: selectedOption?.isCorrect === true,
    explanation: question.explanation,
  }
}

export interface CalculateQuizResultOptions {
  lessonId: string
  startedAtMs?: number
  completedAtMs?: number
}

/** Pure scoring. Answers are validated against canonical options; nothing is revealed before this runs. */
export function calculateQuizResult(
  quiz: Quiz,
  answers: QuizAnswers,
  options: CalculateQuizResultOptions,
): QuizResult {
  const questionResults = quiz.questions.map((question) => buildQuestionResult(question, answers))
  const totalQuestions = questionResults.length
  const correctAnswers = questionResults.filter((result) => result.isCorrect).length
  const answeredCount = questionResults.filter((result) => result.selectedOptionId !== null).length
  const unansweredQuestions = totalQuestions - answeredCount
  const incorrectAnswers = answeredCount - correctAnswers
  const ratio = totalQuestions === 0 ? 0 : correctAnswers / totalQuestions
  const score = totalQuestions === 0 ? 0 : Math.round(ratio * 100)
  const passThreshold = normalizePassThreshold(quiz.passThreshold)

  return {
    quizId: quiz.id,
    lessonId: options.lessonId,
    answers: { ...answers },
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    unansweredQuestions,
    score,
    passThreshold,
    passed: totalQuestions > 0 && ratio >= passThreshold,
    completedAt: new Date(options.completedAtMs ?? Date.now()).toISOString(),
    durationSeconds: safeDurationSeconds(options.startedAtMs, options.completedAtMs),
    questionResults,
  }
}

export function countAnsweredQuestions(answers: QuizAnswers, quiz: Quiz): number {
  return quiz.questions.filter((question) => {
    const value = answers[question.id]
    return typeof value === 'string' && value.length > 0
  }).length
}
