import { ArrowRight } from 'lucide-react'
import { featuredDomains } from '../../data/curriculum'
import { DomainCard } from '../roadmap/DomainCard'
import { Section } from '../layout/Section'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

export function FeaturedDomains() {
  return (
    <Section className="bg-surface/30">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Featured domains"
            title="Start with the foundations that everything else rests on."
            description="A look at the first three domains in the roadmap. Each one is a self-contained step with a clear goal."
          />
          <Button to="/roadmap" variant="secondary" icon={ArrowRight} className="shrink-0">
            All 8 domains
          </Button>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {featuredDomains.map((domain, index) => (
            <Reveal key={domain.id} delay={index * 0.07} className="min-w-0">
              <DomainCard domain={domain} variant="featured" />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}
