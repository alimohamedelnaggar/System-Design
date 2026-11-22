import type { Diagram } from '../../../types/curriculum.ts'
import { getNodeKindStyle } from './palette'

export function DiagramLegend({ diagram }: { diagram: Diagram }) {
  const kinds = [...new Set(diagram.nodes.map((node) => node.kind))]

  if (kinds.length === 0) return null

  return (
    <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-line-soft pt-4 text-[11px] text-ink-subtle">
      {kinds.map((kind) => {
        const style = getNodeKindStyle(kind)
        return (
          <li key={kind} className="inline-flex items-center gap-2">
            <span
              className="size-3 shrink-0 rounded-sm border"
              style={{ backgroundColor: style.fill, borderColor: style.stroke }}
              aria-hidden="true"
            />
            {style.label}
          </li>
        )
      })}
    </ul>
  )
}
