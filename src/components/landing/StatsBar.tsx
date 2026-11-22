import { curriculumStats } from '../../data/curriculum'
import { Container } from '../ui/Container'

const stats = [
  { value: curriculumStats.domains, label: 'Learning domains', suffix: '' },
  { value: curriculumStats.modules, label: 'Planned modules', suffix: '' },
  { value: curriculumStats.hours, label: 'Hours of material', suffix: '+' },
  { value: curriculumStats.projects, label: 'Design projects', suffix: '' },
]

export function StatsBar() {
  return (
    <div className="border-b border-line-soft bg-surface/40">
      <Container className="grid grid-cols-2 gap-x-6 gap-y-8 py-10 sm:py-12 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="min-w-0">
            <p className="font-mono text-3xl font-semibold tabular-nums tracking-tight text-ink sm:text-4xl">
              {stat.value}
              <span className="text-brand-bright">{stat.suffix}</span>
            </p>
            <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-ink-subtle sm:text-sm sm:tracking-normal">
              {stat.label}
            </p>
          </div>
        ))}
      </Container>
    </div>
  )
}
