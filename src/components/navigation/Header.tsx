import { ArrowRight, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { isNavItemActive, primaryNavItems } from '../../data/navigation'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { Logo } from '../ui/Logo'

export function Header() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-50 border-b border-line-soft/80 bg-canvas/85 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-4 lg:h-[72px]">
        <Logo />

        <nav aria-label="Primary navigation" className="hidden items-center gap-1 lg:flex">
          {primaryNavItems.map((item) => {
            const active = isNavItemActive(pathname, item.to)

            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? 'page' : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  active
                    ? 'bg-brand/10 text-brand-bright'
                    : 'text-ink-muted hover:bg-surface-hover hover:text-ink'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden lg:block">
          <Button to="/roadmap" variant="primary" icon={ArrowRight}>
            Start Learning
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          className="grid size-11 place-items-center rounded-xl border border-line text-ink-muted transition-colors hover:bg-surface-hover hover:text-ink lg:hidden"
        >
          {menuOpen ? (
            <X className="size-5" strokeWidth={2} aria-hidden="true" />
          ) : (
            <Menu className="size-5" strokeWidth={2} aria-hidden="true" />
          )}
        </button>
      </Container>

      <div
        id="mobile-navigation"
        aria-hidden={!menuOpen}
        className={`overflow-hidden border-t border-line-soft bg-surface/95 backdrop-blur-xl transition-[max-height,opacity,visibility] duration-200 ease-out lg:hidden ${
          menuOpen
            ? 'visible max-h-[520px] opacity-100'
            : 'invisible max-h-0 opacity-0'
        }`}
      >
        <Container className="py-4">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {primaryNavItems.map((item) => {
              const active = isNavItemActive(pathname, item.to)

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  aria-current={active ? 'page' : undefined}
                  className={`flex min-h-11 items-center rounded-xl px-4 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-brand/10 text-brand-bright'
                      : 'text-ink-muted hover:bg-surface-hover hover:text-ink'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <Button
            to="/roadmap"
            className="mt-4 w-full"
            icon={ArrowRight}
            onClick={() => setMenuOpen(false)}
          >
            Start Learning
          </Button>
        </Container>
      </div>
    </header>
  )
}
