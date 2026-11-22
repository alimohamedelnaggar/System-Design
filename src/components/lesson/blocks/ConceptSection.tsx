import type { LessonSection } from '../../../types/curriculum.ts'
import { LessonSectionFrame } from './LessonSectionFrame'
import { ProseBody } from './ProseBody'

export function ConceptSection({ section }: { section: LessonSection }) {
  return (
    <LessonSectionFrame
      id={`section-${section.id}`}
      title={section.title}
      eyebrow={section.kind === 'introduction' ? 'Introduction' : 'Concept explanation'}
    >
      <ProseBody paragraphs={section.paragraphs} keyPoints={section.keyPoints} />
    </LessonSectionFrame>
  )
}
