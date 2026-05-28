'use client'
import { useEffect, useRef, useCallback, useState } from 'react'

const VW = 600
const VH = 200
const GROUND_Y = 165
const DINO_X = 55
const DINO_W = 40
const DINO_H = 44
const GRAVITY = 0.65
const JUMP_V = -12

interface Obstacle { x: number; w: number; h: number }
interface Cloud    { x: number; y: number }
interface GS {
  phase: 'running' | 'dead'
  dy: number; vy: number; onGround: boolean
  obstacles: Obstacle[]; clouds: Cloud[]
  score: number; highScore: number
  speed: number; frame: number; leg: number; nextIn: number
}

function fresh(hs = 0): GS {
  return {
    phase: 'running',
    dy: GROUND_Y - DINO_H, vy: 0, onGround: true,
    obstacles: [],
    clouds: [{ x: 150, y: 20 }, { x: 350, y: 35 }, { x: 520, y: 15 }],
    score: 0, highScore: hs, speed: 4, frame: 0, leg: 0, nextIn: 90,
  }
}

// x = left edge of dino sprite
function drawDino(ctx: CanvasRenderingContext2D, x: number, y: number, leg: number, dead = false) {
  const C = dead ? '#999' : '#535353'
  ctx.fillStyle = C
  ctx.fillRect(x,      y + 4,  28, 24)
  ctx.fillRect(x + 8,  y,      22, 16)
  ctx.fillRect(x + 26, y + 12, 6,  2)
  ctx.fillRect(x + 18, y + 18, 8,  4)
  ctx.fillStyle = '#fff'
  ctx.fillRect(x + 24, y + 3,  5, 5)
  if (dead) {
    ctx.fillStyle = C
    ctx.fillRect(x + 24, y + 3, 2, 2); ctx.fillRect(x + 27, y + 6, 2, 2)
    ctx.fillRect(x + 27, y + 3, 2, 2); ctx.fillRect(x + 24, y + 6, 2, 2)
  } else {
    ctx.fillStyle = '#535353'
    ctx.fillRect(x + 26, y + 4, 3, 3)
  }
  ctx.fillStyle = C
  if (dead) {
    ctx.fillRect(x + 6, y + 26, 8, 12); ctx.fillRect(x + 18, y + 26, 8, 12)
  } else if (leg === 0) {
    ctx.fillRect(x + 6, y + 26, 8, 14); ctx.fillRect(x + 18, y + 26, 8, 8)
  } else {
    ctx.fillRect(x + 6, y + 26, 8, 8);  ctx.fillRect(x + 18, y + 26, 8, 14)
  }
}

function drawCactus(ctx: CanvasRenderingContext2D, o: Obstacle) {
  ctx.fillStyle = '#535353'
  const mid = Math.floor(o.w / 2) - 4
  ctx.fillRect(o.x + mid,     GROUND_Y - o.h,      8,   o.h)
  ctx.fillRect(o.x,           GROUND_Y - o.h + 10, mid, 6)
  ctx.fillRect(o.x,           GROUND_Y - o.h + 4,  6,  12)
  ctx.fillRect(o.x + mid + 8, GROUND_Y - o.h + 10, mid, 6)
  ctx.fillRect(o.x + o.w - 6, GROUND_Y - o.h + 4,  6,  12)
}

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = '#ddd'
  ctx.fillRect(x,     y + 4, 40,  8)
  ctx.fillRect(x + 8, y,     24, 16)
}

