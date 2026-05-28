'use client'
import { useRef, useState, useCallback } from 'react'
import DockIcon from './DockIcon'
import { useWindowStore } from '@/store/windowStore'
import { useAppStore } from '@/store/appStore'
import type { AppId } from '@/data/searchIndex'

interface DockApp {
  appId: AppId
  label: string
  iconSrc: string
}

const DOCK_APPS: DockApp[] = [
  { appId: 'finder',      label: 'Finder',            iconSrc: '/icons/finder.png' },
  { appId: 'safari',      label: 'Safari',            iconSrc: '/icons/safari.png' },
  { appId: 'mail',        label: 'Mail',              iconSrc: '/icons/mail.png' },
  { appId: 'ical',        label: 'Calculator',        iconSrc: '/icons/ical.png' },
  { appId: 'addressbook', label: 'Address Book',      iconSrc: '/icons/addressbook.png' },
  { appId: 'ichat',       label: 'iChat',             iconSrc: '/icons/ichat.png' },
  { appId: 'itunes',      label: 'iTunes',            iconSrc: '/icons/itunes.png' },
  { appId: 'iphoto',      label: 'iPhoto',            iconSrc: '/icons/iphoto.png' },
  { appId: 'photobooth',  label: 'Photo Booth',       iconSrc: '/icons/photobooth.png' },
  { appId: 'imovie',      label: 'iMovie',            iconSrc: '/icons/imovie.png' },
  { appId: 'garageband',  label: 'GarageBand',        iconSrc: '/icons/garageband.png' },
  { appId: 'sysprefs',    label: 'System Preferences',iconSrc: '/icons/sysprefs.png' },
  { appId: 'trash',       label: 'Trash',             iconSrc: '/icons/trash.png' },
]

const MAX_SCALE = 1.7
const RADIUS = 120

function gaussian(dist: number): number {
  return Math.exp(-(dist * dist) / (2 * RADIUS * RADIUS))
}

export default function Dock() {
  const dockRef = useRef<HTMLDivElement>(null)
  const [scales, setScales] = useState<number[]>(DOCK_APPS.map(() => 1))
  const openWindow = useWindowStore((s) => s.openWindow)
  const clearBounce = useWindowStore((s) => s.clearBounce)
  const windows = useWindowStore((s) => s.windows)
  const requestShutdown = useAppStore((s) => s.requestShutdown)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dockRef.current) return
    const icons = dockRef.current.querySelectorAll<HTMLDivElement>('[data-appid]')
    const newScales = Array.from(icons).map((icon) => {
      const rect = icon.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const dist = Math.abs(e.clientX - centerX)
      return 1 + (MAX_SCALE - 1) * gaussian(dist)
    })
    setScales(newScales)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setScales(DOCK_APPS.map(() => 1))
  }, [])

  return (
    <div
      className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[8000] pb-1"
      style={{ height: 'var(--dock-h)' }}
    >
      <div
        ref={dockRef}
        className="dock-shelf flex items-end gap-1 px-3 pb-2 rounded-t-xl h-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {DOCK_APPS.map((app, i) => (
          <DockIcon
            key={app.appId}
            appId={app.appId}
            label={app.label}
            iconSrc={app.iconSrc}
            scale={scales[i]}
            isOpen={windows[app.appId]?.isOpen ?? false}
            isBouncing={windows[app.appId]?.isBouncing ?? false}
            onClick={() => app.appId === 'trash' ? requestShutdown() : openWindow(app.appId)}
            onBounceEnd={() => clearBounce(app.appId)}
          />
        ))}
      </div>
    </div>
  )
}
