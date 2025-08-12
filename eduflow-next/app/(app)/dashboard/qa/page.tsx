"use client"
import type { Metadata } from 'next'
import { moduleMeta } from '@/lib/seo'
export const metadata: Metadata = moduleMeta('Question Answering','Ask academic questions and get concise AI answers.') as any
import { AppShell } from '@/components/layout/app-shell'
import { Suspense, useEffect, useState } from 'react'
import { aiGenerate } from '@/lib/api'
import { onAuthStateChanged } from 'firebase/auth'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { useSearchParams } from 'next/navigation'
import { useAIProvider } from '@/store/ai'

function QAInner() {
  const [q, setQ] = useState('')
  const [a, setA] = useState('')
  const [loading, setLoading] = useState(false)
  const [uid, setUid] = useState<string | null>(null)
  const params = useSearchParams()
  const { provider, setProvider } = useAIProvider()
  useEffect(()=>{ const p=params.get('p') as any; if(p) setProvider(p) },[params,setProvider])
  useEffect(()=>{ if(!auth) return; const unsub=onAuthStateChanged(auth,u=>setUid(u?.uid??null)); return ()=>unsub&&unsub() },[])
  const ask = async () => {
    if (!q.trim()) return
    setLoading(true)
    try {
      const prompt = `Answer the question concisely and cite sources where relevant.\n\nQuestion: ${q}`
      const ans = await aiGenerate(prompt, provider)
      setA(ans)
      if (uid && db) {
        const ref = collection(db as any, 'users', uid, 'sessions')
        addDoc(ref, { module: 'qa', provider, promptChars: q.length, responseChars: ans.length, createdAt: serverTimestamp() }).catch(()=>{})
      }
    } finally { setLoading(false) }
  }
  return (
    <>
      <h1 className="text-2xl font-semibold">Question Answering</h1>
      <div className="mt-4 grid gap-3">
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Ask your question..." className="focus-ring rounded-xl border border-white/10 bg-white/5 px-3 py-2" />
        <button onClick={ask} disabled={loading} className="w-fit rounded-xl bg-primary-500 px-4 py-2 disabled:opacity-60">{loading?'Asking…':'Ask'}</button>
        <div className="glass rounded-2xl p-4 text-white/70 whitespace-pre-wrap">{a || 'Results appear here.'}</div>
      </div>
    </>
  )
}

export default function QAPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="text-white/70">Loading…</div>}>
        <QAInner />
      </Suspense>
    </AppShell>
  )
}
