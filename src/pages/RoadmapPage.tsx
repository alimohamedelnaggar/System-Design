import { RoadmapPath } from '../components/roadmap/RoadmapPath'
import { Section } from '../components/layout/Section'
import { PageIntro } from '../components/layout/PageIntro'
import { Badge } from '../components/ui/Badge'
import { Container } from '../components/ui/Container'
import { curriculumStats } from '../data/curriculum'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function RoadmapPage() {
  useDocumentTitle('Learning roadmap')

  return (
    <>
      <PageIntro
        eyebrow="The curriculum"
        title={
          <>
            Eight domains. <span className="text-gradient">One path.</span>
          </>
        }
        description="A deliberate sequence from first principles to full system design interviews. Follow it in order, or jump to the domain you need."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="brand">{curriculumStats.domains} domains</Badge>
          <Badge variant="neutral">{curriculumStats.modules} modules</Badge>
          <Badge variant="neutral">~{curriculumStats.hours} hours</Badge>
          <span className="text-sm text-ink-subtle">
            Progress indicators are placeholders in this foundation release.
          </span>
        </div>
      </PageIntro>

      <Section>
        <Container>
          <RoadmapPath />
        </Container>
      </Section>
    </>
  )
}
