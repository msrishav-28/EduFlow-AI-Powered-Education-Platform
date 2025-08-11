"use client"

import { AppShell } from '@/components/layout/app-shell'
import dynamic from 'next/dynamic'
const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false })
import { Suspense, useEffect, useState } from 'react'
import { aiGenerate } from '@/lib/api'
import { onAuthStateChanged } from 'firebase/auth'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { useSearchParams } from 'next/navigation'
import { useAIProvider } from '@/store/ai'

function CodeExplainerInner() {
  const [code, setCode] = useState('// Paste your code here\nfunction add(a,b){return a+b}')
  const [explain, setExplain] = useState('')
  const [loading, setLoading] = useState(false)
  const [uid, setUid] = useState<string | null>(null)
  const params = useSearchParams()
  const { provider, setProvider } = useAIProvider()
  // sync provider from query
  useEffect(() => {
    const p = params.get('p') as any
    if (p) setProvider(p)
  }, [params, setProvider])
  useEffect(()=>{ if(!auth) return; const unsub=onAuthStateChanged(auth,u=>setUid(u?.uid??null)); return ()=>unsub&&unsub() },[])
  const run = async () => {
    setLoading(true)
    try {
      const prompt = `Explain what this code does, point out any bugs, suggest improvements, and discuss time/space complexity if applicable.\n\n\`\`\`javascript\n${code}\n\`\`\``
      const out = await aiGenerate(prompt, provider)
      setExplain(out)
      if (uid && db) {
        const ref = collection(db as any, 'users', uid, 'sessions')
        addDoc(ref, { module: 'code-explainer', provider, contentChars: code.length, responseChars: out.length, createdAt: serverTimestamp() }).catch(()=>{})
      }
    } finally { setLoading(false) }
  }

  return (
    <>
      <h1 className="text-2xl font-semibold">Code Explainer</h1>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <Editor height="60vh" defaultLanguage="javascript" value={code} theme="vs-dark" onChange={(v) => setCode(v || '')} options={{ minimap: { enabled: false } }} />
        </div>
        <div className="glass rounded-2xl p-4 text-white/70 whitespace-pre-wrap">
          {explain || 'AI explanation will appear here based on your code.'}
        </div>
      </div>
      <button onClick={run} disabled={loading} className="mt-3 rounded-xl bg-primary-500 px-4 py-2 disabled:opacity-60">{loading?'Explaining…':'Explain code'}</button>
    </>
  )
}

export default function CodeExplainerPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="text-white/70">Loading…</div>}>
        <CodeExplainerInner />
      </Suspense>
    </AppShell>
  )
}
