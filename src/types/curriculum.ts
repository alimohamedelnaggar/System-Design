/* -------------------------------------------------------------------------- */
/* Phase 1 UI types (kept for backwards compatibility)                         */
/* -------------------------------------------------------------------------- */

export type DomainStage = 'foundation' | 'core' | 'advanced'

export type DomainIconKey =
  | 'fundamentals'
  | 'network'
  | 'database'
  | 'caching'
  | 'distributed'
  | 'scalability'
  | 'messaging'
  | 'interviews'

/** Legacy DOM-facing shape used by the existing roadmap UI. */
export interface LearningDomain {
  id: number
  slug: string
  title: string
  summary: string
  description: string
  modules: number
  estimatedHours: number
  stage: DomainStage
  outcomes: string[]
  icon: DomainIconKey
}

export interface JourneyPhase {
  id: string
  label: string
  title: string
  description: string
  domainIds: number[]
}

export type ProjectDifficulty = 'Intermediate' | 'Advanced'

export type ProjectIconKey = 'chat' | 'commerce' | 'feed' | 'video' | 'payments' | 'search'

export interface Project {
  id: number
  slug: string
  title: string
  description: string
  difficulty: ProjectDifficulty
  tags: string[]
  icon: ProjectIconKey
}

export type FeatureIconKey = 'map' | 'compare' | 'rehearse'

export interface LearningFeature {
  id: number
  title: string
  description: string
  icon: FeatureIconKey
}

export interface CurriculumStats {
  domains: number
  modules: number
  hours: number
  projects: number
}

/* -------------------------------------------------------------------------- */
/* Task 02.1 curriculum architecture types                                     */
/* -------------------------------------------------------------------------- */

export type Difficulty = 'beginner' | 'intermediate' | 'advanced'

export type LessonStatus = 'planned' | 'published'

export type DiagramLayout = 'flow' | 'layers' | 'topology' | 'comparison' | 'timeline'

export type DiagramNodeKind =
  | 'client'
  | 'gateway'
  | 'service'
  | 'cache'
  | 'database'
  | 'queue'
  | 'generic'

export type CodeLanguage = 'text' | 'json' | 'typescript' | 'javascript' | 'sql' | 'bash' | 'yaml'

export interface LearningObjective {
  id: string
  text: string
}

export type LessonSectionKind =
  | 'general'
  | 'introduction'
  | 'concepts'
  | 'process'
  | 'tradeoffs'
  | 'mistakes'

export interface LessonStep {
  id: string
  title: string
  description: string
}

export interface LessonTradeoff {
  id: string
  choice: string
  benefit: string
  cost: string
}

/**
 * A structured teaching block. `paragraphs`/`keyPoints` cover prose lessons;
 * the optional fields let future lessons describe processes, trade-offs and
 * mistakes without inventing prose in the presentation layer.
 */
export interface LessonSection {
  id: string
  order: number
  title: string
  paragraphs: string[]
  keyPoints?: string[]
  kind?: LessonSectionKind
  steps?: LessonStep[]
  tradeoffs?: LessonTradeoff[]
  commonMistakes?: string[]
}

export interface DiagramNode {
  id: string
  label: string
  kind: DiagramNodeKind
  description?: string
}

export interface DiagramEdge {
  id: string
  source: string
  target: string
  label?: string
}

export interface Diagram {
  id: string
  title: string
  description: string
  layout: DiagramLayout
  nodes: DiagramNode[]
  edges: DiagramEdge[]
  /** Opt-in reveal animation handled entirely by the diagram engine. */
  animated?: boolean
}

export interface CodeExample {
  id: string
  title: string
  language: CodeLanguage
  code: string
  explanation?: string
}

export interface ComparisonColumn {
  id: string
  label: string
}

export interface ComparisonRow {
  id: string
  criterion: string
  values: Record<string, string>
}

export interface Comparison {
  id: string
  title: string
  summary: string
  columns: ComparisonColumn[]
  rows: ComparisonRow[]
}

export interface QuizOption {
  id: string
  label: string
  isCorrect: boolean
  explanation?: string
}

export interface QuizQuestion {
  id: string
  prompt: string
  options: QuizOption[]
  explanation?: string
}

export type QuizStandardId = 'sample' | 'final'

export interface Quiz {
  id: string
  title: string
  description: string
  passThreshold: number
  questions: QuizQuestion[]
  /** Declares which structural standard this quiz targets. Defaults to `sample`. */
  standard?: QuizStandardId
}

export interface PracticalChallenge {
  id: string
  title: string
  scenario: string
  requirements: string[]
  constraints: string[]
  deliverables: string[]
  hints?: string[]
}

export interface LessonSummary {
  id: string
  overview: string
  keyTakeaways: string[]
  nextSteps?: string[]
}

/** Lesson metadata. Content is referenced by id and stored in separate files. */
export interface Lesson {
  id: string
  moduleId: string
  slug: string
  number: number
  title: string
  description: string
  estimatedMinutes: number
  order: number
  status: LessonStatus
  learningObjectives: LearningObjective[]
  sectionIds: string[]
  diagramIds: string[]
  codeExampleIds: string[]
  comparisonIds: string[]
  quizId: string | null
  practicalChallengeId: string | null
  summaryId: string | null
  metadata?: Record<string, string>
}

export interface Module {
  id: string
  domainId: string
  number: string
  slug: string
  title: string
  description: string
  estimatedHours: number
  order: number
  lessonIds: string[]
  metadata?: Record<string, string>
}

export interface Domain {
  id: string
  slug: string
  number: number
  title: string
  description: string
  summary: string
  learningObjectives: LearningObjective[]
  estimatedHours: number
  difficulty: Difficulty
  stage: DomainStage
  icon: DomainIconKey
  modules: Module[]
  moduleLessonCounts: Record<string, number>
  metadata?: Record<string, string>
}

/** Fully resolved lesson: metadata plus content from the separated stores. */
export interface LessonContent {
  lesson: Lesson
  learningObjectives: LearningObjective[]
  sections: LessonSection[]
  diagrams: Diagram[]
  codeExamples: CodeExample[]
  comparisons: Comparison[]
  quiz: Quiz | null
  practicalChallenge: PracticalChallenge | null
  summary: LessonSummary | null
}

export interface DomainProgress {
  domainId: string
  totalLessons: number
  completedLessons: number
  percent: number
  status: 'not-started' | 'in-progress' | 'complete'
}

export type ValidationIssueCode =
  | 'duplicate-id'
  | 'duplicate-slug'
  | 'missing-module-reference'
  | 'invalid-lesson-order'
  | 'missing-required-metadata'
  | 'blueprint-mismatch'
  | 'quiz-standard-mismatch'

export interface ValidationIssue {
  code: ValidationIssueCode
  entity: string
  message: string
}
