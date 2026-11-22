/**
 * Canonical curriculum blueprint.
 *
 * This is the single source of truth for the approved shape of the curriculum:
 * eight domains and the exact number of approved modules in each domain.
 * Content seeds, validation and tests all derive their expectations from here
 * so a future count change cannot silently drift out of sync.
 */

export const BLUEPRINT_DOMAIN_COUNT = 8 as const

export const BLUEPRINT_MODULE_COUNTS = [7, 7, 8, 7, 8, 8, 9, 13] as const

export const BLUEPRINT_TOTAL_MODULES = 67 as const

export const BLUEPRINT_PUBLISHED_LESSONS = 3 as const

export const BLUEPRINT_PLANNED_LESSONS = 64 as const

export type BlueprintDomainNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

/** Returns the approved module count for a one-based domain number. */
export function getBlueprintModuleCount(domainNumber: number): number | undefined {
  return BLUEPRINT_MODULE_COUNTS[domainNumber - 1]
}

/** True when every domain has exactly its approved number of modules. */
export function matchesBlueprint(moduleCountsByDomain: readonly number[]): boolean {
  return (
    moduleCountsByDomain.length === BLUEPRINT_DOMAIN_COUNT &&
    BLUEPRINT_MODULE_COUNTS.every((expected, index) => moduleCountsByDomain[index] === expected)
  )
}
