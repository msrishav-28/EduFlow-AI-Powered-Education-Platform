import { useEffect, useState } from 'react'

export function useOnlineStatus() {
  const [online, setOnline] = useState(true)
  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    setOnline(navigator.onLine)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])
  return online
}
