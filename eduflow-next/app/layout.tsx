import type { Metadata, Viewport } from 'next'
import './globals.css'
import { buildJsonLd } from '@/lib/seo'
import { Inter, IBM_Plex_Serif } from 'next/font/google'
import { Providers } from '@/components/layout/providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const plex = IBM_Plex_Serif({ weight: ['400','600','700'], subsets: ['latin'], variable: '--font-plex' })

export const metadata: Metadata = {
  title: 'EduFlow — AI-Powered Education Platform',
  description: 'Hybrid AI tutoring, offline-first, accessibility-focused learning.',
  manifest: '/manifest.json',
  icons: [
    { rel: 'icon', url: '/favicon.ico' },
    { rel: 'apple-touch-icon', url: '/icons/icon-192x192.png' },
  ],
}

export const viewport: Viewport = {
  themeColor: '#0B0B2E',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${plex.variable}`} suppressHydrationWarning>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()) }} />
        {/* Skip link for keyboard users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary-600 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <Providers>
          {/* Main landmark */}
          <main id="main-content" tabIndex={-1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
