import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { footerNavGroups } from '../../data/navigation'
import { Container } from '../ui/Container'
import { Logo } from '../ui/Logo'

const currentYear = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="border-t border-line-soft bg-surface/60">
      <Container className="py-12 sm:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 text-sm leading-relaxed text-ink-muted">
              A structured path from system design fundamentals to architectures that hold up in
              production and in interviews.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 font-mono text-xs text-ink-subtle">
              <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
              Foundation release · Curriculum in progress
            </p>
          </div>

          {footerNavGroups.map((group) => (
            <nav key={group.label} aria-label={`${group.label} footer navigation`}>
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-subtle">
                {group.label}
              </h2>
              <ul className="mt-5 space-y-3">
                {group.items.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="group inline-flex min-h-9 items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
                    >
                      {item.label}
                      <ArrowUpRight
                        className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line-soft pt-6 text-xs text-ink-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} System Design Academy</p>
          <p>Built for engineers who want to understand the why.</p>
        </div>
      </Container>
    </footer>
  )
}
