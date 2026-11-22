const items = [
  { label: 'Idle', description: 'Waiting', dot: 'bg-slate-500' },
  { label: 'Active', description: 'Handling work', dot: 'bg-brand-bright' },
  { label: 'Success', description: 'Completed work', dot: 'bg-success' },
  { label: 'Error', description: 'Failed or unavailable', dot: 'bg-red-400' },
  { label: 'Flow', description: 'Animated data movement', dot: 'bg-cyan-400' },
]

export function SimulationLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2" aria-label="Diagram legend">
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-2 text-xs text-ink-subtle">
          <span className={`size-2 rounded-full ${item.dot}`} aria-hidden="true" />
          <span className="font-medium text-ink-muted">{item.label}</span>
          <span className="sr-only">: {item.description}</span>
        </span>
      ))}
    </div>
  )
}
