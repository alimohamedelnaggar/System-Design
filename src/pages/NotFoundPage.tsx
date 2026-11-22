import { Compass } from 'lucide-react'
import { PlaceholderPage } from '../components/layout/PlaceholderPage'

export function NotFoundPage() {
  return (
    <PlaceholderPage
      icon={Compass}
      eyebrow="404"
      title="That route isn't on the map."
      description="The page you were looking for does not exist. The roadmap is the best place to pick up a known path."
      planned={['Return to the landing page', 'Browse the eight domains']}
    />
  )
}
