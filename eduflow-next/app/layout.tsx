import type { Metadata, Viewport } from 'next'
import './globals.css'
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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
