'use client'
import Clock from './Clock'

function WifiIcon() {
  return (
    <svg width="14" height="12" viewBox="0 0 14 12" fill="currentColor">
      <path d="M7 9.5a1 1 0 110 2 1 1 0 010-2z"/>
      <path d="M4.5 7.5C5.3 6.7 6.1 6.2 7 6.2s1.7.5 2.5 1.3l1-1C9.4 5.3 8.3 4.7 7 4.7s-2.4.6-3.5 1.8l1 1z" opacity=".7"/>
      <path d="M2 5C3.4 3.5 5.1 2.5 7 2.5s3.6 1 5 2.5l1-1C11.4 2.3 9.3 1 7 1S2.6 2.3 1 4l1 1z" opacity=".4"/>
    </svg>
  )
}

function BluetoothIcon() {
  return (
    <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor" opacity=".7">
      <path d="M5 1l3.5 3L5 7V1zm0 6l3.5 3L5 13V7zM1 4l3.5 3L1 10"/>
    </svg>
  )
}

function VolumeIcon() {
  return (
    <svg width="14" height="12" viewBox="0 0 14 12" fill="currentColor" opacity=".7">
      <path d="M1 4h2l3-3v10L3 8H1V4z"/>
      <path d="M8.5 2.5a5 5 0 010 7M10.5 1a7 7 0 010 10" stroke="currentColor" strokeWidth="1" fill="none" opacity=".6"/>
    </svg>
  )
}

function BatteryIcon() {
  return (
    <svg width="22" height="12" viewBox="0 0 22 12" fill="none" opacity=".7">
      <rect x="0.5" y="1.5" width="18" height="9" rx="2" stroke="currentColor" strokeWidth="1"/>
      <rect x="2" y="3" width="13" height="6" rx="1" fill="currentColor"/>
      <path d="M19.5 4.5v3a1.5 1.5 0 000-3z" fill="currentColor"/>
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" opacity=".7">
      <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M9 9l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export default function StatusBar() {
  return (
    <div className="flex items-center gap-3 text-black/80">
      <WifiIcon />
      <BluetoothIcon />
      <VolumeIcon />
      <BatteryIcon />
      <Clock />
      <SearchIcon />
    </div>
  )
}
