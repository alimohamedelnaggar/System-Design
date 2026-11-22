import type { Difficulty } from '../../types/curriculum.ts'

export function formatHours(hours: number): string {
  return `~${hours}h`
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const remainder = minutes % 60
  return remainder === 0 ? `${hours}h` : `${hours}h ${remainder}m`
}

export function formatDifficulty(difficulty: Difficulty): string {
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
}

export function domainNumber(domainNumber: number): string {
  return String(domainNumber).padStart(2, '0')
}
