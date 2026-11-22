import { useId } from 'react'
import type { DiagramNodeKind } from '../../types/curriculum.ts'
import type {
  SimulationConnectionView,
  SimulationNodeStatus,
  SimulationNodeView,
  SimulationVisualState,
} from '../../features/simulations/types.ts'
import { getNodeKindStyle } from '../lesson/diagram/palette.ts'
import './simulation.css'

const NODE_WIDTH = 190
const NODE_HEIGHT = 78

interface PositionedNode {
  node: SimulationNodeView
  x: number
  y: number
}

interface Geometry {
  width: number
  height: number
  nodes: PositionedNode[]
}

function toDiagramKind(kind: SimulationNodeView['kind']): DiagramNodeKind {
  switch (kind) {
    case 'client':
      return 'client'
    case 'load-balancer':
      return 'gateway'
    case 'cache':
      return 'cache'
    case 'database':
      return 'database'
    case 'queue':
      return 'queue'
    case 'server':
    case 'service':
      return 'service'
    default:
      return 'generic'
  }
}

const statusStroke: Record<SimulationNodeStatus, string> = {
  idle: '#3b4a66',
  active: '#6ea8ff',
  success: '#34d399',
  error: '#fb7185',
  disabled: '#475569',
}

function layout(visual: SimulationVisualState): Geometry {
  if (visual.layout === 'hub') {
    const servers = visual.nodes.filter((node) => node.kind === 'server')
    const client = visual.nodes.find((node) => node.kind === 'client')
    const balancer = visual.nodes.find((node) => node.kind === 'load-balancer')
    const height = Math.max(280, 70 + servers.length * 108)
    const middle = height / 2 - NODE_HEIGHT / 2
    const nodes: PositionedNode[] = []
    if (client) nodes.push({ node: client, x: 24, y: middle })
    if (balancer) nodes.push({ node: balancer, x: 286, y: middle })
    servers.forEach((server, index) => nodes.push({ node: server, x: 560, y: 34 + index * 108 }))
    return { width: 800, height, nodes }
  }

  if (visual.layout === 'triangle') {
    const positions: Record<string, { x: number; y: number }> = {
      client: { x: 24, y: 150 },
      cache: { x: 312, y: 44 },
      database: { x: 616, y: 150 },
    }
    return {
      width: 850,
      height: 340,
      nodes: visual.nodes.map((node, index) => ({
        node,
        ...(positions[node.kind] ?? { x: 24 + index * 270, y: 150 }),
      })),
    }
  }

  const width = Math.max(620, 40 + visual.nodes.length * (NODE_WIDTH + 80))
  return {
    width,
    height: 240,
    nodes: visual.nodes.map((node, index) => ({
      node,
      x: 40 + index * (NODE_WIDTH + 80),
      y: 88,
    })),
  }
}

function edgePath(
  connection: SimulationConnectionView,
  positions: Map<string, PositionedNode>,
  offset: number,
): string | null {
  const source = positions.get(connection.source)
  const target = positions.get(connection.target)
  if (!source || !target) return null

  if (target.x >= source.x) {
    const startX = source.x + NODE_WIDTH
    const endX = target.x
    const startY = source.y + NODE_HEIGHT / 2 + offset
    const endY = target.y + NODE_HEIGHT / 2 + offset
    const curve = Math.max(28, (endX - startX) / 2)
    return `M ${startX} ${startY} C ${startX + curve} ${startY}, ${endX - curve} ${endY}, ${endX} ${endY}`
  }

  const startX = source.x
  const endX = target.x + NODE_WIDTH
  const startY = source.y + NODE_HEIGHT / 2 + offset
  const endY = target.y + NODE_HEIGHT / 2 + offset
  const curve = Math.max(30, (startX - endX) / 2)
  return `M ${startX} ${startY} C ${startX - curve} ${startY}, ${endX + curve} ${endY}, ${endX} ${endY}`
}

