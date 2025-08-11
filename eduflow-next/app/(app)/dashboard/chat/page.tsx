"use client"

import { AppShell } from '@/components/layout/app-shell'
import { Suspense, useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { aiGenerate, aiGenerateStream } from '@/lib/api'
import { onAuthStateChanged } from 'firebase/auth'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { useSearchParams } from 'next/navigation'
import { useAIProvider } from '@/store/ai'

function ChatInner() {
  const [messages, setMessages] = useState<Array<{ role: 'user'|'assistant', content: string }>>([
    { role: 'assistant', content: 'Ask me anything about your studies!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [uid, setUid] = useState<string | null>(null)
  useEffect(()=>{ if (!auth) return; const unsub=onAuthStateChanged(auth,u=>setUid(u?.uid??null)); return ()=>unsub&&unsub() },[])
  const params = useSearchParams()
  const { provider, setProvider } = useAIProvider()
  useEffect(() => {
    const p = params.get('p') as any
    if (p) setProvider(p)
  }, [params, setProvider])
  const canStream = useMemo(() => provider === 'ollama' || provider === 'auto', [provider])

  const send = async () => {
    if (!input.trim()) return
    const userMsg = { role: 'user' as const, content: input }
    setMessages((m) => [...m, userMsg])
    // Log user message
    if (uid && db) {
      const ref = collection(db as any, 'users', uid, 'sessions')
      addDoc(ref, { module: 'chat', provider, userMsg: input, createdAt: serverTimestamp() }).catch(()=>{})
    }
    setInput('')
    setLoading(true)
    try {
      if (canStream) {
        let acc = ''
        setMessages((m)=>[...m, { role: 'assistant', content: '' }])
  await aiGenerateStream(userMsg.content, provider === 'gemini' ? 'auto' : provider, (t) => {
          acc += t
          setMessages((m) => {
            const copy = [...m]
            copy[copy.length - 1] = { role: 'assistant', content: acc }
            return copy
          })
        })
        if (!acc) {
          // fallback if stream produced nothing
          const reply = await aiGenerate(userMsg.content, provider)
          setMessages((m)=>{
            const copy=[...m];
            copy[copy.length-1] = { role: 'assistant', content: reply }
            return copy
          })
          if (uid && db) {
            const ref = collection(db as any, 'users', uid, 'sessions')
            addDoc(ref, { module: 'chat', provider, aiMsg: reply, createdAt: serverTimestamp() }).catch(()=>{})
          }
        } else {
          if (uid && db) {
            const ref = collection(db as any, 'users', uid, 'sessions')
            addDoc(ref, { module: 'chat', provider, aiMsg: acc, createdAt: serverTimestamp() }).catch(()=>{})
          }
        }
      } else {
        const reply = await aiGenerate(userMsg.content, provider)
        setMessages((m) => [...m, { role: 'assistant', content: reply }])
        if (uid && db) {
          const ref = collection(db as any, 'users', uid, 'sessions')
          addDoc(ref, { module: 'chat', provider, aiMsg: reply, createdAt: serverTimestamp() }).catch(()=>{})
        }
      }
    } catch {
      // fallback to simple echo if API not configured
      setMessages((m) => [...m, { role: 'assistant', content: `You said: ${userMsg.content}` }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h1 className="text-2xl font-semibold">AI Chatbot</h1>
      <div className="mt-6 grid gap-4">
        <div className="glass max-h-[60vh] overflow-y-auto rounded-2xl p-4">
          {messages.map((m, i) => (
            <div key={i} className={`mb-3 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block max-w-[85%] rounded-xl px-3 py-2 ${m.role==='user' ? 'bg-primary-500 text-white' : 'bg-white/5 text-white'}`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>{m.content}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key==='Enter' && send()}
            placeholder={loading ? 'Thinking…' : 'Type your message...'} disabled={loading}
            className="focus-ring flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2" />
          <button onClick={send} disabled={loading} className="rounded-xl bg-primary-500 px-4 py-2 font-medium hover:scale-[1.02] disabled:opacity-60">{loading ? 'Sending…' : 'Send'}</button>
        </div>
      </div>
    </>
  )
}

export default function ChatPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="text-white/70">Loading…</div>}>
        <ChatInner />
      </Suspense>
    </AppShell>
  )
}
