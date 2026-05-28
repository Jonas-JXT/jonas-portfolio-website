'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import { useWindowStore } from '@/store/windowStore'
import type { AppId } from '@/data/searchIndex'

interface Icon {
  id: string
  label: string
  emoji: string
  appId: AppId
}

const ICONS: Icon[] = [
  { id: 'about',     label: 'About Me',    emoji: '📄', appId: 'safari'      },
  { id: 'work',      label: 'Work History',emoji: '💼', appId: 'ichat'       },
  { id: 'education', label: 'Education',   emoji: '🎓', appId: 'addressbook' },
  { id: 'projects',  label: 'Projects',    emoji: '📁', appId: 'iphoto'      },
  { id: 'contact',   label: 'Contact.vcf', emoji: '💌', appId: 'mail'        },
]

export default function DesktopIcons() {
  const [selected, setSelected] = useState<string | null>(null)
  const openWindow = useWindowStore((s) => s.openWindow)
  const containerRef = useRef<HTMLDivElement>(null)

  // Clicking anywhere outside the icons deselects
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSelected(null)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleClick = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setSelected(id)
  }, [])

  const handleDblClick = useCallback((e: React.MouseEvent, icon: Icon) => {
    e.stopPropagation()
    openWindow(icon.appId)
  }, [openWindow])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ paddingTop: 22, paddingBottom: 90 }}
    >
      {ICONS.map((icon, i) => {
        const isSelected = selected === icon.id
        return (
          <div
            key={icon.id}
            className="absolute pointer-events-auto flex flex-col items-center gap-1 w-[76px]"
            style={{ left: 10, top: 30 + i * 90 }}
            onClick={(e) => handleClick(e, icon.id)}
            onDoubleClick={(e) => handleDblClick(e, icon)}
          >
            <div
              className={`w-14 h-14 rounded-xl flex items-center justify-center text-[38px] transition-colors ${
                isSelected ? 'bg-[#3478f6]/40 ring-2 ring-[#3478f6]/60' : 'hover:bg-white/20'
              }`}
            >
              {icon.emoji}
            </div>
            <span
              className={`text-[11px] text-center leading-tight px-1.5 py-0.5 rounded break-words w-full ${
                isSelected
                  ? 'bg-[#3478f6] text-white'
                  : 'text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]'
              }`}
            >
              {icon.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
