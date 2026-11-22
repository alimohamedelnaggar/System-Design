import { Check, Clipboard, Code2, TriangleAlert } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { CodeExample } from '../../../types/curriculum.ts'
import { tokenizeCode, type CodeToken, type CodeTokenKind } from './tokenize'

interface CodeBlockProps {
  example: CodeExample
}

const tokenClasses: Record<CodeTokenKind, string> = {
  plain: 'text-ink-muted',
  comment: 'italic text-ink-subtle',
  string: 'text-success',
  keyword: 'font-semibold text-brand-bright',
  number: 'text-warning',
  property: 'text-ink',
  function: 'text-[#9dc2ff]',
  variable: 'text-brand-bright',
  punctuation: 'text-ink-subtle',
}

function copyFallback(text: string): boolean {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  const copied = document.execCommand('copy')
  document.body.removeChild(textarea)
  return copied
}

export function CodeBlock({ example }: CodeBlockProps) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle')
  const timerRef = useRef<number | null>(null)
  const tokens = useMemo<CodeToken[]>(
    () => tokenizeCode(example.code, example.language),
    [example.code, example.language],
  )
  const sectionId = `code-${example.id}`

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    },
    [],
  )

  const scheduleReset = () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => setCopyState('idle'), 1800)
  }

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(example.code)
        setCopyState('copied')
      } else if (copyFallback(example.code)) {
        setCopyState('copied')
      } else {
        setCopyState('error')
      }
    } catch {
      setCopyState(copyFallback(example.code) ? 'copied' : 'error')
    }
    scheduleReset()
  }

  const copyLabel =
    copyState === 'copied'
      ? 'Copied'
      : copyState === 'error'
        ? 'Copy unavailable'
        : 'Copy code'

  return (
    <section
      id={sectionId}
      data-lesson-section
      className="card-shell min-w-0 scroll-mt-24 overflow-hidden"
      aria-labelledby={`${sectionId}-title`}
    >
      <div className="flex flex-wrap items-center gap-2 border-b border-line-soft px-4 py-3.5 sm:px-5">
        <Code2 className="size-4 shrink-0 text-brand-bright" aria-hidden="true" />
        <h2 id={`${sectionId}-title`} className="min-w-0 flex-1 text-base font-semibold text-ink">
          {example.title}
        </h2>
        <span className="rounded-pill border border-line bg-surface/70 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-subtle">
          {example.language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-line-soft px-3 text-xs font-semibold text-ink-muted transition-colors hover:border-brand/40 hover:text-ink"
          aria-label={`${copyLabel}: ${example.title}`}
        >
          {copyState === 'copied' ? (
            <Check className="size-3.5 text-success" aria-hidden="true" />
          ) : copyState === 'error' ? (
            <TriangleAlert className="size-3.5 text-warning" aria-hidden="true" />
          ) : (
            <Clipboard className="size-3.5" aria-hidden="true" />
          )}
          {copyLabel}
        </button>
      </div>

      <pre
        className="max-w-full overflow-x-auto bg-canvas/40 p-4 font-mono text-[13px] leading-relaxed sm:p-5 sm:text-sm"
        aria-label={`Code from ${example.title}`}
      >
        <code>
          {tokens.map((token, index) => (
            <span key={index} className={tokenClasses[token.kind]}>
              {token.value}
            </span>
          ))}
        </code>
      </pre>

      {example.explanation ? (
        <p className="border-t border-line-soft px-4 py-3.5 text-sm leading-relaxed text-ink-subtle sm:px-5">
          {example.explanation}
        </p>
      ) : null}
    </section>
  )
}
