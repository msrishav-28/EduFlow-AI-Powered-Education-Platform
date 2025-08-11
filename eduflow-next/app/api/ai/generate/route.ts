import { NextRequest, NextResponse } from 'next/server'

async function callGemini(prompt: string) {
  const apiKey = process.env.GOOGLE_GENAI_API_KEY
  if (!apiKey) throw new Error('GOOGLE_GENAI_API_KEY not configured')
  // Lazy import to avoid bundling in edge
  const { GoogleGenerativeAI } = await import('@google/generative-ai')
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
  const result = await model.generateContent(prompt)
  const response = await result.response
  return response.text()
}

async function callOllama(prompt: string) {
  const base = process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
  const model = process.env.OLLAMA_MODEL || 'gemma2:27b'
  const res = await fetch(`${base}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, prompt, stream: false })
  })
  if (!res.ok) throw new Error(`Ollama error ${res.status}`)
  const data = await res.json()
  return data.response as string
}

async function streamOllama(prompt: string) {
  const base = process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
  const model = process.env.OLLAMA_MODEL || 'gemma2:27b'
  const res = await fetch(`${base}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, prompt, stream: true })
  })
  if (!res.ok || !res.body) throw new Error(`Ollama stream error ${res.status}`)
  return res.body
}

async function streamGemini(prompt: string) {
  const apiKey = process.env.GOOGLE_GENAI_API_KEY
  if (!apiKey) throw new Error('GOOGLE_GENAI_API_KEY not configured')
  const { GoogleGenerativeAI } = await import('@google/generative-ai')
  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
  const result = await model.generateContentStream(prompt)
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of (result as any).stream) {
          const token = typeof chunk?.text === 'function' ? chunk.text() : (chunk?.candidates?.[0]?.content?.parts?.[0]?.text ?? '')
          if (token) controller.enqueue(new TextEncoder().encode(JSON.stringify({ response: token }) + '\n'))
        }
        controller.close()
      } catch (e) {
        controller.error(e)
      }
    }
  })
  return stream
}

function offlineFallback(prompt: string) {
  const hints = [
    ['explain', 'Here is an explanation based on offline knowledge...'],
    ['summarize', 'Summary generated using offline model...'],
    ['quiz', 'Here are some practice questions: 1) ... 2) ...'],
    ['code', 'Here is some guidance for your code...'],
  ] as const
  const hit = hints.find(([k]) => prompt.toLowerCase().includes(k))?.[1] || 'Using offline fallback to assist you.'
  return `${hit} (offline)`
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, provider, stream }: { prompt: string; provider?: 'auto' | 'gemini' | 'ollama'; stream?: boolean } = await req.json()
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 })
    }

    let text = ''
    const mode = provider || 'auto'

    if (mode === 'gemini') {
      if (stream) {
        const body = await streamGemini(prompt)
        return new Response(body, { headers: { 'Content-Type': 'text/event-stream' } })
      }
      text = await callGemini(prompt)
    } else if (mode === 'ollama') {
      if (stream) {
        const body = await streamOllama(prompt)
        return new Response(body, { headers: { 'Content-Type': 'text/event-stream' } })
      }
      text = await callOllama(prompt)
    } else {
      // auto: try Gemini -> Ollama -> offline
      try {
        if (stream) {
          const body = await streamGemini(prompt)
          return new Response(body, { headers: { 'Content-Type': 'text/event-stream' } })
        }
        text = await callGemini(prompt)
      } catch {
        try {
          if (stream) {
            const body = await streamOllama(prompt)
            return new Response(body, { headers: { 'Content-Type': 'text/event-stream' } })
          }
          text = await callOllama(prompt)
        } catch {
          text = offlineFallback(prompt)
        }
      }
    }

    return NextResponse.json({ content: text })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'AI generate failed' }, { status: 500 })
  }
}
