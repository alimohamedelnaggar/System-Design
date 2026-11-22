import {
  Background,
  BackgroundVariant,
  Position,
  ReactFlow,
  type Edge,
  type Node,
} from '@xyflow/react'
import { Database, Globe2, HardDrive, Radio, Server, type LucideIcon } from 'lucide-react'
import { useMemo } from 'react'

function makeNode(
  id: string,
  title: string,
  subtitle: string,
  icon: LucideIcon,
  position: { x: number; y: number },
): Node {
  return {
    id,
    position,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: {
      label: (
        <div className="flex min-w-32 items-center gap-2.5 sm:min-w-36">
          <span className="grid size-7 shrink-0 place-items-center rounded-lg border border-brand/25 bg-brand/10 text-brand-bright">
            <IconComponent icon={icon} />
          </span>
          <span className="min-w-0 text-left">
            <span className="block font-mono text-[11px] font-semibold leading-tight text-ink">
              {title}
            </span>
            <span className="block truncate text-[10px] leading-tight text-ink-subtle">
              {subtitle}
            </span>
          </span>
        </div>
      ),
    },
    style: {
      background: '#101a2b',
      border: '1px solid #22304a',
      borderRadius: 12,
      padding: '8px 10px',
      boxShadow: '0 14px 30px -24px rgba(0,0,0,0.9)',
      width: 'auto',
    },
  }
}

function IconComponent({ icon: Icon }: { icon: LucideIcon }) {
  return <Icon className="size-3.5" strokeWidth={1.9} aria-hidden="true" />
}

const edges: Edge[] = [
  { id: 'client-gateway', source: 'client', target: 'gateway' },
  { id: 'gateway-service', source: 'gateway', target: 'service' },
  { id: 'service-cache', source: 'service', target: 'cache' },
  { id: 'service-database', source: 'service', target: 'database' },
  { id: 'service-queue', source: 'service', target: 'queue' },
]

export function ArchitecturePreview() {
  const nodes = useMemo(
    () => [
      makeNode('client', 'Client', 'browser / app', Globe2, { x: 0, y: 95 }),
      makeNode('gateway', 'Gateway', 'auth / routing', Server, { x: 185, y: 95 }),
      makeNode('service', 'Service', 'core logic', Server, { x: 370, y: 95 }),
      makeNode('cache', 'Cache', 'hot reads', HardDrive, { x: 565, y: 0 }),
      makeNode('database', 'Database', 'durable state', Database, { x: 565, y: 95 }),
      makeNode('queue', 'Queue', 'async jobs', Radio, { x: 565, y: 190 }),
    ],
    [],
  )

  return (
    <figure className="card-shell overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-line-soft px-4 py-3">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-2 rounded-full bg-line" />
          <span className="size-2 rounded-full bg-line" />
          <span className="size-2 rounded-full bg-brand/60" />
        </div>
        <span className="font-mono text-[10px] text-ink-subtle sm:text-xs">
          interactive topology / preview
        </span>
      </div>

      <div
        className="h-[260px] w-full bg-canvas/50 sm:h-[330px]"
        role="img"
        aria-label="Client requests pass through an API gateway to a service, which reads from a cache, writes to a database, and publishes work to a queue."
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={{}}
          nodesDraggable={false}
          nodesConnectable={false}
          nodesFocusable={false}
          edgesFocusable={false}
          elementsSelectable={false}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          preventScrolling={false}
          fitView
          fitViewOptions={{ padding: 0.16 }}
          defaultEdgeOptions={{
            type: 'smoothstep',
            style: { stroke: '#3b82f6', strokeWidth: 1.4, opacity: 0.75 },
          }}
        >
          <Background variant={BackgroundVariant.Dots} gap={22} size={1} color="#22304a" />
        </ReactFlow>
      </div>

      <figcaption className="border-t border-line-soft px-4 py-3 text-xs text-ink-subtle">
        Reference topology · Preview
      </figcaption>
    </figure>
  )
}
