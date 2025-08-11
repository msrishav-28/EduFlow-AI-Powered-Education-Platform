"use client"

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextValue {
  theme: Theme
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system')

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? (localStorage.getItem('theme') as Theme | null) : null
    if (stored) setTheme(stored)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const root = window.document.documentElement
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const resolved = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme
    root.classList.toggle('dark', resolved === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
