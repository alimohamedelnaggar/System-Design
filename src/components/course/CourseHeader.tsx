import { ArrowRight, BookOpen, Clock3, Layers3, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getLessonsByModule } from '../../data/curriculum/index.ts'
import type { Domain } from '../../types/curriculum.ts'
import { Badge } from '../ui/Badge'
import { Container } from '../ui/Container'
import { domainNumber, formatHours } from './format'

interface CourseHeaderProps {
  domains: readonly Domain[]
}

export function CourseHeader({ domains }: CourseHeaderProps) {
  const moduleCount = domains.reduce((total, domain) => total + domain.modules.length, 0)
  const totalHours = domains.reduce((total, domain) => total + domain.estimatedHours, 0)
  const publishedLessons = domains.reduce(
    (total, domain) =>
      total +
      domain.modules.reduce(
        (moduleTotal, module) =>
          moduleTotal + getLessonsByModule(module.id).filter((lesson) => lesson.status === 'published').length,
        0,
      ),
    0,
  )
  const objectives = domains
    .map((domain) => ({ domain, objective: domain.learningObjectives[0]?.text }))
    .filter((item): item is { domain: Domain; objective: string } => Boolean(item.objective))

  return (
    <div className="relative border-b border-line-soft bg-surface/40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgb(59_130_246/14%),transparent_55%)]" />
      <Container className="relative py-14 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
          <div className="min-w-0">
            <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-brand-bright">
              The complete curriculum
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.1] tracking-[-0.04em] text-ink sm:text-5xl lg:text-[54px]">
              From first principles to <span className="text-gradient">full designs.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
              A structured path through the ideas that make systems correct, scalable and
              understandable. Browse every domain and module below, then study the lessons that
              are ready.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Badge variant="brand">{domains.length} domains</Badge>
              <Badge variant="neutral">{moduleCount} modules</Badge>
              <Badge variant="neutral">{formatHours(totalHours)} total</Badge>
              <Badge variant="neutral">{publishedLessons} published lesson</Badge>
            </div>

            {domains[0] ? (
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to={`/domain/${domains[0].slug}`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-deep px-5 text-sm font-semibold text-white shadow-[0_12px_32px_-14px_rgba(59,130,246,0.9)] transition-colors duration-200 hover:bg-brand-hover"
                >
                  Start with domain 01
                  <ArrowRight className="size-4" strokeWidth={2} aria-hidden="true" />
                </Link>
                <Link
                  to="/roadmap"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-line px-5 text-sm font-semibold text-ink transition-colors duration-200 hover:border-brand/50 hover:bg-surface-hover"
                >
                  View roadmap
                </Link>
              </div>
            ) : null}
          </div>

          <aside className="card-shell min-w-0 self-start p-5 sm:p-6" aria-labelledby="course-objectives">
            <div className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-brand/20 bg-brand/10 text-brand-bright">
                <Sparkles className="size-5" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <div>
                <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-brand-bright">
                  Outcomes
                </p>
                <h2 id="course-objectives" className="text-base font-semibold text-ink">
                  What you will learn
                </h2>
              </div>
            </div>
            <ul className="mt-5 space-y-3">
              {objectives.map(({ domain, objective }) => (
                <li key={domain.id} className="flex gap-3 text-sm leading-snug text-ink-muted">
                  <span className="mt-0.5 font-mono text-xs font-semibold tabular-nums text-brand-bright">
                    {domainNumber(domain.number)}
                  </span>
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-line-soft pt-4 text-xs text-ink-subtle">
              <span className="inline-flex items-center gap-1.5">
                <BookOpen className="size-3.5 text-brand-bright" aria-hidden="true" />
                Domain by domain
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Layers3 className="size-3.5 text-brand-bright" aria-hidden="true" />
                Module outlines
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="size-3.5 text-brand-bright" aria-hidden="true" />
                Clear pacing
              </span>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  )
}
