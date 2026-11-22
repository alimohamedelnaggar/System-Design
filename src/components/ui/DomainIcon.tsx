import type { DomainIconKey } from '../../types/curriculum'
import { domainIcons } from './domainIconMap'

interface DomainIconProps {
  icon: DomainIconKey
  className?: string
}

export function DomainIcon({ icon, className = '' }: DomainIconProps) {
  const Icon = domainIcons[icon]

  return (
    <span
      className={`grid size-10 shrink-0 place-items-center rounded-xl border border-brand/20 bg-brand/10 text-brand-bright ${className}`}
    >
      <Icon className="size-5" strokeWidth={1.8} aria-hidden="true" />
    </span>
  )
}
