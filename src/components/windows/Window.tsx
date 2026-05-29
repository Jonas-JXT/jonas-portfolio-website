'use client'
import { useRef, useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDrag } from '@/hooks/useDrag'
import { useWindowStore } from '@/store/windowStore'
import type { AppId } from '@/data/searchIndex'

const MENUBAR_H     = 22
const DOCK_H        = 90
const MIN_W         = 220
const MIN_H         = 150
const SNAP_ZONE     = 24   // px from edge that triggers snap preview

// ── Snap preview ghost ────────────────────────────────────────────────────
// Rendered via portal so it escapes the Desktop's `filter: brightness()` context.
// Without the portal, `position: fixed` would be relative to the filtered ancestor,
// not the viewport.
function SnapPreview({ zone }: { zone: 'left' | 'right' | 'top' }) {
  const vw = window.innerWidth
  const dh = window.innerHeight - MENUBAR_H - DOCK_H
  const base: React.CSSProperties = {
    position: 'fixed',
    zIndex: 8500,
    pointerEvents: 'none',
    background: 'rgba(52,120,246,0.13)',
    border: '2px solid rgba(52,120,246,0.35)',
    borderRadius: 10,
    top: MENUBAR_H,
    transition: 'all 0.12s ease',
  }
  const geo: React.CSSProperties =
    zone === 'top'   ? { left: 0,      width: vw,     height: dh } :
    zone === 'left'  ? { left: 0,      width: vw / 2, height: dh } :
                       { left: vw / 2, width: vw / 2, height: dh }
  return <div style={{ ...base, ...geo }} />
}

// ── Resize handle ─────────────────────────────────────────────────────────
function RH({ dir, cls, onD, onM, onU }: {
  dir: string; cls: string
  onD: (dir: string, e: React.PointerEvent) => void
  onM: (e: React.PointerEvent) => void
  onU: (e: React.PointerEvent) => void
}) {
  return (
    <div
      className={cls}
      onPointerDown={(e) => onD(dir, e)}
      onPointerMove={onM}
      onPointerUp={onU}
    />
  )
}

// ── Window ────────────────────────────────────────────────────────────────
interface Props {
  appId: AppId
  title: string
  defaultSize: { w: number; h: number }
  children: React.ReactNode
}

