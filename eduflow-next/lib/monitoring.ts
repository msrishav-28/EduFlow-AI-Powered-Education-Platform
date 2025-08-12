// Web Vitals reporting helper
export type WebVital = { id: string; name: string; label: string; value: number }

let queue: WebVital[] = []
let flushing = false

function flush() {
  if (flushing || !queue.length) return
  flushing = true
  const payload = queue.splice(0, queue.length)
  if (typeof window !== 'undefined') {
    try {
      // @ts-ignore
      if (window.Sentry) {
        // @ts-ignore
        window.Sentry.captureMessage('web-vitals', { level: 'info', extra: { vitals: payload } })
      }
    } catch {}
  }
  flushing = false
}

export function reportVital(metric: WebVital) {
  queue.push(metric)
  if (queue.length >= 5) flush()
  setTimeout(flush, 4000)
}
