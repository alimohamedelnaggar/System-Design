interface ProseBodyProps {
  paragraphs: readonly string[]
  keyPoints?: readonly string[]
}

export function ProseBody({ paragraphs, keyPoints }: ProseBodyProps) {
  return (
    <>
      {paragraphs.length > 0 ? (
        <div className="space-y-4">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-[15px] leading-relaxed text-ink-muted">
              {paragraph}
            </p>
          ))}
        </div>
      ) : null}

      {keyPoints && keyPoints.length > 0 ? (
        <ul className="mt-5 space-y-2 border-l-2 border-brand/40 pl-4">
          {keyPoints.map((point) => (
            <li key={point} className="text-sm leading-snug text-ink">
              {point}
            </li>
          ))}
        </ul>
      ) : null}
    </>
  )
}
