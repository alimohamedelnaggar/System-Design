import { ArrowRight } from 'lucide-react'
import { featuredProjects } from '../../data/projects'
import { Section } from '../layout/Section'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { ProjectIcon } from '../ui/ProjectIcon'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

export function ProjectsPreview() {
  return (
    <Section className="bg-surface/30">
      <Container>
        <SectionHeading
          eyebrow="Real-world projects"
          title="Practice on problems that look like the real thing."
          description="Every project asks you to make decisions under constraints, then defend the architecture you chose."
        />

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {featuredProjects.map((project, index) => (
            <Reveal key={project.id} delay={index * 0.07} className="min-w-0">
              <article className="card-shell flex h-full flex-col p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <ProjectIcon icon={project.icon} />
                  <span className="font-mono text-[11px] uppercase tracking-wider text-ink-subtle">
                    {project.difficulty}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-ink">
                  {project.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
                  {project.description}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-pill border border-line-soft bg-surface/70 px-2.5 py-1 text-[11px] text-ink-subtle"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-8">
          <Button to="/projects" variant="secondary" icon={ArrowRight}>
            See all projects
          </Button>
        </div>
      </Container>
    </Section>
  )
}
