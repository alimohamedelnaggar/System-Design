import { getLessonForQuiz, getQuizById } from '../../data/curriculum/index.ts'
import type { Lesson } from '../../types/curriculum.ts'
import { validateQuizStructure } from './engine.ts'
import type { PlayableQuizContext, QuizValidationIssue } from './types.ts'

/**
 * Resolves the canonical quiz reference for a lesson and verifies that the
 * lesson/quiz association is valid before any interactive UI is rendered.
 */
export function resolvePlayableQuiz(lesson: Lesson): PlayableQuizContext | undefined {
  if (!lesson.quizId) return undefined

  const issues: QuizValidationIssue[] = []
  const quiz = getQuizById(lesson.quizId)

  if (!quiz) {
    return {
      quiz: {
        id: lesson.quizId,
        title: 'Quiz unavailable',
        description: 'The referenced quiz could not be resolved.',
        passThreshold: 0,
        questions: [],
      },
      lessonId: lesson.id,
      valid: false,
      issues: [{ entity: lesson.quizId, message: 'Lesson references a quiz that does not exist.' }],
    }
  }

  if (quiz.id !== lesson.quizId) {
    issues.push({ entity: quiz.id, message: 'Quiz id does not match the lesson reference.' })
  }
  if (getLessonForQuiz(quiz.id)?.id !== lesson.id) {
    issues.push({ entity: quiz.id, message: 'Quiz is not associated with this lesson.' })
  }
  if (lesson.status !== 'published') {
    issues.push({ entity: lesson.id, message: 'Only published lessons can be quizzed.' })
  }

  const structure = validateQuizStructure(quiz)
  issues.push(...structure.issues)

  return { quiz, lessonId: lesson.id, valid: issues.length === 0, issues }
}
