"use client"

import { AppShell } from '@/components/layout/app-shell'
import { useTheme } from '@/components/layout/theme-provider'
import { usePreferences } from '@/store/preferences'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { fontSize, setFontSize, reduceMotion, setReduceMotion } = usePreferences()
  return (
    <AppShell>
      <h1 className="text-2xl font-semibold">Settings</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className="glass rounded-2xl p-6">
          <h2 className="font-medium">Preferences</h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <label>Theme</label>
              <select value={theme} onChange={(e) => setTheme(e.target.value as any)} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <label>Font size</label>
              <select value={fontSize} onChange={(e) => setFontSize(e.target.value as any)} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <label>Reduce motion</label>
              <input type="checkbox" checked={reduceMotion} onChange={(e) => setReduceMotion(e.target.checked)} />
            </div>
          </div>
        </section>
        <section className="glass rounded-2xl p-6">
          <h2 className="font-medium">Profile</h2>
          <p className="mt-2 text-white/70">Connect auth to update profile info.</p>
        </section>
      </div>
    </AppShell>
  )
}
