import type { PositionedNode } from './layout'
import { getNodeKindStyle } from './palette'

interface DiagramNodeShapeProps {
  node: PositionedNode
  animated: boolean
  index: number
}

export function DiagramNodeShape({ node, animated, index }: DiagramNodeShapeProps) {
  const style = getNodeKindStyle(node.kind)
  const centerX = node.x + node.width / 2
  const labelSize = node.label.length > 22 ? 10.5 : 12.5

  return (
    <g
      className={animated ? 'diagram-node-reveal' : undefined}
      style={animated ? { animationDelay: `${index * 90}ms` } : undefined}
    >
      <rect
        x={node.x}
        y={node.y}
        width={node.width}
        height={node.height}
        rx={12}
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth={1.5}
      />
      <text
        x={centerX}
        y={node.y + 21}
        textAnchor="middle"
        fontSize={9}
        letterSpacing="1.1"
        fill={style.accent}
        fontFamily="var(--font-mono)"
      >
        {style.label.toUpperCase()}
      </text>
      <text
        x={centerX}
        y={node.y + 46}
        textAnchor="middle"
        fontSize={labelSize}
        fontWeight={600}
        fill={style.text}
        fontFamily="var(--font-sans)"
      >
        {node.label}
      </text>
    </g>
  )
}
