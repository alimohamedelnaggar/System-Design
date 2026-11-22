import { Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getSimulationBySlug } from '../../../features/simulations/registry/simulationLookup.ts'
import type { Lesson } from '../../../types/curriculum.ts'
import { LessonSectionFrame } from './LessonSectionFrame'

interface LessonSimulationLinkProps {
  lesson: Lesson
}

/** Links a lesson to one already-registered simulation without adding progress state. */
export function LessonSimulationLink({ lesson }: LessonSimulationLinkProps) {
  const slug = lesson.metadata?.simulationSlug
  const simulation = getSimulationBySlug(slug)

  if (!simulation) return null

  return (
    <LessonSectionFrame
      id="lesson-simulation"
      title="See the request flow in motion"
      eyebrow="Interactive simulation"
      icon={Play}
    >
      <p className="text-sm leading-relaxed text-ink-muted">{simulation.description}</p>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">
        Step through one run and watch which component is active, when the request changes direction and how each stage
        adds latency. Compare the path with the request and response diagram above.
      </p>
      <p className="mt-3 text-xs leading-relaxed text-ink-subtle">
        This is an optional demonstration. It does not record lesson progress or replace the explanation in this lesson.
      </p>
      <Link
        to={`/simulations/${simulation.slug}`}
        data-lesson-simulation-link={simulation.slug}
        className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-deep px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
      >
        <Play className="size-4" aria-hidden="true" />
        Open {simulation.title}
      </Link>
    </LessonSectionFrame>
  )
}
