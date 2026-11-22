import { Circle, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface PlaceholderPanelProps {
  icon: LucideIcon
  eyebrow: string
  title: string
  description: string
  facts?: { label: string; value: string }[]
  planned?: string[]
  children?: ReactNode
}

export function PlaceholderPanel({
  icon: Icon,
  eyebrow,
  title,
  description,
  facts = [],
  planned = [],
  children,
}: PlaceholderPanelProps) {
  return (
    <div className="card-shell overflow-hidden">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-brand/60 to-transparent" />
      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:p-10">
        <div className="min-w-0">
          <div className="flex items-center gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-brand/25 bg-brand/10 text-brand-bright">
              <Icon className="size-5" strokeWidth={1.8} aria-hidden="true" />
            </span>
            <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-brand-bright">
              {eyebrow}
            </span>
          </div>
          <h1 className="mt-6 text-3xl font-semibold leading-tight tracking-[-0.03em] text-ink sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">{description}</p>

          {facts.length > 0 ? (
            <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {facts.map((fact) => (
                <div key={fact.label} className="rounded-xl border border-line-soft bg-surface/60 p-4">
                  <dt className="text-xs font-medium uppercase tracking-wider text-ink-subtle">
                    {fact.label}
                  </dt>
                  <dd className="mt-1 font-mono text-lg font-semibold tabular-nums text-ink">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>

        <div className="flex w-full flex-col justify-center gap-4 lg:w-72">
          <div className="rounded-xl border border-line-soft bg-surface/60 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
              Planned for this area
            </p>
            {planned.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {planned.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-snug text-ink-muted">
                    <Circle className="mt-1.5 size-2 shrink-0 fill-brand/70 text-brand/70" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                Course material is being written and will appear here as each module is released.
              </p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
