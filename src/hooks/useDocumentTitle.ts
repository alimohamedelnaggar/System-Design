import { useEffect } from 'react'

const siteName = 'System Design Academy'

/** Keeps the browser title in sync with the current page. */
export function useDocumentTitle(title?: string): void {
  useEffect(() => {
    document.title = title ? `${title} — ${siteName}` : `${siteName} — Understand. Design. Scale.`
  }, [title])
}
