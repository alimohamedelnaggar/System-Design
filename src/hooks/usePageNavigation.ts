import { useEffect, type RefObject } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Resets scroll position and moves focus to the main region after a route
 * change so keyboard and screen-reader users land on the new content.
 */
export function usePageNavigation(mainRef: RefObject<HTMLElement | null>): void {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    mainRef.current?.focus({ preventScroll: true })
  }, [pathname, mainRef])
}
