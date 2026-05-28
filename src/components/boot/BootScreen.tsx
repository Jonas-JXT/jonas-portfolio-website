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
      {/* Apple Logo */}
      <div className="boot-logo mb-8">
        <svg width="80" height="98" viewBox="0 0 80 98" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M66.5 52.2c-.1-10.8 8.8-16 9.2-16.3-5-7.3-12.8-8.3-15.6-8.4-6.7-.7-13.1 3.9-16.5 3.9-3.4 0-8.6-3.8-14.2-3.7-7.3.1-14 4.2-17.8 10.7C4.1 51.8 9.7 69.5 17 79.8c3.6 5.2 7.9 11 13.5 10.8 5.4-.2 7.5-3.5 14-3.5 6.5 0 8.4 3.5 14.1 3.4 5.8-.1 9.5-5.2 13.1-10.5 4.1-6 5.8-11.8 5.9-12.1-.1-.1-11.3-4.4-11.1-17.7zM55.7 18.6C58.6 15 60.5 10 59.9 5c-4.4.2-9.7 2.9-12.8 6.5-2.8 3.2-5.2 8.4-4.6 13.3 4.9.4 9.9-2.5 13.2-6.2z"/>
        </svg>
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
