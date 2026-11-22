import { Network } from 'lucide-react'
import type { Diagram } from '../../../types/curriculum.ts'
import { DiagramFigure } from '../diagram'
import { LessonSectionFrame } from './LessonSectionFrame'

export function LessonDiagramBlock({ diagram }: { diagram: Diagram }) {
  return (
    <LessonSectionFrame
      id={`diagram-${diagram.id}`}
      title={diagram.title}
      eyebrow="Architecture diagram"
      icon={Network}
    >
      <DiagramFigure diagram={diagram} />
    </LessonSectionFrame>
  )
}
