import { ChevronDown, ListTree } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getLessonsByModule, journeyPhases } from '../../data/curriculum/index.ts'
import type { Domain } from '../../types/curriculum.ts'
import { domainNumber } from './format'
import { getLessonViewStatus, isLessonAvailable, type LessonProgressInput } from './status'
import { LessonStatusBadge } from './LessonStatusBadge'

interface CourseSidebarProps {
  domains: readonly Domain[]
  activeDomainId?: string
  activeModuleId?: string
  activeLessonId?: string
  progress?: LessonProgressInput
  className?: string
}

type SidebarNavProps = Omit<CourseSidebarProps, 'className'>

function SidebarNav({
  domains,
  activeDomainId,
  activeModuleId,
  activeLessonId,
  progress,
}: SidebarNavProps) {
  return (
    <nav aria-label="Course contents" className="min-w-0">
      <ol className="space-y-5">
        {journeyPhases.map((phase) => {
          const phaseDomains = domains.filter((domain) => phase.domainIds.includes(domain.number))
          if (phaseDomains.length === 0) return null

          return (
            <li key={phase.id}>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-subtle">
                {phase.title}
              </p>
              <ul className="mt-2 space-y-1">
                {phaseDomains.map((domain) => {
                  const isActiveDomain = domain.id === activeDomainId
                  return (
                    <li key={domain.id}>
                      <Link
                        to={`/domain/${domain.slug}`}
                        aria-current={isActiveDomain ? 'page' : undefined}
                        className={`flex min-h-9 items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors ${
                          isActiveDomain
                            ? 'bg-brand/10 font-semibold text-brand-bright'
                            : 'text-ink-muted hover:bg-surface-hover hover:text-ink'
                        }`}
                      >
                        <span className="font-mono text-[11px] tabular-nums text-ink-subtle">
                          {domainNumber(domain.number)}
                        </span>
                        <span className="min-w-0 truncate">{domain.title}</span>
                      </Link>

                      {isActiveDomain ? (
                        <ul className="mb-2 ml-4 mt-1 space-y-1 border-l border-line-soft pl-3">
                          {domain.modules.map((module) => {
                            const isActiveModule = module.id === activeModuleId
                            const moduleLessons = getLessonsByModule(module.id)
                            return (
                              <li key={module.id}>
                                <Link
                                  to={`/domain/${domain.slug}#module-${module.id}`}
                                  className={`flex min-h-8 items-center gap-2 rounded-md px-2 py-1 text-xs transition-colors ${
                                    isActiveModule
                                      ? 'bg-surface-hover font-semibold text-ink'
                                      : 'text-ink-subtle hover:bg-surface-hover hover:text-ink'
                                  }`}
                                >
                                  <span className="font-mono tabular-nums text-brand-bright">
                                    {module.number}
                                  </span>
                                  <span className="min-w-0 truncate">{module.title}</span>
                                </Link>

                                {isActiveModule ? (
                                  <ul className="mb-1 ml-4 space-y-1 border-l border-line-soft pl-2">
                                    {moduleLessons.map((lesson) => {
                                      const status = getLessonViewStatus(lesson, progress)
                                      const available = isLessonAvailable(status)
                                      const isActiveLesson = lesson.id === activeLessonId
                                      const className = `flex min-h-8 items-center justify-between gap-2 rounded-md px-2 py-1 text-[11px] transition-colors ${
                                        isActiveLesson
                                          ? 'bg-brand/10 text-brand-bright'
                                          : available
                                            ? 'text-ink-muted hover:bg-surface-hover hover:text-ink'
                                            : 'text-ink-subtle'
                                      }`
                                      const lessonContent = (
                                        <>
                                          <span className="min-w-0 truncate">
                                            {lesson.number} · {lesson.title}
                                          </span>
                                          <LessonStatusBadge status={status} className="shrink-0 !px-1.5 !py-0" />
                                        </>
                                      )

                                      return (
                                        <li key={lesson.id}>
                                          {available ? (
                                            <Link to={`/lesson/${lesson.slug}`} className={className}>
                                              {lessonContent}
                                            </Link>
                                          ) : (
                                            <span className={className} aria-disabled="true">
                                              {lessonContent}
                                            </span>
                                          )}
                                        </li>
                                      )
                                    })}
                                  </ul>
                                ) : null}
                              </li>
                            )
                          })}
                        </ul>
                      ) : null}
                    </li>
                  )
                })}
              </ul>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export function CourseSidebar({
  domains,
  activeDomainId,
  activeModuleId,
  activeLessonId,
  progress,
  className = '',
}: CourseSidebarProps) {
  const navProps = { domains, activeDomainId, activeModuleId, activeLessonId, progress }
  const headingId = 'course-sidebar-title'

  return (
    <aside className={`min-w-0 ${className}`} aria-labelledby={headingId}>
      <h2 id={headingId} className="sr-only">
        Course contents
      </h2>

      <details className="card-shell group mb-5 lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
          <span className="inline-flex items-center gap-2">
            <ListTree className="size-4 text-brand-bright" aria-hidden="true" />
            Course contents
          </span>
          <ChevronDown
            className="size-4 text-ink-subtle transition-transform duration-200 group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <div className="border-t border-line-soft p-4">
          <SidebarNav {...navProps} />
        </div>
      </details>

      <div className="card-shell sticky top-24 hidden max-h-[calc(100dvh-8rem)] overflow-y-auto p-4 lg:block">
        <p className="mb-4 inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-bright">
          <ListTree className="size-4" aria-hidden="true" />
          Course contents
        </p>
        <SidebarNav {...navProps} />
      </div>
    </aside>
  )
}
