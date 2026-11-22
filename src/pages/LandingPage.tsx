import { FeaturePreview } from '../components/landing/FeaturePreview'
import { FeaturedDomains } from '../components/landing/FeaturedDomains'
import { FinalCta } from '../components/landing/FinalCta'
import { Hero } from '../components/landing/Hero'
import { LearningJourney } from '../components/landing/LearningJourney'
import { ProjectsPreview } from '../components/landing/ProjectsPreview'
import { StatsBar } from '../components/landing/StatsBar'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function LandingPage() {
  useDocumentTitle()

  return (
    <>
      <Hero />
      <StatsBar />
      <LearningJourney />
      <FeaturedDomains />
      <FeaturePreview />
      <ProjectsPreview />
      <FinalCta />
    </>
  )
}
