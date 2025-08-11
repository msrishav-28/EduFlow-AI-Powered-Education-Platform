"use client"

import { AppShell } from '@/components/layout/app-shell'
import { Suspense, useEffect, useState } from 'react'
import { aiGenerate } from '@/lib/api'
import { useSearchParams } from 'next/navigation'
import { useAIProvider } from '@/store/ai'

function CareerInner() {
  const params = useSearchParams()
  const { provider, setProvider } = useAIProvider()
  useEffect(()=>{ const p=params.get('p') as any; if(p) setProvider(p) },[params,setProvider])

  const [interests, setInterests] = useState('AI, design, teaching')
  const [skills, setSkills] = useState('JavaScript, Python, writing')
  const [level, setLevel] = useState<'school'|'undergrad'|'postgrad'|'professional'>('undergrad')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const ask = async () => {
    setLoading(true)
    try {
      const prompt = `You are a career guidance assistant. Given the user's interests, skills, and current level, suggest 5 career paths. For each, include: why it fits, core daily work, required skills to strengthen, suggested coursework/certifications, an actionable 30/60/90-day plan, and 2 portfolio project ideas. Use concise bullet points.

Level: ${level}
Interests: ${interests}
Skills: ${skills}`
      const out = await aiGenerate(prompt, provider)
      setResult(out)
    } finally { setLoading(false) }
  }

  return (
    <>
      <h1 className="text-2xl font-semibold">Career Guidance</h1>
      <div className="mt-4 grid gap-3">
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="block">
            <div className="mb-1 text-sm text-white/70">Interests</div>
            <input value={interests} onChange={(e)=>setInterests(e.target.value)} className="focus-ring w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2" placeholder="e.g., AI, healthcare, design" />
          </label>
          <label className="block">
            <div className="mb-1 text-sm text-white/70">Skills</div>
            <input value={skills} onChange={(e)=>setSkills(e.target.value)} className="focus-ring w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2" placeholder="e.g., Python, Figma, writing" />
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-white/70">Current level:</span>
          <select value={level} onChange={(e)=>setLevel(e.target.value as any)} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <option value="school">School</option>
            <option value="undergrad">Undergrad</option>
            <option value="postgrad">Postgrad</option>
            <option value="professional">Professional</option>
          </select>
          <button onClick={ask} disabled={loading} className="ml-auto rounded-xl bg-primary-500 px-4 py-2 disabled:opacity-60">{loading?'Generating…':'Get guidance'}</button>
        </div>
        <div className="glass rounded-2xl p-4 text-white/70 whitespace-pre-wrap min-h-32">{result || 'Your personalized career guidance will appear here.'}</div>
      </div>
    </>
  )
}

export default function CareerGuidancePage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="text-white/70">Loading…</div>}>
        <CareerInner />
      </Suspense>
    </AppShell>
  )
}
