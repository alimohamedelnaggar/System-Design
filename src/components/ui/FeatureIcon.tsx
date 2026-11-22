import { GitCompareArrows, Map, MessagesSquare, type LucideIcon } from 'lucide-react'
import type { FeatureIconKey } from '../../types/curriculum'

const icons: Record<FeatureIconKey, LucideIcon> = {
  map: Map,
  compare: GitCompareArrows,
  rehearse: MessagesSquare,
}

interface FeatureIconProps {
  icon: FeatureIconKey
  className?: string
}

export function FeatureIcon({ icon, className = '' }: FeatureIconProps) {
  const Icon = icons[icon]

  return (
    <span
      className={`grid size-10 shrink-0 place-items-center rounded-xl border border-brand/20 bg-brand/10 text-brand-bright ${className}`}
    >
      <Icon className="size-5" strokeWidth={1.8} aria-hidden="true" />
    </span>
  )
}
