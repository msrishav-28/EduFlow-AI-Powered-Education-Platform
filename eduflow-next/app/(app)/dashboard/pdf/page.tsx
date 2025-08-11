"use client"

import { AppShell } from '@/components/layout/app-shell'
import { Suspense, useEffect, useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useSearchParams } from 'next/navigation'
import { useAIProvider } from '@/store/ai'
import { aiGenerate } from '@/lib/api'
import { parseMCQs, MCQ } from '@/lib/mcq'
import { onAuthStateChanged } from 'firebase/auth'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
let pdfjsLib: any
let mammothLib: any
if (typeof window !== 'undefined') {
  // dynamically import only in browser
  import('pdfjs-dist').then(mod => {
    pdfjsLib = mod as any
    // @ts-ignore
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
  }).catch(()=>{})
  import('mammoth').then(mod => { mammothLib = (mod as any).default ?? mod }).catch(()=>{})
}

// set worker src for pdfjs in browser
if (typeof window !== 'undefined') {
  // @ts-ignore
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
}

async function extractTextFromPDF(file: File): Promise<string> {
  if (!pdfjsLib) throw new Error('PDF parser not ready. Please try again in a moment.')
  const arrayBuf = await file.arrayBuffer()
  const typedarray = new Uint8Array(arrayBuf)
  const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise
  let text = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = (content.items as any[]).map((it:any)=>it.str).join(' ')
    text += pageText + '\n'
  }
  return text
}

async function extractTextFromDocx(file: File): Promise<string> {
  if (!mammothLib) throw new Error('DOCX parser not ready. Please try again in a moment.')
  const arrayBuffer = await file.arrayBuffer()
  const { value } = await mammothLib.extractRawText({ arrayBuffer })
  return value
}

