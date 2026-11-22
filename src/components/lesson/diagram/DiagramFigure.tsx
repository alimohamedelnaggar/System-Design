import { useId, useMemo, useRef } from 'react'
import type { Diagram } from '../../../types/curriculum.ts'
import { useElementWidth } from '../hooks/useElementWidth'
import { DiagramEdgePath } from './DiagramEdgePath'
import { DiagramLegend } from './DiagramLegend'
import { DiagramNodeShape } from './DiagramNodeShape'
import { layoutDiagram } from './layout'
import { getNodeKindStyle } from './palette'
import './diagram.css'

interface DiagramFigureProps {
  diagram: Diagram
}

export function DiagramFigure({ diagram }: DiagramFigureProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const containerWidth = useElementWidth(containerRef)
  const compact = containerWidth > 0 && containerWidth < 540
  const geometry = useMemo(() => layoutDiagram(diagram, compact), [diagram, compact])
  const rawId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const idPrefix = rawId || diagram.id
  const titleId = `${idPrefix}-title`
  const descriptionId = `${idPrefix}-description`
  const markerId = `${idPrefix}-arrow`
  const animated = diagram.animated === true

  const accessibleDescription = [
    diagram.description,
    `Components: ${geometry.nodes
      .map((node) => `${node.label} (${getNodeKindStyle(node.kind).label})`)
      .join('; ')}.`,
    `Connections: ${geometry.edges
      .map((edge) =>
        edge.label
          ? `${edge.sourceLabel} to ${edge.targetLabel}: ${edge.label}`
          : `${edge.sourceLabel} to ${edge.targetLabel}`,
      )
      .join('; ')}.`,
  ].join(' ')

  return (
    <figure className="min-w-0">
      <div
        ref={containerRef}
        className="min-w-0 overflow-hidden rounded-xl border border-line-soft bg-canvas/40 p-1.5 sm:p-3"
      >
        <svg
          viewBox={`0 0 ${geometry.width} ${geometry.height}`}
          preserveAspectRatio="xMidYMid meet"
          className="block h-auto max-w-full w-full"
          role="img"
          aria-labelledby={`${titleId} ${descriptionId}`}
        >
          <title id={titleId}>{diagram.title}</title>
          <desc id={descriptionId}>{accessibleDescription}</desc>
          <defs>
            <marker
              id={markerId}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#6ea8ff" />
            </marker>
          </defs>
          {geometry.edges.map((edge, index) => (
            <DiagramEdgePath
              key={edge.id}
              edge={edge}
              markerId={markerId}
              animated={animated}
              index={index}
            />
          ))}
          {geometry.nodes.map((node, index) => (
            <DiagramNodeShape key={node.id} node={node} animated={animated} index={index} />
          ))}
        </svg>
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-ink-muted">
        {diagram.description}
      </figcaption>
      <DiagramLegend diagram={diagram} />
    </figure>
  )
}
