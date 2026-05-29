'use client'
import { useState, useEffect, useCallback } from 'react'
import BootScreen from '@/components/boot/BootScreen'
import WelcomeScreen from '@/components/boot/WelcomeScreen'
import Desktop from '@/components/desktop/Desktop'
import MobileLayout from '@/components/mobile/MobileLayout'
import { useAppStore } from '@/store/appStore'
import { useWindowStore } from '@/store/windowStore'

type Phase = 'boot' | 'welcome' | 'desktop'

function ShutdownOverlay() {
  const [phase, setPhase] = useState<'fading' | 'dark' | 'message'>('fading')

  useEffect(() => {
    const t1 = setTimeout(() => { setPhase('dark'); window.close() }, 800)
    const t2 = setTimeout(() => setPhase('message'), 1400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-700"
      style={{ opacity: phase === 'fading' ? 0 : 1 }}
    >
      {phase === 'message' && (
        <p className="text-white/40 text-sm" style={{ fontFamily: 'var(--font-sl)' }}>
          You may now close this tab.
        </p>
      )}
    </div>
  )
}

export default function Home() {
  const [phase,    setPhase]    = useState<Phase>('boot')
  const [isMobile, setIsMobile] = useState(false)
  const shuttingDown = useAppStore((s) => s.shuttingDown)
  const openWindow   = useWindowStore((s) => s.openWindow)

  useEffect(() => {
    // Skip boot + welcome if already seen this session
    const alreadyBooted = sessionStorage.getItem('booted')
    if (alreadyBooted) {
      setPhase('desktop')
      setTimeout(() => openWindow('safari'), 300)
    }

    // Detect mobile
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleBootDone = useCallback(() => {
    setPhase('welcome')
  }, [])

  const handleWelcomeDone = useCallback(() => {
    sessionStorage.setItem('booted', '1')
    setPhase('desktop')
    // Open Safari in the centre of the screen after the desktop renders
    setTimeout(() => openWindow('safari'), 350)
  }, [openWindow])

  if (isMobile) return <MobileLayout />

  return (
    <>
      {phase === 'boot'    && <BootScreen    onDone={handleBootDone}    />}
      {phase === 'welcome' && <WelcomeScreen onDone={handleWelcomeDone} />}
      {phase === 'desktop' && <Desktop />}
      {shuttingDown        && <ShutdownOverlay />}
    </>
  )
}
