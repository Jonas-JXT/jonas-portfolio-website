'use client'
import { useEffect, useState } from 'react'

interface Props {
  onDone: () => void
}

export default function BootScreen({ onDone }: Props) {
  const [hiding, setHiding] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => {
      setHiding(true)
      setTimeout(onDone, 500)
    }, 3500)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black transition-opacity duration-500 ${hiding ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Name */}
      <div className="boot-logo mb-8 text-center">
        <span style={{
          fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
          fontSize: 52,
          fontWeight: 100,
          color: 'rgba(255,255,255,0.92)',
          letterSpacing: '0.12em',
          textShadow: '0 0 40px rgba(255,255,255,0.15)',
        }}>
          Jonas
        </span>
      </div>

      {/* Progress bar track */}
      <div className="w-48 h-[3px] rounded-full bg-white/20 overflow-hidden">
        <div className="h-full rounded-full bg-white/70 boot-progress-bar" />
      </div>

      <p className="mt-6 text-white/40 text-xs tracking-widest" style={{ fontFamily: 'var(--font-sl)' }}>
        Mac OS X
      </p>
    </div>
  )
}
