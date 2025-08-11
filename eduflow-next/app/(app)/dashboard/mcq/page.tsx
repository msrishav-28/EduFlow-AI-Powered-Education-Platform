"use client"
import { AppShell } from '@/components/layout/app-shell'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { aiGenerate } from '@/lib/api'
import { useSearchParams } from 'next/navigation'
import { useAIProvider } from '@/store/ai'
import { onAuthStateChanged } from 'firebase/auth'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { parseMCQs, MCQ } from '@/lib/mcq'

// using shared MCQ type

function MCQInner() {
  const [text, setText] = useState('')
  const [out, setOut] = useState('')
  const [quiz, setQuiz] = useState<MCQ[] | null>(null)
  const [answers, setAnswers] = useState<Record<number, 'A'|'B'|'C'|'D'|null>>({})
  const [score, setScore] = useState<number | null>(null)
  const [uid, setUid] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const params = useSearchParams()
  const { provider, setProvider } = useAIProvider()
  useEffect(()=>{ const p=params.get('p') as any; if(p) setProvider(p) },[params,setProvider])
  useEffect(()=>{ if (!auth) return; const unsub=onAuthStateChanged(auth,u=>setUid(u?.uid??null)); return ()=>unsub&&unsub() },[])

  const parseToQuiz = (raw: string): MCQ[] | null => parseMCQs(raw)
  const generate = async () => {
    if (!text.trim()) return
    setLoading(true)
    try {
      const prompt = `Create 5 high-quality multiple-choice questions from the content below.
Return strictly as JSON array with this shape:
[
  {"question": string, "options": [string, string, string, string], "correct": "A"|"B"|"C"|"D", "explanation": string}
]
No markdown, no preface, only JSON.

Content:
${text}`
      const raw = await aiGenerate(prompt, provider)
      setOut(raw)
      const parsed = parseToQuiz(raw)
      setQuiz(parsed)
      setAnswers(parsed ? Object.fromEntries(parsed.map((_,i)=>[i,null])) as any : {})
    } finally { setLoading(false) }
  }
  const answeredCount = useMemo(()=>Object.values(answers).filter(v=>v!=null).length,[answers])
  const submit = () => {
    if (!quiz) return
    let s = 0
    quiz.forEach((q,i)=>{ if (answers[i] === q.correct) s += 1 })
    setScore(s)
    // Optional: log to Firestore under the user
    if (uid && db) {
      const ref = collection(db as any, 'users', uid, 'sessions')
      addDoc(ref, {
        module: 'mcq',
        total: quiz.length,
        correct: s,
        accuracy: Number((s / quiz.length).toFixed(3)),
        contentChars: text.length,
        provider,
        createdAt: serverTimestamp(),
      }).catch(()=>{})
    }
  }
  const reset = () => { setScore(null); setAnswers(quiz? Object.fromEntries(quiz.map((_,i)=>[i,null])) as any : {}) }
  return (
    <>
      <h1 className="text-2xl font-semibold">MCQ Generator</h1>
      <textarea value={text} onChange={(e)=>setText(e.target.value)} placeholder="Paste text here..." className="focus-ring mt-4 h-40 w-full rounded-xl border border-white/10 bg-white/5 p-3" />
      <div className="mt-3 flex gap-3">
        <button onClick={generate} disabled={loading} className="rounded-xl bg-primary-500 px-4 py-2 disabled:opacity-60">{loading?'Generating…':'Generate'}</button>
        {quiz && <button onClick={reset} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2">Reset Answers</button>}
      </div>
      {!quiz && (
        <div className="glass mt-4 rounded-2xl p-4 text-white/70 whitespace-pre-wrap">{out || 'Generated MCQs appear here.'}</div>
      )}
      {quiz && (
        <div className="mt-6 space-y-6">
          {quiz.map((q, idx) => (
            <div key={idx} className="glass rounded-2xl p-4">
              <div className="font-medium">Q{idx+1}. {q.question}</div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {q.options.map(opt => {
                  const selected = answers[idx] === opt.label
                  const isCorrect = score!=null && q.correct === opt.label
                  const isWrong = score!=null && selected && !isCorrect
                  return (
                    <button
                      key={opt.label}
                      onClick={()=> setAnswers(a=>({...a, [idx]: opt.label}))}
                      disabled={score!=null}
                      className={
                        'text-left rounded-xl border px-3 py-2 transition ' +
                        (selected ? 'border-primary-400 bg-primary-500/20 ' : 'border-white/10 bg-white/5 hover:bg-white/10 ') +
                        (isCorrect ? ' ring-1 ring-green-400' : '') +
                        (isWrong ? ' ring-1 ring-red-400' : '')
                      }
                    >
                      <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-md bg-white/10 text-sm">{opt.label}</span>
                      {opt.text}
                    </button>
                  )
                })}
              </div>
              {score!=null && (
                <div className="mt-3 text-sm text-white/70">
                  Correct answer: <span className="font-medium text-green-300">{q.correct}</span>
                  {q.explanation && <>
                    <span className="mx-2">•</span>
                    <span>{q.explanation}</span>
                  </>}
                </div>
              )}
            </div>
          ))}
          <div className="flex items-center justify-between">
            <div className="text-sm text-white/70">Answered {answeredCount} / {quiz.length}</div>
            {score==null ? (
              <button onClick={submit} disabled={answeredCount !== quiz.length} className="rounded-xl bg-emerald-500 px-4 py-2 disabled:opacity-60">Submit</button>
            ) : (
              <div className="text-lg">Score: <span className="font-semibold">{score} / {quiz.length}</span></div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default function MCQPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="text-white/70">Loading…</div>}>
        <MCQInner />
      </Suspense>
    </AppShell>
  )
}
