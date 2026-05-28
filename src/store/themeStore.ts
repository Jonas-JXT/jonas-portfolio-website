'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeStore {
  brightness: number
  setBrightness: (v: number) => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      brightness: 100,
      setBrightness: (v) => set({ brightness: Math.min(150, Math.max(0, v)) }),
    }),
    { name: 'snow-leopard-theme' }
  )
)
