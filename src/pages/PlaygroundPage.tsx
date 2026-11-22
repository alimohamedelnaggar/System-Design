import { Workflow } from 'lucide-react'
import { PlaceholderPage } from '../components/layout/PlaceholderPage'

export function PlaygroundPage() {
  return (
    <PlaceholderPage
      icon={Workflow}
      eyebrow="Playground"
      title="A canvas for your architecture ideas."
      description="The playground will let you sketch systems with components and connections. React Flow is already wired in as the foundation for that editor."
      planned={['Drag-and-drop components', 'Connection and flow tooling', 'Exportable diagrams']}
    />
  )
}
