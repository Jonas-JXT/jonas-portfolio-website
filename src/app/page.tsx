'use client'
import { useState, useEffect } from 'react'
import BootScreen from '@/components/boot/BootScreen'
import Desktop from '@/components/desktop/Desktop'
import MobileLayout from '@/components/mobile/MobileLayout'
import { useAppStore } from '@/store/appStore'

function ShutdownOverlay() {
  const [phase, setPhase] = useState<'fading' | 'dark' | 'message'>('fading')

  useEffect(() => {
    const t1 = setTimeout(() => {
      setPhase('dark')
      window.close()
    }, 800)
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
  const [booted, setBooted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const shuttingDown = useAppStore((s) => s.shuttingDown)

  useEffect(() => {
    const alreadyBooted = sessionStorage.getItem('booted')
    if (alreadyBooted) setBooted(true)

    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const handleBootDone = () => {
    sessionStorage.setItem('booted', '1')
    setBooted(true)
  }

  if (isMobile) return <MobileLayout />

  return (
    <>
      {!booted && <BootScreen onDone={handleBootDone} />}
      {booted && <Desktop />}
      {shuttingDown && <ShutdownOverlay />}
    </>
  )
}
