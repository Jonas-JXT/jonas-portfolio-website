'use client'
import { useRef, useCallback } from 'react'

interface Bounds {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

interface UseDragOptions {
  position: { x: number; y: number }
  onPositionChange: (pos: { x: number; y: number }) => void
  getBounds: () => Bounds
}

export function useDrag({ position, onPositionChange, getBounds }: UseDragOptions) {
  const dragging = useRef(false)
  const startMouse = useRef({ x: 0, y: 0 })
  const startPos = useRef({ x: 0, y: 0 })

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      dragging.current = true
      startMouse.current = { x: e.clientX, y: e.clientY }
      startPos.current = { ...position }
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    },
    [position]
  )

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return
      const dx = e.clientX - startMouse.current.x
      const dy = e.clientY - startMouse.current.y
      const bounds = getBounds()
      const newX = Math.min(bounds.maxX, Math.max(bounds.minX, startPos.current.x + dx))
      const newY = Math.min(bounds.maxY, Math.max(bounds.minY, startPos.current.y + dy))
      onPositionChange({ x: newX, y: newY })
    },
    [getBounds, onPositionChange]
  )

  const onPointerUp = useCallback(() => {
    dragging.current = false
  }, [])

  return { onPointerDown, onPointerMove, onPointerUp }
}
