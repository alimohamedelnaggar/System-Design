import { ArrowRight } from 'lucide-react'
import { Container } from '../ui/Container'
import { Button } from '../ui/Button'
import { Section } from '../layout/Section'

export function FinalCta() {
  return (
    <Section className="border-t border-line-soft">
      <Container>
        <div className="card-shell relative overflow-hidden px-6 py-10 sm:px-10 sm:py-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgb(59_130_246/18%),transparent_55%)]" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-bright">
                Your next step
              </p>
              <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-ink sm:text-3xl">
                Every system starts with a clear first decision.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-base">
                Open the roadmap and choose where to begin.
              </p>
            </div>
            <Button to="/roadmap" size="lg" icon={ArrowRight} className="shrink-0">
              Explore the Roadmap
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  )
}
