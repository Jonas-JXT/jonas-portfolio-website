'use client'
import { useState, useRef, useCallback } from 'react'
import StatusBar from './StatusBar'
import MenuDropdown from './MenuDropdown'
import { useWindowStore } from '@/store/windowStore'
import { menuConfigs, finderMenuConfig } from '@/data/menuItems'
import type { AppMenu } from '@/data/menuItems'
import type { AppId } from '@/data/searchIndex'

function AppleLogo() {
  return (
    <svg width="13" height="16" viewBox="0 0 80 98" fill="currentColor" className="text-black/80">
      <path d="M66.5 52.2c-.1-10.8 8.8-16 9.2-16.3-5-7.3-12.8-8.3-15.6-8.4-6.7-.7-13.1 3.9-16.5 3.9-3.4 0-8.6-3.8-14.2-3.7-7.3.1-14 4.2-17.8 10.7C4.1 51.8 9.7 69.5 17 79.8c3.6 5.2 7.9 11 13.5 10.8 5.4-.2 7.5-3.5 14-3.5 6.5 0 8.4 3.5 14.1 3.4 5.8-.1 9.5-5.2 13.1-10.5 4.1-6 5.8-11.8 5.9-12.1-.1-.1-11.3-4.4-11.1-17.7zM55.7 18.6C58.6 15 60.5 10 59.9 5c-4.4.2-9.7 2.9-12.8 6.5-2.8 3.2-5.2 8.4-4.6 13.3 4.9.4 9.9-2.5 13.2-6.2z"/>
    </svg>
  )
}

interface OpenMenu {
  menu: AppMenu
  rect: DOMRect
}

export default function MenuBar() {
  const focusedAppId = useWindowStore((s) => s.focusedAppId)
  const [openMenu, setOpenMenu] = useState<OpenMenu | null>(null)
  const barRef = useRef<HTMLDivElement>(null)

  const config = focusedAppId
    ? (menuConfigs[focusedAppId as AppId] ?? finderMenuConfig)
    : finderMenuConfig

  const handleMenuClick = useCallback(
    (menu: AppMenu, e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      if (openMenu?.menu.label === menu.label) {
        setOpenMenu(null)
      } else {
        setOpenMenu({ menu, rect })
      }
    },
    [openMenu]
  )

  return (
    <div
      ref={barRef}
      className="menubar-glass fixed top-0 left-0 right-0 z-[9000] flex items-center justify-between px-2 select-none"
      style={{ height: 'var(--menubar-h)' }}
    >
      {/* Left side */}
      <div className="relative flex items-center gap-0.5 h-full">
        {/* Apple logo */}
        <button className="flex items-center justify-center px-2 h-full hover:bg-black/10 rounded-sm">
          <AppleLogo />
        </button>

        {/* App name */}
        <button className="px-2 h-full text-[12px] font-semibold text-black/85 hover:bg-black/10 rounded-sm">
          {config.appName}
        </button>

        {/* App menus */}
        {config.menus.map((menu) => (
          <button
            key={menu.label}
            onClick={(e) => handleMenuClick(menu, e)}
            className={`px-2 h-full text-[12px] text-black/80 hover:bg-black/10 rounded-sm ${
              openMenu?.menu.label === menu.label ? 'bg-black/10' : ''
            }`}
          >
            {menu.label}
          </button>
        ))}

        {/* Active dropdown */}
        {openMenu && (
          <MenuDropdown
            menu={openMenu.menu}
            anchorRect={openMenu.rect}
            onClose={() => setOpenMenu(null)}
          />
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center pr-1">
        <StatusBar />
      </div>
    </div>
  )
}
