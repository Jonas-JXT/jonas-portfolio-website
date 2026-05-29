'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

const WORDS = [
  'Welcome',
  'Bienvenue',
  'Willkommen',
  'Bienvenido',
  'Benvenuto',
  'Bem-vindo',
  'Welkom',
  'Välkommen',
  'ようこそ',
  '欢迎',
  '환영합니다',
  'مرحباً',
  'स्वागत है',
  'Добро пожаловать',
  'Hoş geldiniz',
  'Tervetuloa',
  'Witamy',
  'Καλώς ορίσατε',
  'ยินดีต้อนรับ',
  'Chào mừng',
  'Selamat datang',
  'Velkommen',
  'ברוך הבא',
  '歡迎',
  'Welcome',
]

// ── Starfield canvas ──────────────────────────────────────────────────────
function StarCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.3 + 0.3,
      speed: Math.random() * 0.1 + 0.02,
      phase: Math.random() * Math.PI * 2,
      twinkle: Math.random() * 0.025 + 0.006,
    }))

    let frame = 0
    let raf: number

    function tick() {
      const W = ctx.canvas.width, H = ctx.canvas.height
      ctx.clearRect(0, 0, W, H)
      frame++
      stars.forEach((s) => {
        s.y += s.speed * 0.35
        s.x += s.speed * 0.08
        if (s.y > H) { s.y = 0; s.x = Math.random() * W }
        if (s.x > W) { s.x = 0 }
        const opacity = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(frame * s.twinkle + s.phase))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${opacity.toFixed(2)})`
        ctx.fill()
      })
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
}

// ── Main component ────────────────────────────────────────────────────────
interface Props {
  onDone: () => void
}

export default function WelcomeScreen({ onDone }: Props) {
  const [wordIdx,       setWordIdx]       = useState(0)
  const [wordVisible,   setWordVisible]   = useState(true)
  const [screenOpacity, setScreenOpacity] = useState(0)

  const onDoneRef     = useRef(onDone)
  const doneCalledRef = useRef(false)
  const audioRef      = useRef<HTMLAudioElement | null>(null)
  onDoneRef.current = onDone

  // Fade in on mount
  useEffect(() => {
    const t = setTimeout(() => setScreenOpacity(1), 60)
    return () => clearTimeout(t)
  }, [])

  // Audio — try autoplay immediately; if blocked, play on first user interaction
  useEffect(() => {
    const audio = new Audio('/intro.mp3')
    audioRef.current = audio

    audio.play().catch(() => {
      // Autoplay blocked — hook the first interaction and play then
      const onInteract = () => {
        audio.play().catch(() => {})
        document.removeEventListener('click',      onInteract)
        document.removeEventListener('keydown',    onInteract)
        document.removeEventListener('touchstart', onInteract)
      }
      document.addEventListener('click',      onInteract)
      document.addEventListener('keydown',    onInteract)
      document.addEventListener('touchstart', onInteract)
    })

    return () => {
      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
  }, [])

  // Fade the audio volume to 0 over `ms` milliseconds then pause
  const fadeOutAudio = useCallback((ms = 800) => {
    const audio = audioRef.current
    if (!audio || audio.paused) return
    const steps    = 25
    const interval = ms / steps
    const startVol = audio.volume
    let   step     = 0
    const timer = setInterval(() => {
      step++
      audio.volume = Math.max(0, startVol * (1 - step / steps))
      if (step >= steps) { clearInterval(timer); audio.pause() }
    }, interval)
  }, [])

  const triggerDone = useCallback(() => {
    if (doneCalledRef.current) return
    doneCalledRef.current = true
    fadeOutAudio(800)         // fade audio over 800 ms
    setScreenOpacity(0)       // fade screen over 800 ms (CSS transition)
    setTimeout(() => onDoneRef.current(), 800)
  }, [fadeOutAudio])

  // Word cycling
  const idxRef = useRef(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setWordVisible(false)
      setTimeout(() => {
        idxRef.current = (idxRef.current + 1) % WORDS.length
        setWordIdx(idxRef.current)
        setWordVisible(true)
        // Auto-end after the final "Welcome" — 2250 ms holds the last word
        // Timing: 24 intervals × 1100 ms + 350 ms fade + 2250 ms = 29 000 ms exactly
        if (idxRef.current === WORDS.length - 1) {
          setTimeout(triggerDone, 2250)
        }
      }, 350)
    }, 1100)
    return () => clearInterval(interval)
  }, [triggerDone])

  const progress = Math.round(((wordIdx + 1) / WORDS.length) * 100)

  return (
    <div
      className="fixed inset-0 z-[9998] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: [
          'radial-gradient(ellipse at 32% 30%, rgba(145,45,230,0.55) 0%, transparent 52%)',
          'radial-gradient(ellipse at 72% 68%, rgba(90,18,185,0.42) 0%, transparent 48%)',
          'radial-gradient(ellipse at 55% 82%, rgba(210,95,255,0.22) 0%, transparent 42%)',
          '#060012',
        ].join(', '),
        opacity: screenOpacity,
        transition: 'opacity 0.8s ease',
      }}
    >
      {/* Animated nebula orbs */}
      <div className="absolute pointer-events-none" style={{
        width: '70vw', height: '70vw', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(155,55,240,0.32) 0%, transparent 68%)',
        top: '2%', left: '12%', filter: 'blur(70px)',
        animation: 'nebulaDrift1 22s ease-in-out infinite',
      }} />
      <div className="absolute pointer-events-none" style={{
        width: '48vw', height: '48vw', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(100,28,205,0.28) 0%, transparent 68%)',
        top: '48%', right: '4%', filter: 'blur(90px)',
        animation: 'nebulaDrift2 28s ease-in-out infinite',
      }} />
      <div className="absolute pointer-events-none" style={{
        width: '55vw', height: '55vw', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(215,95,255,0.16) 0%, transparent 68%)',
        bottom: '4%', left: '22%', filter: 'blur(80px)',
        animation: 'nebulaDrift3 34s ease-in-out infinite',
      }} />

      {/* Stars */}
      <StarCanvas />

      {/* Welcome word */}
      <div
        className="relative z-10 text-center select-none px-8"
        style={{
          opacity: wordVisible ? 1 : 0,
          transform: wordVisible ? 'scale(1) translateY(0)' : 'scale(0.94) translateY(6px)',
          transition: 'opacity 0.30s ease, transform 0.30s ease',
        }}
      >
        <span style={{
          fontFamily: '"Helvetica Neue", "Hiragino Sans", "Arial Unicode MS", "Noto Sans", sans-serif',
          fontSize: 'clamp(38px, 7vw, 76px)',
          fontWeight: 100,
          color: 'rgba(255,255,255,0.90)',
          letterSpacing: '0.06em',
          textShadow: '0 0 60px rgba(190,130,255,0.45), 0 0 120px rgba(140,60,240,0.25)',
          display: 'block',
          lineHeight: 1.2,
        }}>
          {WORDS[wordIdx]}
        </span>
      </div>

      {/* Progress bar */}
      <div
        className="absolute z-10"
        style={{ bottom: 56, left: '50%', transform: 'translateX(-50%)', width: 180 }}
      >
        <div className="w-full h-[2px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.12)' }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: 'rgba(255,255,255,0.38)',
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      {/* Skip button */}
      <button
        onClick={triggerDone}
        className="absolute z-10 bottom-6 right-8 transition-colors"
        style={{
          fontFamily: 'var(--font-sl)',
          fontSize: 11,
          color: 'rgba(255,255,255,0.28)',
          letterSpacing: '0.04em',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.28)')}
      >
        Skip →
      </button>

    </div>
  )
}
