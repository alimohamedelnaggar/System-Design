import type { DiagramNodeKind } from '../../../types/curriculum.ts'

export interface NodeKindStyle {
  label: string
  fill: string
  stroke: string
  text: string
  accent: string
}

export const diagramKindStyles: Record<DiagramNodeKind, NodeKindStyle> = {
  client: {
    label: 'Client',
    fill: '#12233f',
    stroke: '#3b82f6',
    text: '#f1f6ff',
    accent: '#6ea8ff',
  },
  gateway: {
    label: 'Gateway',
    fill: '#1b1b3c',
    stroke: '#818cf8',
    text: '#f1f6ff',
    accent: '#a5b4fc',
  },
  service: {
    label: 'Service',
    fill: '#102a3c',
    stroke: '#22d3ee',
    text: '#f1f6ff',
    accent: '#67e8f9',
  },
  cache: {
    label: 'Cache',
    fill: '#2a2110',
    stroke: '#fbbf24',
    text: '#f1f6ff',
    accent: '#fcd34d',
  },
  database: {
    label: 'Database',
    fill: '#102d26',
    stroke: '#34d399',
    text: '#f1f6ff',
    accent: '#6ee7b7',
  },
  queue: {
    label: 'Queue',
    fill: '#2c1530',
    stroke: '#e879f9',
    text: '#f1f6ff',
    accent: '#f0abfc',
  },
  generic: {
    label: 'Component',
    fill: '#16233a',
    stroke: '#64748b',
    text: '#f1f6ff',
    accent: '#b3c1d6',
  },
}

export function getNodeKindStyle(kind: DiagramNodeKind): NodeKindStyle {
  return diagramKindStyles[kind] ?? diagramKindStyles.generic
}
