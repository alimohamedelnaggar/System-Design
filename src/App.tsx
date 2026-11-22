import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { SiteLayout } from './components/layout/SiteLayout'
import { RouteFallback } from './components/ui/RouteFallback'

const LandingPage = lazy(() =>
  import('./pages/LandingPage').then((module) => ({ default: module.LandingPage })),
)
const RoadmapPage = lazy(() =>
  import('./pages/RoadmapPage').then((module) => ({ default: module.RoadmapPage })),
)
const CoursePage = lazy(() =>
  import('./pages/CoursePage').then((module) => ({ default: module.CoursePage })),
)
const DomainPage = lazy(() =>
  import('./pages/DomainPage').then((module) => ({ default: module.DomainPage })),
)
const LessonPage = lazy(() =>
  import('./pages/LessonPage').then((module) => ({ default: module.LessonPage })),
)
const ProjectsPage = lazy(() =>
  import('./pages/ProjectsPage').then((module) => ({ default: module.ProjectsPage })),
)
const InterviewsPage = lazy(() =>
  import('./pages/InterviewsPage').then((module) => ({ default: module.InterviewsPage })),
)
const PlaygroundPage = lazy(() =>
  import('./pages/PlaygroundPage').then((module) => ({ default: module.PlaygroundPage })),
)
const ProgressPage = lazy(() =>
  import('./pages/ProgressPage').then((module) => ({ default: module.ProgressPage })),
)
const SimulationsPage = lazy(() =>
  import('./pages/SimulationsPage').then((module) => ({ default: module.SimulationsPage })),
)
const SimulationPage = lazy(() =>
  import('./pages/SimulationPage').then((module) => ({ default: module.SimulationPage })),
)
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })),
)

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="roadmap" element={<RoadmapPage />} />
          <Route path="course" element={<CoursePage />} />
          <Route path="domain/:slug" element={<DomainPage />} />
          <Route path="lesson/:slug" element={<LessonPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="interviews" element={<InterviewsPage />} />
          <Route path="playground" element={<PlaygroundPage />} />
          <Route path="progress" element={<ProgressPage />} />
          <Route path="simulations" element={<SimulationsPage />} />
          <Route path="simulations/:slug" element={<SimulationPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
