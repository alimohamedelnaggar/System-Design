import { Network } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Logo() {
  return (
    <Link to="/" className="inline-flex shrink-0 items-center gap-3 rounded-xl">
      <span className="grid size-9 place-items-center rounded-xl border border-brand/30 bg-brand/10 text-brand-bright shadow-[inset_0_1px_0_rgb(255_255_255/8%)]">
        <Network className="size-5" strokeWidth={1.8} aria-hidden="true" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-semibold tracking-[-0.02em] text-ink">System Design</span>
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-brand-bright">
          Academy
        </span>
      </span>
    </Link>
  )
}
