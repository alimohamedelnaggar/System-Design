import type { PositionedEdge } from './layout'

interface DiagramEdgePathProps {
  edge: PositionedEdge
  markerId: string
  animated: boolean
  index: number
}

export function DiagramEdgePath({ edge, markerId, animated, index }: DiagramEdgePathProps) {
  const labelWidth = edge.label ? Math.max(34, edge.label.length * 6 + 14) : 0

  return (
    <g
      className={animated ? 'diagram-edge-reveal' : undefined}
      style={animated ? { animationDelay: `${120 + index * 70}ms` } : undefined}
    >
      <path
        d={edge.path}
        fill="none"
        stroke="#6ea8ff"
        strokeWidth={1.6}
        strokeLinecap="round"
        markerEnd={`url(#${markerId})`}
      />
      {edge.label ? (
        <g>
          <rect
            x={edge.labelX - labelWidth / 2}
            y={edge.labelY - 12}
            width={labelWidth}
            height={18}
            rx={6}
            fill="#0b1220"
            stroke="#22304a"
            strokeWidth={1}
          />
          <text
            x={edge.labelX}
            y={edge.labelY + 0.5}
            textAnchor="middle"
            fontSize={9}
            fill="#b3c1d6"
            fontFamily="var(--font-mono)"
          >
            {edge.label}
          </text>
        </g>
      ) : null}
    </g>
  )
}
