import type { Quiz, QuizStandardId } from '../../types/curriculum.ts'

export type { QuizStandardId }

/**
 * Quiz standards live in one place so the existing sample can stay valid while
 * the architecture is ready for the final educational standard.
 *
 * `sample` accepts any structurally valid quiz (the current published lesson
 * uses two questions with three options each). `final` enforces the approved
 * standard of exactly five questions with four options per question.
 */
export interface QuizStandard {
  id: QuizStandardId
  label: string
  questionCount: number | null
  optionsPerQuestion: number | null
}

export const QUIZ_STANDARDS: Record<QuizStandardId, QuizStandard> = {
  sample: {
    id: 'sample',
    label: 'Sample lesson standard',
    questionCount: null,
    optionsPerQuestion: null,
  },
  final: {
    id: 'final',
    label: 'Final educational lesson standard',
    questionCount: 5,
    optionsPerQuestion: 4,
  },
}

/** The standard applied when a quiz does not declare one explicitly. */
export const DEFAULT_QUIZ_STANDARD: QuizStandardId = 'sample'

export function getQuizStandard(quiz: Pick<Quiz, 'standard'>): QuizStandard {
  return QUIZ_STANDARDS[quiz.standard ?? DEFAULT_QUIZ_STANDARD]
}

export interface QuizStandardViolation {
  field: 'questions' | 'options'
  expected: number
  actual: number
}

/** Checks a quiz against its declared (or default) standard. */
export function checkQuizStandard(quiz: Quiz): QuizStandardViolation[] {
  const standard = getQuizStandard(quiz)
  const violations: QuizStandardViolation[] = []

  if (standard.questionCount !== null && quiz.questions.length !== standard.questionCount) {
    violations.push({
      field: 'questions',
      expected: standard.questionCount,
      actual: quiz.questions.length,
    })
  }

  if (standard.optionsPerQuestion !== null) {
    for (const question of quiz.questions) {
      if (question.options.length !== standard.optionsPerQuestion) {
        violations.push({
          field: 'options',
          expected: standard.optionsPerQuestion,
          actual: question.options.length,
        })
      }
    }
  }

  return violations
}
