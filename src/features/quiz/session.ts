import type { QuizSessionAction, QuizSessionState } from './types.ts'

export function createQuizSessionState(questionCount = 0): QuizSessionState {
  return {
    totalQuestions: Math.max(0, questionCount),
    currentIndex: questionCount > 0 ? 0 : -1,
    answers: {},
    result: null,
    view: 'questions',
  }
}

function clampIndex(index: number, total: number): number {
  if (total <= 0) return -1
  return Math.min(total - 1, Math.max(0, index))
}

/** Pure session state machine used by the quiz UI and by tests. */
export function quizSessionReducer(
  state: QuizSessionState,
  action: QuizSessionAction,
): QuizSessionState {
  switch (action.type) {
    case 'select': {
      if (state.result) return state
      if (state.answers[action.questionId] === action.optionId) return state
      return { ...state, answers: { ...state.answers, [action.questionId]: action.optionId } }
    }
    case 'clear': {
      if (state.result || !(action.questionId in state.answers)) return state
      const answers = { ...state.answers }
      delete answers[action.questionId]
      return { ...state, answers }
    }
    case 'goTo':
      return { ...state, currentIndex: clampIndex(action.index, state.totalQuestions) }
    case 'next':
      return { ...state, currentIndex: clampIndex(state.currentIndex + 1, action.total) }
    case 'previous':
      return { ...state, currentIndex: clampIndex(state.currentIndex - 1, state.totalQuestions) }
    case 'submit':
      return {
        ...state,
        result: action.result,
        currentIndex: 0,
        view: 'results',
      }
    case 'review':
      return state.result ? { ...state, view: 'review' } : state
    case 'backToResults':
      return state.result ? { ...state, view: 'results' } : state
    case 'retake':
      return createQuizSessionState(state.totalQuestions)
    default:
      return state
  }
}