function PDFInner() {
  const params = useSearchParams()
  const { provider, setProvider } = useAIProvider()
  useEffect(()=>{ const p=params.get('p') as any; if(p) setProvider(p) },[params,setProvider])

  const [fileName, setFileName] = useState<string>('')
  const [rawText, setRawText] = useState<string>('')
  const [notesShort, setNotesShort] = useState('')
  const [notesLong, setNotesLong] = useState('')
  const [mcqRaw, setMcqRaw] = useState('')
  const [quiz, setQuiz] = useState<MCQ[] | null>(null)
  const [answers, setAnswers] = useState<Record<number,'A'|'B'|'C'|'D'|null>>({})
  const [score, setScore] = useState<number | null>(null)
  // uid state already declared above; ensure only one instance
  const [loading, setLoading] = useState(false)
  const [uid, setUid] = useState<string | null>(null)
  useEffect(()=>{ if (!auth) return; const unsub=onAuthStateChanged(auth,u=>setUid(u?.uid??null)); return ()=>unsub&&unsub() },[])

  const onDrop = useCallback(async (accepted: File[]) => {
    const file = accepted[0]
    if (!file) return
    setFileName(file.name)
    setLoading(true)
    try {
      let text = ''
      if (file.type === 'application/pdf') text = await extractTextFromPDF(file)
      else if (file.name.toLowerCase().endsWith('.docx')) text = await extractTextFromDocx(file)
      else text = await file.text()
      setRawText(text)
    } finally { setLoading(false) }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false })

  const generateNotes = async () => {
    if (!rawText.trim()) return
    setLoading(true)
    try {
      const shortPrompt = `Create short, exam-ready notes (bulleted, concise) from this content.\n\n${rawText}`
      const longPrompt = `Create detailed, structured notes with headings, definitions, examples, and key formulas from this content.\n\n${rawText}`
      const [s, l] = await Promise.all([
        aiGenerate(shortPrompt, provider),
        aiGenerate(longPrompt, provider),
      ])
      setNotesShort(s)
      setNotesLong(l)
      if (uid && db) {
        const ref = collection(db as any, 'users', uid, 'sessions')
        addDoc(ref, { module: 'pdf-notes', provider, contentChars: rawText.length, shortLen: s.length, longLen: l.length, createdAt: serverTimestamp() }).catch(()=>{})
      }
    } finally { setLoading(false) }
  }

  const generateMCQ = async () => {
    if (!rawText.trim()) return
    setLoading(true)
    try {
      const prompt = `Create 5 high-quality multiple-choice questions from the content below.
Return strictly as JSON array with this shape:
[{"question": string, "options": [string, string, string, string], "correct": "A"|"B"|"C"|"D", "explanation": string}]
No markdown, no preface, only JSON.

Content:
${rawText}`
      const out = await aiGenerate(prompt, provider)
      setMcqRaw(out)
      const parsed = parseMCQs(out)
      setQuiz(parsed)
      setAnswers(parsed ? Object.fromEntries(parsed.map((_,i)=>[i,null])) as any : {})
    } finally { setLoading(false) }
  }

  const answeredCount = Object.values(answers).filter(v=>v!=null).length
  const submit = () => {
    if (!quiz) return
    let s = 0
    quiz.forEach((q,i)=>{ if (answers[i] === q.correct) s += 1 })
    setScore(s)
    if (uid && db) {
      const ref = collection(db as any, 'users', uid, 'sessions')
      addDoc(ref, {
        module: 'pdf-mcq',
        total: quiz.length,
        correct: s,
        accuracy: Number((s / quiz.length).toFixed(3)),
        contentChars: rawText.length,
        provider,
        createdAt: serverTimestamp(),
      }).catch(()=>{})
    }
  }
  const reset = () => { setScore(null); setAnswers(quiz? Object.fromEntries(quiz.map((_,i)=>[i,null])) as any : {}) }

  return (
    <>
      <h1 className="text-2xl font-semibold">PDF → Study Materials</h1>
      <div {...getRootProps()} className="mt-4 flex h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/5">
        <input {...getInputProps()} />
        <p className="text-white/70">{isDragActive ? 'Drop file here…' : 'Drag & drop a PDF or DOCX here, or click to upload'}</p>
      </div>
      {fileName && <p className="mt-2 text-sm text-white/60">Selected: {fileName}</p>}

      {rawText && (
        <div className="mt-4 grid gap-4">
          <div className="flex gap-2">
            <button onClick={generateNotes} disabled={loading} className="rounded-xl bg-primary-500 px-4 py-2 disabled:opacity-60">{loading?'Generating…':'Generate Notes'}</button>
            <button onClick={generateMCQ} disabled={loading} className="rounded-xl bg-primary-500 px-4 py-2 disabled:opacity-60">{loading?'Generating…':'Generate MCQs'}</button>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="glass rounded-2xl p-4">
              <h3 className="font-medium">Short Notes</h3>
              <div className="mt-2 whitespace-pre-wrap text-white/70">{notesShort || '—'}</div>
            </div>
            <div className="glass rounded-2xl p-4">
              <h3 className="font-medium">Long Notes</h3>
              <div className="mt-2 whitespace-pre-wrap text-white/70">{notesLong || '—'}</div>
            </div>
          </div>
          <div className="glass rounded-2xl p-4">
            <h3 className="font-medium">MCQs</h3>
            {!quiz && (
              <div className="mt-2 whitespace-pre-wrap text-white/70">{mcqRaw || '—'}</div>
            )}
            {quiz && (
              <div className="mt-4 space-y-6">
                {quiz.map((q, idx) => (
                  <div key={idx}>
                    <div className="font-medium">Q{idx+1}. {q.question}</div>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {q.options.map(opt => {
                        const selected = answers[idx] === opt.label
                        const isCorrect = score!=null && q.correct === opt.label
                        const isWrong = score!=null && selected && !isCorrect
                        return (
                          <button key={opt.label} onClick={()=> setAnswers(a=>({...a, [idx]: opt.label}))} disabled={score!=null}
                            className={'text-left rounded-xl border px-3 py-2 transition ' +
                              (selected ? 'border-primary-400 bg-primary-500/20 ' : 'border-white/10 bg-white/5 hover:bg-white/10 ') +
                              (isCorrect ? ' ring-1 ring-green-400' : '') +
                              (isWrong ? ' ring-1 ring-red-400' : '')}
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
                {quiz && <button onClick={reset} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2">Reset Answers</button>}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default function PDFConverterPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="text-white/70">Loading…</div>}>
        <PDFInner />
      </Suspense>
    </AppShell>
  )
}
