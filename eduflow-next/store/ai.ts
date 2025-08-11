import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type AIProvider = 'auto' | 'gemini' | 'ollama'

interface AIProviderState {
  provider: AIProvider
  setProvider: (p: AIProvider) => void
}

export const useAIProvider = create<AIProviderState>()(
  persist(
    (set) => ({
      provider: 'auto',
      setProvider: (provider) => set({ provider }),
    }),
    { name: 'ai-provider' }
  )
)
