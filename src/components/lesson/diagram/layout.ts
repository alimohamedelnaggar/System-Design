import type { Diagram, DiagramEdge, DiagramNode } from '../../../types/curriculum.ts'

export interface Point {
  x: number
  y: number
}

export interface PositionedNode extends DiagramNode {
  x: number
  y: number
  width: number
  height: number
}

export interface PositionedEdge {
  id: string
  label?: string
  sourceLabel: string
  targetLabel: string
  path: string
  labelX: number
  labelY: number
}

export interface DiagramGeometry {
  width: number
  height: number
  nodes: PositionedNode[]
  edges: PositionedEdge[]
}

function measureWidth(label: string, compact: boolean): number {
  const measured = Math.ceil(label.length * 7.4 + 38)
  return Math.min(compact ? 280 : 180, Math.max(compact ? 150 : 104, measured))
}

function placeNode(node: DiagramNode, x: number, y: number, compact: boolean): PositionedNode {
  return {
    ...node,
    x,
    y,
    width: measureWidth(node.label, compact),
    height: compact ? 66 : 72,
  }
}

/** Point on a node boundary facing `from`, held slightly clear of the box. */
function boundaryPoint(from: Point, node: PositionedNode): Point {
  const center = { x: node.x + node.width / 2, y: node.y + node.height / 2 }
  const dx = from.x - center.x
  const dy = from.y - center.y
  const halfWidth = node.width / 2
  const halfHeight = node.height / 2
  const scale = 1 / Math.max(Math.abs(dx) / halfWidth, Math.abs(dy) / halfHeight, 0.0001)

  return {
    x: center.x + dx * scale * 0.9,
    y: center.y + dy * scale * 0.9,
  }
}

function buildEdge(
  edge: DiagramEdge,
  nodes: readonly PositionedNode[],
): PositionedEdge | undefined {
  const source = nodes.find((node) => node.id === edge.source)
  const target = nodes.find((node) => node.id === edge.target)
  if (!source || !target) return undefined

  const sourceCenter = { x: source.x + source.width / 2, y: source.y + source.height / 2 }
  const targetCenter = { x: target.x + target.width / 2, y: target.y + target.height / 2 }
  const start = boundaryPoint(targetCenter, source)
  const end = boundaryPoint(sourceCenter, target)
  const dx = end.x - start.x
  const dy = end.y - start.y

  const path =
    Math.abs(dx) >= Math.abs(dy)
      ? `M ${start.x} ${start.y} C ${start.x + Math.max(24, Math.abs(dx) * 0.45)} ${start.y}, ${end.x - Math.max(24, Math.abs(dx) * 0.45)} ${end.y}, ${end.x} ${end.y}`
      : `M ${start.x} ${start.y} C ${start.x} ${start.y + Math.max(24, Math.abs(dy) * 0.45)}, ${end.x} ${end.y - Math.max(24, Math.abs(dy) * 0.45)}, ${end.x} ${end.y}`

  return {
    id: edge.id,
    label: edge.label,
    sourceLabel: source.label,
    targetLabel: target.label,
    path,
    labelX: (start.x + end.x) / 2,
    labelY: (start.y + end.y) / 2 - 7,
  }
}

function withEdges(
  width: number,
  height: number,
  nodes: PositionedNode[],
  edges: readonly DiagramEdge[],
): DiagramGeometry {
  return {
    width,
    height,
    nodes,
    edges: edges
      .map((edge) => buildEdge(edge, nodes))
      .filter((edge): edge is PositionedEdge => edge !== undefined),
  }
}

function horizontalFlow(diagram: Diagram): DiagramGeometry {
  const widths = diagram.nodes.map((node) => measureWidth(node.label, false))
  const gap = 66
  const contentWidth = widths.reduce((total, width) => total + width, 0) + gap * Math.max(0, diagram.nodes.length - 1)
  const width = Math.max(720, contentWidth + 96)
  let cursor = (width - contentWidth) / 2

  const nodes = diagram.nodes.map((node) => {
    const placed = placeNode(node, cursor, 84, false)
    cursor += placed.width + gap
    return placed
  })

  return withEdges(width, 228, nodes, diagram.edges)
}

function verticalStack(diagram: Diagram, compact: boolean): DiagramGeometry {
  const width = compact ? 360 : 430
  const height = compact ? 66 : 72
  const gap = compact ? 50 : 56
  const startY = 24
  const nodes = diagram.nodes.map((node, index) => {
    const widthForNode = measureWidth(node.label, compact)
    return placeNode(node, (width - widthForNode) / 2, startY + index * (height + gap), compact)
  })
  const totalHeight = startY + diagram.nodes.length * height + Math.max(0, diagram.nodes.length - 1) * gap + 24

  return withEdges(width, Math.max(200, totalHeight), nodes, diagram.edges)
}

function comparisonLayout(diagram: Diagram): DiagramGeometry {
  const width = 680
  const rowGap = 88
  const nodes = diagram.nodes.map((node, index) =>
    placeNode(node, index % 2 === 0 ? 56 : 384, 28 + Math.floor(index / 2) * rowGap, false),
  )
  const rows = Math.ceil(diagram.nodes.length / 2)
  return withEdges(width, Math.max(220, 28 + rows * rowGap), nodes, diagram.edges)
}

function radialLayout(diagram: Diagram): DiagramGeometry {
  const width = 720
  const height = 420
  const centerX = width / 2
  const centerY = height / 2
  const count = Math.max(1, diagram.nodes.length)

  const nodes = diagram.nodes.map((node, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / count
    const nodeWidth = measureWidth(node.label, false)
    const nodeHeight = 64
    return {
      ...node,
      x: centerX + Math.cos(angle) * 250 - nodeWidth / 2,
      y: centerY + Math.sin(angle) * 140 - nodeHeight / 2,
      width: nodeWidth,
      height: nodeHeight,
    }
  })

  return withEdges(width, height, nodes, diagram.edges)
}

/** Pure geometry: layout stays in the diagram engine, never in lesson code. */
export function layoutDiagram(diagram: Diagram, compact: boolean): DiagramGeometry {
  switch (diagram.layout) {
    case 'flow':
    case 'timeline':
      return compact ? verticalStack(diagram, true) : horizontalFlow(diagram)
    case 'layers':
      return verticalStack(diagram, compact)
    case 'comparison':
      return comparisonLayout(diagram)
    case 'topology':
      return radialLayout(diagram)
    default:
      return compact ? verticalStack(diagram, true) : horizontalFlow(diagram)
  }
}
