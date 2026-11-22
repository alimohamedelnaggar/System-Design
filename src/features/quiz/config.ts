/**
 * Central quiz defaults. Quiz metadata wins whenever it provides a valid
 * threshold; this value is only a fallback for future quizzes that omit one.
 */
export const DEFAULT_QUIZ_PASS_THRESHOLD = 0.7

export function normalizePassThreshold(value: number | undefined | null): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return DEFAULT_QUIZ_PASS_THRESHOLD
  }
  return Math.min(1, Math.max(0, value))
}
