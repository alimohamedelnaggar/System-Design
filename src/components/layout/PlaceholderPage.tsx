import type { LucideIcon } from 'lucide-react'
import { ArrowLeft, House } from 'lucide-react'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { PlaceholderPanel } from '../ui/PlaceholderPanel'
import { Section } from './Section'

interface PlaceholderPageProps {
  icon: LucideIcon
  eyebrow: string
  title: string
  description: string
  planned?: string[]
  facts?: { label: string; value: string }[]
}

export function PlaceholderPage({
  icon,
  eyebrow,
  title,
  description,
  planned = [],
  facts,
}: PlaceholderPageProps) {
  useDocumentTitle(title)

  return (
    <Section className="bg-[radial-gradient(circle_at_70%_0%,rgb(59_130_246/8%),transparent_45%)]">
      <Container>
        <PlaceholderPanel
          icon={icon}
          eyebrow={eyebrow}
          title={title}
          description={description}
          facts={facts}
          planned={planned}
        >
          <div className="flex flex-col gap-3">
            <Button to="/roadmap" variant="secondary" icon={ArrowLeft}>
              Back to roadmap
            </Button>
            <Button to="/" variant="ghost" icon={House}>
              Return home
            </Button>
          </div>
        </PlaceholderPanel>
      </Container>
    </Section>
  )
}
