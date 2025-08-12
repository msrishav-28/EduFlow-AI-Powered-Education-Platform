export type MCQ = {
  question: string
  options: { label: 'A'|'B'|'C'|'D'; text: string }[]
  correct: 'A'|'B'|'C'|'D'
  explanation?: string
}

export function parseMCQs(raw: string): MCQ[] | null {
  // Try JSON array detection
  try {
    const s = raw.indexOf('[')
    const e = raw.lastIndexOf(']')
    if (s !== -1 && e !== -1) {
      const json = JSON.parse(raw.slice(s, e + 1))
      const items: MCQ[] = json.map((q: any) => {
        const arr = (q.options ?? q.choices ?? []) as any[]
        const options = arr.map((t, i) => ({
          label: (['A','B','C','D'][i] as 'A'|'B'|'C'|'D'),
          text: typeof t === 'string' ? t : t?.text ?? String(t)
        }))
        const correct = (q.correct ?? q.answer ?? q.correctOption ?? '').toString().trim().toUpperCase()
        return {
          question: q.question ?? q.q ?? '',
          options,
          correct: (['A','B','C','D'].includes(correct) ? correct : 'A') as any,
          explanation: q.explanation ?? q.why ?? q.reason
        }
      })
      if (items.length) return items
    }
  } catch {}
  // Fallback: parse plain text blocks separated by blank lines
  const blocks = raw.split(/\n\s*\n/).filter(Boolean)
  const parsed: MCQ[] = []
  for (const b of blocks) {
    const lines = b.split(/\n/).filter(Boolean)
    if (lines.length < 3) continue
    const question = lines[0].replace(/^\d+\.?\s*/, '').trim()
    const options: MCQ['options'] = []
    const ansLine = lines.find(l => /^(answer|correct)\b/i.test(l))
    for (const l of lines.slice(1)) {
      if (l === ansLine) continue
      const m = l.match(/^([ABCD])\)?[\.:\-]?\s*(.*)$/i)
      if (m) options.push({ label: m[1].toUpperCase() as any, text: m[2].trim() })
    }
    const expLine = lines.find(l => /explanation/i.test(l))
  let correctMatch = ansLine?.match(/answer\s*[:\-]?\s*([ABCD])/i)
  if (!correctMatch) correctMatch = ansLine?.match(/([ABCD])/i)
    if (options.length) {
      parsed.push({
        question,
        options: options.slice(0,4),
        correct: (correctMatch?.[1]?.toUpperCase() as any) ?? 'A',
        explanation: expLine?.replace(/^[Ee]xplanation[:\-]\s*/, '')
      })
    }
  }
  return parsed.length ? parsed : null
}
