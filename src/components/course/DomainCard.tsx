import { ArrowUpRight, Clock3, Layers3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getLessonsByModule, journeyPhases } from '../../data/curriculum/index.ts'
import type { Domain } from '../../types/curriculum.ts'
import { DomainIcon } from '../ui/DomainIcon'
import { domainNumber, formatDifficulty, formatHours } from './format'

interface DomainCardProps {
  domain: Domain
}

export function DomainCard({ domain }: DomainCardProps) {
  const phase = journeyPhases.find((item) => item.domainIds.includes(domain.number))
  const lessonCount = domain.modules.reduce(
    (total, module) => total + getLessonsByModule(module.id).length,
    0,
  )

  return (
    <Link
      to={`/domain/${domain.slug}`}
      className="card-shell group block min-w-0 p-5 transition-[border-color,background-color,transform] duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:bg-surface-hover/50 sm:p-6"
      aria-label={`Open domain ${domainNumber(domain.number)}: ${domain.title}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <DomainIcon icon={domain.icon} />
          <div className="min-w-0">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-brand-bright">
              {phase?.title ?? 'Domain'}
            </p>
            <p className="mt-0.5 font-mono text-xs text-ink-subtle">
              Domain {domainNumber(domain.number)}
            </p>
          </div>
        </div>
        <span
          className="font-mono text-2xl font-semibold leading-none tabular-nums text-ink-subtle/60"
          aria-hidden="true"
        >
          {domainNumber(domain.number)}
        </span>
      </div>

      <h3 className="mt-5 text-lg font-semibold leading-snug tracking-[-0.02em] text-ink transition-colors group-hover:text-brand-bright sm:text-xl">
        {domain.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{domain.description}</p>

      <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-line-soft pt-4 text-xs text-ink-subtle">
        <div className="inline-flex items-center gap-2">
          <Layers3 className="size-3.5 text-brand-bright" aria-hidden="true" />
          <dt className="sr-only">Modules</dt>
          <dd className="tabular-nums">{domain.modules.length} modules</dd>
        </div>
        <div className="inline-flex items-center gap-2">
          <Clock3 className="size-3.5 text-brand-bright" aria-hidden="true" />
          <dt className="sr-only">Estimated duration</dt>
          <dd className="tabular-nums">{formatHours(domain.estimatedHours)}</dd>
        </div>
        <div className="inline-flex items-center gap-2">
          <dt className="sr-only">Difficulty</dt>
          <dd>{formatDifficulty(domain.difficulty)}</dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-ink-subtle tabular-nums">{lessonCount} lessons mapped</span>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-bright">
          View domain
          <ArrowUpRight
            className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  )
}
