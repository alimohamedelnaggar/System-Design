# System Design Academy

A production-quality foundation for a structured system design learning platform. The curriculum, lesson engine, quiz engine, and local learning-progress tracking are built on a strongly typed data architecture. No backend, authentication, or external persistence service is used.

## Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- React Router 7
- Framer Motion
- Lucide React
- React Flow (`@xyflow/react`)

## Getting started

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run build           # typecheck + production build
npm run typecheck       # TypeScript only
npm run lint            # oxlint
npm run test:curriculum # curriculum lookup + validation tests (Node test runner)
npm run test:quiz       # quiz structure, engine, session and saving tests
npm run test:progress   # progress storage, service and selector tests
npm run test:simulations # engine, scheduler, three simulations and registry tests
npm test                # all four test suites
npm run preview         # serve the production build
```

## Routes

| Route | Status |
| --- | --- |
| `/` | Complete landing page (unchanged) |
| `/roadmap` | Complete roadmap with all eight domains |
| `/course` | Complete course overview with all 8 domains and 67 modules |
| `/domain/:slug` | Domain detail with ordered modules, lessons and availability |
| `/lesson/:slug` | Published lesson study view or clear planned-lesson notice |
| `/progress` | Local progress dashboard with overall, domain, activity and quiz metrics |
| `/simulations` | Discovery page for the three runnable simulation demonstrations |
| `/simulations/:slug` | Interactive simulation experience; unknown slugs show the 404 page |
| `/projects`, `/interviews`, `/playground` | Consistent placeholders |
| `*` | 404 page |

## Structure

```text
src/
  components/
    course/            CourseHeader, DomainCard, DomainHeader, ModuleCard,
                       ModuleAccordion, LessonListItem, LessonStatusBadge,
                       CourseBreadcrumbs, CourseSidebar
    lesson/            LessonLayout, LessonBody, diagram engine, code blocks,
                       table of contents, reading progress, completion and navigation
    quiz/              QuizExperience, question card, result screen and review list
    simulations/       Page layout, header, controls, canvas, config panel,
                       metrics, event log, legend and status components
    features/
      quiz/            Pure quiz validation, scoring, session reducer and canonical quiz lookup
      progress/        Typed LocalStorage adapter, service, selectors, provider and hook
      simulations/     Pure engine, scheduler, validation, registry, useSimulation hook,
                       shared model helpers and three representative simulations
    landing, layout, navigation, roadmap and shared UI
  data/
    curriculum.ts      Legacy UI adapter (derives the old shapes; no duplicated data)
    curriculum/
      blueprint.ts       Canonical 8-domain / 67-module blueprint and lesson-status counts
      domains.ts         8 domain metadata records + modules + lesson counts
      modules.ts         67 approved module definitions
      lessons.ts         Lesson metadata (one per module topic)
      lessonContent.ts   Sections, code examples, comparisons, challenges, summaries
      quizzes.ts         Quiz data
      quizStandards.ts   Sample and final quiz structural standards
      diagrams.ts        Diagram configurations
      journey.ts         UI-facing phase grouping
      lookup.ts          Centralized lookup functions
      validation.ts      Curriculum integrity checks
      index.ts           Canonical public API
    navigation.ts, projects.ts, features.ts
  hooks/               Document title and route focus/scroll handling
  pages/               Route components
  styles/              Tailwind entry, design tokens, base styles
  types/
    curriculum.ts      Phase 1 UI types + Task 02.1 hierarchy interfaces
scripts/
  test-curriculum.ts   Lookup and validation tests
  test-quiz.ts         Quiz engine, session, result and saving tests
  test-progress.ts     Progress storage, service and selector tests
  test-simulations.ts  Engine, scheduler, simulation and registry tests
```

## Curriculum API

Import from `src/data/curriculum/index.ts` in new code:

- `getAllDomains()`, `getDomainBySlug()`, `getDomainById()`, `getModuleBySlug()`, `getModuleById()`, `getLessonBySlug()`, `getLessonById()`, `getQuizById()`, `getLessonForQuiz()`
- `getLessonsByModule()`, `getNextLesson()`, `getPreviousLesson()`, `getDomainProgress()`
- `getLessonContent()` resolves the separated content stores into one lesson object
- `validateCurriculum()` / `assertValidCurriculum()` check ids, slugs, references, ordering and required metadata

The existing `src/data/curriculum.ts` facade continues to expose the Phase 1 shapes used by the roadmap UI. All of its values are derived from the canonical data, so curriculum metadata exists in exactly one place.

## Current phase notes

- The approved blueprint is encoded in `src/data/curriculum/blueprint.ts`: 8 domains with module counts `7, 7, 8, 7, 8, 8, 9, 13` (67 modules total). All 67 modules and their matching lesson metadata records are present.
- Only Domain 01 / Module 1.1 (`what-is-system-design`) has full content and remains the single `published` lesson. The other 66 lessons are `planned` metadata with no generated educational content.
- Quizzes are structurally validated by their declared standard. The sample quiz uses the `sample` standard (2 questions × 3 options); the `final` standard (5 questions × 4 options) is defined in `quizStandards.ts` for future educational lessons.
- Course and domain browsing is complete and reads only from `src/data/curriculum/index.ts`. Planned lessons are clearly marked and never render as empty study pages; direct URLs show an availability notice with module navigation.
- Progress is derived from typed lesson and quiz records. The `/progress` dashboard calculates overall and per-domain completion from canonical curriculum data, with all 67 lessons used as the overall denominator. Only published lessons can create progress records.
- Progress is stored in LocalStorage under `sda.learning-progress` with schema version `1`. Storage access is centralized in `src/features/progress/storage.ts`; corrupted data, missing data, and unavailable storage fall back safely. The reset action requires confirmation and removes local data only.
- The quiz engine validates canonical quiz structure, supports single-choice questions with navigation and clearing, scores and reviews after submission only, and uses `passThreshold` from quiz metadata with a centralized `0.7` fallback. Passing a quiz does not complete a lesson.
- The lesson engine renders published lessons in a three-column reading layout with a derived table of contents, active-section tracking, reading progress, an explicit completion control and an interactive knowledge check. Diagram, code, navigation and content renderers are separate reusable modules under `src/components/lesson/`.
- The simulation engine is data-driven and deterministic: definitions own runtime rules, a pure reducer owns lifecycle, a separate scheduler owns wall-clock timing, and React uses `useSimulation()` for cleanup-safe scheduling. Speed changes scheduling only, never calculations.
- Three demonstrations are registered: client–server request flow, load balancer algorithms (Round Robin and Least Connections with unavailable-backend exclusion), and cache strategies (hits, misses, database fallback, TTL expiry, invalidation). They are engine demos, not curriculum lessons.
- Simulations do not persist progress, do not change lesson completion, and are not added to the curriculum blueprint. The SVG visualization layer is derived from simulation state; business outcomes never happen in components.
- Course statistics are derived from curriculum metadata, not fabricated usage numbers.
- The React Flow diagram on the landing page remains a static preview of the future playground.
