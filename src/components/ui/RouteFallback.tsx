import { LoaderCircle } from 'lucide-react'
import { Container } from './Container'

export function RouteFallback() {
  return (
    <div className="flex min-h-[60dvh] items-center justify-center" role="status">
      <Container className="flex flex-col items-center gap-3 text-center">
        <LoaderCircle className="size-5 animate-spin text-brand-bright" aria-hidden="true" />
        <span className="sr-only">Loading page</span>
      </Container>
    </div>
  )
}
