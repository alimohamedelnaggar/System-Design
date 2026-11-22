import type { LessonContent, LessonSection } from '../../types/curriculum.ts'
import { CodeBlock } from './code/CodeBlock'
import {
  CommonMistakesSection,
  ComparisonTable,
  ConceptSection,
  KeyTakeaways,
  KnowledgeCheck,
  LearningObjectives,
  LessonDiagramBlock,
  LessonIntroduction,
  LessonSimulationLink,
  PracticalChallenge,
  ProcessSection,
  TradeoffSection,
} from './blocks'

interface LessonBodyProps {
  content: LessonContent
  moduleLabel?: string
}

function renderSection(section: LessonSection) {
  switch (section.kind ?? 'concepts') {
    case 'process':
      return <ProcessSection key={section.id} section={section} />
    case 'tradeoffs':
      return <TradeoffSection key={section.id} section={section} />
    case 'mistakes':
      return <CommonMistakesSection key={section.id} section={section} />
    case 'introduction':
    case 'concepts':
    case 'general':
    default:
      return <ConceptSection key={section.id} section={section} />
  }
}

/** Content rendering only. Navigation and layout live in sibling components. */
export function LessonBody({ content, moduleLabel }: LessonBodyProps) {
  return (
    <div className="min-w-0 space-y-5">
      <LessonIntroduction content={content} moduleLabel={moduleLabel} />
      <LearningObjectives objectives={content.learningObjectives} />
      {content.sections.map(renderSection)}
      {content.diagrams.map((diagram) => (
        <LessonDiagramBlock key={diagram.id} diagram={diagram} />
      ))}
      {content.codeExamples.map((example) => (
        <CodeBlock key={example.id} example={example} />
      ))}
      {content.comparisons.map((comparison) => (
        <ComparisonTable key={comparison.id} comparison={comparison} />
      ))}
      <LessonSimulationLink lesson={content.lesson} />
      {content.quiz ? <KnowledgeCheck key={content.lesson.id} lesson={content.lesson} /> : null}
      {content.practicalChallenge ? (
        <PracticalChallenge challenge={content.practicalChallenge} />
      ) : null}
      {content.summary ? <KeyTakeaways summary={content.summary} /> : null}
    </div>
  )
}
