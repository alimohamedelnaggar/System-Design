import type { CodeLanguage } from '../../../types/curriculum.ts'

export type CodeTokenKind =
  | 'plain'
  | 'comment'
  | 'string'
  | 'keyword'
  | 'number'
  | 'property'
  | 'function'
  | 'variable'
  | 'punctuation'

export interface CodeToken {
  value: string
  kind: CodeTokenKind
}

interface TokenRule {
  kind: CodeTokenKind
  source: string
}

const lineComment = '\\/\\/[^\\n]*'
const blockComment = '\\/\\*[\\s\\S]*?\\*\\/'
const doubleString = '"(?:\\\\.|[^"\\\\\\n])*"'
const singleString = "'(?:\\\\.|[^'\\\\\\n])*'"
const templateString = '`(?:\\\\.|[^`\\\\])*`'
const number = '-?\\b\\d+(?:\\.\\d+)?\\b'
const identifier = '[A-Za-z_$][\\w$]*'
const identifierTail = '[\\w$]*'

const rules: Record<CodeLanguage, TokenRule[]> = {
  text: [
    { kind: 'property', source: '^\\s*[A-Za-z][A-Za-z -]*(?=:)' },
    { kind: 'number', source: '\\b\\d+(?:\\.\\d+)?(?:%|ms)?\\b' },
    { kind: 'keyword', source: '\\b(?:must|latency|availability|region|team)\\b' },
  ],
  json: [
    { kind: 'property', source: `${doubleString}(?=\\s*:)` },
    { kind: 'string', source: doubleString },
    { kind: 'number', source: number },
    { kind: 'keyword', source: '\\b(?:true|false|null)\\b' },
    { kind: 'punctuation', source: '[{}[\\],:]' },
  ],
  typescript: [
    { kind: 'comment', source: `${blockComment}|${lineComment}` },
    { kind: 'string', source: `${templateString}|${doubleString}|${singleString}` },
    {
      kind: 'keyword',
      source:
        '\\b(?:const|let|var|function|return|if|else|for|while|class|interface|type|import|from|export|default|async|await|new|extends|implements|public|private|readonly|void|null|undefined|true|false)\\b',
    },
    { kind: 'number', source: number },
    { kind: 'function', source: `${identifier}(?=\\s*\\()` },
    { kind: 'variable', source: `\\b(?:this|super)\\b|\\$${identifierTail}` },
    { kind: 'punctuation', source: '[{}()\\[\\].,;:=<>+\\-*/?!&|]' },
  ],
  javascript: [
    { kind: 'comment', source: `${blockComment}|${lineComment}` },
    { kind: 'string', source: `${templateString}|${doubleString}|${singleString}` },
    {
      kind: 'keyword',
      source:
        '\\b(?:const|let|var|function|return|if|else|for|while|class|import|from|export|default|async|await|new|extends|null|undefined|true|false)\\b',
    },
    { kind: 'number', source: number },
    { kind: 'function', source: `${identifier}(?=\\s*\\()` },
    { kind: 'variable', source: `\\b(?:this|super)\\b|\\$${identifierTail}` },
    { kind: 'punctuation', source: '[{}()\\[\\].,;:=<>+\\-*/?!&|]' },
  ],
  sql: [
    { kind: 'comment', source: `--[^\\n]*|${blockComment}` },
    { kind: 'string', source: singleString },
    {
      kind: 'keyword',
      source:
        '\\b(?:select|from|where|group|by|order|limit|join|inner|left|right|on|as|and|or|not|insert|into|values|update|set|delete|create|table|index|primary|key|distinct|count|sum|avg)\\b',
    },
    { kind: 'number', source: number },
    { kind: 'punctuation', source: '[(),;*=<>]' },
  ],
  bash: [
    { kind: 'comment', source: '#[^\\n]*' },
    { kind: 'string', source: `${doubleString}|${singleString}` },
    { kind: 'variable', source: `\\$\\{?${identifierTail}\\}?` },
    { kind: 'keyword', source: '\\b(?:cd|echo|export|sudo|npm|npx|node|git|curl|mkdir|rm|cp|mv)\\b' },
    { kind: 'punctuation', source: '[|&;<>()=]' },
  ],
  yaml: [
    { kind: 'comment', source: '#[^\\n]*' },
    { kind: 'property', source: '^\\s*(?:-\\s*)?[\\w.-]+(?=\\s*:)' },
    { kind: 'string', source: `${doubleString}|${singleString}` },
    { kind: 'number', source: number },
    { kind: 'keyword', source: '\\b(?:true|false|null|yes|no)\\b' },
    { kind: 'punctuation', source: '[:\\-\\[\\]{},]' },
  ],
}

/** Lightweight, dependency-free tokenizer for the languages used by lessons. */
export function tokenizeCode(code: string, language: CodeLanguage): CodeToken[] {
  const languageRules = rules[language] ?? []
  if (languageRules.length === 0 || code.length === 0) {
    return code.length === 0 ? [] : [{ value: code, kind: 'plain' }]
  }

  const pattern = new RegExp(
    languageRules.map((rule, index) => `(?<g${index}>${rule.source})`).join('|'),
    'gmi',
  )
  const tokens: CodeToken[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(code)) !== null) {
    if (match[0].length === 0) {
      pattern.lastIndex += 1
      continue
    }

    if (match.index > lastIndex) {
      tokens.push({ value: code.slice(lastIndex, match.index), kind: 'plain' })
    }

    const groups = match.groups ?? {}
    const ruleIndex = languageRules.findIndex((_, index) => groups[`g${index}`] !== undefined)
    tokens.push({
      value: match[0],
      kind: languageRules[ruleIndex]?.kind ?? 'plain',
    })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < code.length) {
    tokens.push({ value: code.slice(lastIndex), kind: 'plain' })
  }

  return tokens
}
