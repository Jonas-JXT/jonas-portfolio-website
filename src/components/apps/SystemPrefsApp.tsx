'use client'
import { useState } from 'react'
import { useThemeStore } from '@/store/themeStore'

export default function SystemPrefsApp() {
  const [activePref, setActivePref] = useState<string | null>(null)
  const brightness = useThemeStore((s) => s.brightness)
  const setBrightness = useThemeStore((s) => s.setBrightness)

  const prefs = [
    { id: 'brightness', label: 'Displays', icon: '🖥️', functional: true },
    { id: 'sound', label: 'Sound', icon: '🔊', functional: false },
    { id: 'network', label: 'Network', icon: '📶', functional: false },
    { id: 'users', label: 'Users', icon: '👤', functional: false },
    { id: 'security', label: 'Security', icon: '🔒', functional: false },
    { id: 'energy', label: 'Energy', icon: '⚡', functional: false },
  ]

  return (
    <div className="flex flex-col h-full bg-[#e8e8e8] text-[12px]">
      {/* Toolbar */}
      <div className="flex items-center px-3 py-1.5 bg-gradient-to-b from-[#d5d5d5] to-[#c5c5c5] border-b border-black/15">
        {activePref && (
          <button
            onClick={() => setActivePref(null)}
            className="flex items-center gap-1 text-[11px] text-[#3478f6] hover:underline"
          >
            <svg width="6" height="10" viewBox="0 0 6 10" fill="currentColor"><path d="M5 1L1 5l4 4"/></svg>
            Show All
          </button>
        )}
        <p className="flex-1 text-center text-[13px] font-semibold text-black/70">
          {activePref ? prefs.find((p) => p.id === activePref)?.label : 'System Preferences'}
        </p>
      </div>

      {activePref === 'brightness' ? (
        <BrightnessPanel brightness={brightness} setBrightness={setBrightness} />
      ) : (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-3 gap-3">
            {prefs.map((pref) => (
              <button
                key={pref.id}
                onClick={() => pref.functional && setActivePref(pref.id)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-lg transition-colors ${
                  pref.functional
                    ? 'hover:bg-white/70 cursor-pointer'
                    : 'opacity-50 cursor-default'
                }`}
              >
                <span className="text-3xl">{pref.icon}</span>
                <span className="text-[11px] text-black/70">{pref.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function BrightnessPanel({
  brightness,
  setBrightness,
}: {
  brightness: number
  setBrightness: (v: number) => void
}) {
  return (
    <div className="flex-1 p-5 space-y-5">
      <div className="bg-white rounded-lg p-4 shadow-sm border border-black/10">
        <h2 className="text-[13px] font-semibold text-black/80 mb-4">Display Brightness</h2>

        <div className="flex items-center gap-3">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" className="text-black/40 shrink-0">
            <circle cx="7" cy="7" r="3"/>
            <path d="M7 0v2M7 12v2M0 7h2M12 7h2M2.1 2.1l1.4 1.4M10.5 10.5l1.4 1.4M10.5 2.1l-1.4 1.4M3.5 10.5l-1.4 1.4"/>
          </svg>

          <input
            type="range"
            min={10}
            max={150}
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="flex-1 accent-[#3478f6]"
          />

          <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" className="text-black/60 shrink-0">
            <circle cx="9" cy="9" r="4"/>
            <path d="M9 0v3M9 15v3M0 9h3M15 9h3M2.6 2.6l2.1 2.1M13.3 13.3l2.1 2.1M13.3 2.6l-2.1 2.1M4.7 13.3l-2.1 2.1"/>
          </svg>
        </div>

        <p className="text-center text-[11px] text-black/40 mt-2">{brightness}%</p>
      </div>

      <p className="text-[11px] text-black/40 text-center">
        Drag the slider to adjust desktop brightness
      </p>
    </div>
  )
}
