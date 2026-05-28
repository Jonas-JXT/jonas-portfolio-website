'use client'
import { create } from 'zustand'
import type { AppId } from '@/data/searchIndex'

interface WindowState {
  isOpen: boolean
  zIndex: number
  position: { x: number; y: number }
  isBouncing: boolean
}

const defaultPositions: Record<AppId, { x: number; y: number }> = {
  finder:      { x: 60,  y: 50  },
  safari:      { x: 80,  y: 60  },
  mail:        { x: 120, y: 80  },
  ical:        { x: 200, y: 100 },
  addressbook: { x: 150, y: 70  },
  ichat:       { x: 100, y: 90  },
  itunes:      { x: 180, y: 110 },
  iphoto:      { x: 90,  y: 75  },
  photobooth:  { x: 130, y: 85  },
  imovie:      { x: 160, y: 95  },
  garageband:  { x: 110, y: 65  },
  sysprefs:    { x: 140, y: 80  },
  trash:       { x: 170, y: 100 },
}

const ALL_APP_IDS: AppId[] = [
  'finder','safari','mail','ical','addressbook','ichat',
  'itunes','iphoto','photobooth','imovie','garageband','sysprefs','trash',
]

function jitter() {
  return Math.floor(Math.random() * 60) - 30
}

function makeInitial(): Record<AppId, WindowState> {
  return Object.fromEntries(
    ALL_APP_IDS.map((id) => [
      id,
      { isOpen: false, zIndex: 1, position: defaultPositions[id], isBouncing: false },
    ])
  ) as Record<AppId, WindowState>
}

interface WindowStore {
  windows: Record<AppId, WindowState>
  highestZIndex: number
  focusedAppId: AppId | null
  openWindow: (appId: AppId) => void
  closeWindow: (appId: AppId) => void
  focusWindow: (appId: AppId) => void
  setPosition: (appId: AppId, pos: { x: number; y: number }) => void
  clearBounce: (appId: AppId) => void
}

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: makeInitial(),
  highestZIndex: 10,
  focusedAppId: null,

  openWindow: (appId) => {
    const { highestZIndex, windows } = get()
    const base = defaultPositions[appId]
    const newZ = highestZIndex + 1
    set({
      highestZIndex: newZ,
      focusedAppId: appId,
      windows: {
        ...windows,
        [appId]: {
          ...windows[appId],
          isOpen: true,
          zIndex: newZ,
          isBouncing: true,
          position: { x: base.x + jitter(), y: base.y + jitter() },
        },
      },
    })
  },

  closeWindow: (appId) => {
    const { windows, focusedAppId } = get()
    set({
      focusedAppId: focusedAppId === appId ? null : focusedAppId,
      windows: {
        ...windows,
        [appId]: { ...windows[appId], isOpen: false },
      },
    })
  },

  focusWindow: (appId) => {
    const { highestZIndex, windows } = get()
    const newZ = highestZIndex + 1
    set({
      highestZIndex: newZ,
      focusedAppId: appId,
      windows: {
        ...windows,
        [appId]: { ...windows[appId], zIndex: newZ },
      },
    })
  },

  setPosition: (appId, pos) => {
    const { windows } = get()
    set({ windows: { ...windows, [appId]: { ...windows[appId], position: pos } } })
  },

  clearBounce: (appId) => {
    const { windows } = get()
    set({ windows: { ...windows, [appId]: { ...windows[appId], isBouncing: false } } })
  },
}))
