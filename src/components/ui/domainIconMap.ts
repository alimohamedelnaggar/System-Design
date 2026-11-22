import {
  Boxes,
  Database,
  Gauge,
  HardDrive,
  Network,
  Radio,
  Trophy,
  Workflow,
  type LucideIcon,
} from 'lucide-react'
import type { DomainIconKey } from '../../types/curriculum'

export const domainIcons: Record<DomainIconKey, LucideIcon> = {
  fundamentals: Boxes,
  network: Network,
  database: Database,
  caching: HardDrive,
  distributed: Workflow,
  scalability: Gauge,
  messaging: Radio,
  interviews: Trophy,
}

export function getDomainIcon(icon: DomainIconKey): LucideIcon {
  return domainIcons[icon]
}
