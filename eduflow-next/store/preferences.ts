import { create } from 'zustand'

export type FontSize = 'sm' | 'md' | 'lg'

interface PreferencesState {
  fontSize: FontSize
  reduceMotion: boolean
  setFontSize: (s: FontSize) => void
  setReduceMotion: (v: boolean) => void
}

export const usePreferences = create<PreferencesState>((set) => ({
  fontSize: 'md',
  reduceMotion: false,
  setFontSize: (fontSize) => set({ fontSize }),
  setReduceMotion: (reduceMotion) => set({ reduceMotion }),
}))
