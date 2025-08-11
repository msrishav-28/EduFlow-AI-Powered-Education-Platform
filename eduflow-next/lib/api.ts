export async function aiGenerate(prompt: string, provider: 'auto' | 'gemini' | 'ollama' = 'auto'): Promise<string> {
  const res = await fetch('/api/ai/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, provider })
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Request failed ${res.status}`)
  }
  const data = await res.json()
  return data.content as string
}

export async function aiGenerateStream(prompt: string, provider: 'auto' | 'ollama' = 'auto', onToken?: (t: string)=>void): Promise<void> {
  const res = await fetch('/api/ai/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, provider, stream: true })
  })
  if (!res.ok || !res.body) throw new Error(`Stream failed ${res.status}`)
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value)
    // Ollama returns JSON lines per chunk; try to parse lines
    const lines = chunk.split('\n').filter(l=>l.trim())
    for (const line of lines) {
      try {
        const json = JSON.parse(line)
        if (json.response && onToken) onToken(json.response as string)
      } catch { /* ignore */ }
    }
  }
}
