"use client"

import { useState } from 'react'
import hljs from 'highlight.js'

export function CodeBlock({ code, lang = 'plaintext' }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false)
  const html = hljs.highlight(code, { language: lang, ignoreIllegals: true }).value
  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }
  return (
    <div className="relative">
      <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/70 p-4 text-sm" aria-label="Code block">
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
      <button onClick={copy} className="absolute right-2 top-2 rounded-lg bg-white/10 px-2 py-1 text-xs text-white hover:bg-white/20" aria-label="Copy code">
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  )
}
