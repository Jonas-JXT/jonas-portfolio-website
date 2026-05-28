'use client'
import { create } from 'zustand'
import type { AppId } from '@/data/searchIndex'

interface Highlight {
  appId: AppId
  sectionId: string
}

interface SearchStore {
  highlight: Highlight | null
  setHighlight: (h: Highlight) => void
  clearHighlight: () => void
}

export const useSearchStore = create<SearchStore>((set) => ({
  highlight: null,
  setHighlight: (h) => set({ highlight: h }),
  clearHighlight: () => set({ highlight: null }),
}))