// ── Intro "No Internet" screen ────────────────────────────────────────────
function NoInternetScreen({ onStart }: { onStart: () => void }) {
  const miniRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const c = miniRef.current
    if (!c) return
    const ctx = c.getContext('2d')!
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, c.width, c.height)
    drawDino(ctx, 10, 5, 0)
  }, [])

  return (
    <div
      className="h-full flex flex-col items-center justify-center bg-white select-none cursor-pointer"
      onClick={onStart}
    >
      {/* Dinosaur */}
      <canvas
        ref={miniRef}
        width={80}
        height={60}
        style={{ imageRendering: 'pixelated', marginBottom: 24 }}
      />

      {/* Chrome-style error text */}
      <p style={{
        fontFamily: '"Segoe UI", Roboto, Arial, sans-serif',
        fontSize: 22,
        fontWeight: 300,
        color: '#535353',
        margin: 0,
        marginBottom: 8,
      }}>
        No internet
      </p>

      <p style={{
        fontFamily: '"Segoe UI", Roboto, Arial, sans-serif',
        fontSize: 11,
        color: '#bbb',
        margin: 0,
        marginBottom: 18,
        letterSpacing: '0.03em',
      }}>
        ERR_INTERNET_DISCONNECTED
      </p>

      <div style={{
        fontFamily: '"Segoe UI", Roboto, Arial, sans-serif',
        fontSize: 11,
        color: '#999',
        lineHeight: 1.7,
        textAlign: 'left',
        marginBottom: 20,
      }}>
        <p style={{ margin: 0, marginBottom: 4 }}>Try:</p>
        <p style={{ margin: 0 }}>• Checking the network cables, modem, and router</p>
        <p style={{ margin: 0 }}>• Reconnecting to Wi-Fi</p>
        <p style={{ margin: 0 }}>• Running Network Diagnostics</p>
      </div>

      <p style={{
        fontFamily: '"Segoe UI", Roboto, Arial, sans-serif',
        fontSize: 10,
        color: '#ccc',
        margin: 0,
        letterSpacing: '0.05em',
      }}>
        Press Space or click to play offline
      </p>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────
export default function DinoGame() {
  const [started, setStarted] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gs = useRef<GS>(fresh())
  const raf = useRef(0)

  const action = useCallback(() => {
    if (!started) {
      setStarted(true)
      return
    }
    const s = gs.current
    if (s.phase === 'dead') {
      gs.current = fresh(s.highScore)
      return
    }
    if (s.onGround) { s.vy = JUMP_V; s.onGround = false }
  }, [started])

  // Key listener runs regardless of intro/game state
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); action() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [action])

  // Game loop — only active once started
  useEffect(() => {
    if (!started) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    function tick() {
      const s = gs.current
      ctx.fillStyle = '#f5f5f5'
      ctx.fillRect(0, 0, VW, VH)

      s.clouds.forEach(c => drawCloud(ctx, c.x, c.y))
      ctx.fillStyle = '#535353'
      ctx.fillRect(0, GROUND_Y, VW, 2)
      for (let i = 0; i < VW; i += 40)
        ctx.fillRect((i + s.frame * 2) % VW, GROUND_Y + 4, 15, 1)

      if (s.phase === 'dead') {
        drawDino(ctx, DINO_X, s.dy, 0, true)
        s.obstacles.forEach(o => drawCactus(ctx, o))
        ctx.fillStyle = '#535353'
        ctx.font = 'bold 14px "Courier New",monospace'
        ctx.textAlign = 'center'
        ctx.fillText('G A M E   O V E R', VW / 2, 70)
        ctx.font = '11px "Courier New",monospace'
        ctx.fillText('↺  Click or SPACE to restart', VW / 2, 90)
        ctx.textAlign = 'right'
        ctx.font = '12px "Courier New",monospace'
        ctx.fillText(`HI ${String(Math.floor(s.highScore)).padStart(5,'0')}  ${String(Math.floor(s.score)).padStart(5,'0')}`, VW - 8, 20)
      } else {
        s.frame++
        s.score += 0.1
        s.speed = Math.min(10, 4 + s.score / 250)
        s.vy += GRAVITY
        s.dy += s.vy
        if (s.dy >= GROUND_Y - DINO_H) { s.dy = GROUND_Y - DINO_H; s.vy = 0; s.onGround = true }
        s.leg = s.onGround ? Math.floor(s.frame / 7) % 2 : 0
        s.clouds.forEach(c => { c.x -= s.speed * 0.25 })
        s.clouds = s.clouds.filter(c => c.x > -60)
        if (s.clouds.length < 4 && Math.random() < 0.008)
          s.clouds.push({ x: VW + 10, y: 10 + Math.random() * 40 })
        s.nextIn--
        if (s.nextIn <= 0) {
          const big = Math.random() > 0.55
          s.obstacles.push({ x: VW + 10, w: big ? 30 : 18, h: big ? 48 : 32 })
          s.nextIn = Math.max(40, 70 + Math.random() * 70 - s.score / 80)
        }
        s.obstacles.forEach(o => { o.x -= s.speed })
        s.obstacles = s.obstacles.filter(o => o.x > -50)
        s.obstacles.forEach(o => drawCactus(ctx, o))
        drawDino(ctx, DINO_X, s.dy, s.leg)

        const db = { x: DINO_X + 8, y: s.dy + 4, w: DINO_W - 16, h: DINO_H - 4 }
        for (const o of s.obstacles) {
          const cb = { x: o.x + 4, y: GROUND_Y - o.h + 4, w: o.w - 8, h: o.h - 4 }
          if (db.x < cb.x + cb.w && db.x + db.w > cb.x && db.y < cb.y + cb.h && db.y + db.h > cb.y) {
            s.phase = 'dead'; s.highScore = Math.max(s.highScore, s.score)
          }
        }
        ctx.fillStyle = '#535353'
        ctx.textAlign = 'right'
        ctx.font = '12px "Courier New",monospace'
        ctx.fillText(`HI ${String(Math.floor(s.highScore)).padStart(5,'0')}  ${String(Math.floor(s.score)).padStart(5,'0')}`, VW - 8, 20)
      }

      raf.current = requestAnimationFrame(tick)
    }

    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [started])

  if (!started) return <NoInternetScreen onStart={action} />

  return (
    <div className="flex flex-col h-full bg-[#f5f5f5] select-none cursor-pointer" onClick={action}>
      <canvas
        ref={canvasRef}
        width={VW}
        height={VH}
        style={{ width: '100%', aspectRatio: `${VW}/${VH}`, display: 'block', imageRendering: 'pixelated' }}
      />
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[10px] text-black/25" style={{ fontFamily: '"Courier New",monospace' }}>
          SPACE / ↑ to jump
        </p>
      </div>
    </div>
  )
}
