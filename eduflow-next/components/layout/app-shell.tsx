"use client"

import { Topbar } from './topbar'
import { OfflineBanner } from './offline-banner'
import { Sidebar } from './sidebar'
import { usePathname } from 'next/navigation'

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/dashboard') || pathname === '/settings'
  return (
    <div className="min-h-screen">
      <Topbar />
      <OfflineBanner />
      <div className="mx-auto max-w-7xl px-6 py-8">
        {isDashboard ? (
          <div className="grid gap-6 lg:grid-cols-[15rem,1fr]">
            <Sidebar />
            <div>
              {children}
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  )
}
