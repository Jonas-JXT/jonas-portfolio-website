'use client'
import { useEffect, useRef } from 'react'
import type { AppMenu } from '@/data/menuItems'

interface Props {
  menu: AppMenu
  anchorRect: DOMRect
  onClose: () => void
}

export default function MenuDropdown({ menu, anchorRect, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  return (
    <div
      ref={ref}
      className="menu-dropdown absolute top-[22px] z-[9990] min-w-[200px] py-1"
      style={{ left: anchorRect.left }}
    >
      {menu.items.map((item, i) =>
        item.separator ? (
          <div key={i} className="my-1 h-px bg-black/15 mx-2" />
        ) : (
          <div
            key={i}
            className={`flex items-center justify-between px-4 py-[2px] text-[12px] rounded-sm mx-1 ${
              item.disabled
                ? 'text-black/35 cursor-default'
                : 'text-black/90 cursor-pointer hover:bg-[#3478f6] hover:text-white'
            }`}
          >
            <span>{item.label}</span>
            {item.shortcut && (
              <span className="ml-8 text-[11px] opacity-70">{item.shortcut}</span>
            )}
          </div>
        )
      )}
    </div>
  )
}
