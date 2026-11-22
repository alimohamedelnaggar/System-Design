import {
  CreditCard,
  MessageCircle,
  Rss,
  Search,
  ShoppingBag,
  Video,
  type LucideIcon,
} from 'lucide-react'
import type { ProjectIconKey } from '../../types/curriculum'

const icons: Record<ProjectIconKey, LucideIcon> = {
  chat: MessageCircle,
  commerce: ShoppingBag,
  feed: Rss,
  video: Video,
  payments: CreditCard,
  search: Search,
}

interface ProjectIconProps {
  icon: ProjectIconKey
  className?: string
}

export function ProjectIcon({ icon, className = '' }: ProjectIconProps) {
  const Icon = icons[icon]

  return (
    <span
      className={`grid size-10 shrink-0 place-items-center rounded-xl border border-brand/20 bg-brand/10 text-brand-bright ${className}`}
    >
      <Icon className="size-5" strokeWidth={1.8} aria-hidden="true" />
    </span>
  )
}
