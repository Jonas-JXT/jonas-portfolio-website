'use client'
import { useWindowStore } from '@/store/windowStore'
import { useThemeStore } from '@/store/themeStore'
import Window from '@/components/windows/Window'
import MenuBar from '@/components/menubar/MenuBar'
import Dock from '@/components/dock/Dock'

import FinderApp from '@/components/apps/FinderApp'
import SafariApp from '@/components/apps/SafariApp'
import MailApp from '@/components/apps/MailApp'
import CalculatorApp from '@/components/apps/CalculatorApp'
import AddressBookApp from '@/components/apps/AddressBookApp'
import IChatApp from '@/components/apps/iChatApp'
import IPhotoApp from '@/components/apps/iPhotoApp'
import SystemPrefsApp from '@/components/apps/SystemPrefsApp'
import PlaceholderApp from '@/components/apps/PlaceholderApp'
import DinoGame from '@/components/apps/DinoGame'
import DesktopIcons from '@/components/desktop/DesktopIcons'

const WINDOWS = [
  { appId: 'finder'      as const, title: 'Finder',             size: { w: 380, h: 420 }, content: <FinderApp /> },
  { appId: 'safari'      as const, title: 'Safari',             size: { w: 520, h: 460 }, content: <SafariApp /> },
  { appId: 'mail'        as const, title: 'Mail',               size: { w: 540, h: 420 }, content: <MailApp /> },
  { appId: 'ical'        as const, title: 'Calculator',         size: { w: 240, h: 340 }, content: <CalculatorApp /> },
  { appId: 'addressbook' as const, title: 'Address Book',       size: { w: 460, h: 400 }, content: <AddressBookApp /> },
  { appId: 'ichat'       as const, title: 'iChat',              size: { w: 500, h: 440 }, content: <IChatApp /> },
  { appId: 'iphoto'      as const, title: 'iPhoto',             size: { w: 480, h: 440 }, content: <IPhotoApp /> },
  { appId: 'sysprefs'    as const, title: 'System Preferences', size: { w: 380, h: 340 }, content: <SystemPrefsApp /> },
  { appId: 'itunes'      as const, title: 'iTunes',             size: { w: 420, h: 380 }, content: <PlaceholderApp appName="iTunes" icon="🎵" /> },
  { appId: 'photobooth'  as const, title: 'Photo Booth',        size: { w: 380, h: 340 }, content: <PlaceholderApp appName="Photo Booth" icon="📸" /> },
  { appId: 'imovie'      as const, title: 'iMovie',             size: { w: 560, h: 300 }, content: <DinoGame /> },
  { appId: 'garageband'  as const, title: 'GarageBand',         size: { w: 480, h: 380 }, content: <PlaceholderApp appName="GarageBand" icon="🎸" /> },
]

export default function Desktop() {
  const brightness = useThemeStore((s) => s.brightness)
  const windows = useWindowStore((s) => s.windows)

  const filterStyle: React.CSSProperties = {
    filter: `brightness(${brightness / 100})`,
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
  }

  const overlayOpacity = brightness < 100 ? (100 - brightness) / 200 : 0

  return (
    <div style={filterStyle}>
      {/* Wallpaper */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/wallpaper/snow-leopard.jpg')" }}
      />

      {/* Brightness dark overlay */}
      {overlayOpacity > 0 && (
        <div
          className="absolute inset-0 bg-black pointer-events-none"
          style={{ opacity: overlayOpacity }}
        />
      )}

      {/* Menu bar */}
      <MenuBar />

      {/* Desktop icons */}
      <DesktopIcons />

      {/* App windows */}
      <div className="absolute inset-0" style={{ paddingTop: 22, paddingBottom: 90 }}>
        {WINDOWS.map(({ appId, title, size, content }) =>
          windows[appId]?.isOpen ? (
            <Window key={appId} appId={appId} title={title} defaultSize={size}>
              {content}
            </Window>
          ) : null
        )}
      </div>

      {/* Dock */}
      <Dock />
    </div>
  )
}
