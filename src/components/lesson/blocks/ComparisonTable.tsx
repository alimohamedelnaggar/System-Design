import { Columns3 } from 'lucide-react'
import type { Comparison } from '../../../types/curriculum.ts'
import { LessonSectionFrame } from './LessonSectionFrame'

export function ComparisonTable({ comparison }: { comparison: Comparison }) {
  return (
    <LessonSectionFrame
      id={`comparison-${comparison.id}`}
      title={comparison.title}
      eyebrow="Comparison"
      icon={Columns3}
    >
      <p className="text-sm leading-relaxed text-ink-muted">{comparison.summary}</p>
      <div className="mt-4 max-w-full overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="py-3 pr-4 font-medium text-ink-subtle">
                Criterion
              </th>
              {comparison.columns.map((column) => (
                <th key={column.id} scope="col" className="py-3 pr-4 font-semibold text-ink">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparison.rows.map((row) => (
              <tr key={row.id} className="border-b border-line-soft last:border-0">
                <th scope="row" className="py-3 pr-4 font-medium text-ink">
                  {row.criterion}
                </th>
                {comparison.columns.map((column) => (
                  <td key={column.id} className="py-3 pr-4 leading-snug text-ink-muted">
                    {row.values[column.id]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </LessonSectionFrame>
  )
}
