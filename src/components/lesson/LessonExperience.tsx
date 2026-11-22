import { useEffect, useMemo, useRef } from 'react'
import type { Domain, Lesson, LessonContent } from '../../types/curriculum.ts'
import {
  getNextLesson,
  getPreviousLesson,
} from '../../data/curriculum/index.ts'
import { useProgress } from '../../features/progress'
import { CourseBreadcrumbs, CourseSidebar } from '../course'
import { getLessonViewStatus } from '../course/status'
import { LessonAvailabilityNotice } from './LessonAvailabilityNotice'
import { LessonBody } from './LessonBody'
import { LessonCompletionCard } from './blocks'
import { LessonLayout } from './LessonLayout'
import { LessonNavigation } from './LessonNavigation'
import { LessonTableOfContents } from './LessonTableOfContents'
import { ReadingProgress } from './ReadingProgress'
import { useActiveSection } from './hooks/useActiveSection'
import { useReadingProgress } from './hooks/useReadingProgress'
import { getLessonModule, type LessonLocation } from './location'
import { buildLessonOutline } from './outline'

interface LessonExperienceProps {
  lesson: Lesson
  content: LessonContent
  location: LessonLocation
  domains: readonly Domain[]
}

/** Composes the navigation, progress and content renderers for one lesson. */
export function LessonExperience({
  lesson,
  content,
  location,
  domains,
}: LessonExperienceProps) {
  const articleRef = useRef<HTMLElement>(null)
  const readingProgress = useReadingProgress(articleRef)
  const { state, startLesson } = useProgress()
  const status = getLessonViewStatus(lesson, {
    completedLessonIds: Object.values(state.lessons)
      .filter((record) => record.status === 'completed')
      .map((record) => record.lessonId),
    inProgressLessonIds: Object.values(state.lessons)
      .filter((record) => record.status === 'in_progress')
      .map((record) => record.lessonId),
  })

  useEffect(() => {
    if (status === 'published' || status === 'in_progress' || status === 'completed') {
      startLesson(lesson.id)
    }
  }, [lesson.id, startLesson, status])

  const outline = useMemo(() => {
    if (status === 'published' || status === 'in_progress' || status === 'completed') {
      return buildLessonOutline(content)
    }

    // Planned lessons only render the availability notice; keep the TOC honest.
    return buildLessonOutline({
      ...content,
      learningObjectives: [],
      sections: [],
      diagrams: [],
      codeExamples: [],
      comparisons: [],
      quiz: null,
      practicalChallenge: null,
      summary: null,
    })
  }, [content, status])
  const outlineIds = useMemo(() => outline.map((item) => item.id), [outline])
  const activeId = useActiveSection(outlineIds)

  const previousLesson = getPreviousLesson(lesson.id)
  const nextLesson = getNextLesson(lesson.id)
  const backToModule = `/domain/${location.domainSlug}#module-${location.moduleId}`
  const activeDomainId = getLessonModule(lesson)?.domainId
  const breadcrumbItems = [
    { label: 'Course', to: '/course' },
    { label: location.domainTitle, to: `/domain/${location.domainSlug}` },
    { label: `${location.moduleNumber} · ${location.moduleTitle}`, to: backToModule },
    { label: lesson.title },
  ]

  const lessonProgress = {
    completedLessonIds: Object.values(state.lessons)
      .filter((record) => record.status === 'completed')
      .map((record) => record.lessonId),
    inProgressLessonIds: Object.values(state.lessons)
      .filter((record) => record.status === 'in_progress')
      .map((record) => record.lessonId),
  }

  return (
    <LessonLayout
      articleRef={articleRef}
      breadcrumbs={<CourseBreadcrumbs items={breadcrumbItems} className="mb-5" />}
      progress={<ReadingProgress value={readingProgress} estimatedMinutes={lesson.estimatedMinutes} />}
      sidebar={
        <CourseSidebar
          domains={domains}
          activeDomainId={activeDomainId}
          activeModuleId={lesson.moduleId}
          activeLessonId={lesson.id}
          progress={lessonProgress}
        />
      }
      toc={<LessonTableOfContents items={outline} activeId={activeId} />}
    >
      {status === 'planned' ? (
        <LessonAvailabilityNotice
          lesson={lesson}
          status={status}
          backToModule={backToModule}
          moduleNumber={location.moduleNumber}
        />
      ) : (
        <>
          <LessonBody content={content} moduleLabel={location.moduleNumber} />
          <LessonCompletionCard lessonId={lesson.id} />
        </>
      )}

      <LessonNavigation
        previous={previousLesson}
        next={nextLesson}
        backToModule={backToModule}
        moduleNumber={location.moduleNumber}
        domainSlug={location.domainSlug}
        domainTitle={location.domainTitle}
      />
    </LessonLayout>
  )
}
