import { lazy, Suspense } from 'react'
import { learningFeatures } from '../../data/features'
import { Section } from '../layout/Section'
import { Badge } from '../ui/Badge'
import { Container } from '../ui/Container'
import { FeatureIcon } from '../ui/FeatureIcon'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
const ArchitecturePreview = lazy(() =>
  import('./ArchitecturePreview').then((module) => ({ default: module.ArchitecturePreview })),
)

export function FeaturePreview() {
  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Interactive learning"
          title="Architecture you can inspect, not just read about."
          description="The experience is being built around exploration: follow data, change constraints, and explain the result."
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-12">
          <div>
            <Badge variant="neutral">In development</Badge>
            <ul className="mt-6 space-y-3">
              {learningFeatures.map((feature, index) => (
                <li key={feature.id}>
                  <Reveal delay={index * 0.06}>
                    <div className="flex gap-4 rounded-xl border border-line-soft bg-surface/50 p-4">
                      <FeatureIcon icon={feature.icon} />
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-ink">{feature.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>

          <Reveal delay={0.1} className="min-w-0">
            <Suspense
              fallback={
                <div className="card-shell h-[304px] animate-pulse bg-surface/60 sm:h-[374px]" />
              }
            >
              <ArchitecturePreview />
            </Suspense>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
