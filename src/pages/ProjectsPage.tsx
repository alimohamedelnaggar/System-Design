import { Wrench } from 'lucide-react'
import { PlaceholderPage } from '../components/layout/PlaceholderPage'
import { projects } from '../data/projects'

export function ProjectsPage() {
  return (
    <PlaceholderPage
      icon={Wrench}
      eyebrow="Practice projects"
      title="Design briefs, ready for your turn."
      description="Six real-world scenarios are mapped out, from realtime chat to a payments ledger. Project briefs and guided solutions will be added in a later phase."
      facts={[
        { label: 'Projects', value: String(projects.length) },
        {
          label: 'Advanced',
          value: String(projects.filter((project) => project.difficulty === 'Advanced').length),
        },
      ]}
      planned={['Detailed briefs and constraints', 'Solution walkthroughs', 'Review checklists']}
    />
  )
}
