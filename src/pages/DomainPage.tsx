import { useParams } from 'react-router-dom'
import {
  CourseBreadcrumbs,
  CourseSidebar,
  DomainHeader,
  ModuleAccordion,
} from '../components/course'
import { Section } from '../components/layout/Section'
import { Container } from '../components/ui/Container'
import { SectionHeading } from '../components/ui/SectionHeading'
import { getAllDomains, getDomainBySlug } from '../data/curriculum/index.ts'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { NotFoundPage } from './NotFoundPage'

export function DomainPage() {
  const { slug } = useParams<{ slug: string }>()
  const domain = getDomainBySlug(slug)
  const domains = getAllDomains()
  const domainIndex = domain ? domains.findIndex((item) => item.id === domain.id) : -1

  useDocumentTitle(domain?.title ?? 'Domain not found')

  if (!domain) {
    return <NotFoundPage />
  }

  const previousDomain = domainIndex > 0 ? domains[domainIndex - 1] : undefined
  const nextDomain = domainIndex >= 0 && domainIndex < domains.length - 1
    ? domains[domainIndex + 1]
    : undefined

  return (
    <>
      <DomainHeader domain={domain} previousDomain={previousDomain} nextDomain={nextDomain} />

      <Section>
        <Container>
          <CourseBreadcrumbs
            items={[{ label: 'Course', to: '/course' }, { label: domain.title }]}
            className="mb-8"
          />

          <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-10">
            <div className="min-w-0">
              <SectionHeading
                eyebrow="Module outline"
                title={`${domain.modules.length} modules in this domain`}
                description="Modules follow the approved order. Expand any module to see its lessons, their status and estimated reading time."
              />

              <div className="mt-8">
                <ModuleAccordion domain={domain} />
              </div>
            </div>

            <CourseSidebar domains={domains} activeDomainId={domain.id} />
          </div>
        </Container>
      </Section>
    </>
  )
}
