import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  return [
    '', '/', '/dashboard', '/support', '/sign-in', '/sign-up', '/settings', '/dashboard/chat', '/dashboard/qa', '/dashboard/summarize', '/dashboard/mcq', '/dashboard/code-explainer'
  ].map((p) => ({ url: base + p, lastModified: new Date() }))
}
