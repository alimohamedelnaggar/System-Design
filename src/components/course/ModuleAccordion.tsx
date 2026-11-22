import { getLessonsByModule } from '../../data/curriculum/index.ts'
import type { Domain } from '../../types/curriculum.ts'
import { ModuleCard } from './ModuleCard'
import type { LessonProgressInput } from './status'

interface ModuleAccordionProps {
  domain: Domain
  progress?: LessonProgressInput
}

export function ModuleAccordion({ domain, progress }: ModuleAccordionProps) {
  return (
    <div className="space-y-3">
      {domain.modules.map((module) => (
        <ModuleCard
          key={module.id}
          module={module}
          lessons={getLessonsByModule(module.id)}
          defaultOpen
          progress={progress}
        />
      ))}
    </div>
  )
}
