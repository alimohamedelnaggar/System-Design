import type { ReactNode, RefObject } from 'react'
import { Section } from '../layout/Section'
import { Container } from '../ui/Container'

interface LessonLayoutProps {
  breadcrumbs: ReactNode
  progress: ReactNode
  sidebar: ReactNode
  toc: ReactNode
  children: ReactNode
  articleRef: RefObject<HTMLElement | null>
}

export function LessonLayout({
  breadcrumbs,
  progress,
  sidebar,
  toc,
  children,
  articleRef,
}: LessonLayoutProps) {
  return (
    <Section className="bg-[radial-gradient(circle_at_75%_0%,rgb(59_130_246/8%),transparent_45%)]">
      <Container>
        {breadcrumbs}
        {progress}

        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,210px)_minmax(0,1fr)_minmax(0,195px)] xl:grid-cols-[minmax(0,230px)_minmax(0,1fr)_minmax(0,215px)] lg:gap-7">
          <div className="order-2 min-w-0 lg:order-1">{sidebar}</div>
          <article ref={articleRef} className="order-1 min-w-0 lg:order-2">
            {children}
          </article>
          <div className="order-3 min-w-0">{toc}</div>
        </div>
      </Container>
    </Section>
  )
}
