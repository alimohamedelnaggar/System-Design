import { useRef } from 'react'
import { Outlet } from 'react-router-dom'
import { usePageNavigation } from '../../hooks/usePageNavigation'
import { Footer } from '../navigation/Footer'
import { Header } from '../navigation/Header'

export function SiteLayout() {
  const mainRef = useRef<HTMLElement>(null)
  usePageNavigation(mainRef)

  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <Header />
      <main
        id="main-content"
        ref={mainRef}
        tabIndex={-1}
        className="flex-1 focus:outline-none"
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
