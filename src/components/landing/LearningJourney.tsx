import { ArrowRight } from 'lucide-react'
import { getDomainsForPhase, journeyPhases } from '../../data/curriculum'
import { Section } from '../layout/Section'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

export function LearningJourney() {
  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="The learning journey"
          title="Three phases. One continuous path."
          description="Each phase builds on the last, so you are never asked to design at scale before you understand the pieces underneath."
        />

        <div className="mt-10 grid gap-4 lg:grid-cols-3 lg:gap-5">
          {journeyPhases.map((phase, index) => {
            const phaseDomains = getDomainsForPhase(phase)
            const hours = phaseDomains.reduce((total, domain) => total + domain.estimatedHours, 0)

            return (
              <Reveal key={phase.id} delay={index * 0.08}>
                <article className="card-shell flex h-full flex-col p-6">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-[0.18em] text-brand-bright">
                      {phase.label}
                    </span>
                    <ArrowRight className="size-4 text-line" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em] text-ink">
                    {phase.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
                    {phase.description}
                  </p>
                  <p className="mt-6 border-t border-line-soft pt-4 font-mono text-xs text-ink-subtle">
                    {phaseDomains.length} domains · ~{hours} hours
                  </p>
                </article>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