export default function Window({ appId, title, defaultSize, children }: Props) {
  const winState     = useWindowStore((s) => s.windows[appId])
  const focusedAppId = useWindowStore((s) => s.focusedAppId)
  const focusWindow  = useWindowStore((s) => s.focusWindow)
  const closeWindow  = useWindowStore((s) => s.closeWindow)
  const setPosition  = useWindowStore((s) => s.setPosition)

  const [closing,     setClosing]     = useState(false)
  const [size,        setSize]        = useState(defaultSize)
  const [maximized,   setMaximized]   = useState(false)
  const [snapped,     setSnapped]     = useState<'left' | 'right' | null>(null)
  const [snapPreview, setSnapPreview] = useState<'left' | 'right' | 'top' | null>(null)
  const [domReady,    setDomReady]    = useState(false)   // guard for portal
  const savedRestore  = useRef<{ w: number; h: number; x: number; y: number } | null>(null)

  useEffect(() => { setDomReady(true) }, [])

  // Reset on each fresh open
  useEffect(() => {
    if (winState?.isOpen) {
      setSize(defaultSize)
      setMaximized(false)
      setSnapped(null)
      setSnapPreview(null)
      savedRestore.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winState?.isOpen])

  // ── Close ─────────────────────────────────────────────────────────────────
  const handleClose = useCallback(() => {
    setClosing(true)
    setTimeout(() => { closeWindow(appId); setClosing(false) }, 150)
  }, [appId, closeWindow])

  // ── Green button: maximize / restore ──────────────────────────────────────
  const handleMaximize = useCallback(() => {
    if (!winState) return
    const isLocked = maximized || snapped
    if (!isLocked) {
      savedRestore.current = { w: size.w, h: size.h, x: winState.position.x, y: winState.position.y }
      setSize({ w: window.innerWidth, h: window.innerHeight - MENUBAR_H - DOCK_H })
      setPosition(appId, { x: 0, y: MENUBAR_H })
      setMaximized(true)
      setSnapped(null)
    } else {
      const r = savedRestore.current
      if (r) { setSize({ w: r.w, h: r.h }); setPosition(appId, { x: r.x, y: r.y }) }
      setMaximized(false)
      setSnapped(null)
    }
  }, [appId, maximized, snapped, size, winState, setPosition])

  // ── Snap (called on drag-end when in a zone) ──────────────────────────────
  const applySnap = useCallback((zone: 'left' | 'right' | 'top') => {
    if (!winState) return
    if (!savedRestore.current) {
      savedRestore.current = { w: size.w, h: size.h, x: winState.position.x, y: winState.position.y }
    }
    const vw = window.innerWidth
    const dh = window.innerHeight - MENUBAR_H - DOCK_H
    if (zone === 'top') {
      setSize({ w: vw, h: dh });  setPosition(appId, { x: 0, y: MENUBAR_H })
      setMaximized(true);          setSnapped(null)
    } else if (zone === 'left') {
      setSize({ w: vw / 2, h: dh }); setPosition(appId, { x: 0, y: MENUBAR_H })
      setSnapped('left');              setMaximized(false)
    } else {
      setSize({ w: vw / 2, h: dh }); setPosition(appId, { x: vw / 2, y: MENUBAR_H })
      setSnapped('right');             setMaximized(false)
    }
  }, [appId, size, winState, setPosition])

  // ── Drag ─────────────────────────────────────────────────────────────────
  // Very permissive bounds — windows can go partially off-screen like a real OS.
  // The only hard constraint is the title bar never goes behind the menu bar.
  const getBounds = useCallback(() => ({
    minX: -(window.innerWidth  - 80),
    maxX:   window.innerWidth  - 80,
    minY:   MENUBAR_H,
    maxY:   window.innerHeight - 30,
  }), [])

  // During drag: update position AND track which snap zone the window is in
  const handlePositionChange = useCallback((pos: { x: number; y: number }) => {
    setPosition(appId, pos)
    const vw = window.innerWidth
    if      (pos.y <= MENUBAR_H + SNAP_ZONE)    setSnapPreview('top')
    else if (pos.x <= SNAP_ZONE)                setSnapPreview('left')
    else if (pos.x + size.w >= vw - SNAP_ZONE)  setSnapPreview('right')
    else                                         setSnapPreview(null)
  }, [appId, setPosition, size.w])

  const { onPointerDown: onDragDown, onPointerMove: onDragMove, onPointerUp: onDragUpRaw } = useDrag({
    position: winState?.position ?? { x: 100, y: 100 },
    onPositionChange: handlePositionChange,
    getBounds,
  })

  // On drag release: apply snap if in a zone, then clear preview
  const onDragUp = useCallback(() => {
    onDragUpRaw()
    if (snapPreview) { applySnap(snapPreview); setSnapPreview(null) }
  }, [onDragUpRaw, snapPreview, applySnap])

  // On title-bar grab: if the window is snapped/maximized, restore its size first
  const handleTitleDragDown = useCallback((e: React.PointerEvent) => {
    if (maximized || snapped) {
      const r = savedRestore.current
      if (r) setSize({ w: r.w, h: r.h })   // restore original size; position stays put
      setMaximized(false)
      setSnapped(null)
      savedRestore.current = null
    }
    onDragDown(e)
  }, [maximized, snapped, onDragDown])

  // ── Resize ────────────────────────────────────────────────────────────────
  const resizeDir   = useRef<string | null>(null)
  const resizeStart = useRef({ mx: 0, my: 0, posX: 0, posY: 0, w: 0, h: 0 })

  const onResizeDown = useCallback((dir: string, e: React.PointerEvent) => {
    e.preventDefault(); e.stopPropagation()
    if (maximized || snapped) {
      const r = savedRestore.current
      if (r) setSize({ w: r.w, h: r.h })
      setMaximized(false); setSnapped(null); savedRestore.current = null
    }
    resizeDir.current = dir
    resizeStart.current = {
      mx: e.clientX, my: e.clientY,
      posX: winState?.position.x ?? 0, posY: winState?.position.y ?? 0,
      w: size.w, h: size.h,
    }
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }, [maximized, snapped, winState, size])

  const onResizeMove = useCallback((e: React.PointerEvent) => {
    if (!resizeDir.current) return
    e.stopPropagation()
    const { mx, my, posX, posY, w, h } = resizeStart.current
    const dx = e.clientX - mx, dy = e.clientY - my
    const dir = resizeDir.current
    let nW = w, nH = h, nX = posX, nY = posY
    if (dir.includes('e')) nW = Math.max(MIN_W, w + dx)
    if (dir.includes('s')) nH = Math.max(MIN_H, h + dy)
    if (dir.includes('w')) { nW = Math.max(MIN_W, w - dx); nX = posX + (w - nW) }
    if (dir.includes('n')) { nH = Math.max(MIN_H, h - dy); nY = posY + (h - nH) }
    nX = Math.max(0, nX); nY = Math.max(MENUBAR_H, nY)
    setSize({ w: nW, h: nH })
    if (nX !== posX || nY !== posY) setPosition(appId, { x: nX, y: nY })
  }, [appId, setPosition])

  const onResizeUp = useCallback((e: React.PointerEvent) => {
    e.stopPropagation(); resizeDir.current = null
  }, [])

  // ── Render guard ──────────────────────────────────────────────────────────
  if (!winState?.isOpen && !closing) return null
  if (!winState) return null

  const isActive  = focusedAppId === appId
  const isLocked  = maximized || !!snapped

  return (
    <>
      {/* Snap preview — portalled to document.body to bypass filter stacking context */}
      {domReady && snapPreview && createPortal(
        <SnapPreview zone={snapPreview} />,
        document.body
      )}

      <div
        className={`absolute ${closing ? 'window-close' : 'window-open'}`}
        style={{
          left: winState.position.x, top: winState.position.y,
          width: size.w, height: size.h,
          zIndex: winState.zIndex, willChange: 'transform',
        }}
        onPointerMove={onDragMove}
        onPointerUp={onDragUp}
        onMouseDown={() => focusWindow(appId)}
      >
        <div
          className="flex flex-col h-full rounded-lg overflow-hidden shadow-2xl border border-black/20"
          style={{ opacity: isActive ? 1 : 0.9, transition: 'opacity 0.1s' }}
        >
          {/* Title bar */}
          <div
            className={`${isActive ? 'window-titlebar' : 'window-titlebar-inactive'} flex items-center px-2 shrink-0 cursor-move border-b border-black/15`}
            style={{ height: 22 }}
            onPointerDown={handleTitleDragDown}
          >
            <div className="flex items-center gap-[5px] mr-3">
              <button
                className="w-[12px] h-[12px] rounded-full bg-[#ff5f57] border border-[#e0443e] flex items-center justify-center group"
                onClick={(e) => { e.stopPropagation(); handleClose() }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <span className="opacity-0 group-hover:opacity-100 text-[8px] text-[#820005] leading-none">✕</span>
              </button>
              <button
                className="w-[12px] h-[12px] rounded-full bg-[#febc2e] border border-[#d9a01e] flex items-center justify-center group"
                onClick={(e) => { e.stopPropagation(); handleClose() }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <span className="opacity-0 group-hover:opacity-100 text-[8px] text-[#795400] leading-none">✕</span>
              </button>
              <button
                className="w-[12px] h-[12px] rounded-full bg-[#28c840] border border-[#1aab2c] flex items-center justify-center group"
                onClick={(e) => { e.stopPropagation(); handleMaximize() }}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <span className="opacity-0 group-hover:opacity-100 text-[8px] text-[#006400] leading-none">
                  {isLocked ? '⊟' : '⊞'}
                </span>
              </button>
            </div>
            <span
              className="flex-1 text-center text-[12px] font-medium truncate pointer-events-none select-none"
              style={{ color: isActive ? '#2c2c2c' : '#8a8a8a', marginRight: 42 }}
            >
              {title}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto bg-white" style={{ fontFamily: 'var(--font-sl)' }}>
            {children}
          </div>
        </div>

        {/* Resize handles */}
        <RH dir="e"  cls="absolute top-5 bottom-5 right-0 w-1.5 cursor-e-resize"  onD={onResizeDown} onM={onResizeMove} onU={onResizeUp} />
        <RH dir="w"  cls="absolute top-5 bottom-5 left-0 w-1.5 cursor-w-resize"   onD={onResizeDown} onM={onResizeMove} onU={onResizeUp} />
        <RH dir="s"  cls="absolute left-5 right-5 bottom-0 h-1.5 cursor-s-resize" onD={onResizeDown} onM={onResizeMove} onU={onResizeUp} />
        <RH dir="n"  cls="absolute left-5 right-5 top-0 h-1.5 cursor-n-resize"    onD={onResizeDown} onM={onResizeMove} onU={onResizeUp} />
        <RH dir="se" cls="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"     onD={onResizeDown} onM={onResizeMove} onU={onResizeUp} />
        <RH dir="sw" cls="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize"      onD={onResizeDown} onM={onResizeMove} onU={onResizeUp} />
        <RH dir="ne" cls="absolute top-0 right-0 w-4 h-4 cursor-ne-resize"        onD={onResizeDown} onM={onResizeMove} onU={onResizeUp} />
        <RH dir="nw" cls="absolute top-0 left-0 w-4 h-4 cursor-nw-resize"         onD={onResizeDown} onM={onResizeMove} onU={onResizeUp} />
      </div>
    </>
  )
}
