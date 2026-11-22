import { useEffect, useState } from 'react'

/**
 * Tracks which outline target is currently being read. Uses document order and
 * a small viewport marker so the result is stable while scrolling.
 */
export function useActiveSection(ids: readonly string[]): string | undefined {
  const [activeId, setActiveId] = useState<string | undefined>(ids[0])

  useEffect(() => {
    const update = () => {
      const marker = 180
      let current: string | undefined

      for (const id of ids) {
        const element = document.getElementById(id)
        if (element && element.getBoundingClientRect().top <= marker) {
          current = id
        }
      }

      setActiveId(current ?? ids[0])
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [ids])

  return activeId
}
