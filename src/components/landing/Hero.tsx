import { ArrowRight } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'
import { SystemBlueprint } from './SystemBlueprint'

export function Hero() {
  return (
    <div className="relative overflow-hidden border-b border-line-soft">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgb(59_130_246/16%),transparent_45%),radial-gradient(circle_at_85%_35%,rgb(29_78_216/10%),transparent_45%)]" />
      <Container className="relative grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:py-28">
        <div className="min-w-0">
          <Badge variant="brand" dot>
            A structured system design curriculum
          </Badge>

          <h1 className="mt-7 text-[clamp(2.75rem,7vw,5rem)] font-semibold leading-[1.02] tracking-[-0.055em] text-ink">
            Understand. Design.{' '}
            <span className="text-gradient block sm:inline">Scale.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
            Go from first principles to production-scale architecture with a learning path that
            explains every decision, not just the final diagram.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button to="/course" size="lg" icon={ArrowRight}>
              Start Learning
            </Button>
            <Button to="/roadmap" size="lg" variant="secondary">
              Explore Roadmap
            </Button>
          </div>

          <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-subtle">
            <span>Self-paced</span>
            <span className="size-1 rounded-full bg-line" aria-hidden="true" />
            <span>Eight connected domains</span>
            <span className="size-1 rounded-full bg-line" aria-hidden="true" />
            <span>No account needed to explore</span>
          </p>
        </div>

        <Reveal delay={0.12} className="min-w-0">
          <SystemBlueprint />
        </Reveal>
      </Container>
    </div>
  )
}
