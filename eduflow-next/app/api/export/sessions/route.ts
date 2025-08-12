import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, orderBy, query, limit } from 'firebase/firestore'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const uid = searchParams.get('uid')
  if (!uid || !db) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  try {
    const ref = collection(db as any, 'users', uid, 'sessions')
    const q = query(ref, orderBy('createdAt','desc'), limit(500))
    const snap = await getDocs(q)
    const rows: any[] = []
    snap.forEach(d=>{
      const v = d.data() as any
      rows.push({
        module: v.module,
        accuracy: v.accuracy ?? '',
        total: v.total ?? '',
        correct: v.correct ?? '',
        provider: v.provider ?? '',
        createdAt: v.createdAt?.toDate?.()?.toISOString?.() || ''
      })
    })
    const header = 'module,accuracy,total,correct,provider,createdAt\n'
    const csv = header + rows.map(r=>[
      r.module,
      r.accuracy,
      r.total,
      r.correct,
      r.provider,
      r.createdAt
    ].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n') + '\n'
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="sessions.csv"'
      }
    })
  } catch (e:any) {
    return NextResponse.json({ error: e.message || 'error' }, { status: 500 })
  }
}
