import { ChevronRight, House } from 'lucide-react'
import { Link } from 'react-router-dom'

export interface BreadcrumbItem {
  label: string
  to?: string
}

interface CourseBreadcrumbsProps {
  items: readonly BreadcrumbItem[]
  className?: string
}

export function CourseBreadcrumbs({ items, className = '' }: CourseBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={`min-w-0 ${className}`}>
      <ol className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-ink-subtle">
        <li className="flex items-center gap-1.5">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded transition-colors hover:text-brand-bright"
          >
            <House className="size-3.5" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-1.5">
              <ChevronRight className="size-3.5 shrink-0 text-ink-subtle/60" aria-hidden="true" />
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className="min-w-0 truncate rounded transition-colors hover:text-brand-bright"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className="min-w-0 truncate font-medium text-ink-muted"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
