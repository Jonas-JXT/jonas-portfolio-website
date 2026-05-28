'use client'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import type { AppId } from '@/data/searchIndex'

interface Props {
  appId: AppId
  label: string
  iconSrc: string
  scale: number
  isOpen: boolean
  isBouncing: boolean
  onClick: () => void
  onBounceEnd: () => void
}

export default function DockIcon({
  appId,
  label,
  iconSrc,
  scale,
  isOpen,
  isBouncing,
  onClick,
  onBounceEnd,
}: Props) {
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isBouncing || !imgRef.current) return
    const el = imgRef.current
    el.classList.add('dock-bounce')
    const timer = setTimeout(() => {
      el.classList.remove('dock-bounce')
      onBounceEnd()
    }, 600)
    return () => clearTimeout(timer)
  }, [isBouncing, onBounceEnd])

  return (
    <div
      data-appid={appId}
      className="relative flex flex-col items-center cursor-pointer group"
      style={{
        transition: 'transform 0.15s ease',
        transform: `scale(${scale})`,
        transformOrigin: 'bottom center',
        willChange: 'transform',
      }}
      onClick={onClick}
    >
      {/* Tooltip */}
      <div
        className="absolute bottom-full mb-2 px-2 py-0.5 rounded text-[11px] text-white bg-black/70 whitespace-nowrap
                   opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
      >
        {label}
      </div>

      {/* Icon */}
      <div ref={imgRef} className="w-[60px] h-[60px] relative">
        <Image
          src={iconSrc}
          alt={label}
          fill
          sizes="60px"
          className="object-contain drop-shadow-lg"
          unoptimized
        />
      </div>

      {/* Open dot */}
      {isOpen && (
        <div className="absolute -bottom-[6px] w-[4px] h-[4px] rounded-full bg-white/90 shadow-sm" />
      )}
    </div>
  )
}
