import { ArrowLeft, ArrowRight, Clock3, Layers3, Target } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getLessonsByModule, journeyPhases } from '../../data/curriculum/index.ts'
import type { Domain } from '../../types/curriculum.ts'
import { Badge } from '../ui/Badge'
import { DomainIcon } from '../ui/DomainIcon'
import { domainNumber, formatDifficulty, formatHours } from './format'

interface DomainHeaderProps {
  domain: Domain
  previousDomain?: Domain
  nextDomain?: Domain
}

export function DomainHeader({ domain, previousDomain, nextDomain }: DomainHeaderProps) {
  const phase = journeyPhases.find((item) => item.domainIds.includes(domain.number))
  const lessonCount = domain.modules.reduce(
    (total, module) => total + getLessonsByModule(module.id).length,
    0,
  )
  const publishedCount = domain.modules.reduce(
    (total, module) =>
      total + getLessonsByModule(module.id).filter((lesson) => lesson.status === 'published').length,
    0,
  )

  return (
    <div className="relative border-b border-line-soft bg-surface/40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_0%,rgb(59_130_246/12%),transparent_50%)]" />
      <div className="relative mx-auto w-full max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="brand">Domain {domainNumber(domain.number)}</Badge>
          {phase ? <Badge variant="neutral">{phase.title}</Badge> : null}
          <Badge variant="neutral">{formatDifficulty(domain.difficulty)}</Badge>
        </div>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <DomainIcon icon={domain.icon} className="size-12 sm:size-14" />
            <div className="min-w-0">
              <h1 className="text-3xl font-semibold leading-tight tracking-[-0.035em] text-ink sm:text-4xl lg:text-[46px]">
                {domain.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
                {domain.description}
              </p>
            </div>
          </div>

          <dl className="grid shrink-0 grid-cols-3 gap-2 sm:gap-3 lg:w-[360px]">
            <div className="rounded-xl border border-line-soft bg-surface/70 p-3 sm:p-4">
              <dt className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-ink-subtle">
                <Layers3 className="size-3.5" aria-hidden="true" />
                Modules
              </dt>
              <dd className="mt-1 font-mono text-lg font-semibold tabular-nums text-ink">
                {domain.modules.length}
              </dd>
            </div>
            <div className="rounded-xl border border-line-soft bg-surface/70 p-3 sm:p-4">
              <dt className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-ink-subtle">
                <Clock3 className="size-3.5" aria-hidden="true" />
                Duration
              </dt>
              <dd className="mt-1 font-mono text-lg font-semibold tabular-nums text-ink">
                {formatHours(domain.estimatedHours)}
              </dd>
            </div>
            <div className="rounded-xl border border-line-soft bg-surface/70 p-3 sm:p-4">
              <dt className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-ink-subtle">
                <Target className="size-3.5" aria-hidden="true" />
                Lessons
              </dt>
              <dd className="mt-1 font-mono text-lg font-semibold tabular-nums text-ink">
                {lessonCount}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-8 grid gap-6 rounded-2xl border border-line-soft bg-canvas/40 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-brand-bright">
              Learning objectives
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {domain.learningObjectives.map((objective) => (
                <li key={objective.id} className="flex items-center gap-2 text-sm text-ink-muted">
                  <span className="size-1.5 shrink-0 rounded-full bg-brand-bright" aria-hidden="true" />
                  {objective.text}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-ink-subtle lg:max-w-[220px] lg:text-right">
            {publishedCount > 0
              ? `${publishedCount} lesson ready to study in this domain.`
              : 'All lessons in this domain are currently planned.'}
          </p>
        </div>

        {(previousDomain || nextDomain) && (
          <nav aria-label="Domain navigation" className="mt-8 flex flex-wrap gap-3">
            {previousDomain ? (
              <Link
                to={`/domain/${previousDomain.slug}`}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-line-soft px-4 text-sm font-medium text-ink-muted transition-colors hover:border-brand/40 hover:text-ink"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">Previous: </span>
                {previousDomain.title}
              </Link>
            ) : null}
            {nextDomain ? (
              <Link
                to={`/domain/${nextDomain.slug}`}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-line-soft px-4 text-sm font-medium text-ink-muted transition-colors hover:border-brand/40 hover:text-ink"
              >
                <span className="hidden sm:inline">Next: </span>
                {nextDomain.title}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            ) : null}
          </nav>
        )}
      </div>
    </div>
  )
}
