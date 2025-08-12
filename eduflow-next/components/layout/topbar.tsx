"use client"

import Link from 'next/link'
import { useTheme } from './theme-provider'
import { Sun, Moon, Bell, Search } from 'lucide-react'

export function Topbar() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark' || theme === 'system'

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-bg/60 backdrop-blur-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
  <Link href="/" prefetch className="font-semibold focus-ring rounded-lg px-1">EduFlow</Link>
        <div className="flex items-center gap-2">
          <div className="glass hidden items-center gap-2 rounded-xl px-3 py-1.5 text-white/70 sm:flex">
            <Search className="h-4 w-4" />
            <input className="bg-transparent outline-none placeholder:text-white/40" placeholder="Search..." aria-label="Search" />
          </div>
          <button aria-label="Notifications" className="rounded-xl p-2 hover:bg-white/5 focus-ring"><Bell className="h-5 w-5" /></button>
          <button
            aria-label="Toggle theme"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="rounded-xl p-2 hover:bg-white/5 focus-ring"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  )
}
