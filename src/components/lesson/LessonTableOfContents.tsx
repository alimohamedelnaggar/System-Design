import { ChevronDown, ListTree } from 'lucide-react'
import type { LessonOutlineItem } from './outline'

interface LessonTableOfContentsProps {
  items: readonly LessonOutlineItem[]
  activeId?: string
}

function TocList({
  items,
  activeId,
}: {
  items: readonly LessonOutlineItem[]
  activeId?: string
}) {
  return (
    <nav aria-label="On this page" className="min-w-0">
      <ul className="min-w-0 space-y-0.5">
        {items.map((item) => {
          const isActive = item.id === activeId
          return (
            <li key={item.id} className="min-w-0">
              <a
                href={`#${item.id}`}
                aria-current={isActive ? 'location' : undefined}
                className={`flex min-h-8 items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs leading-snug transition-colors ${
                  isActive
                    ? 'bg-brand/10 font-semibold text-brand-bright'
                    : 'text-ink-subtle hover:bg-surface-hover hover:text-ink'
                }`}
              >
                <span
                  className={`size-1.5 shrink-0 rounded-full ${isActive ? 'bg-brand-bright' : 'bg-line'}`}
                  aria-hidden="true"
                />
                <span className="min-w-0 truncate">{item.label}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export function LessonTableOfContents({ items, activeId }: LessonTableOfContentsProps) {
  return (
    <aside className="min-w-0" aria-labelledby="lesson-toc-title">
      <h2 id="lesson-toc-title" className="sr-only">
        On this page
      </h2>

      <details className="card-shell group lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 text-sm font-semibold text-ink [&::-webkit-details-marker]:hidden">
          <span className="inline-flex items-center gap-2">
            <ListTree className="size-4 text-brand-bright" aria-hidden="true" />
            On this page
          </span>
          <ChevronDown
            className="size-4 text-ink-subtle transition-transform duration-200 group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <div className="border-t border-line-soft p-3">
          <TocList items={items} activeId={activeId} />
        </div>
      </details>

      <div className="card-shell sticky top-24 hidden max-h-[calc(100dvh-8rem)] overflow-y-auto p-4 lg:block">
        <p className="mb-4 inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-bright">
          <ListTree className="size-4" aria-hidden="true" />
          On this page
        </p>
        <TocList items={items} activeId={activeId} />
      </div>
    </aside>
  )
}
