import { Container } from '../components/ui/Container'
import { Section } from '../components/layout/Section'
import { SectionHeading } from '../components/ui/SectionHeading'
import {
  CourseBreadcrumbs,
  CourseHeader,
  CourseSidebar,
  DomainCard,
} from '../components/course'
import { getAllDomains } from '../data/curriculum/index.ts'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function CoursePage() {
  useDocumentTitle('Course overview')
  const domains = getAllDomains()

  return (
    <>
      <CourseHeader domains={domains} />

      <Section>
        <Container>
          <CourseBreadcrumbs items={[{ label: 'Course' }]} className="mb-8" />

          <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-10">
            <div className="min-w-0">
              <SectionHeading
                eyebrow="Curriculum"
                title="Every domain, in order."
                description="Each domain groups its approved modules in sequence. Open a domain to see its module outlines, lesson counts and content availability."
              />

              <div className="mt-8 grid min-w-0 gap-4 sm:grid-cols-2">
                {domains.map((domain) => (
                  <DomainCard key={domain.id} domain={domain} />
                ))}
              </div>
            </div>

            <CourseSidebar domains={domains} />
          </div>
        </Container>
      </Section>
    </>
  )
}
