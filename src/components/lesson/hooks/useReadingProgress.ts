import { useEffect, useState, type RefObject } from 'react'

function clamp(value: number): number {
  return Math.min(100, Math.max(0, value))
}

/** Percentage of the lesson article that has been scrolled past. */
export function useReadingProgress(target: RefObject<HTMLElement | null>): number {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const element = target.current
      if (!element) return

      const top = element.getBoundingClientRect().top + window.scrollY
      const scrollable = element.offsetHeight - window.innerHeight
      const next = scrollable <= 0 ? 100 : clamp(((window.scrollY - top) / scrollable) * 100)
      setProgress(Math.round(next))
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [target])

  return progress
}