export function SimulationCanvas({ visual }: { visual: SimulationVisualState }) {
  const rawId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const idPrefix = rawId || 'simulation-canvas'
  const geometry = layout(visual)
  const positions = new Map(geometry.nodes.map((position) => [position.node.id, position]))

  return (
    <section
      aria-labelledby={`${idPrefix}-heading`}
      className="card-shell min-w-0 overflow-hidden p-3 sm:p-5"
      data-simulation-canvas
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id={`${idPrefix}-heading`} className="text-sm font-semibold text-ink">
          Architecture view
        </h2>
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-subtle">
          {visual.nodes.length} components · {visual.connections.length} links
        </span>
      </div>

      <svg
        className="mt-3 h-auto w-full min-w-0"
        viewBox={`0 0 ${geometry.width} ${geometry.height}`}
        role="img"
        aria-labelledby={`${idPrefix}-title`}
        aria-describedby={`${idPrefix}-description`}
      >
        <title id={`${idPrefix}-title`}>{visual.summary}</title>
        <desc id={`${idPrefix}-description`}>
          Diagram showing {visual.nodes.map((node) => node.label).join(', ')} and their connections.
        </desc>
        <defs>
          <marker
            id={`${idPrefix}-arrow`}
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#6ea8ff" />
          </marker>
        </defs>

        {visual.connections.map((connection, index) => {
          const offset = visual.connections.length > 2 ? 0 : index === 0 ? -14 : 14
          const path = edgePath(connection, positions, offset)
          if (!path) return null
          return (
            <g key={connection.id}>
              <path
                d={path}
                fill="none"
                stroke={connection.status === 'error' ? '#fb7185' : connection.status === 'active' ? '#6ea8ff' : '#32415d'}
                strokeWidth={connection.status === 'active' ? 2.4 : 1.5}
                strokeLinecap="round"
                className={connection.status === 'active' ? 'simulation-flow' : undefined}
                markerEnd={`url(#${idPrefix}-arrow)`}
              />
              {connection.label ? (
                <text
                  x={connection.source === 'server' ? geometry.width - 70 : geometry.width / 2}
                  y={connection.status === 'active' ? 22 : geometry.height - 12}
                  textAnchor="middle"
                  fontSize="10"
                  fontFamily="var(--font-mono)"
                  fill="#90a2bf"
                >
                  {connection.label}
                </text>
              ) : null}
            </g>
          )
        })}

        {geometry.nodes.map(({ node, x, y }) => {
          const style = getNodeKindStyle(toDiagramKind(node.kind))
          const stroke = statusStroke[node.status]
          return (
            <g key={node.id}>
              <rect
                className={`simulation-node-rect ${node.status === 'active' ? 'simulation-node-pulse' : ''}`}
                x={x}
                y={y}
                width={NODE_WIDTH}
                height={NODE_HEIGHT}
                rx="12"
                fill={style.fill}
                stroke={stroke}
                strokeWidth={node.status === 'idle' ? 1.4 : 2.2}
              />
              <text
                x={x + 14}
                y={y + 20}
                fontSize="9"
                letterSpacing="1.1"
                fontFamily="var(--font-mono)"
                fill={style.accent}
              >
                {style.label.toUpperCase()}
              </text>
              <text x={x + 14} y={y + 41} fontSize="14" fontWeight="600" fill={style.text}>
                {node.label}
              </text>
              <text x={x + 14} y={y + 59} fontSize="10" fill="#90a2bf">
                {node.detail ?? node.status}
              </text>
              {node.value ? (
                <text
                  x={x + NODE_WIDTH - 12}
                  y={y + 20}
                  textAnchor="end"
                  fontSize="9"
                  fontFamily="var(--font-mono)"
                  fill={stroke}
                >
                  {node.value}
                </text>
              ) : null}
            </g>
          )
        })}
      </svg>

      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{visual.summary}</p>
    </section>
  )
}
