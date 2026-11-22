import type { ReactNode } from 'react'
import { Container } from '../ui/Container'

interface PageIntroProps {
  eyebrow: string
  title: ReactNode
  description: string
  children?: ReactNode
}

export function PageIntro({ eyebrow, title, description, children }: PageIntroProps) {
  return (
    <div className="relative border-b border-line-soft bg-surface/40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgb(59_130_246/12%),transparent_55%)]" />
      <Container className="relative py-14 sm:py-20">
        <div className="max-w-3xl">
          <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-brand-bright">
            {eyebrow}
          </span>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.1] tracking-[-0.04em] text-ink sm:text-5xl lg:text-[54px]">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
            {description}
          </p>
          {children ? <div className="mt-8">{children}</div> : null}
        </div>
      </Container>
    </div>
  )
}
