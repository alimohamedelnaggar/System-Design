import type { ReactNode } from 'react'

type BadgeVariant = 'brand' | 'neutral' | 'success'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  dot?: boolean
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  brand: 'border-brand/25 bg-brand/10 text-brand-bright',
  neutral: 'border-line bg-surface-raised/70 text-ink-muted',
  success: 'border-success/25 bg-success/10 text-success',
}

export function Badge({ children, variant = 'neutral', dot = false, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-pill border px-3 py-1 text-xs font-semibold tracking-wide ${variants[variant]} ${className}`}
    >
      {dot ? <span className="size-1.5 rounded-full bg-current" aria-hidden="true" /> : null}
      {children}
    </span>
  )
}
