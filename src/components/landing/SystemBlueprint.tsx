import { ArrowDown, ArrowRight, Database, Globe2, HardDrive, Radio, Server } from 'lucide-react'

const topRow = [
  { label: 'Client', detail: 'browser / mobile', icon: Globe2 },
  { label: 'Edge', detail: 'routing / TLS', icon: Server },
  { label: 'Service', detail: 'business logic', icon: Server },
]

const bottomRow = [
  { label: 'Cache', detail: 'hot reads', icon: HardDrive },
  { label: 'Database', detail: 'source of truth', icon: Database },
  { label: 'Queue', detail: 'async work', icon: Radio },
]

function BlueprintNode({
  label,
  detail,
  icon: Icon,
}: {
  label: string
  detail: string
  icon: typeof Server
}) {
  return (
    <div className="flex min-w-0 items-center gap-2 rounded-lg border border-line bg-surface/90 px-2.5 py-2 sm:gap-3 sm:px-3">
      <Icon className="size-4 shrink-0 text-brand-bright sm:size-5" strokeWidth={1.7} aria-hidden="true" />
      <div className="min-w-0">
        <p className="truncate font-mono text-[10px] font-semibold text-ink sm:text-xs">{label}</p>
        <p className="truncate text-[9px] text-ink-subtle sm:text-[10px]">{detail}</p>
      </div>
    </div>
  )
}

export function SystemBlueprint() {
  return (
    <div className="card-shell relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 blueprint-grid opacity-40" />
      <div className="relative flex items-center justify-between border-b border-line-soft px-4 py-3">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-2 rounded-full bg-line" />
          <span className="size-2 rounded-full bg-line" />
          <span className="size-2 rounded-full bg-brand/60" />
        </div>
        <span className="font-mono text-[10px] text-ink-subtle sm:text-xs">
          reference-architecture / v1
        </span>
      </div>

      <div className="relative px-3 py-6 sm:px-5 sm:py-8">
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          {topRow.map((node, index) => (
            <div key={node.label} className="flex min-w-0 items-center gap-1 sm:gap-2">
              <div className="min-w-0 flex-1">
                <BlueprintNode {...node} />
              </div>
              {index < topRow.length - 1 ? (
                <ArrowRight className="size-3 shrink-0 text-brand/60 sm:size-4" aria-hidden="true" />
              ) : null}
            </div>
          ))}
        </div>

        <div className="my-4 flex justify-center sm:my-6">
          <span className="flex flex-col items-center text-brand/60">
            <ArrowDown className="size-4" aria-hidden="true" />
            <span className="font-mono text-[9px] text-ink-subtle">fan out</span>
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          {bottomRow.map((node) => (
            <BlueprintNode key={node.label} {...node} />
          ))}
        </div>
      </div>

      <div className="relative border-t border-line-soft px-4 py-3 font-mono text-[10px] text-ink-subtle sm:text-xs">
        request → validate → serve → persist
      </div>
    </div>
  )
}
