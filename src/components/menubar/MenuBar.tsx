'use client'
import { useState, useRef, useCallback } from 'react'
import StatusBar from './StatusBar'
import MenuDropdown from './MenuDropdown'
import { useWindowStore } from '@/store/windowStore'
import { menuConfigs, finderMenuConfig } from '@/data/menuItems'
import type { AppMenu } from '@/data/menuItems'
import type { AppId } from '@/data/searchIndex'

function JonasLogo() {
  return (
    <span style={{
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      fontSize: 12,
      fontWeight: 500,
      color: 'rgba(0,0,0,0.80)',
      letterSpacing: '0.04em',
    }}>
      Jonas
    </span>
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
        {/* Jonas logo */}
        <button className="flex items-center justify-center px-2 h-full hover:bg-black/10 rounded-sm">
          <JonasLogo />
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
