import { useParams } from 'react-router-dom'
import { SimulationExperience } from '../components/simulations/SimulationExperience.tsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.ts'
import { getSimulationBySlug } from '../features/simulations/registry/simulationLookup.ts'
import { NotFoundPage } from './NotFoundPage.tsx'

export function SimulationPage() {
  const { slug } = useParams<{ slug: string }>()
  const definition = getSimulationBySlug(slug)
  useDocumentTitle(definition?.title ?? 'Simulation not found')

  if (!definition) return <NotFoundPage />

  return <SimulationExperience definition={definition} />
}
