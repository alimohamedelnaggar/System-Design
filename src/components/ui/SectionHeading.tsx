import type { ReactNode } from 'react'

interface SectionHeadingProps {
  eyebrow: string
  title: ReactNode
  description?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className = '',
}: SectionHeadingProps) {
  const alignment = align === 'center' ? 'mx-auto text-center items-center' : 'items-start'

  return (
    <div className={`flex flex-col gap-4 ${alignment} ${className}`}>
      <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-brand-bright">
        {eyebrow}
      </span>
      <h2 className="text-3xl font-semibold leading-tight tracking-[-0.03em] text-ink sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-base leading-relaxed text-ink-muted">{description}</p>
      ) : null}
    </div>
  )
}
