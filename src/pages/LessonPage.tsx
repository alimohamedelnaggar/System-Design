import { useParams } from 'react-router-dom'
import { LessonExperience } from '../components/lesson'
import { findLessonLocation } from '../components/lesson/location'
import { getAllDomains, getLessonBySlug, getLessonContent } from '../data/curriculum/index.ts'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { NotFoundPage } from './NotFoundPage'

export function LessonPage() {
  const { slug } = useParams<{ slug: string }>()
  const lesson = getLessonBySlug(slug)
  const content = getLessonContent(slug)

  useDocumentTitle(lesson?.title ?? 'Lesson not found')

  if (!lesson || !content) {
    return <NotFoundPage />
  }

  const location = findLessonLocation(lesson)
  if (!location) {
    return <NotFoundPage />
  }

  return <LessonExperience lesson={lesson} content={content} location={location} domains={getAllDomains()} />
}
