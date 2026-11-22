import { MessagesSquare } from 'lucide-react'
import { PlaceholderPage } from '../components/layout/PlaceholderPage'

export function InterviewsPage() {
  return (
    <PlaceholderPage
      icon={MessagesSquare}
      eyebrow="Interview preparation"
      title="Practice the explanation, not just the diagram."
      description="Interview preparation will pair system design problems with prompts, follow-ups, and rubrics so you can rehearse your reasoning out loud."
      planned={['Timed design prompts', 'Follow-up question banks', 'Communication rubrics']}
    />
  )
}
