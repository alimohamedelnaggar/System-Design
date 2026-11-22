import { useEffect, useMemo, useReducer, useRef } from 'react'
import { ArrowLeft, ArrowRight, CircleHelp, RotateCcw, Send, TriangleAlert } from 'lucide-react'
import type { Quiz } from '../../types/curriculum.ts'
import {
  calculateQuizResult,
  countAnsweredQuestions,
  createQuizSessionState,
  quizSessionReducer,
  validateQuizStructure,
} from '../../features/quiz'
import type { QuizAttemptInput, QuizProgressRecord } from '../../features/progress/types.ts'
import { ProgressBar } from '../ui/ProgressBar'
import { QuizQuestionCard } from './QuizQuestionCard'
import { QuizResultView } from './QuizResultView'
import { QuizReviewList } from './QuizReviewList'

interface QuizExperienceProps {
  quiz: Quiz
  lessonId: string
  previousProgress?: QuizProgressRecord
  onAttempt(input: QuizAttemptInput): void
}

export function QuizExperience({
  quiz,
  lessonId,
  previousProgress,
  onAttempt,
}: QuizExperienceProps) {
  const validation = useMemo(() => validateQuizStructure(quiz), [quiz])
  const [session, dispatch] = useReducer(
    quizSessionReducer,
    quiz.questions.length,
    createQuizSessionState,
  )
  const startedAtRef = useRef<number | null>(null)
  const total = quiz.questions.length
  const answeredCount = countAnsweredQuestions(session.answers, quiz)
  const currentQuestion = quiz.questions[session.currentIndex]

  useEffect(() => {
    startedAtRef.current = Date.now()
  }, [])

  const handleSubmit = () => {
    const completedAtMs = Date.now()
    const result = calculateQuizResult(quiz, session.answers, {
      lessonId,
      startedAtMs: startedAtRef.current ?? completedAtMs,
      completedAtMs,
    })

    onAttempt({
      quizId: quiz.id,
      lessonId,
      score: result.score,
      correctAnswers: result.correctAnswers,
      totalQuestions: result.totalQuestions,
      answeredQuestions: result.totalQuestions - result.unansweredQuestions,
      passed: result.passed,
      completedAt: result.completedAt,
      durationSeconds: result.durationSeconds,
    })
    dispatch({ type: 'submit', result })
  }

  const handleRetake = () => {
    startedAtRef.current = Date.now()
    dispatch({ type: 'retake' })
  }

  if (!validation.valid) {
    return (
      <div className="min-w-0" data-quiz-engine>
        <div
          role="alert"
          className="rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm text-ink"
        >
          <p className="inline-flex items-center gap-2 font-semibold">
            <TriangleAlert className="size-4 text-warning" aria-hidden="true" />
            This quiz cannot be started yet.
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-ink-muted">
            {validation.issues.map((issue) => (
              <li key={`${issue.entity}-${issue.message}`}>
                {issue.entity}: {issue.message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="min-w-0" data-quiz-engine>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold leading-snug text-ink">{quiz.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{quiz.description}</p>
        </div>
        <span className="shrink-0 rounded-pill border border-line bg-surface/70 px-3 py-1 font-mono text-[11px] text-ink-subtle">
          {total} question{total === 1 ? '' : 's'}
        </span>
      </div>

      {previousProgress && previousProgress.attempts > 0 && !session.result ? (
        <p className="mt-4 rounded-lg border border-line-soft bg-surface/60 px-3.5 py-2.5 text-xs leading-relaxed text-ink-subtle">
          Previous attempts: {previousProgress.attempts} · Best score: {previousProgress.bestScore}% ·
          Latest score: {previousProgress.latestScore}% ·{' '}
          {previousProgress.passed ? 'Passed previously' : 'Not passed previously'}
        </p>
      ) : null}

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between gap-3 text-xs text-ink-subtle">
          <span>
            {session.result
              ? 'Quiz complete'
              : `Question ${session.currentIndex + 1} of ${total}`}
          </span>
          <span className="tabular-nums">
            {session.result ? `${answeredCount}/${total} answered` : `${answeredCount}/${total} answered`}
          </span>
        </div>
        <ProgressBar
          value={session.result ? 100 : ((session.currentIndex + 1) / total) * 100}
          label="Quiz question progress"
        />
      </div>

      {session.view === 'questions' && currentQuestion ? (
        <>
          <nav aria-label="Quiz questions" className="mt-5 flex flex-wrap gap-2">
            {quiz.questions.map((question, index) => {
              const answered = typeof session.answers[question.id] === 'string'
              const current = index === session.currentIndex
              return (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => dispatch({ type: 'goTo', index })}
                  aria-current={current ? 'step' : undefined}
                  aria-label={`Question ${index + 1}, ${answered ? 'answered' : 'unanswered'}`}
                  className={`inline-flex min-h-9 min-w-9 items-center justify-center gap-1.5 rounded-lg border px-2.5 font-mono text-xs font-semibold transition-colors ${
                    current
                      ? 'border-brand bg-brand/15 text-brand-bright'
                      : answered
                        ? 'border-brand/30 bg-surface/70 text-ink'
                        : 'border-line-soft bg-surface/60 text-ink-subtle hover:text-ink'
                  }`}
                >
                  {answered ? <CircleHelp className="size-3 text-brand-bright" aria-hidden="true" /> : null}
                  {index + 1}
                </button>
              )
            })}
          </nav>

          <div className="mt-5">
            <QuizQuestionCard
              quizId={quiz.id}
              question={currentQuestion}
              index={session.currentIndex}
              total={total}
              selectedOptionId={session.answers[currentQuestion.id] ?? null}
              onSelect={(optionId) =>
                dispatch({ type: 'select', questionId: currentQuestion.id, optionId })
              }
              onClear={() => dispatch({ type: 'clear', questionId: currentQuestion.id })}
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => dispatch({ type: 'previous' })}
              disabled={session.currentIndex === 0}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-4 text-sm font-semibold text-ink-muted transition-colors hover:border-brand/40 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Previous
            </button>

            <div className="flex flex-wrap items-center gap-3">
              {session.currentIndex < total - 1 ? (
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'next', total })}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-4 text-sm font-semibold text-ink transition-colors hover:border-brand/50 hover:bg-surface-hover"
                >
                  Next
                  <ArrowRight className="size-4" aria-hidden="true" />
                </button>
              ) : null}
              <button
                type="button"
                onClick={handleSubmit}
                data-quiz-submit
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-deep px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
              >
                <Send className="size-4" aria-hidden="true" />
                Submit quiz
              </button>
            </div>
          </div>
          {answeredCount < total ? (
            <p className="mt-3 text-xs text-ink-subtle">
              {total - answeredCount} unanswered question{total - answeredCount === 1 ? '' : 's'}{' '}
              will be counted as incorrect.
            </p>
          ) : null}
        </>
      ) : null}

      {session.view === 'results' && session.result ? (
        <div className="mt-5">
          <QuizResultView
            quiz={quiz}
            result={session.result}
            onReview={() => dispatch({ type: 'review' })}
            onRetake={handleRetake}
          />
        </div>
      ) : null}

      {session.view === 'review' && session.result ? (
        <div className="mt-5 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-ink">Review all questions</h3>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => dispatch({ type: 'backToResults' })}
                className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-line px-3.5 text-xs font-semibold text-ink-muted transition-colors hover:text-ink"
              >
                <ArrowLeft className="size-3.5" aria-hidden="true" />
                Back to results
              </button>
              <button
                type="button"
                onClick={handleRetake}
                className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-line px-3.5 text-xs font-semibold text-ink transition-colors hover:border-brand/50"
              >
                <RotateCcw className="size-3.5" aria-hidden="true" />
                Retake quiz
              </button>
            </div>
          </div>
          <div className="mt-4">
            <QuizReviewList quiz={quiz} result={session.result} />
          </div>
        </div>
      ) : null}
    </div>
  )
}
