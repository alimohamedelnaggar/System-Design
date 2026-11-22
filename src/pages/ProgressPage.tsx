import {
  CheckCircle2,
  Circle,
  ClipboardCheck,
  RotateCcw,
  Sparkles,
  Target,
  type LucideIcon,
} from 'lucide-react'
import { useProgress } from '../features/progress'
import { PageIntro } from '../components/layout/PageIntro'
import { Section } from '../components/layout/Section'
import { Badge } from '../components/ui/Badge'
import { Container } from '../components/ui/Container'
import { ProgressBar } from '../components/ui/ProgressBar'
import { lessonStatusLabels } from '../components/course/status'
import type { LessonProgressStatus } from '../features/progress'

function formatDate(value: string | null): string {
  if (!value) return 'Recently'
  const timestamp = Date.parse(value)
  if (Number.isNaN(timestamp)) return 'Recently'
  return new Date(timestamp).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const statusIcons: Record<LessonProgressStatus, LucideIcon> = {
  not_started: Circle,
  in_progress: Target,
  completed: CheckCircle2,
}

export function ProgressPage() {
  const progress = useProgress()
  const overall = progress.getOverallProgress()
  const domains = progress.getDomainProgressSummaries()
  const recent = progress.getRecentActivity(6)
  const quizzes = progress.getQuizPerformance()
  const hasActivity =
    overall.completedLessons > 0 || overall.inProgressLessons > 0 || quizzes.attemptedQuizzes > 0

  const handleReset = () => {
    const confirmed = window.confirm(
      'Reset all learning progress? Lesson completion and quiz results stored in this browser will be removed.',
    )
    if (confirmed) progress.resetAllProgress()
  }

  const stats = [
    { label: 'Completed lessons', value: overall.completedLessons, hint: 'of 67 curriculum lessons' },
    { label: 'In progress', value: overall.inProgressLessons, hint: 'currently being read' },
    { label: 'Published to study', value: overall.publishedLessons, hint: 'available right now' },
    { label: 'Quizzes passed', value: quizzes.passedQuizzes, hint: `${quizzes.attemptedQuizzes} attempted` },
  ]

  return (
    <>
      <PageIntro
        eyebrow="Your progress"
        title="Progress you can trust."
        description="Lesson completion and quiz results are calculated from canonical curriculum data and stored only in this browser. Nothing is fabricated or sent anywhere."
      >
        <div className="flex flex-wrap gap-3">
          <Badge variant="brand">{overall.totalDomains} domains</Badge>
          <Badge>{overall.totalModules} modules</Badge>
          <Badge>{overall.totalLessons} lessons</Badge>
        </div>
      </PageIntro>

      <Section className="bg-[radial-gradient(circle_at_85%_0%,rgb(59_130_246/8%),transparent_45%)]">
        <Container>
          <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-6">
            <section className="card-shell min-w-0 p-5 sm:p-7" aria-labelledby="overall-progress-title">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-bright">
                    Overall completion
                  </p>
                  <h2 id="overall-progress-title" className="mt-2 text-xl font-semibold text-ink">
                    Your learning journey
                  </h2>
                </div>
                <p className="font-mono text-4xl font-semibold tabular-nums text-ink">
                  {overall.completionPercent}%
                </p>
              </div>
              <div className="mt-5">
                <ProgressBar
                  value={overall.completionPercent}
                  label="Overall course completion"
                  className="h-2"
                />
              </div>
              <p className="mt-3 text-xs leading-relaxed text-ink-subtle">
                Completion is measured across all {overall.totalLessons} curriculum lessons. Right
                now {overall.publishedLessons} lesson{overall.publishedLessons === 1 ? ' is' : 's are'}{' '}
                published, so planned lessons remain uncompleted.
              </p>

              <dl className="mt-6 grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="min-w-0 rounded-xl border border-line-soft bg-surface/60 p-3.5"
                  >
                    <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                      {stat.label}
                    </dt>
                    <dd className="mt-1 text-2xl font-semibold tabular-nums text-ink">{stat.value}</dd>
                    <p className="mt-1 text-[11px] leading-snug text-ink-subtle">{stat.hint}</p>
                  </div>
                ))}
              </dl>
            </section>

            <section className="card-shell min-w-0 p-5 sm:p-7" aria-labelledby="quiz-performance-title">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="size-4 text-brand-bright" aria-hidden="true" />
                <h2 id="quiz-performance-title" className="text-lg font-semibold text-ink">
                  Quiz performance
                </h2>
              </div>

              {quizzes.attemptedQuizzes === 0 ? (
                <div className="mt-5 rounded-xl border border-dashed border-line bg-surface/40 p-5">
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
                    <Sparkles className="size-4 text-brand-bright" aria-hidden="true" />
                    No quiz attempts yet
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-subtle">
                    Complete a published lesson’s knowledge check to see scores here.
                  </p>
                </div>
              ) : (
                <>
                  <dl className="mt-5 grid min-w-0 grid-cols-2 gap-3">
                    <div className="rounded-xl border border-line-soft bg-surface/60 p-3.5">
                      <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                        Average latest score
                      </dt>
                      <dd className="mt-1 text-2xl font-semibold tabular-nums text-ink">
                        {quizzes.averageLatestScore}%
                      </dd>
                    </div>
                    <div className="rounded-xl border border-line-soft bg-surface/60 p-3.5">
                      <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-subtle">
                        Best score
                      </dt>
                      <dd className="mt-1 text-2xl font-semibold tabular-nums text-ink">
                        {quizzes.bestScore}%
                      </dd>
                    </div>
                  </dl>
                  <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                    {quizzes.totalAttempts} attempt{quizzes.totalAttempts === 1 ? '' : 's'} across{' '}
                    {quizzes.attemptedQuizzes} quiz{quizzes.attemptedQuizzes === 1 ? '' : 'zes'}.
                  </p>
                  {quizzes.topQuiz ? (
                    <p className="mt-2 text-xs leading-relaxed text-ink-subtle">
                      Best performance: {quizzes.topQuiz.quizTitle} ({quizzes.topQuiz.score}%)
                    </p>
                  ) : null}
                </>
              )}
            </section>
          </div>

          <div className="mt-6 grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-6">
            <section className="card-shell min-w-0 p-5 sm:p-7" aria-labelledby="domain-progress-title">
              <h2 id="domain-progress-title" className="text-lg font-semibold text-ink">
                Domain progress
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                All eight domains, calculated from completed lesson records.
              </p>
              <ul className="mt-5 min-w-0 space-y-4">
                {domains.map((domain) => (
                  <li key={domain.domainId} className="min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                      <span className="min-w-0 text-ink">
                        <span className="mr-2 font-mono text-xs text-brand-bright">
                          {String(domain.domainNumber).padStart(2, '0')}
                        </span>
                        {domain.domainTitle}
                      </span>
                      <span className="shrink-0 tabular-nums text-ink-subtle">
                        {domain.completedLessons}/{domain.totalLessons} · {domain.percent}%
                      </span>
                    </div>
                    <ProgressBar
                      value={domain.percent}
                      label={`${domain.domainTitle} completion`}
                      className="mt-2"
                    />
                  </li>
                ))}
              </ul>
            </section>

            <section className="card-shell min-w-0 p-5 sm:p-7" aria-labelledby="recent-activity-title">
              <h2 id="recent-activity-title" className="text-lg font-semibold text-ink">
                Recent activity
              </h2>
              {recent.length === 0 ? (
                <div className="mt-5 rounded-xl border border-dashed border-line bg-surface/40 p-5">
                  <p className="text-sm font-semibold text-ink">Nothing here yet</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-subtle">
                    Open a published lesson to start your activity timeline.
                  </p>
                </div>
              ) : (
                <ol className="mt-5 min-w-0 space-y-3">
                  {recent.map((item) => {
                    const StatusIcon = statusIcons[item.status]
                    return (
                      <li
                        key={item.lessonId}
                        className="min-w-0 rounded-xl border border-line-soft bg-surface/60 p-3.5"
                      >
                        <div className="flex min-w-0 items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-ink">{item.lessonTitle}</p>
                            <p className="mt-0.5 truncate text-xs text-ink-subtle">
                              {item.moduleNumber} · {item.moduleTitle}
                            </p>
                          </div>
                          <StatusIcon
                            className={`size-4 shrink-0 ${
                              item.status === 'completed' ? 'text-success' : 'text-brand-bright'
                            }`}
                            aria-hidden="true"
                          />
                        </div>
                        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-ink-subtle">
                          <span>
                            {item.status === 'not_started'
                              ? 'Not started'
                              : lessonStatusLabels[item.status]}
                          </span>
                          <span>{formatDate(item.activityAt)}</span>
                        </div>
                      </li>
                    )
                  })}
                </ol>
              )}
            </section>
          </div>

          <section className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line-soft bg-surface/40 p-5">
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-ink">Local learning data</h2>
              <p className="mt-1 text-xs leading-relaxed text-ink-subtle">
                Resetting removes stored progress from this browser only. This cannot be undone.
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              disabled={!hasActivity}
              data-progress-reset
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line px-4 text-sm font-semibold text-ink-muted transition-colors hover:border-warning/50 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              Reset all progress
            </button>
          </section>
        </Container>
      </Section>
    </>
  )
}
