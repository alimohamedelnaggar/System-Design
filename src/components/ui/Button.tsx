import type { LucideIcon } from 'lucide-react'
import type { MouseEventHandler, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'md' | 'lg'

interface ButtonProps {
  to: string
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: LucideIcon
  className?: string
  onClick?: MouseEventHandler<HTMLAnchorElement>
}

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-deep text-white shadow-[0_12px_32px_-14px_rgba(59,130,246,0.9)] hover:bg-brand-hover',
  secondary:
    'border border-line bg-surface-raised/70 text-ink hover:border-brand/50 hover:bg-surface-hover',
  ghost: 'text-ink-muted hover:bg-surface-raised/70 hover:text-ink',
}

const sizes: Record<ButtonSize, string> = {
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-[15px]',
}

export function Button({
  to,
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className = '',
  onClick,
}: ButtonProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl font-semibold transition-colors duration-200 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
      {Icon ? <Icon className="size-4 shrink-0" strokeWidth={2} aria-hidden="true" /> : null}
    </Link>
  )
}
