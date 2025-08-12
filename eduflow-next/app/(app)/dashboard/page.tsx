"use client"
import type { Metadata } from 'next'
import { moduleMeta } from '@/lib/seo'
export const metadata: Metadata = moduleMeta('Dashboard','Access AI study tools, analytics and resources.') as any
import { AppShell } from '@/components/layout/app-shell'
import Link from 'next/link'
import { useEffect, useState, useMemo } from 'react'
import { useAIProvider } from '@/store/ai'

export default function DashboardPage() {
  const modules = [
    { href: '/dashboard/chat', title: 'AI Chatbot', desc: 'Chat with streaming responses, markdown, code.' },
  { href: '/dashboard/career', title: 'Career Guidance', desc: 'Explore paths tailored to interests and skills.' },
    { href: '/dashboard/qa', title: 'Question Answering', desc: 'Ask anything and get concise answers.' },
    { href: '/dashboard/summarize', title: 'Text Summarizer', desc: 'Summarize content with copy & download.' },
    { href: '/dashboard/mcq', title: 'MCQ Generator', desc: 'Generate practice questions from text.' },
    { href: '/dashboard/code-explainer', title: 'Code Explainer', desc: 'Use Monaco editor with AI explanations.' },
  { href: '/dashboard/pdf', title: 'PDF Converter', desc: 'Upload PDF/DOCX to extract notes and MCQs.' },
  { href: '/dashboard/analysis', title: 'Study Analysis', desc: 'Insights from your sessions and habits.' },
  ]
  const [health, setHealth] = useState<{ gemini: boolean; ollama: boolean } | null>(null)
  const { provider, setProvider } = useAIProvider()
  const withProvider = useMemo(() => (href: string) => `${href}?p=${provider}`, [provider])
  useEffect(() => { fetch('/api/health/ai').then(r=>r.json()).then(setHealth).catch(()=>setHealth({gemini:false,ollama:false})) }, [])
  return (
    <AppShell>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm text-white/70">
          AI health: <span className={health?.gemini ? 'text-green-300' : 'text-red-300'}>Gemini {health?.gemini ? 'OK' : 'Off'}</span> · <span className={health?.ollama ? 'text-green-300' : 'text-red-300'}>Ollama {health?.ollama ? 'OK' : 'Off'}</span>
        </div>
        <div className="text-sm">
          Provider:
          <select className="ml-2 rounded-xl border border-white/10 bg-white/5 px-2 py-1" value={provider} onChange={(e)=>setProvider(e.target.value as any)}>
            <option value="auto">Auto</option>
            <option value="gemini">Gemini</option>
            <option value="ollama">Ollama</option>
          </select>
        </div>
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map(m => (
          <Link
            href={withProvider(m.href)}
            key={m.href}
            className="glass block rounded-2xl p-6 hover:translate-y-[-2px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
            tabIndex={0}
            prefetch
          >
            <h3 className="font-medium">{m.title}</h3>
            <p className="mt-1 text-white/70">{m.desc}</p>
          </Link>
        ))}
      </div>
    </AppShell>
  )
}
