"use client"

import { useOnlineStatus } from '@/hooks/useOnlineStatus'

export function OfflineBanner() {
  const online = useOnlineStatus()
  if (online) return null
  return (
    <div role="status" aria-live="polite" className="sticky top-0 z-50 w-full bg-yellow-500/20 py-2 text-center text-yellow-200">
      You are offline. Changes will sync when you&apos;re back online.
    </div>
  )
}
