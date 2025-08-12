"use client"
import type { Metadata } from 'next'
import { moduleMeta } from '@/lib/seo'
export const metadata: Metadata = moduleMeta('Text Summarizer','Condense long passages into concise study summaries.') as any
import { AppShell } from '@/components/layout/app-shell'
import { Suspense, useEffect, useState } from 'react'
import { aiGenerate } from '@/lib/api'
import { onAuthStateChanged } from 'firebase/auth'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { useSearchParams } from 'next/navigation'
import { useAIProvider } from '@/store/ai'

function SummarizeInner() {
  const [text, setText] = useState('')
  const [out, setOut] = useState('')
  const [loading, setLoading] = useState(false)
  const [uid, setUid] = useState<string | null>(null)
  const params = useSearchParams()
  const { provider, setProvider } = useAIProvider()
  useEffect(()=>{ const p=params.get('p') as any; if(p) setProvider(p) },[params,setProvider])
  useEffect(()=>{ if(!auth) return; const unsub=onAuthStateChanged(auth,u=>setUid(u?.uid??null)); return ()=>unsub&&unsub() },[])
  const summarize = async () => {
    if (!text.trim()) return
    setLoading(true)
    try {
      const prompt = `Summarize the following text in 1-2 paragraphs focusing on key concepts and structure:\n\n${text}`
      const out = await aiGenerate(prompt, provider)
      setOut(out)
      if (uid && db) {
        const ref = collection(db as any, 'users', uid, 'sessions')
        addDoc(ref, { module: 'summarize', provider, contentChars: text.length, responseChars: out.length, createdAt: serverTimestamp() }).catch(()=>{})
      }
    } finally { setLoading(false) }
  }
  return (
    <>
      <h1 className="text-2xl font-semibold">Text Summarizer</h1>
      <textarea value={text} onChange={(e)=>setText(e.target.value)} placeholder="Paste text here..." className="focus-ring mt-4 h-40 w-full rounded-xl border border-white/10 bg-white/5 p-3" />
      <button onClick={summarize} disabled={loading} className="mt-3 rounded-xl bg-primary-500 px-4 py-2 disabled:opacity-60">{loading?'Summarizing…':'Summarize'}</button>
      <div className="glass mt-4 rounded-2xl p-4 text-white/70 whitespace-pre-wrap">{out || 'Summary appears here.'}</div>
    </>
  )
}

export default function SummarizePage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="text-white/70">Loading…</div>}>
        <SummarizeInner />
      </Suspense>
    </AppShell>
  )
}
