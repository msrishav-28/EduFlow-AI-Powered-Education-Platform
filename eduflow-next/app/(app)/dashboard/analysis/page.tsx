"use client"

import { AppShell } from '@/components/layout/app-shell'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { collection, getDocs, limit, orderBy, query, Timestamp, where } from 'firebase/firestore'

type SessionDoc = {
  module: string
  total?: number
  correct?: number
  accuracy?: number
  durationMin?: number
  createdAt?: Timestamp
}

function AnalysisInner() {
  const [uid, setUid] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [sessions, setSessions] = useState<SessionDoc[]>([])
  useEffect(()=>{ if (!auth) return; const unsub=onAuthStateChanged(auth,u=>setUid(u?.uid??null)); return ()=>unsub&&unsub() },[])
  useEffect(()=>{
    const run = async () => {
  if (!uid || !db) { setSessions([]); setLoading(false); return }
      setLoading(true)
      try {
  const ref = collection(db as any, 'users', uid, 'sessions')
        const q = query(ref, orderBy('createdAt','desc'), limit(100))
        const snap = await getDocs(q)
        setSessions(snap.docs.map(d=>d.data() as SessionDoc))
      } finally { setLoading(false) }
    }
    run()
  },[uid])

  const stats = useMemo(()=>{
    if (!sessions.length) return null
    const totalQuizzes = sessions.filter(s=>s.module==='mcq')
    const attempts = totalQuizzes.length
    const avgAcc = attempts ? totalQuizzes.reduce((a,s)=>a+(s.accuracy??0),0)/attempts : 0
    const correct = totalQuizzes.reduce((a,s)=>a+(s.correct??0),0)
    const totalQs = totalQuizzes.reduce((a,s)=>a+(s.total??0),0)
    return { attempts, avgAcc, correct, totalQs }
  },[sessions])

  // Minimal inline charts: weekly histogram by createdAt
  const weeklyCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const moduleCanvasRef = useRef<HTMLCanvasElement | null>(null)
  useEffect(()=>{
    if (!sessions.length) return
    const now = Date.now()
    const start = now - 6*24*3600*1000
    const buckets = Array(7).fill(0)
    for (const s of sessions) {
      const t = s.createdAt?.toMillis?.() ?? 0
      if (!t) continue
      const d = Math.max(0, Math.min(6, Math.floor((t - start) / (24*3600*1000))))
      buckets[d] += 1
    }
    const c = weeklyCanvasRef.current
    if (c) {
      const ctx = c.getContext('2d')!
      ctx.clearRect(0,0,c.width,c.height)
      const w= c.width, h=c.height, pad=20
      const barW = (w - pad*2) / buckets.length - 8
      const maxV = Math.max(1, ...buckets)
      buckets.forEach((v, i) => {
        const x = pad + i * (barW + 8)
        const bh = (h - pad*2) * (v / maxV)
        const y = h - pad - bh
        ctx.fillStyle = 'rgba(99,102,241,0.8)'
        ctx.fillRect(x, y, barW, bh)
      })
    }
    const byModule: Record<string, number> = {}
    sessions.forEach(s=>{ byModule[s.module] = (byModule[s.module]||0)+1 })
    const m = moduleCanvasRef.current
    if (m) {
      const ctx = m.getContext('2d')!
      ctx.clearRect(0,0,m.width,m.height)
      const names = Object.keys(byModule)
      const vals = Object.values(byModule)
      const total = vals.reduce((a,b)=>a+b,0)||1
      let startAng = -Math.PI/2
      const cx = m.width/2, cy=m.height/2, r=Math.min(cx,cy)-10
      vals.forEach((v, i)=>{
        const ang = (v/total) * Math.PI*2
        ctx.beginPath()
        const hue = (i*60)%360
        ctx.fillStyle = `hsl(${hue} 70% 55% / 0.9)`
        ctx.moveTo(cx,cy)
        ctx.arc(cx,cy,r,startAng,startAng+ang)
        ctx.closePath()
        ctx.fill()
        startAng += ang
      })
    }
  },[sessions])

  return (
    <>
      <h1 className="text-2xl font-semibold">Study Pattern Analysis</h1>
      {!uid && <p className="mt-2 text-white/70">Sign in to see personalized analytics and progress.</p>}
      {uid && loading && <p className="mt-2 text-white/70">Loading your recent sessions…</p>}
      {uid && !loading && !sessions.length && <p className="mt-2 text-white/70">No sessions yet. Generate MCQs and submit your answers to build insights.</p>}

      <div className="mt-6 grid gap-6 lg:grid-cols-4">
        <div className="glass rounded-2xl p-4">
          <div className="text-sm text-white/60">MCQ attempts</div>
          <div className="mt-1 text-2xl font-semibold">{stats? stats.attempts : 0}</div>
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="text-sm text-white/60">Average accuracy</div>
          <div className="mt-1 text-2xl font-semibold">{stats? Math.round(stats.avgAcc*100) : 0}%</div>
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="text-sm text-white/60">Questions answered</div>
          <div className="mt-1 text-2xl font-semibold">{stats? stats.totalQs : 0}</div>
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="text-sm text-white/60">Correct answers</div>
          <div className="mt-1 text-2xl font-semibold">{stats? stats.correct : 0}</div>
        </div>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-2xl p-4">
          <div className="mb-2 font-medium">Weekly Activity</div>
          <canvas ref={weeklyCanvasRef} width={560} height={220} className="w-full" />
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="mb-2 font-medium">Module Breakdown</div>
          <canvas ref={moduleCanvasRef} width={560} height={220} className="w-full" />
        </div>
      </div>
    </>
  )
}

export default function AnalysisPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="text-white/70">Loading…</div>}>
        <AnalysisInner />
      </Suspense>
    </AppShell>
  )
}
