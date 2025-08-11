"use client"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useRef } from 'react'
import { ThemeProvider } from '@/components/layout/theme-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  const clientRef = useRef<QueryClient>()
  if (!clientRef.current) clientRef.current = new QueryClient()

  return (
    <QueryClientProvider client={clientRef.current}>
      <ThemeProvider>
        {children}
        <Toaster position="top-right" toastOptions={{
          className: 'glass',
        }} />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
