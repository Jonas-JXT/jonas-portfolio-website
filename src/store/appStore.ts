'use client'
import { create } from 'zustand'

interface AppStore {
  shuttingDown: boolean
  requestShutdown: () => void
  cancelShutdown: () => void
}

export const useAppStore = create<AppStore>((set) => ({
  shuttingDown: false,
  requestShutdown: () => set({ shuttingDown: true }),
  cancelShutdown: () => set({ shuttingDown: false }),
}))
