import { NextResponse } from 'next/server'

export async function GET() {
  const hasGemini = !!process.env.GOOGLE_GENAI_API_KEY
  const base = process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
  let hasOllama = false
  try {
    const res = await fetch(`${base}/api/tags`, { cache: 'no-store' })
    hasOllama = res.ok
  } catch {
    hasOllama = false
  }
  return NextResponse.json({ gemini: hasGemini, ollama: hasOllama })
}
