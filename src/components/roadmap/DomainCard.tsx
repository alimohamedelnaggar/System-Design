import { ArrowUpRight, Clock3, Layers3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getPhaseForDomain } from '../../data/curriculum'
import type { LearningDomain } from '../../types/curriculum'
import { DomainIcon } from '../ui/DomainIcon'
import { ProgressBar } from '../ui/ProgressBar'

interface DomainCardProps {
  domain: LearningDomain
  variant?: 'roadmap' | 'featured'
}

export function DomainCard({ domain, variant = 'roadmap' }: DomainCardProps) {
  const phase = getPhaseForDomain(domain.id)
  const isRoadmap = variant === 'roadmap'

  return (
    <Link
      to={`/domain/${domain.slug}`}
      className="card-shell group block min-w-0 p-5 transition-[border-color,background-color,transform] duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:bg-surface-hover/50 sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <DomainIcon icon={domain.icon} />
          <div className="min-w-0">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-brand-bright">
              {phase?.title ?? 'Domain'}
            </p>
            <p className="mt-0.5 font-mono text-xs text-ink-subtle">
              Domain {String(domain.id).padStart(2, '0')}
            </p>
          </div>
        </div>
        <span
          className="font-mono text-2xl font-semibold leading-none tabular-nums text-ink-subtle/60"
          aria-hidden="true"
        >
          {String(domain.id).padStart(2, '0')}
        </span>
      </div>

      <h3 className="mt-5 text-lg font-semibold leading-snug tracking-[-0.02em] text-ink transition-colors group-hover:text-brand-bright sm:text-xl">
        {domain.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{domain.summary}</p>

      <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-line-soft pt-4 text-xs text-ink-subtle">
        <div className="inline-flex items-center gap-2">
          <Layers3 className="size-3.5 text-brand-bright" aria-hidden="true" />
          <dt className="sr-only">Modules</dt>
          <dd className="tabular-nums">{domain.modules} modules</dd>
        </div>
        <div className="inline-flex items-center gap-2">
          <Clock3 className="size-3.5 text-brand-bright" aria-hidden="true" />
          <dt className="sr-only">Estimated duration</dt>
          <dd className="tabular-nums">~{domain.estimatedHours} hours</dd>
        </div>
      </dl>

      {isRoadmap ? (
        <div className="mt-4">
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="text-ink-subtle">Progress</span>
            <span className="font-medium text-ink-muted">Not started · 0%</span>
          </div>
          <ProgressBar
            value={0}
            label={`${domain.title} progress: not started, 0%`}
            className="mt-2"
          />
        </div>
      ) : null}

      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-bright">
        View domain
        <ArrowUpRight
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      </span>
    </Link>
  )
}
